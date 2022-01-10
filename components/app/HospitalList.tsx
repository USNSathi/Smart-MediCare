import getTimeSpan from "@lib/time-span"
import Link from "next/link"
import Image from "next/image"
import { Links } from "@pages/_app"
import React from "react"

interface VacantBedTuple {
	hospital_name: string
	registration_no: string
	last_updated: Date
	ward: number | null
	special_ward: number | null
	cabin: number | null
	vip_cabin: number | null
	icu: number | null
	ccu: number | null
	hdu: number | null
	hfncu: number | null
	emergency: number | null
	covid: number | null
	extra: number | null
}

export interface HospitalListProps {
	vacantBedInfo: VacantBedTuple[]
}

const HospitalList: React.FC<HospitalListProps> = ({ vacantBedInfo }) => {
	let key = 0,
		bedTypes = Object.keys(vacantBedInfo[0])

	// filtering array from non bed type names
	for (const elem of [
		"registration_no",
		"hospital_name",
		"last_updated",
		"image_source",
	])
		bedTypes = bedTypes.filter((el: any) => el.indexOf(elem) == -1)

	return (
		<>
			<div className="row">
				{vacantBedInfo.map((vacantBedTuple, index) => (
					<React.Fragment key={index}>
						{index == 6 ? (
							<>
								<div
									className="col-12 col-md-8 col-lg-6 mb-4 px-2 d-flex"
									key={key++}
								>
									<div className="card d-flex mx-auto rounded shadow-lg m-auto">
										<div className="card-image m-auto p-3">
											<Image
												className="img-fluid rounded-circle"
												src="/media/doctor-testimonial.jpg"
												width={400}
												height={400}
											/>
										</div>
										<div className="card-body">
											<h4 className="card-title">Dr. Petro Gilbert</h4>
											<p
												className="card-text mx-auto"
												style={{ maxWidth: "98%" }}
											>
												<i className="bi bi-blockquote-left h2 text-info"></i>
												Lorem ipsum dolor sit amet, consectetuer adipiscing
												elit. Aenean commodo ligula eget dolor. Aenean massa.
												Nam quam nunc, blandit vel, luctus pulvinar, hendrerit
												Maecenas nec odio et ante tincidunt tempus Duis leo.
												Donec sodales sagittis magna id, lorem.
												<i className="bi bi-blockquote-right h2 text-info align-text-top"></i>
											</p>
										</div>
										<div className="card-footer text-center">
											<small>
												Petro, CEO,&nbsp;<a href="#">United Hospital Ltd.</a>
											</small>
										</div>
									</div>
								</div>
							</>
						) : null}
						<div
							className={
								index < 4
									? index <= 1
										? "col-12 col-md-4 col-lg-3 mb-4 px-2 animate__animated animate__fadeInUp"
										: "col-12 col-md-4 col-lg-3 mb-4 px-2 animate__animated animate__fadeInUp"
									: "col-12 col-md-4 col-lg-3 mb-4 px-2"
							}
							style={
								index < 4
									? index == 0
										? { animationDelay: "0.47s" }
										: index == 1
										? { animationDelay: "0.67s" }
										: index == 2
										? { animationDelay: "0.87s" }
										: index == 3
										? { animationDelay: "0.97s" }
										: {}
									: {}
							}
							id={vacantBedTuple.registration_no}
							key={key++}
						>
							<div className="card h-100 rounded-3 bg-light shadow animate_animated animate__fadeInLeft">
								<div className="card-img-top d-flex justify-content-center align-items-center">
									<Image
										src={
											// todo fix path
											"/media/hospital-building-" +
											Math.floor(Math.random() * (7 - 1 + 1) + 1) +
											".jpg"
										}
										alt="institute image"
										width={480}
										height={320}
										// priority={index <= 3 ? true : false}
									/>
								</div>
								<div className="card-body d-flex flex-column">
									<Link href={Links.App.home + vacantBedTuple.registration_no}>
										<a className="card-title text-decoration-none stretched-link">
											{vacantBedTuple.hospital_name}
										</a>
									</Link>
									<ul className="list-group list-group-flush my-auto">
										{bedTypes.map(
											(bedType: keyof typeof vacantBedTuple, index) => {
												return vacantBedTuple[bedType] == null ? null : (
													<li
														className="
											list-group-item
											d-flex
											justify-content-between
											align-items-center
										"
														style={{ fontSize: "0.9rem" }}
														key={index}
													>
														{
															bedType.split("_").join(" ").toUpperCase()
															// .replace(/(?:^\w|[a-z]|\b\w)/g, (ltr, idx) =>
															// 	ltr.toUpperCase()
															// )
														}
														<span
															className={
																(vacantBedTuple[bedType] as number) <= 5
																	? vacantBedTuple[bedType] == 0
																		? "badge badge-danger badge-pill"
																		: "badge badge-warning badge-pill"
																	: "badge badge-primary badge-pill"
															}
														>
															{vacantBedTuple[bedType]}
														</span>
													</li>
												)
											}
										)}
									</ul>
								</div>
								<div className="card-footer text-center">
									<small className="text-muted">
										Last updated {getTimeSpan(vacantBedTuple.last_updated)}
									</small>
								</div>
							</div>
						</div>
					</React.Fragment>
				))}
			</div>
		</>
	)
}

export default HospitalList
