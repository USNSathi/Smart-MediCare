import Head from "next/head"
import $ from "jquery"
import Image from "next/image"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"
import { prisma } from "@functionalities/DB/prismaInstance"
import React, { useEffect, useState } from "react"
import {
	address,
	amenity,
	blood_analytical_service,
	booking,
	booking_status,
	capacity,
	diagnostic_imaging_service,
	doctor,
	general_service,
	log,
	staff,
	vacant_bed_log,
} from "@prisma/client"
import { Toast } from "@functionalities/toast"
import { sendEmail, sendOTP } from "@functionalities/emailManager"
import Crypto from "crypto"
import AnnotationToggler from "@components/AnnotationToggler"
import Loader from "@components/Loader"
import BedTypeInputFields from "@components/BedTypeInputFields"
import { isObjectEqual } from "@functionalities/compareObjects"
import router from "next/router"

export const getServerSideProps = async ({ query }: any) => {
	// redirect upon error
	if (query.reg == "" || query.reg == undefined)
		return {
			redirect: {
				destination: "/404",
				permanent: false,
			},
		}
	console.log(query)
	const retrievedData: RetrievedData = await prisma.hospital.findUnique({
		where: {
			registration_no: query.reg,
		},
		include: {
			address: true,
			amenity: true,
			blood_analytical_service: true,
			booking: { take: 10, orderBy: { booked_at: "desc" } },
			capacity: true,
			diagnostic_imaging_service: true,
			general_service: true,
			vacant_bed_log: { take: 10, orderBy: { last_updated: "desc" } },
			doctor: {
				include: {
					schedule: true,
				},
			},
			staff: {
				where: {
					email: {
						not: query.user,
					},
				},
				select: {
					email: true,
					joined_on: true,
					last_updated: true,
					mobile_no: true,
					name: true,
					role: true,
					status: true,
				},
				orderBy: {
					joined_on: "desc",
				},
			},
			log: { take: 10, orderBy: { logged_at: "desc" } },
		},
	})

	if (query.user)
		retrievedData["user"] = (await prisma.staff.findUnique({
			where: {
				email: query.user,
			},
		})) as staff
	else retrievedData["user"] = retrievedData.staff[0]

	retrievedData["count"] = {
		["booking"]: {
			requested: 0,
			booked: 0,
			served: 0,
			cancelled: 0,
		},
	}

	for (const status of ["Requested", "Booked", "Served", "Cancelled"]) {
		retrievedData.count.booking[
			status.toLowerCase() as keyof typeof retrievedData.count.booking
		] = await prisma.booking.count({
			where: {
				registration_no: query.reg,
				AND: {
					status: status as booking_status,
				},
			},
		})
	}

	return { props: { retrievedData: JSON.stringify(retrievedData) } }
}

interface RetrievedData {
	registration_no: string
	hospital_name: string
	description: string
	hospital_type: string[]
	bed_type: string
	image_source: string
	website: string
	joined_on: Date
	status: string[]
	address: address
	amenity: amenity
	blood_analytical_service: blood_analytical_service
	booking: booking[]
	capacity: capacity
	count: {
		booking: {
			requested: number
			booked: number
			served: number
			cancelled: number
		}
	}
	diagnostic_imaging_service: diagnostic_imaging_service
	doctor: doctor[]
	general_service: general_service
	log: log[]
	staff: staff[]
	user: staff
	vacant_bed_log: vacant_bed_log[]
}

export interface DashboardProps {
	retrievedData: string
}

const Dashboard: React.FC<DashboardProps> = ({ retrievedData }) => {
	let hospital: RetrievedData = JSON.parse(retrievedData)

	const [loading, setLoading] = useState(false)

	// console.log(hospital)

	// * employee management
	const [staff, setStaff] = useState(hospital.staff),
		filterStaff = (status: string = "Active") => {
			return staff.filter(el => {
				return el.status.indexOf(status) != -1
			})
		},
		[filteredStaff, setFilteredStaff] = useState(filterStaff()),
		[filteredStaffOnSearch, setFilteredStaffOnSearch] = useState(filterStaff()),
		[searchFieldName, setSearchFieldName] = useState("name"),
		[showAddStaff, setShowAddStaff] = useState(false),
		[OTP, setOTP] = useState(""),
		getStaffInputFieldData = (submit: boolean = false) => {
			let data: object = submit
				? {
						registration_no: hospital.registration_no,
						status: "Active",
						password: Crypto.randomBytes(5).toString("hex"), // 10 characters
				  }
				: {}

			$("#staffDataRow")
				.find("input[type=text], input[type=tel], input[type=email], select")
				.map((index, elem) => {
					submit
						? $(elem).attr("data-name") == "mobile_no"
							? (data[$(elem).attr("data-name")] =
									"+88" + ($(elem).val() as string).replace("+88", ""))
							: (data[$(elem).attr("data-name")] = $(elem).val())
						: $(elem).attr("id") == "staffMobile"
						? (data[$(elem).attr("id")] =
								"+88" + ($(elem).val() as string).replace("+88", ""))
						: (data[$(elem).attr("id")] = $(elem).val())
				})
			return data
		},
		[editTuple, setEditTuple] = useState(""),
		getStaffEditFieldData = (tupleId: string, email: string) => {
			let data: object = { email }

			$(`#${tupleId} input, #${tupleId} select`).map((ind, elem) => {
				$(elem).attr("data-name") == "role"
					? (data[$(elem).attr("data-name")] = $(elem).val().replace(" ", "_"))
					: (data[$(elem).attr("data-name")] = $(elem).val())
			})

			return data
		},
		populateRow = (tr: staff, index: number) => {
			const populateForActiveStaffs = () => {
				return (
					<React.Fragment key={index}>
						{["name", "mobile_no", "email", "role", "status", "joined_on"].map(
							(td: string, index) => {
								return (
									<td
										className={td == "joined_on" ? "pl-0" : undefined}
										key={index}
									>
										{td == "joined_on" || td == "last_updated" ? (
											new Date(tr[td]).toUTCString()
										) : td == "name" ? (
											editTuple == tr.mobile_no ? (
												<>
													<input
														type="text"
														className="w-100"
														placeholder="E.g.: Alice Milburn"
														onInput={e =>
															((e.target as HTMLInputElement).value = (
																e.target as HTMLInputElement
															).value.slice(0, 50))
														}
														onChange={e => {
															$(e.target).attr("value") == e.target.value
																? $(
																		"#btn_save_" + tr.mobile_no.replace("+", "")
																  ).addClass("disabled")
																: $(
																		"#btn_save_" + tr.mobile_no.replace("+", "")
																  ).removeClass("disabled")
														}}
														required
														data-name={td}
														defaultValue={tr[td as keyof staff] as string}
													/>
													<small
														className="d-block text-danger text-left mt-1 pl-1 font-italic"
														style={{ fontSize: "0.73rem" }}
														id={tr.mobile_no.replace("+", "") + "_nameErr"}
													></small>
												</>
											) : (
												tr[td as keyof staff]
											)
										) : td == "mobile_no" ? (
											editTuple == tr.mobile_no ? (
												<>
													<input
														type="tel"
														className="w-100"
														placeholder="E.g.: 01*********"
														onInput={e =>
															((e.target as HTMLInputElement).value = (
																e.target as HTMLInputElement
															).value.slice(0, 14))
														}
														onChange={e => {
															$(e.target).attr("value") == e.target.value
																? $(
																		"#btn_save_" + tr.mobile_no.replace("+", "")
																  ).addClass("disabled")
																: $(
																		"#btn_save_" + tr.mobile_no.replace("+", "")
																  ).removeClass("disabled")
														}}
														required
														data-name={td}
														defaultValue={tr[td as keyof staff] as string}
													/>
													<small
														className="d-block text-danger text-left mt-1 pl-1 font-italic"
														style={{ fontSize: "0.73rem" }}
														id={tr.mobile_no.replace("+", "") + "_mobile_noErr"}
													></small>
												</>
											) : (
												tr[td as keyof staff]
											)
										) : td == "email" ? (
											// editTuple == tr.mobile_no ? (
											// 	<>
											// 		<input
											// 			type="email"
											// 			className="w-100"
											// 			placeholder="E.g.: 01*********"
											// 			onInput={e =>
											// 				(e.target.value = e.target.value.slice(0, 14))
											// 			}
											// 			required
											// 			data-name={td}
											// 			defaultValue={tr[td as keyof staff].toString()}
											// 		/>
											// 		<small
											// 			className="d-block text-danger text-left mt-1 pl-1"
											// 			id={tr.mobile_no + "_staffEmailErr"}
											// 		></small>
											// 	</>
											// ) : (
											tr[td as keyof staff]
										) : // )
										td == "role" ? (
											editTuple == tr.mobile_no ? (
												<select
													className="custom-select"
													defaultValue={tr[td as keyof staff] as string}
													data-name={td}
													onChange={e => {
														tr.role == e.target.value
															? $(
																	"#btn_save_" + tr.mobile_no.replace("+", "")
															  ).addClass("disabled")
															: $(
																	"#btn_save_" + tr.mobile_no.replace("+", "")
															  ).removeClass("disabled")
													}}
												>
													<option value="Admin">Admin</option>
													<option value="DB Manager">DB Manager</option>
													<option value="Moderator">Moderator</option>
												</select>
											) : (
												(tr[td as keyof staff] as string).replace("_", " ")
											)
										) : td == "status" ? (
											editTuple == tr.mobile_no ? (
												<>
													<select
														className="custom-select"
														defaultValue={tr[td as keyof staff] as string}
														data-name={td}
														onChange={e => {
															tr.status == e.target.value
																? $(
																		"#btn_save_" + tr.mobile_no.replace("+", "")
																  ).addClass("disabled")
																: $(
																		"#btn_save_" + tr.mobile_no.replace("+", "")
																  ).removeClass("disabled")
														}}
													>
														<option value="Active">Active</option>
														<option value="Inactive">Inactive</option>
													</select>
													<small
														className="text-danger font-italic"
														style={{ fontSize: "0.73rem" }}
													>
														# irreversible change
													</small>
												</>
											) : (
												tr[td as keyof staff]
											)
										) : null}
									</td>
								)
							}
						)}
						<td className="pl-0 pr-2">
							<div className="btn-group w-100 animate__animated animate__fadeIn animate__slow">
								<button
									className="btn btn-sm btn-dark d-inline-block hvr-float"
									onClick={e => {
										setEditTuple(editTuple == tr.mobile_no ? "" : tr.mobile_no)
										$(".btn-save").addClass("disabled")
									}}
								>
									<i className="bi bi-pencil-square"></i>&nbsp;Edit
								</button>
								<button
									className={
										"btn btn-sm btn-primary d-inline-block hvr-float btn-save disabled"
									}
									id={"btn_save_" + tr.mobile_no.replace("+", "")}
									onClick={async e => {
										if ($(e.target).hasClass("disabled")) return

										// * update staff info block
										setLoading(true)
										await fetch("/api/updatehospitalstaff", {
											method: "POST",
											body: JSON.stringify(
												getStaffEditFieldData(
													tr.mobile_no.replace("+", ""),
													tr.email
												)
											),
											headers: {
												"content-type": "application/json",
											},
										})
											.then(response => response.json())
											.then(async res => {
												const fields = {
													name: false,
													mobile_no: false,
												}

												if (res.updated) {
													$(e.target).addClass("disabled")

													$("#btn_refresh").trigger("click")
												} else if (res.errors != undefined) {
													res.errors.map((error: string) => {
														fields[error.split(" ")[0] as keyof typeof fields] =
															true

														$(
															`#${tr.mobile_no.replace("+", "")}_${
																error.split(" ")[0]
															}Err`
														).text(error.replace("_no", ""))
													})
												}

												Object.keys(fields).map(error => {
													!fields[error as keyof typeof fields]
														? $(
																`#${tr.mobile_no.replace("+", "")}_${
																	error.split(" ")[0]
																}Err`
														  ).text("")
														: null
												})
											})
											.catch(err => console.error(err))
										setLoading(false)
									}}
								>
									<i className="bi bi-file-earmark-check"></i>&nbsp;Save
								</button>
							</div>
						</td>
					</React.Fragment>
				)
			}

			return typeof window != "undefined"
				? $("#active input[type=radio]").is(":checked")
					? populateForActiveStaffs()
					: // * populate thead - inactive
					  [
							"name",
							"mobile_no",
							"email",
							"role",
							"joined_on",
							"last_updated",
							"action",
					  ].map((td: string, index) => {
							return (
								<td key={index}>
									{td == "joined_on" || td == "last_updated" ? (
										new Date(tr[td]).toUTCString()
									) : td == "role" ? (
										tr[td as keyof staff].toString().replace("_", " ")
									) : td == "action" ? (
										<button
											className="btn btn-sm btn-dark hvr-float animate__animated animate__fadeIn animate__slow"
											onClick={async e => {
												setLoading(true)

												await fetch("/api/deletehospitalstaff", {
													method: "POST",
													headers: { "content-type": "application/json" },
													body: JSON.stringify({ email: tr.email }),
												})
													.then(response => response.json())
													.then(res => {
														if (res.deleted) {
															$("#btn_refresh").trigger("click")

															Toast("Staff deleted", "primary", 1800)
														} else {
															Toast(
																"Could not delete staff! Try again.",
																"primary",
																1800
															)
														}
													})
													.catch(err => console.error(err))

												setLoading(false)
											}}
										>
											<i className="bi bi-trash"></i>&nbsp;Delete
										</button>
									) : (
										tr[td as keyof staff]
									)}
								</td>
							)
					  })
				: populateForActiveStaffs()
		}

	// * amenities & services management
	const [amenity, setAmenity] = useState(hospital.amenity),
		[newAmenity, setNewAmenity] = useState(hospital.amenity),
		[generalService, setGeneralService] = useState(hospital.general_service),
		[newGeneralService, setNewGeneralService] = useState(
			hospital.general_service
		),
		[bloodAnalyticalService, setBloodAnalyticalService] = useState(
			hospital.blood_analytical_service
		),
		[newBloodAnalyticalService, setNewBloodAnalyticalService] = useState(
			hospital.blood_analytical_service
		),
		[diagnosticImagingService, setDiagnosticImagingService] = useState(
			hospital.diagnostic_imaging_service
		),
		[newDiagnosticImagingService, setNewDiagnosticImagingService] = useState(
			hospital.diagnostic_imaging_service
		)

	useEffect(() => {
		const unsavedAmenity = !isObjectEqual(amenity, newAmenity),
			unsavedGeneralService = !isObjectEqual(generalService, newGeneralService),
			unsavedBloodAnalyticalService = !isObjectEqual(
				bloodAnalyticalService,
				newBloodAnalyticalService
			),
			unsavedDiagnosticImagingService = !isObjectEqual(
				diagnosticImagingService,
				newDiagnosticImagingService
			)

		// enabling save button if changes are made
		if (!unsavedAmenity) $("#btn_amenity").addClass("disabled")
		else if (unsavedAmenity) $("#btn_amenity").removeClass("disabled")

		if (!unsavedGeneralService) $("#btn_general_service").addClass("disabled")
		else if (unsavedGeneralService)
			$("#btn_general_service").removeClass("disabled")

		if (!unsavedBloodAnalyticalService)
			$("#btn_blood_analytical_service").addClass("disabled")
		else if (unsavedBloodAnalyticalService)
			$("#btn_blood_analytical_service").removeClass("disabled")

		if (!unsavedDiagnosticImagingService)
			$("#btn_diagnostic_imaging_service").addClass("disabled")
		else if (unsavedDiagnosticImagingService)
			$("#btn_diagnostic_imaging_service").removeClass("disabled")

		// // removing navigation event listener if changes are reverted
		// if (
		// 	!unsavedAmenity ||
		// 	!unsavedGeneralService ||
		// 	!unsavedBloodAnalyticalService ||
		// 	!unsavedDiagnosticImagingService
		// ) {
		// 	$(
		// 		"#sidebarMenu a, #sidebarMenu li, #sidebarMenu span, #sidebarMenu i"
		// 	).off("click.new")
		// }

		// // adding event listener on unsaved changes and stopping navigation
		// $("#sidebarMenu li").on("click.new", event => {
		// 	if (
		// 		unsavedAmenity ||
		// 		unsavedGeneralService ||
		// 		unsavedBloodAnalyticalService ||
		// 		unsavedDiagnosticImagingService
		// 	) {
		// 		event.stopImmediatePropagation()

		// 		Toast(
		// 			"Unsaved changes persist! To proceed further, save them first or revert changes.",
		// 			"warning",
		// 			false
		// 		)
		// 	}
		// })
	}, [
		newAmenity,
		newGeneralService,
		newBloodAnalyticalService,
		newDiagnosticImagingService,
	]) // detecting changes

	useEffect(() => {
		// showing indeterminate in custom checkbox of services if null
		$("#amenities-and-services")
			.find("input[type=checkbox]")
			.map((index, elem) =>
				hospital.amenity[$(elem).attr("id") as keyof typeof hospital.amenity] ==
				null
					? $(elem).prop("indeterminate", true)
					: null
			)

		Object.keys(hospital)
			.filter(el => el.indexOf("_service") != -1)
			.map(type => {
				$("#" + type)
					.find("input[type=checkbox]")
					.map((index, elem) =>
						hospital[type as keyof typeof hospital][$(elem).attr("id")] == null
							? $(elem).prop("indeterminate", true)
							: null
					)
			})

		// sidebar menu content border radius control
		$("#menu-content ul li").map((index, elem) => {
			$(elem).children("a").hasClass("active")
				? ($(elem).prev("li").css("border-bottom-right-radius", "0.5rem"),
				  $(elem).next("li").css("border-top-right-radius", "0.5rem"))
				: null
		})

		$("#menu-content ul")
			.find("li, a, i")
			.on("click", e => {
				// todo blocking upon unsaved changes
				// if (true) return

				$(e.target)
					.parents("li")
					.prev("li")
					.css("border-bottom-right-radius", "0.5rem"),
					$(e.target)
						.parents("li")
						.next("li")
						.css("border-top-right-radius", "0.5rem")

				e.target.id === "btn-logout" ||
				$(e.target).parents("li").children("span").attr("id") === "btn-logout"
					? $(e.target)
							.parents("li")
							.prev("li")
							.css("border-top-right-radius", "0")
							.css("border-bottom-right-radius", "0")
							.prevAll("li")
							.css("border-radius", "0")
					: $(e.target)
							.parents("li")
							.prev("li")
							.css("border-top-right-radius", "0")
							.prevAll("li")
							.css("border-radius", "0")

				$(e.target).parents("li").css("border-radius", "0")

				$(e.target)
					.parents("li")
					.next("li")
					.css("border-bottom-right-radius", "0")
					.nextAll("li")
					.css("border-radius", "0")
			})
	}, [])

	// * settings
	let base64image = "default"

	useEffect(() => {
		// * profile view handler
		// hospital profile view data generator
		const getProfileViewData = () => {
			let data = {
				hospital: {
					registration_no: hospital.registration_no,
				},
				address: { registration_no: hospital.registration_no },
			}

			$("#hospital_profile")
				.find("input, select")
				.map((index, elem) => {
					data[$(elem).attr("data-parent")][$(elem).attr("name")] =
						$(elem).val() == "" ? null : $(elem).val()
				})

			return data
		}

		$("#hospital_profile")
			.find("input, select")
			.on("input", e => {
				setNewProfileData(getProfileViewData() as typeof profileViewData)
			})

		// * capacity view handler
		// capacity checkbox checked/unchecked setter
		$("#hospital_capacity")
			.find("input[type=checkbox]")
			.map((index, elem) => {
				$(elem).attr(
					"checked",
					hospital.capacity[$(elem).attr("data-name") as keyof capacity]
				)
			})

		// capacity value & enabled/disabled setter
		$("#hospital_capacity")
			.find("input[type=number]")
			.map((index, elem) => {
				$(elem).val(
					hospital.capacity[
						$(elem).attr("data-name") as keyof capacity
					] as number
				)

				$(elem).attr("min", "1")

				$(elem).parent().prev().children("input[type=checkbox]").is(":checked")
					? $(elem).removeAttr("disabled")
					: null
			})

		// enable/disable input fields on checkbox click
		$("#hospital_capacity")
			.find("input[type=checkbox]")
			.on("click", e => {
				const inputField = $(e.target)
					.parent()
					.next()
					.children("input[type=number]")

				if ($(e.target).is(":checked")) {
					$(inputField).removeAttr("disabled")
					$(inputField).val("1")
				} else {
					$(inputField).attr("disabled", "true")
					$(inputField).val("")
				}

				$(inputField).trigger("input")
			})

		// hospital capacity view data generator
		const getCapacityViewData = () => {
			let data = {
				registration_no: hospital.registration_no,
				total_capacity: (() => {
					let sum = 0
					$("#hospital_capacity")
						.find("input[type=number]")
						.map((ind, elem) => {
							sum += parseInt(
								$(elem).val() == "" ? "0" : ($(elem).val() as string)
							)
						})
					return sum
				})(),
			}

			$("#hospital_capacity")
				.find("input[type=number]")
				.map((index, elem) => {
					data[$(elem).attr("data-name")] =
						$(elem).val() == "" ? null : parseInt($(elem).val() as string)
				})

			return data as capacity
		}

		$("#hospital_capacity")
			.find("input[type=number]")
			.on("input", e => {
				setNewCapacity(getCapacityViewData())
			})

		// * user view handler
		// hospital profile view data generator
		const getUserViewData = () => {
			let data = {
				registration_no: hospital.registration_no,
			}

			$("#hospital_user")
				.find("input")
				.map((index, elem) => {
					if (!$(elem).attr("disabled") && !$(elem).attr("readonly"))
						// excluding uneditable fields
						$(elem).attr("name") == "password"
							? $(elem).hasClass("is-valid")
								? (data[$(elem).attr("name")] = $(elem).val())
								: null
							: (data[$(elem).attr("name")] =
									$(elem).val() == "" ? null : $(elem).val())
				})

			return data
		}

		$("#hospital_user")
			.find("input")
			.on("input", e => {
				setNewUserData(getUserViewData() as typeof userViewData)
			})
	}, [])

	const profileViewData = {
			hospital: {
				registration_no: hospital.registration_no,
				hospital_name: hospital.hospital_name,
				hospital_type: hospital.hospital_type,
				website: hospital.website,
			},
			address: {
				registration_no: hospital.registration_no,
				address: hospital.address.address,
				phone_no: hospital.address.phone_no,
				mobile_no: hospital.address.mobile_no,
				latitude: hospital.address.latitude,
				longitude: hospital.address.longitude,
			},
		},
		[profileData, setProfileData] = useState(profileViewData),
		[newProfileData, setNewProfileData] = useState(profileViewData),
		[capacity, setCapacity] = useState(hospital.capacity),
		[newCapacity, setNewCapacity] = useState(hospital.capacity),
		[passwordChangeViewIsVisible, setPasswordChangeViewIsVisible] =
			useState(false),
		userViewData = {
			registration_no: hospital.registration_no,
			name: hospital.user.name,
			email: hospital.user.email,
			mobile_no: hospital.user.mobile_no,
			// role: hospital.user.role,
		},
		[userData, setUserData] = useState(userViewData),
		[newUserData, setNewUserData] = useState(userViewData)

	useEffect(() => {
		isObjectEqual(profileData, newProfileData)
			? $("#btn_profile").addClass("disabled")
			: $("#btn_profile").removeClass("disabled")

		isObjectEqual(capacity, newCapacity)
			? $("#btn_capacity").addClass("disabled")
			: $("#btn_capacity").removeClass("disabled")

		isObjectEqual(userData, newUserData)
			? $("#btn_user").addClass("disabled")
			: $("#btn_user").removeClass("disabled")
	}, [newProfileData, newCapacity, newUserData])

	return (
		<>
			<Head>
				<title>Dashboard | Admin Panel</title>
			</Head>
			<main className="row mx-0 dashboard">
				{loading ? <Loader /> : null}
				<nav
					className="col-12 col-lg-2 navbar bg-dark navbar-expand-lg px-0 pr-lg- py-0 position-fixed h-100"
					id="sidebarMenu"
				>
					<div className="collapse navbar-collapse" id="menu-content">
						<ul
							className="nav nav-tabs flex-column border-0 w-100 bg-light"
							role="tablist"
						>
							<li className="nav-item bg-dark">
								<a
									className="nav-link d-flex justify-content-center justify-content-lg-start align-items-center rounded-0 border-right-0 animate__animated animate__fadeInLeft active"
									href="#dashboard"
									data-toggle="tab"
									role="tab"
									style={{ animationDelay: "100ms" }}
								>
									<i className="bi bi-house-door-fill h4 mr-2 my-auto"></i>
									Dashboard
								</a>
							</li>
							<li className="nav-item bg-dark">
								<a
									className="nav-link d-flex justify-content-center justify-content-lg-start align-items-center rounded-0 border-right-0 animate__animated animate__fadeInLeft"
									href="#employees"
									data-toggle="tab"
									role="tab"
									style={{ animationDelay: "200ms" }}
								>
									<i className="bi bi-people-fill h4 mr-2 my-auto"></i>
									Employees
								</a>
							</li>
							<li className="nav-item bg-dark">
								<a
									className="nav-link d-flex justify-content-center justify-content-lg-start align-items-center rounded-0 border-right-0 animate__animated animate__fadeInLeft"
									href="#amenities-and-services"
									data-toggle="tab"
									role="tab"
									style={{ animationDelay: "300ms" }}
								>
									<i className="bi bi-tools h4 mr-2 my-auto"></i>
									Amenities &amp; Services
								</a>
							</li>
							<li className="nav-item bg-dark">
								<a
									className="nav-link d-flex justify-content-center justify-content-lg-start align-items-center rounded-0 border-right-0 animate__animated animate__fadeInLeft"
									href="#settings"
									data-toggle="tab"
									role="tab"
									style={{ animationDelay: "400ms" }}
								>
									<i className="bi bi-gear-fill h4 mr-2 my-auto"></i>
									Settings
								</a>
							</li>
							<li className="nav-item bg-dark">
								<Popup
									trigger={
										<span
											className="nav-link d-flex justify-content-center justify-content-lg-start align-items-center animate__animated animate__fadeInLeft"
											id="btn-logout"
											style={{ animationDelay: "450ms" }}
										>
											<i className="bi bi-box-arrow-right h4 mr-2 my-auto"></i>
											Logout
										</span>
									}
									contentStyle={{
										width: "auto",
										borderRadius: "0.25rem",
										padding: "0",
									}}
									closeOnDocumentClick={false}
									modal
								>
									{(close: any) => (
										<div className="modal-content">
											<div className="modal-header">
												<h5 className="modal-title">Logout</h5>
												<button
													type="button"
													className="close"
													data-dismiss="modal"
													aria-label="Close"
													onClick={() => {
														close()
													}}
												>
													<span aria-hidden="true">&times;</span>
												</button>
											</div>
											<div className="modal-body">
												<p>Are you sure you want to logout?</p>
											</div>
											<div className="modal-footer p-0">
												<button
													type="button"
													className="btn btn-sm px-4 btn-outline-primary"
													onClick={() => {
														close()
														// todo implement logout function
														router.replace(`/admin/`)
													}}
												>
													Yes
												</button>
												<button
													type="button"
													className="btn btn-sm px-4 btn-dark"
													onClick={() => {
														close()
													}}
												>
													No
												</button>
											</div>
										</div>
									)}
								</Popup>
							</li>
						</ul>
					</div>
				</nav>
				<section className="col-12 col-lg-10 ml-sm-auto px-0">
					<nav className="navbar navbar-secondary bg-light sticky-top pt-3 pb-2 mb-3 border-bottom animate__animated animate__fadeInDown">
						<div className="container d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center">
							<i
								className="bi bi-menu-app navbar-toggler d-lg-none"
								style={{ fontSize: "1.6rem" }}
								data-toggle="collapse"
								data-target="#menu-content"
								onClick={e => {
									const normal = "bi-menu-app",
										expanded = "bi-menu-app-fill"

									if (!$("#menu-content").hasClass("show")) {
										$(e.target).removeClass(normal)
										$(e.target).addClass(expanded)
									} else {
										$(e.target).removeClass(expanded)
										$(e.target).addClass(normal)
									}
								}}
							></i>
							<h6 className="navbar-brand font-weight-light">
								{hospital.hospital_name} | Admin Panel
							</h6>
							{/* <div className="btn-toolbar mb-2 mb-md-0">
								<div className="btn-group mr-2">
									<button
										type="button"
										className="btn btn-sm btn-outline-secondary"
									>
										Share
									</button>
									<button
										type="button"
										className="btn btn-sm btn-outline-secondary"
									>
										Export
									</button>
								</div>
							</div> */}
						</div>
					</nav>

					<div className="tab-content" id="nav-tabContent">
						<div
							className="tab-pane fade show active"
							id="dashboard"
							role="tabpanel"
						>
							<div
								className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 mx-0 mt-n3 px-2 py-4"
								style={{ backgroundColor: "aliceblue" }}
							>
								{Object.keys(hospital.count.booking).map((elem, index) => {
									return (
										<React.Fragment key={index}>
											<div className="col p-2 shadow-sm rounded">
												<div className="card card-stats border-0">
													<div className="card-body">
														<div className="row">
															<div className="col-5 col-md-4 p-0 d-flex justify-content-center align-items-center">
																<div className="h1 text-center text-info">
																	{index == 0 ? (
																		<i className="bi bi-journal-medical"></i>
																	) : index == 1 ? (
																		<i className="bi bi-journal-bookmark-fill"></i>
																	) : index == 2 ? (
																		<i className="bi bi-journal-check"></i>
																	) : (
																		<i className="bi bi-journal-x"></i>
																	)}
																</div>
															</div>
															<div className="col-7 col-md-8 text-center">
																<h6 className="card-title">
																	{elem.replace(
																		/(?:^\w|[A-Z]|\b\w)/g,
																		(ltr, idx) => ltr.toUpperCase()
																	)}
																</h6>
																<span className="display-4 font-weight-light">
																	{
																		hospital.count.booking[
																			elem as keyof typeof hospital.count.booking
																		]
																	}
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</React.Fragment>
									)
								})}
							</div>
						</div>
						<div className="tab-pane fade" id="employees" role="tabpanel">
							<div className="container">
								<div className="d-flex">
									<div
										className="btn-group btn-group-sm btn-group-toggle d-flex"
										style={{ flex: "auto" }}
										role="group"
										data-toggle="buttons"
									>
										<label
											className="btn btn-primary animate__animated animate__zoomIn active"
											id="active"
											onClick={e => {
												setFilteredStaff(filterStaff())
												setFilteredStaffOnSearch(filterStaff())

												setEditTuple("")
											}}
										>
											<input
												type="radio"
												name="options"
												defaultChecked={true}
											/>
											Active
										</label>
										<label
											className="btn btn-warning animate__animated animate__zoomIn"
											id="inactive"
											onClick={e => {
												setFilteredStaff(filterStaff("Inactive"))
												setFilteredStaffOnSearch(filterStaff("Inactive"))
											}}
										>
											<input type="radio" name="options" />
											Inactive
										</label>
									</div>
									<div className="">
										<button
											className="btn btn-sm btn-info ml-1 hvr-grow"
											onClick={async e => {
												// * refresh button action
												$("#btn_refresh_spinner").addClass("rotate")

												await fetch("/api/getupdatedstaffs", {
													method: "GET",
													headers: {
														"content-type": "application/json",
														"x-registration-no": hospital.registration_no,
													},
												})
													.then(response => response.json())
													.then(res => {
														setStaff(res)

														$("#inactive input[type=radio]").is(":checked")
															? $("#inactive").trigger("click")
															: $("#active").trigger("click")

														$("#btn_refresh_spinner").removeClass("rotate")

														Toast(`Staff list refreshed!`, "primary", 1800)
													})
													.catch(err => console.error(err))
											}}
											id={"btn_refresh"}
										>
											<i
												className="bi bi-arrow-repeat h6 d-inline-block mb-0"
												id={"btn_refresh_spinner"}
											></i>
										</button>
										<button
											className="btn btn-sm btn-dark ml-1 hvr-grow"
											id="addStaff"
											onClick={() => {
												setShowAddStaff(!showAddStaff)
												setOTP("")
											}}
										>
											<i className="bi bi-person-plus-fill h6"></i>
										</button>
									</div>
								</div>
								<div className="my-3">
									<form
										onSubmit={e => {
											e.stopPropagation()
											e.preventDefault()
										}}
									>
										<div className="form-group row">
											<div className="col-12 col-lg-6 col-xl-7 animate__animated animate__fadeInDown">
												<input
													type="search"
													placeholder="Search staffs"
													className={
														hospital.staff.length == 0
															? "form-control form-control-sm disabled"
															: "form-control form-control-sm"
													}
													id="searchStaffs"
													onChange={event => {
														setFilteredStaffOnSearch(
															filteredStaff.filter(staff => {
																return searchFieldName == "joined_on"
																	? new Date(
																			staff[
																				searchFieldName as keyof typeof staff
																			]
																	  )
																			.toUTCString()
																			.toLowerCase()
																			.indexOf(
																				event.target.value.toLowerCase()
																			) != -1
																	: staff[searchFieldName as keyof typeof staff]
																			.toString()
																			.toLowerCase()
																			.indexOf(
																				event.target.value.toLowerCase()
																			) != -1
															})
														)
													}}
													onClick={() => {
														// resetting table tuple if in edit mode
														setEditTuple("")
														$(".btn-save").addClass("disabled")
													}}
												/>
											</div>
											<div
												className="col-12 col-lg-6 col-xl-5 animate__animated animate__fadeInUp mt-2 mt-lg-0 d-flex justify-content-around"
												id="searchType"
											>
												<div className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														id="name"
														name="radioInline"
														className="custom-control-input"
														onClick={e => {
															setSearchFieldName(
																(e.target as HTMLInputElement).id
															)
															$("#searchStaffs").trigger("focus")
														}}
														defaultChecked={true}
													/>
													<label
														className="custom-control-label"
														htmlFor="name"
													>
														name
													</label>
												</div>
												<div className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														id="mobile_no"
														name="radioInline"
														className="custom-control-input"
														onClick={e => {
															setSearchFieldName(
																(e.target as HTMLInputElement).id
															)
															$("#searchStaffs").trigger("focus")
														}}
													/>
													<label
														className="custom-control-label"
														htmlFor="mobile_no"
													>
														mobile
													</label>
												</div>
												<div className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														id="email"
														name="radioInline"
														className="custom-control-input"
														onClick={e => {
															setSearchFieldName(
																(e.target as HTMLInputElement).id
															)
															$("#searchStaffs").trigger("focus")
														}}
													/>
													<label
														className="custom-control-label"
														htmlFor="email"
													>
														email
													</label>
												</div>
												<div className="custom-control custom-radio custom-control-inline">
													<input
														type="radio"
														id="joined_on"
														name="radioInline"
														className="custom-control-input"
														onClick={e => {
															setSearchFieldName(
																(e.target as HTMLInputElement).id
															)
															$("#searchStaffs").trigger("focus")
														}}
													/>
													<label
														className="custom-control-label"
														htmlFor="joined_on"
													>
														joined on
													</label>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
							{showAddStaff ? (
								<div className="table-responsive mt-5 mb-5 px-lg-5 px-md-3 px-2 animate__animated animate__fadeIn">
									<h5>Add New Staff</h5>
									<table className="table">
										<thead className="thead-dark text-center">
											<tr>
												<th>Name *</th>
												<th>Mobile *</th>
												<th>Email *</th>
												<th>Role *</th>
												{OTP != "" ? (
													<th className="animate__animated animate__fadeIn">
														OTP *
													</th>
												) : null}
												<th>Action</th>
											</tr>
										</thead>
										<tbody className="text-center">
											<tr id="staffDataRow">
												<td>
													<input
														type="text"
														className="w-100"
														id="staffName"
														placeholder="E.g.: Alice Milburn"
														onInput={e =>
															((e.target as HTMLInputElement).value = (
																e.target as HTMLInputElement
															).value.slice(0, 50))
														}
														required
														data-name="name"
													/>
													<small
														className="d-block text-danger text-left mt-1 pl-1"
														id="staffNameErr"
													></small>
												</td>
												<td>
													<input
														type="tel"
														className="w-100"
														id="staffMobile"
														placeholder="E.g.: 01*********"
														onInput={e =>
															((e.target as HTMLInputElement).value = (
																e.target as HTMLInputElement
															).value.slice(0, 11))
														}
														required
														data-name="mobile_no"
													/>
													<small
														className="d-block text-danger text-left mt-1 pl-1"
														id="staffMobileErr"
													></small>
												</td>
												<td>
													<input
														type="email"
														className="w-100"
														id="staffEmail"
														placeholder="E.g.: example@domain.com"
														onInput={e =>
															((e.target as HTMLInputElement).value = (
																e.target as HTMLInputElement
															).value.slice(0, 50))
														}
														required
														data-name="email"
													/>
													<small
														className="d-block text-danger text-left mt-1 pl-1"
														id="staffEmailErr"
													></small>
												</td>
												<td className="input-group input-group-sm">
													<select
														className="custom-select"
														id="staffRole"
														onChange={e => {
															$("#btn_addStaff").removeClass("disabled")
														}}
														data-name="role"
													>
														<option value={"null"} hidden>
															Choose...
														</option>
														<option value="Admin">Admin</option>
														<option value="DB_Manager">DB Manager</option>
														<option value="Moderator">Moderator</option>
													</select>
												</td>
												{OTP != "" ? (
													<td className="animate__animated animate__fadeIn">
														<div className="code_group">
															<input
																type="number"
																className="form-control"
																min="0"
																max="9"
																id="d-1"
																onInput={e => {
																	;(e.target as HTMLInputElement).value
																		.length == 1
																		? $("#d-2").trigger("focus")
																		: null
																}}
															/>
															<input
																type="number"
																className="form-control"
																min="0"
																max="9"
																id="d-2"
																onInput={e => {
																	;(e.target as HTMLInputElement).value
																		.length == 1
																		? $("#d-3").trigger("focus")
																		: null
																}}
															/>
															<input
																type="number"
																className="form-control"
																min="0"
																max="9"
																id="d-3"
																onInput={e => {
																	;(e.target as HTMLInputElement).value
																		.length == 1
																		? $("#d-4").trigger("focus")
																		: null
																}}
															/>
															<input
																type="number"
																className="form-control"
																min="0"
																max="9"
																id="d-4"
																onChange={async e => {
																	const enteredOTP =
																		($("#d-1").val() as string) +
																		$("#d-2").val() +
																		$("#d-3").val() +
																		$("#d-4").val()

																	if (OTP == enteredOTP) {
																		setOTP("")
																		$("#otpErr").text("")

																		// * new staff addition block
																		await fetch("/api/addhospitalstaff", {
																			method: "POST",
																			body: JSON.stringify(
																				getStaffInputFieldData(true)
																			),
																			headers: {
																				"content-type": "application/json",
																				"x-field-validated": "true",
																			},
																		})
																			.then(response => response.json())
																			.then(async res => {
																				// * on new staff addition success
																				if (res != null) {
																					// loading spinner
																					setLoading(true)

																					if (
																						await sendEmail(
																							res.email,
																							"Staff Login Credentials",
																							`This email is automatically generated from internal system of Smart Medicare, do not reply. 
           																					An account has been created for you as '${res.role.replace(
																											"_",
																											" "
																										)}' to access the dashboard functionalities
																							at https://${window.location.host}/admin. Mobile '${
																								res.mobile_no
																							}' & password '${res.password}'
																							are your login credentials. You are advised to change your password immediately after login.`
																						)
																					) {
																						// * on new staff addition & credentials sent success
																						Toast(
																							"Staff added and the credentials have been sent to the provided email.",
																							"primary",
																							5000
																						)

																						// resetting input fields & enabling 'Add Staff' button
																						$("#staffDataRow")
																							.find(
																								"input[type=text], input[type=tel], input[type=email], select"
																							)
																							.map((index, elem) => {
																								$(elem).attr("id") ==
																								"staffRole"
																									? $(elem).html($(elem).html())
																									: $(elem).val("")
																							})
																						$("#btn_addStaff").removeClass(
																							"disabled"
																						)
																					}
																					// * on new staff addition success but credentials sending failure
																					else {
																						Toast(
																							`Staff added but the credentials could not send to the provided email. 
																							Recovering the staff's password is advised.`,
																							"warning",
																							5000
																						)
																					}

																					setLoading(false)
																				}
																				// * on new staff addition failure
																				else {
																					Toast(
																						"Could not add the staff! Please try again.",
																						"warning"
																					)
																					$("#btn_addStaff").removeClass(
																						"disabled"
																					)
																				}
																			})
																			.catch(err => console.error(err))
																	} else {
																		$("#otpErr").text("Invalid OTP!")
																	}
																}}
															/>
														</div>
														<small
															className="d-block text-danger text-left mt-1 pl-1"
															id="otpErr"
														></small>
													</td>
												) : null}
												<td>
													<button
														className="btn btn-sm btn-primary disabled"
														id="btn_addStaff"
														onClick={async e => {
															if ($("#btn_addStaff").hasClass("disabled"))
																return

															let otp

															// field data validation
															await fetch("/api/addhospitalstaff", {
																method: "POST",
																body: JSON.stringify(getStaffInputFieldData()),
																headers: {
																	"content-type": "application/json",
																},
															})
																.then(response => response.json())
																.then(async res => {
																	const fieldHasError = {}

																	Object.keys(getStaffInputFieldData()).map(
																		fieldName => {
																			fieldHasError[fieldName] = false
																		}
																	)

																	// show error text
																	if (res.errors != undefined) {
																		res.errors.map((error: string) => {
																			$(
																				"#" +
																					Object.keys(
																						getStaffInputFieldData()
																					).filter(el => {
																						return (
																							el.indexOf(error.split(" ")[0]) !=
																							-1
																						)
																					})[0] +
																					"Err"
																			).text(error.replace("staff", ""))

																			fieldHasError[error.split(" ")[0]] = true
																		})
																	}

																	// hide error text upon validation
																	Object.keys(getStaffInputFieldData()).map(
																		fieldName => {
																			if (!fieldHasError[fieldName])
																				$("#" + fieldName + "Err").text("")
																		}
																	)

																	// * send OTP upon server side validation
																	if (res.validated) {
																		$("#btn_addStaff_spinner").removeClass(
																			"d-none"
																		)

																		otp = Math.floor(
																			1000 + Math.random() * 9000
																		)

																		if (
																			await sendOTP(
																				$("#staffEmail").val() as string,
																				"Staff Email Verification",
																				otp
																			)
																		) {
																			setOTP(otp.toString())

																			Toast(
																				`An OTP has been sent to the provided staff email, input OTP and verify.`,
																				"primary",
																				7000
																			)
																		} else {
																			Toast(
																				`Couldn't send OTP at the moment. Check your internet connectivity, please try again later.`,
																				"warning",
																				5000
																			)
																		}

																		$("#btn_addStaff_spinner").addClass(
																			"d-none"
																		)
																		$("#btn_addStaff").addClass("disabled")
																	}
																})
																.catch(err => console.error(err))
														}}
													>
														<span
															className="spinner-border spinner-border-sm d-none"
															id="btn_addStaff_spinner"
														></span>
														&nbsp;Add Staff
													</button>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							) : null}
							<div className="table-responsive px-lg-5 px-md-3 px-2 animate__animated animate__fadeIn animate__slow">
								<table
									className="table table-striped table-hover bg-light rounded shadow"
									id="staffDataTable"
								>
									<caption>
										<small>
											<i>
												Showing {filteredStaffOnSearch.length}&nbsp;of&nbsp;
												{filteredStaff.length} entries
											</i>
										</small>
									</caption>
									<thead className="thead-dark text-center">
										<tr>
											{typeof window != "undefined"
												? $("#active input[type=radio]").is(":checked")
													? // * populate thead - active
													  [
															"name",
															"mobile_no",
															"email",
															"role",
															"status",
															"joined_on",
															"action",
													  ].map((th: string, index) => {
															return (
																<th key={index}>
																	{th
																		.split("_")
																		.join(" ")
																		.replace(" no", "")
																		.replace(
																			/(?:^\w|[A-Z]|\b\w)/g,
																			(ltr, idx) => ltr.toUpperCase()
																		)}
																</th>
															)
													  })
													: // * populate thead - inactive
													  [
															"name",
															"mobile_no",
															"email",
															"role",
															"joined_on",
															"last_updated",
															"Action",
													  ].map((th: string, index) => {
															return (
																<th key={index}>
																	{th
																		.split("_")
																		.join(" ")
																		.replace(" no", "")
																		.replace(
																			/(?:^\w|[A-Z]|\b\w)/g,
																			(ltr, idx) => ltr.toUpperCase()
																		)}
																</th>
															)
													  })
												: // * populate thead - active
												  [
														"name",
														"mobile_no",
														"email",
														"role",
														"status",
														"joined_on",
														"action",
												  ].map((th: string, index) => {
														return (
															<th key={index}>
																{th
																	.split("_")
																	.join(" ")
																	.replace(" no", "")
																	.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
																		ltr.toUpperCase()
																	)}
															</th>
														)
												  })}
										</tr>
									</thead>
									<tbody className="text-center">
										{filteredStaffOnSearch.map((tr: staff, index: number) => {
											return (
												<tr
													className={
														tr?.status == "Active"
															? "table-active"
															: "table-dark text-secondary"
													}
													id={tr?.mobile_no.replace("+", "")}
													key={index}
												>
													{populateRow(tr, index)}
												</tr>
											)
										})}
									</tbody>
								</table>
							</div>
						</div>
						<div
							className="tab-pane fade"
							id="amenities-and-services"
							role="tabpanel"
						>
							<div className="container">
								<div
									className="card rounded-lg shadow mb-5 animate__animated animate__fadeIn"
									style={{ animationDelay: "100ms" }}
								>
									<h5 className="card-header">Amenities</h5>
									<div
										className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 mx-0 card-body"
										id="amenities"
									>
										{Object.keys(hospital.amenity)
											.filter((el: any) => el.indexOf("registration_no") == -1)
											.map((amenityType, index) => {
												return (
													<React.Fragment key={index}>
														<div className="col custom-control custom-checkbox my-2">
															<input
																type="checkbox"
																className="custom-control-input"
																id={amenityType}
																defaultChecked={
																	hospital.amenity[amenityType as keyof amenity]
																		? true
																		: false
																}
																onClick={e => {
																	const data = {
																		registration_no: hospital.registration_no,
																	}

																	$("#amenities")
																		.find("input[type=checkbox]")
																		.map(
																			(index, elem) =>
																				(data[$(elem).attr("id")] =
																					$(elem).is(":checked"))
																		)

																	setNewAmenity(data as amenity)
																}}
															/>
															<label
																className="custom-control-label"
																htmlFor={amenityType}
															>
																{amenityType
																	.replace("_", " ")
																	.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
																		ltr.toUpperCase()
																	)}
															</label>
														</div>
													</React.Fragment>
												)
											})}
									</div>
									<div className="card-footer d-flex justify-content-end py-1">
										<button
											className="btn btn-sm btn-primary disabled"
											id={"btn_amenity"}
											onClick={async e => {
												//  update hospital amenities
												if ($("#btn_amenity").hasClass("disabled")) return

												$("#btn_amenity_spinner").removeClass("d-none")

												await fetch("/api/updatehospitalamenities", {
													method: "POST",
													body: JSON.stringify(newAmenity),
													headers: {
														"content-type": "application/json",
														"x-service-type": "amenity",
													},
												})
													.then(response => response.json())
													.then(res => {
														if (res["clientVersion"] == undefined) {
															$("#btn_amenity_spinner").addClass("d-none")
															$(e.target).addClass("disabled")

															setAmenity(res)

															Toast("Amenities updated!")
														} else {
															$("#btn_amenity_spinner").addClass("d-none")

															Toast("Amenities update failed!", "danger", false)
														}

														console.table(res)
													})
													.catch(err => console.error(err))
											}}
										>
											<span
												className="spinner-border spinner-border-sm d-none"
												id={"btn_amenity_spinner"}
											></span>
											&nbsp;Save Changes
										</button>
									</div>
								</div>
								{[
									"general_service",
									"blood_analytical_service",
									"diagnostic_imaging_service",
								].map((serviceType: string, serviceTypeIndex) => {
									const annotationDataSet = {
										general_service: {
											emg: "Electromyography",
										},
										blood_analytical_service: {
											cbc: "Complete Blood Count",
											crp: "C-Reactive Protein",
											esr: "Erythrocyte Sedimentation Rate",
											fobt: "Fecal Occult Blood Test",
											rf: "Rheumatoid Factor",
											sr: "Sedimentation Rate",
										},
										diagnostic_imaging_service: {
											cta: "Computed Tomography Angiography",
											ct: "Computed Tomography",
											mra: "Magnetic Resonance Angiography",
											mri: "Magnetic Resonance Imaging",
											mrs: "Magnetic Resonance Spectroscopy",
											pet: "Positron Emission Tomography",
											spect: "Single-Photon Emission Computed Tomography",
										},
									}

									return (
										<React.Fragment key={serviceTypeIndex}>
											<div
												className="card rounded-lg shadow mb-5 animate__animated animate__fadeIn"
												style={
													serviceTypeIndex == 0
														? { animationDelay: "300ms" }
														: serviceTypeIndex == 1
														? { animationDelay: "500ms" }
														: {}
												}
											>
												<h5 className="card-header">
													{serviceType
														.split("_")
														.join(" ")
														// .toUpperCase()
														.replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
															ltr.toUpperCase()
														) + "s"}
												</h5>
												<div
													className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 mx-0 card-body"
													id={serviceType}
												>
													{Object.keys(
														hospital[serviceType as keyof typeof hospital]
													)
														.filter(
															(el: any) => el.indexOf("registration_no") == -1
														)
														.map((service, index) => {
															return (
																<React.Fragment key={index}>
																	<div className="col custom-control custom-checkbox my-2">
																		<input
																			type="checkbox"
																			defaultChecked={
																				hospital[serviceType][service]
																					? true
																					: false
																			}
																			data-parent={serviceType}
																			className="custom-control-input"
																			id={service}
																			onClick={e => {
																				const data = {
																					[serviceType]: {
																						registration_no:
																							hospital.registration_no,
																					},
																				}

																				$("#" + $(e.target).attr("data-parent"))
																					.find("input[type=checkbox]")
																					.map(
																						(index, elem) =>
																							(data[serviceType][
																								$(elem).attr("id")
																							] = $(elem).is(":checked"))
																					)

																				if (
																					Object.keys(data)[0] ===
																					"general_service"
																				) {
																					setNewGeneralService(
																						data[serviceType] as general_service
																					)
																				} else if (
																					Object.keys(data)[0] ===
																					"blood_analytical_service"
																				) {
																					setNewBloodAnalyticalService(
																						data[
																							serviceType
																						] as blood_analytical_service
																					)
																				} else if (
																					Object.keys(data)[0] ===
																					"diagnostic_imaging_service"
																				) {
																					setNewDiagnosticImagingService(
																						data[
																							serviceType
																						] as diagnostic_imaging_service
																					)
																				}
																			}}
																		/>
																		<label
																			htmlFor={service}
																			className="custom-control-label ml-2"
																		>
																			{service
																				.split("_")
																				.join(" ")
																				.toUpperCase()}
																		</label>

																		{Object.keys(annotationDataSet)[
																			serviceTypeIndex
																		] == serviceType
																			? Object.keys(
																					annotationDataSet[
																						serviceType as keyof typeof annotationDataSet
																					]
																			  ).map((serviceElem, index) => {
																					return serviceElem == service ? (
																						<AnnotationToggler
																							textContent={
																								annotationDataSet[serviceType][
																									service
																								]
																							}
																							textColor="text-info"
																							key={index}
																						/>
																					) : null
																			  })
																			: null}
																	</div>
																</React.Fragment>
															)
														})}
												</div>
												<div className="card-footer d-flex justify-content-end py-1">
													<button
														className="btn btn-sm btn-primary disabled"
														id={"btn_" + serviceType}
														onClick={e => {
															// update hospital services
															if ($("#btn_" + serviceType).hasClass("disabled"))
																return

															const types = {
																	general_service: newGeneralService,
																	blood_analytical_service:
																		newBloodAnalyticalService,
																	diagnostic_imaging_service:
																		newDiagnosticImagingService,
																},
																saveChanges = async (
																	serviceType: string,
																	value:
																		| general_service
																		| blood_analytical_service
																		| diagnostic_imaging_service
																) => {
																	$(
																		"#btn_" + serviceType + "_spinner"
																	).removeClass("d-none")

																	await fetch("/api/updatehospitalservices", {
																		method: "POST",
																		body: JSON.stringify(value),
																		headers: {
																			"content-type": "application/json",
																			"x-service-type": `${serviceType}`,
																		},
																	})
																		.then(response => response.json())
																		.then(res => {
																			if (res["clientVersion"] == undefined) {
																				$(
																					"#btn_" + serviceType + "_spinner"
																				).addClass("d-none")
																				$(e.target).addClass("disabled")

																				if (serviceType === "general_service") {
																					setGeneralService(
																						res as general_service
																					)
																				} else if (
																					serviceType ===
																					"blood_analytical_service"
																				) {
																					setBloodAnalyticalService(
																						res as blood_analytical_service
																					)
																				} else if (
																					serviceType ===
																					"diagnostic_imaging_service"
																				) {
																					setDiagnosticImagingService(
																						res as diagnostic_imaging_service
																					)
																				}

																				Toast(
																					`${
																						serviceType
																							.split("_")
																							.join(" ")
																							.replace(
																								/(?:^\w|[A-Z]|\b\w)/g,
																								(ltr, idx) => ltr.toUpperCase()
																							) + "s"
																					} updated!`
																				)
																			} else {
																				$(
																					"#btn_" + serviceType + "_spinner"
																				).addClass("d-none")

																				Toast(
																					`${
																						serviceType
																							.split("_")
																							.join(" ")
																							.replace(
																								/(?:^\w|[A-Z]|\b\w)/g,
																								(ltr, idx) => ltr.toUpperCase()
																							) + "s"
																					} update failed!`,
																					"danger",
																					false
																				)
																			}

																			console.table(res)
																		})
																		.catch(err => console.error(err))
																}

															for (const type of Object.keys(types)) {
																if (type.match(serviceType)) {
																	saveChanges(
																		type,
																		types[type as keyof typeof types]
																	)
																	break
																}
															}
														}}
													>
														<span
															className="spinner-border spinner-border-sm d-none"
															id={"btn_" + serviceType + "_spinner"}
														></span>
														&nbsp;Save Changes
													</button>
												</div>
											</div>
										</React.Fragment>
									)
								})}
							</div>
						</div>

						<div className="tab-pane fade" id="settings" role="tabpanel">
							<div className="container">
								<form
									onSubmit={e => {
										e.preventDefault()
										e.stopPropagation()
									}}
								>
									<div className="card border-0 mb-5">
										<fieldset
											className="shadow-sm rounded animate__animated animate__fadeIn"
											style={{ animationDelay: "100ms" }}
										>
											<h5 className="card-header">Profile</h5>
											<div className="card-body" id="hospital_profile">
												<div className="form-row row-cols-lg- row-cols-md-3 row-cols-sm-2 row-cols-1">
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_hospital_name"
														>
															Name *
														</label>
														<input
															type="text"
															className="form-control"
															id="hospital_hospital_name"
															data-parent="hospital"
															name="hospital_name"
															placeholder="E.g.: United Hospital Ltd."
															defaultValue={hospital.hospital_name}
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 100))
															}
															required
														/>
														<small className="invalid-feedback"></small>
													</div>
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_registration_no"
														>
															Registration
														</label>
														<input
															type="text"
															className="form-control"
															id="hospital_registration_no"
															data-parent="hospital"
															name="registration_no"
															placeholder="E.g.: 1*2*3*4*5*"
															defaultValue={hospital.registration_no}
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 10))
															}
															disabled
															readOnly
														/>
													</div>
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_hospital_type"
														>
															Type *
														</label>
														<select
															className="custom-select"
															id="hospital_hospital_type"
															data-parent="hospital"
															name="hospital_type"
															defaultValue={hospital.hospital_type}
															required
														>
															<option value="Public">Public</option>
															<option value="Private">Private</option>
														</select>
														<small className="invalid-feedback"></small>
													</div>
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_website"
														>
															Website #
														</label>
														<input
															type="url"
															className="form-control"
															id="hospital_website"
															data-parent="hospital"
															name="website"
															placeholder="E.g.: www.example.com"
															defaultValue={hospital.website}
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 255))
															}
														/>
														<small className="invalid-feedback"></small>
													</div>
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_phone_no"
														>
															Phone #
														</label>
														<input
															type="tel"
															className="form-control"
															id="hospital_phone_no"
															data-parent="address"
															name="phone_no"
															placeholder="E.g.: +88023456712"
															defaultValue={
																hospital.address.phone_no == null
																	? ""
																	: hospital.address.phone_no
															}
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 14))
															}
														/>
														<small className="invalid-feedback"></small>
													</div>
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_mobile_no"
														>
															Mobile #
														</label>
														<input
															type="tel"
															className="form-control"
															id="hospital_mobile_no"
															data-parent="address"
															name="mobile_no"
															placeholder="E.g.: +8801*********"
															defaultValue={
																hospital.address.mobile_no == null
																	? ""
																	: hospital.address.mobile_no
															}
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 14))
															}
														/>
														<small className="invalid-feedback"></small>
													</div>
												</div>
												<div className="form-row row-cols-3 mb-3">
													<div className="col">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_latitude"
														>
															Latitude $
														</label>
														<input
															type="number"
															min="-90"
															max="90"
															step="0.00000001"
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 10))
															}
															className="form-control"
															id="hospital_latitude"
															data-parent="address"
															name="latitude"
															placeholder="E.g.: 23.80665"
															defaultValue={hospital.address.latitude?.toString()}
														/>
														<small className="invalid-feedback"></small>
													</div>
													<div className="col">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_longitude"
														>
															Longitude $
														</label>
														<input
															type="number"
															min="-180"
															max="180"
															step="0.00000001"
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 10))
															}
															className="form-control"
															id="hospital_longitude"
															data-parent="address"
															name="longitude"
															placeholder="E.g.: 90.679456"
															defaultValue={hospital.address.longitude?.toString()}
														/>
														<small className="invalid-feedback"></small>
													</div>
													<div className="col d-flex">
														<button
															className="btn btn-sm btn-dark mt-auto mb-1 mx-auto mx-md-0"
															style={{ fontSize: "0.85rem" }}
															onClick={() => {
																navigator.geolocation
																	? navigator.geolocation.getCurrentPosition(
																			position => {
																				$("#coordinateErr").text("")
																				$(
																					"#hospital_latitude, #hospital_longitude"
																				)
																					.next("small")
																					.text("")

																				$("#hospital_latitude").val(
																					position.coords.latitude
																						.toString()
																						.slice(0, 10)
																				)
																				$("#hospital_longitude").val(
																					position.coords.longitude
																						.toString()
																						.slice(0, 10)
																				)

																				$("#hospital_latitude").trigger("input")
																			},
																			error =>
																				$("#coordinateErr").html(error.message)
																	  )
																	: $("#coordinateErr").text(
																			`Your browser doesn\'t support geolocation. Try inputting manually.`
																	  )
															}}
														>
															<i className="bi bi-geo-alt"></i>
															&nbsp;Get Position
														</button>
													</div>
													<small
														className="text-danger font-italic ml-1 mt-1"
														id="coordinateErr"
													></small>
												</div>
												<div className="form-row row-cols-12 mt-n1">
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_address"
														>
															Address *
														</label>
														<input
															type="text"
															className="form-control"
															id="hospital_address"
															data-parent="address"
															name="address"
															placeholder="Street address of the hospital"
															defaultValue={hospital.address.address}
															required
														/>
														<small className="invalid-feedback"></small>
													</div>
												</div>
											</div>
											<div className="card-footer d-flex justify-content-end py-1">
												<div className="text-info mr-auto pr-2">
													<small className="mr-2 mb-1 d-inline-block">
														* - required
													</small>
													<small className="mr-2 mb-1 d-inline-block">
														# - either one is required
													</small>
													<small className="mr-2 mb-1 d-inline-block">
														$ - optional
													</small>
												</div>
												<button
													className="btn btn-sm btn-primary disabled"
													id="btn_profile"
													onClick={async e => {
														if ($(e.target).hasClass("disabled")) return

														$("#btn_profile_spinner").removeClass("d-none")

														await fetch("/api/updatehospitalprofile", {
															method: "POST",
															headers: { "content-type": "application/json" },
															body: JSON.stringify({
																profileData,
																newProfileData,
															}),
														})
															.then(response => response.json())
															.then(res => {
																$("#hospital_profile")
																	.find("input, select")
																	.map((index, elem) => {
																		if (
																			!$(elem).attr("disabled") &&
																			!$(elem).attr("readonly")
																		)
																			$(elem)
																				.addClass("is-valid")
																				.removeClass("is-invalid")
																	})

																if (res.errors != undefined) {
																	res.errors.map((error: string) => {
																		$(
																			"#hospital_" +
																				error.split(".")[1].split(" ")[0]
																		)
																			.addClass("is-invalid")
																			.removeClass("is-valid")
																			.next("small")
																			.text(
																				error
																					.split(".")[1]
																					.replace("_no", "")
																					.replace("_", " ")
																			)
																	})
																} else if (res.updated) {
																	setProfileData(newProfileData)
																	$("#btn_profile").addClass("disabled")
																	Toast(
																		"Profile updated successfully!",
																		"primary",
																		1800
																	)

																	$("#hospital_profile")
																		.find("input, select")
																		.map((index, elem) => {
																			$(elem).removeClass("is-valid is-invalid")
																		})
																}
															})
															.catch(err => console.error(err))
														$("#btn_profile_spinner").addClass("d-none")
													}}
												>
													<span
														className="spinner-border spinner-border-sm d-none"
														id="btn_profile_spinner"
													></span>
													&nbsp;Save Changes
												</button>
											</div>
										</fieldset>
										<fieldset
											className="mt-5 shadow-sm rounded animate__animated animate__fadeIn"
											style={{ animationDelay: "300ms" }}
										>
											<h5 className="card-header">Description &amp; Avatar</h5>
											<div className="card-body">
												<div className="form-row">
													<div className="col mb-3 my-auto">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_image"
														>
															Avatar $
														</label>
														<Image
															// todo fix image path
															// src={hospital.image_source}
															src={"/media/hospital-building-3.jpg"}
															width={1280}
															height={780}
															id="hospital_image"
															priority
														/>

														<div className="custom-file">
															<small
																className="custom-file-label"
																id="imageSourceLabel"
															>
																Choose file
															</small>
															<input
																type="file"
																className="custom-file-input"
																id="hospital_image_source"
																data-parent="hospital"
																name="image_source"
																accept="image/jpeg, image/png"
																onChange={event => {
																	if (event.target.files?.length == 1) {
																		$("#imageErr").text("")
																		$("#imageSourceLabel").text(
																			event.target.files.item(0)?.name as string
																		)

																		const file = event.target.files[0],
																			reader = new FileReader()

																		reader.readAsDataURL(file)
																		reader.onloadend = () => {
																			base64image = reader.result as string
																			$("#hospital_image").attr(
																				"srcset",
																				reader.result as string
																			)
																		}
																	} else {
																		$("#imageErr").text(
																			"No image file chosen, default image will be displayed!"
																		)
																		$("#imageSourceLabel").text("Choose file")

																		$("#hospital_image").attr(
																			"srcset",
																			hospital.image_source
																		)

																		base64image = "default"
																	}
																}}
															/>
														</div>
														<small
															className="d-block text-danger ml-1 mt-1"
															id="imageErr"
														></small>
													</div>
													<div className="col mb-3 my-auto">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="hospital_description"
														>
															Description $
														</label>
														<textarea
															className="form-control"
															style={{ fontSize: "0.85rem" }}
															id="hospital_description"
															data-parent="hospital"
															name="description"
															placeholder="Provide a brief description of the hospital."
															defaultValue={hospital.description}
															rows={4}
															spellCheck
														></textarea>
														<small className="invalid-feedback"></small>
													</div>
												</div>
											</div>
											<div className="card-footer d-flex justify-content-end py-1">
												<div className="text-info mr-auto">
													<small className="mr-2 mb-1">$ - optional</small>
												</div>
												<button
													className="btn btn-sm btn-primary disabled"
													id="btn_description"
													onClick={() => {}}
												>
													<span
														className="spinner-border spinner-border-sm d-none"
														id="btn_description_spinner"
													></span>
													&nbsp;Save Changes
												</button>
											</div>
										</fieldset>
										<fieldset className="mt-5 shadow-sm rounded">
											<h5 className="card-header">Capacity</h5>
											<div className="card-body">
												<div
													className="form-row row-cols-xl-6 row-cols-md-4 row-cols-2"
													data-parent="capacity"
													id="hospital_capacity"
												>
													<BedTypeInputFields />
												</div>
											</div>
											<div className="card-footer d-flex justify-content-end py-1">
												<button
													className="btn btn-sm btn-primary disabled"
													id="btn_capacity"
													onClick={async e => {
														if ($(e.target).hasClass("disabled")) return

														$("#btn_capacity_spinner").removeClass("d-none")

														await fetch("/api/updatehospitalcapacity", {
															method: "POST",
															headers: {
																"content-type": "application/json",
															},
															body: JSON.stringify({
																capacity,
																newCapacity,
															}),
														})
															.then(response => response.json())
															.then(res => {
																Toast(
																	"Hospital capacity updated successfully!",
																	"primary",
																	1800
																)

																setCapacity(newCapacity)

																$(e.target).addClass("disabled")
															})
															.catch(err => console.error(err))

														$("#btn_capacity_spinner").addClass("d-none")
													}}
												>
													<span
														className="spinner-border spinner-border-sm d-none"
														id="btn_capacity_spinner"
													></span>
													&nbsp;Save Changes
												</button>
											</div>
										</fieldset>
										<fieldset className="mt-5 shadow-sm rounded">
											<h5 className="card-header">User</h5>
											<div className="card-body">
												<div
													className="form-row row-cols-1 row-cols-sm-2"
													id="hospital_user"
												>
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="staff_name"
														>
															Name *
														</label>
														<input
															type="text"
															className="form-control"
															id="staff_name"
															data-parent="staff"
															name="name"
															placeholder="E.g.: Alice Milburn"
															defaultValue={hospital.user.name}
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 50))
															}
															required
														/>
														<small className="invalid-feedback"></small>
													</div>
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="staff_email"
														>
															Email *
														</label>
														<input
															type="email"
															className="form-control"
															id="staff_email"
															data-parent="staff"
															name="email"
															placeholder="E.g.: example@domain.com"
															defaultValue={hospital.user.email}
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 50))
															}
															required
														/>
														<small className="invalid-feedback"></small>
													</div>
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="staff_mobile_no"
														>
															Mobile *
														</label>
														<input
															type="tel"
															className="form-control"
															id="staff_mobile_no"
															data-parent="staff"
															name="mobile_no"
															placeholder="E.g.: +8801*********"
															defaultValue={hospital.user.mobile_no}
															onInput={e =>
																((e.target as HTMLInputElement).value = (
																	e.target as HTMLInputElement
																).value.slice(0, 14))
															}
															required
														/>
														<small className="invalid-feedback"></small>
													</div>
													<div className="col mb-3">
														<label
															className="text-primary"
															style={{ fontSize: "0.9rem" }}
															htmlFor="staff_role"
														>
															Role
														</label>
														<input
															type="text"
															className="form-control"
															id="staff_role"
															data-parent="staff"
															name="role"
															defaultValue={hospital.user.role.replace(
																"_",
																" "
															)}
															disabled
															readOnly
														/>
														<small className="invalid-feedback"></small>
													</div>
												</div>
												{passwordChangeViewIsVisible ? (
													<div className="form-row row-cols-1 row-cols-sm-2 mb-1 animate__animated animate__fadeIn">
														<div className="col mb-3">
															<label
																className="text-primary"
																style={{ fontSize: "0.9rem" }}
																htmlFor="staff_password"
															>
																<i className="bi bi-pencil-square"></i>
																&nbsp;Change Password
															</label>
															<input
																type="password"
																className="form-control"
																id="staff_password"
																data-parent="staff"
																name="password"
																placeholder="New password"
																onKeyDown={e => {
																	e.code == "Backspace"
																		? $(e.target).trigger("input")
																		: null
																}}
																onInput={e => {
																	;(e.target as HTMLInputElement).value = (
																		e.target as HTMLInputElement
																	).value.slice(0, 25)

																	if (
																		($(e.target).val() as string)?.length < 4
																	) {
																		$(e.target).addClass("is-invalid")

																		$("#staffPasswordErr").text(
																			"Password too short! Should be between 4 - 25 characters."
																		)
																		return
																	} else {
																		$(e.target).removeClass("is-invalid")
																		$("#staffPasswordErr").text("")
																	}

																	const input = $(e.target)
																		.parent()
																		.next()
																		.children("input[type=password]")
																		.removeClass("is-valid is-invalid")
																		.val("")
																	return
																	if (
																		input.val() ==
																		(e.target as HTMLInputElement).value
																	)
																		$("#btn_save_password").removeClass(
																			"disabled"
																		)
																	else
																		$("#btn_save_password").addClass("disabled")
																}}
															/>
														</div>
														<div className="col mt-auto mb-3">
															<input
																type="password"
																className="form-control"
																data-parent="staff"
																name="password"
																placeholder="Confirm new password"
																onInput={e => {
																	;(e.target as HTMLInputElement).value = (
																		e.target as HTMLInputElement
																	).value.slice(0, 25)

																	const input = $(e.target)
																		.parent()
																		.prev()
																		.children("input[type=password]")

																	if (input.val() == "") return

																	if ((input.val() as string)?.length < 4)
																		return

																	if (
																		input.val() !=
																		(e.target as HTMLInputElement).value
																	) {
																		input.removeClass("is-valid")
																		$(e.target).addClass("is-invalid")

																		$("#staffPasswordErr").text(
																			"Passwords do not match!"
																		)

																		$("#btn_save_password").addClass("disabled")
																	} else {
																		input.addClass("is-valid")
																		$(e.target).removeClass("is-invalid")
																		$(e.target).addClass("is-valid")

																		$("#staffPasswordErr").text("")

																		$("#btn_save_password").removeClass(
																			"disabled"
																		)
																	}
																}}
															/>
														</div>
														<small
															className="text-danger ml-1 mw-100"
															style={{ flex: "none" }}
															id="staffPasswordErr"
														></small>
													</div>
												) : null}
												<button
													className="btn btn-sm btn-dark mr-1"
													onClick={e => {
														setPasswordChangeViewIsVisible(
															!passwordChangeViewIsVisible
														)
													}}
												>
													Change Password
												</button>
												{passwordChangeViewIsVisible ? (
													<button
														className="btn btn-sm btn-info disabled animate__animated animate__fadeIn"
														id="btn_save_password"
														onClick={async e => {
															if ($(e.target).hasClass("disabled")) return

															$("#btn_save_password_spinner").removeClass(
																"d-none"
															)

															await fetch("/api/updatehospitaluser", {
																method: "POST",
																headers: {
																	"content-type": "application/json",
																	"x-action-update-password": "true",
																},
																body: JSON.stringify({
																	// todo implement encryption
																	newPassword: $("#staff_password").val(),
																	email: userData.email,
																}),
															})
																.then(response => response.json())
																.then(res => {
																	Toast(
																		"User password updated successfully!",
																		"primary",
																		1800
																	)
																	setPasswordChangeViewIsVisible(false)
																})
																.catch(err => console.error(err))

															$("#btn_save_password_spinner").addClass("d-none")
														}}
													>
														<span
															className="spinner-border spinner-border-sm d-none"
															id="btn_save_password_spinner"
														></span>
														&nbsp;Save Password
													</button>
												) : null}
											</div>
											<div className="card-footer d-flex justify-content-end py-1">
												<div className="text-info mr-auto">
													<small className="mr-2 mb-1">* - required</small>
												</div>
												<button
													className="btn btn-sm btn-primary disabled"
													id="btn_user"
													onClick={async e => {
														if ($(e.target).hasClass("disabled")) return

														$("#btn_user_spinner").removeClass("d-none")

														await fetch("/api/updatehospitaluser", {
															method: "POST",
															headers: { "content-type": "application/json" },
															body: JSON.stringify({
																userData,
																newUserData,
															}),
														})
															.then(response => response.json())
															.then(res => {
																$("#hospital_user")
																	.find("input")
																	.map((index, elem) => {
																		if (
																			!$(elem).attr("disabled") &&
																			!$(elem).attr("readonly")
																		)
																			$(elem)
																				.addClass("is-valid")
																				.removeClass("is-invalid")
																	})

																if (res.errors != undefined) {
																	res.errors.map((error: string) => {
																		$("#staff_" + error.split(" ")[0])
																			.addClass("is-invalid")
																			.removeClass("is-valid")
																			.next("small")
																			.text(
																				error
																					.replace("_no", "")
																					.replace("_", "")
																			)
																	})
																} else if (res.updated) {
																	setUserData(newUserData)
																	$("#btn_user").addClass("disabled")
																	Toast(
																		"User updated successfully!",
																		"primary",
																		1800
																	)

																	$("#hospital_user")
																		.find("input")
																		.map((index, elem) => {
																			$(elem).removeClass("is-valid is-invalid")
																		})
																}
															})
															.catch(err => console.error(err))
														$("#btn_user_spinner").addClass("d-none")
													}}
												>
													<span
														className="spinner-border spinner-border-sm d-none"
														id="btn_user_spinner"
													></span>
													&nbsp;Save Changes
												</button>
											</div>
										</fieldset>
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}

export default Dashboard
