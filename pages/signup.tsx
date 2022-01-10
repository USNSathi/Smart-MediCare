import Head from "next/head"
import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import $ from "jquery"
import { sendOTP } from "@functionalities/emailManager"
import Link from "next/link"

import ImageCapture from "react-image-data-capture"

import ReactCrop from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Toast } from "@functionalities/toast"
import { Links } from "@pages/_app"
import router from "next/router"

export interface UserSignupProps {}

const UserSignup: React.FC<UserSignupProps> = () => {
	let current_fs: JQuery<HTMLElement>,
		next_fs: JQuery<HTMLElement>,
		previous_fs: JQuery<HTMLElement>,
		left,
		opacity,
		scale, //fieldset properties which we will animate
		animating: boolean, //flag to prevent quick multi-click glitches
		OTP: number,
		validated = false

	const [showCodeGroup, setShowCodeGroup] = useState(false),
		sendUserSignupOTP = async () => {
			await fetch("/api/usersignup", {
				method: "POST",
				headers: new Headers({ "content-type": "application/json" }),
				body: JSON.stringify({
					step: "user email",
					data: {
						email: $("#email").val(),
					},
				}),
				redirect: "follow",
			})
				.then(response => response.json())
				.then(async res => {
					// error message displaying
					if (res.message != undefined)
						$("#emailErr").text(res.message.replace("email ", "Email "))
					else if (res.error != undefined) $("#emailErr").text(res.error)
					else {
						$("#emailErr").text("")

						$("#otpBtnSpinner").removeClass("d-none")
						$("#otp").html(`<span
								class="spinner-border spinner-border-sm mr-2"
								id="otpBtnSpinner"></span>Continue`)
						// $("#otp").attr("disabled", "true")

						setShowCodeGroup(true)

						OTP = Math.floor(1000 + Math.random() * 9000)
							console.log(OTP)
						if (
							await sendOTP(
								$("#email").val() as string,
								"User Signup Email Verification",
								OTP
							)
						) {
							$(".done_text").removeClass("d-none")
							$("#otpBtnSpinner").addClass("d-none")
							$("#otp").removeAttr("disabled")
						} else {
							$("#otpBtnSpinner").addClass("d-none")

							Toast(
								`Couldn't send OTP at the moment. Check your internet connectivity, please try again later.`,
								"warning",
								5000
							)
						}
					}
				})
				.catch(error => console.error(error))
		},
		setDate = () => {
			return new Date(new Date().setFullYear(new Date().getFullYear() - 13))
				.toISOString()
				.split("T")[0]
		},
		validateAndSubmitUserInfo = async () => {
			await fetch("/api/usersignup", {
				method: "POST",
				headers: new Headers({ "content-type": "application/json" }),
				body: JSON.stringify({
					step: "user info",
					data: {
						mobile_no: "+88" + $("#mobile").val(),
						password: $("#password").val(),
						name: $("#name").val(),
						sex: $("#sex").val(),
						dob: $("#dob").val(),
						email: $("#email").val(),
						...($("#documentID").val() != "" && {
							document_id: $("#documentID").val(),
						}),
					},
				}),
				redirect: "follow",
			})
				.then(response => response.json())
				.then(res => {
					let collection = {
							name: "Name",
							document_id: "Document ID",
							mobile_no: "Mobile",
							password: "Password",
						},
						flaggedError = {
							name: false,
							document_id: false,
							mobile_no: false,
							password: false,
						}

					// error message displaying
					if ($("#sex").val() == "null")
						$("#sexErr").text("Gender must be selected")
					else $("#sexErr").text("")

					// duplicate mobile number error display
					if (res.error?.mobile_no != undefined) {
						$("#mobileErr").text(res.error.mobile_no)
						flaggedError.mobile_no = true
					}
					// duplicate document id error display
					else if (res.error?.document_id != undefined) {
						$("#documentIDErr").text(res.error.document_id)
						flaggedError.document_id = true
					} else if (res?.errors != undefined) {
						res.errors.map((errorMsg: any) => {
							Object.keys(collection).map(
								(keyName: keyof typeof collection) => {
									if (errorMsg.includes(keyName)) {
										if (keyName == "mobile_no")
											$("#mobileErr").text(
												errorMsg.replace(keyName, collection[keyName])
											)
										else if (keyName == "document_id")
											$("#documentIDErr").text(
												errorMsg.replace(keyName, collection[keyName])
											)
										else
											$("#" + keyName + "Err").text(
												errorMsg.replace(keyName, collection[keyName])
											)

										flaggedError[keyName] = true
									}
								}
							)
						})
					} else {
						// todo handle routing
						console.log(res)
						router.replace(Links.App.home)
					}

					Object.keys(flaggedError).map(
						(keyName: keyof typeof flaggedError) => {
							if (flaggedError[keyName] == false)
								if (keyName == "mobile_no") $("#mobileErr").text("")
								else if (keyName == "document_id") $("#documentIDErr").text("")
								else $("#" + keyName + "Err").text("")
						}
					)
				})
				.catch(error => console.error(error))
		}

	useEffect(function onFirstMount() {
		$(".next").on("click", async function (event) {
			if (event.target.id === "otp" && event.target.innerText == "Send OTP")
				await sendUserSignupOTP()
			else if (
				event.target.id === "otp" &&
				event.target.innerText == "Continue"
			) {
				// validate OTP and continue
				let otpCharArr: any = []
				$(".code_group")
					.children("input")
					.each((index, eachInput) => {
						otpCharArr.push($(eachInput).val())
					})

				if (OTP == otpCharArr.join("")) {
					validated = true // validated with no errors
					$("#otpErr").text("")
				} else $("#otpErr").text("Invalid OTP!")
			} else if (event.target.id === "skip") validated = true
			else if (event.target.id === "info") await validateAndSubmitUserInfo()

			if (!validated) return
			validated = false

			if (animating) return
			animating = true

			current_fs = $(this).parent()
			next_fs = $(this).parent().next()

			//activate next step on progressbar using the index of next_fs
			$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active")

			//show the next fieldset
			next_fs.show()
			//hide the current fieldset with style
			current_fs.animate(
				{
					opacity: 0,
				},
				{
					step: function (now, mx) {
						//as the opacity of current_fs reduces to 0 - stored in "now"
						//1. scale current_fs down to 80%
						scale = 1 - (1 - now) * 0.2
						//2. bring next_fs from the right(50%)
						left = now * 50 + "%"
						//3. increase opacity of next_fs to 1 as it moves in
						opacity = 1 - now
						current_fs.css({
							transform: "scale(" + scale + ")",
							position: "absolute",
						})
						next_fs.css({
							left: left,
							opacity: opacity,
						})
					},
					duration: 500,
					complete: function () {
						current_fs.hide()
						animating = false
					},
					//this comes from the custom easing plugin
					easing: "swing",
				}
			)
		})

		$(".previous").on("click", function () {
			validated = false

			if (animating) return false
			animating = true

			current_fs = $(this).parent()
			previous_fs = $(this).parent().prev()

			//de-activate current step on progressbar
			$("#progressbar li")
				.eq($("fieldset").index(current_fs))
				.removeClass("active")

			//show the previous fieldset
			previous_fs.show()
			//hide the current fieldset with style
			current_fs.animate(
				{
					opacity: 0,
				},
				{
					step: function (now, mx) {
						//as the opacity of current_fs reduces to 0 - stored in "now"
						//1. scale previous_fs from 80% to 100%
						scale = 0.8 + (1 - now) * 0.2
						//2. take current_fs to the right(50%) - from 0%
						left = (1 - now) * 50 + "%"
						//3. increase opacity of previous_fs to 1 as it moves in
						opacity = 1 - now
						current_fs.css({
							left: left,
						})
						previous_fs.css({
							transform: "scale(" + scale + ")",
							opacity: opacity,
						})
					},
					duration: 500,
					complete: function () {
						current_fs.hide()
						animating = false
					},
					//this comes from the custom easing plugin
					easing: "swing",
				}
			)
		})

		$("input[name=docType]").on("click", () => {
			setDocTypeSelected(true)
		})
	}, [])

	// * document capture analyzer block
	const [upImg, setUpImg] = useState(""),
		imgRef = useRef(null),
		previewCanvasRef = useRef(null),
		[crop, setCrop] = useState({ unit: "%", width: 100, height: 100 }),
		[completedCrop, setCompletedCrop] = useState(null),
		// view image with crop functionality on image select
		onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files && e.target.files.length > 0) {
				$("#crop-btn").removeAttr("hidden")

				const reader = new FileReader()
				reader.readAsDataURL(e.target.files[0])
				reader.addEventListener("load", () => {
					setUpImg(reader.result as string)
				})
			}
		},
		onLoad = useCallback(img => {
			imgRef.current = img
		}, []),
		ocrApiCall = async (canvas: any, crop: any) => {
			if (!crop || !canvas) {
				return
			}

			// showing spinner
			$("#crop-btn-spinner").removeClass("d-none")

			await fetch(
				`https://api.microblink.com/v1/recognizers/${$(
					"input[name='docType']:checked"
				).val()}`,
				{
					method: "POST",
					body: `{
  							"returnFullDocumentImage": false,
 							"returnFaceImage": false,
							"returnSignatureImage": false,
							"allowBlurFilter": false,
							"allowUnparsedMrzResults": false,
							"allowUnverifiedMrzResults": true,
							"validateResultCharacters": true,
						 	"anonymizationMode": "FULL_RESULT",
							"anonymizeImage": true,
							"ageLimit": 0,
							"imageSource": "${canvas.toDataURL()}",
							"scanCroppedDocumentImage": false
							}`,
					headers: {
						"content-type": "application/json",
						Accept: "application/json",
						Authorization: process.env
							.NEXT_PUBLIC_MICROLABLINK_BEARER_TOKEN as string,
					},
				}
			)
				.then(function (res) {
					return res.json()
				})
				.then(function ({ result }) {
					// hide spinner and button
					$("#crop-btn-spinner").addClass("d-none")
					$("#crop-btn").attr("hidden", "true")

					// * response after analyzing the document
					if (result.processingStatus === "SUCCESS") {
						// form data value autocompletion
						$("#name").val(result.firstName + " " + result.lastName)
						$("#sex")
							.children()
							.map((ind, options) => {
								if ($(options).attr("value") == result.sex)
									$("#sex").val(result.sex)
							})
						$("#documentID").val(result.documentNumber)
						$("#dob").val(
							result.dateOfBirth.year +
								"-" +
								(`${result.dateOfBirth.month}`.length === 1
									? "0" + result.dateOfBirth.month
									: result.dateOfBirth.month) +
								"-" +
								(`${result.dateOfBirth.day}`.length === 1
									? "0" + result.dateOfBirth.day
									: result.dateOfBirth.day)
						)

						// disabling input fields upon autocomplete
						new Array("#name", "#sex", "#documentID", "#dob").map(id => {
							$(id).attr("disabled", "true")
						})

						$("#skip").text("Continue")

						Toast("Info retrieved! Continue to next step.")
					} else if (
						result.processingStatus == "UNSUPPORTED_CLASS" ||
						result.processingStatus == "DETECTION_FAILED"
					) {
						Toast(
							"Could not retrieve data! Provided picture possibly doesn't have MRZ information. Please try again with correct picture.",
							"warning",
							false
						)
					} else
						Toast(
							"Could not retrieve data! Please try again.",
							"warning",
							false
						)
				})
		},
		[showImgCapture, setShowImgCapture] = useState(false),
		config = useMemo(() => ({ video: { facingMode: "environment" } }), []),
		/*
    	{ video: true } - Default Camera View
    	{ video: { facingMode: environment } } - Back Camera
   	 	{ video: { facingMode: "user" } } - Front Camera
 		 */

		onCapture = (imageData: any) => {
			// read as webP
			setUpImg(imageData.webP)
			// Unmount component to stop the video track and release camera
			setShowImgCapture(false)

			// show crop button
			$("#crop-btn").removeAttr("hidden")
		},
		onError = useCallback(error => {
			console.error(error)
		}, []),
		[docTypeSelected, setDocTypeSelected] = useState(false)

	useEffect(() => {
		if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
			return
		}

		const image: any = imgRef.current,
			canvas: any = previewCanvasRef.current,
			crop: any = completedCrop,
			scaleX = image.naturalWidth / image.width,
			scaleY = image.naturalHeight / image.height,
			ctx = canvas.getContext("2d"),
			pixelRatio = window.devicePixelRatio

		canvas.width = crop.width * pixelRatio
		canvas.height = crop.height * pixelRatio

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
		ctx.imageSmoothingQuality = "high"

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		)
	}, [completedCrop])

	return (
		<>
			<Head>
				<title>Sign Up | Smart Medicare</title>
				{/* <!-- Icons CSS --> */}
				<link
					rel="stylesheet"
					href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
				/>
			</Head>
			<div className="user_signup_form">
				<form
					id="msform"
					onSubmit={event => {
						event.preventDefault()
						event.stopPropagation()
					}}
				>
					<div className="title">
						<h2>Sign Up</h2>
						<h6 className="font-italic text-secondary">It's quick and easy</h6>
					</div>
					<ul id="progressbar">
						<li className="active">Verify Email</li>
						<li>Upload Documents</li>
						<li>Personal Details</li>
					</ul>
					<fieldset>
						<h5>An OTP will be sent to the provided email</h5>

						<div
							className="form-group text-left mx-auto"
							style={{ maxWidth: "300px" }}
						>
							<input
								type="email"
								className="form-control"
								placeholder="E.g.: name@example.com"
								onInput={e => (e.target.value = e.target.value.slice(0, 50))}
								id="email"
								required
							/>
							<small className="text-danger pl-1" id="emailErr"></small>
						</div>
						<div className="done_text mt-4 d-none">
							<a href="#" className="done_icon">
								<i className="ion-android-done"></i>
							</a>
							<h6>OTP sent! Enter it here...</h6>
						</div>
						{showCodeGroup ? (
							<>
								<div className="code_group">
									<input
										type="number"
										className="form-control"
										min="0"
										max="9"
										onInput={e => {
											e.target.value.length == 1
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
											e.target.value.length == 1
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
											e.target.value.length == 1
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
									/>
								</div>
								<span
									className="text-danger d-block mt-2 mb-5"
									id="otpErr"
								></span>
							</>
						) : null}
						<button
							type="button"
							className="btn btn-sm rounded next action-button"
							id="otp"
						>
							Send OTP
						</button>
						<div className="text-secondary">
							<small>
								Already have an account?
								<Link href={Links.App.login}>
									<a className="text-decoration-none font-weight-bold">
										&nbsp;Login
									</a>
								</Link>
							</small>
						</div>
					</fieldset>
					<fieldset>
						<h5 className="w-75 mx-auto" style={{ lineHeight: "1.3" }}>
							Upload any of these documents to proceed with form autocompletion
							or skip to input manually
						</h5>
						<div className="input-group justify-content-center my-4">
							<div className="form-check form-check-inline mr-4">
								<input
									className="form-check-input"
									type="radio"
									name="docType"
									id="documentIDRadio"
									value="mrz-id"
								/>
								<label
									className="form-check-label text-primary font-weight-bold"
									htmlFor="documentIDRadio"
								>
									New NID Card (Back)
								</label>
							</div>
							<div className="form-check form-check-inline">
								<input
									className="form-check-input"
									type="radio"
									name="docType"
									id="passportRadio"
									value="passport"
								/>
								<label
									className="form-check-label text-primary font-weight-bold"
									htmlFor="passportRadio"
								>
									Passport
								</label>
							</div>
						</div>
						{docTypeSelected ? (
							<>
								<div className="input-group custom-file">
									<input
										type="file"
										accept="image/jpeg, image/png"
										name="document"
										className="custom-file-input"
										id="document"
										onChange={(
											changeEvent: React.ChangeEvent<HTMLInputElement>
										) => {
											onSelectFile(changeEvent)
										}}
									/>
									<label
										className="custom-file-label mx-auto pr-5"
										htmlFor="upload"
									>
										<i className="ion-android-cloud-outline pr-1"></i>Choose
										file
									</label>
									<small className="d-block my-2 text-muted">OR</small>
									<button
										type="button"
										className="btn btn-sm btn-primary"
										onClick={e => {
											showImgCapture
												? setShowImgCapture(false)
												: setShowImgCapture(true)
										}}
									>
										<i className="bi bi-camera-fill h2"></i>
									</button>
								</div>
								<small
									className={
										!completedCrop?.width || !completedCrop?.height
											? "d-none"
											: "text-info d-block mt-4"
									}
								>
									Crop to fit the document
								</small>
								<div className="w-75 mx-auto mt-4 mb-3">
									{showImgCapture && (
										<div>
											<ImageCapture
												onCapture={onCapture}
												onError={onError}
												width={300}
												userMediaConfig={config}
											/>
										</div>
									)}
									{upImg && (
										<>
											<ReactCrop
												src={upImg}
												onImageLoaded={onLoad}
												crop={crop}
												onChange={c => setCrop(c)}
												onComplete={c => setCompletedCrop(c)}
											/>
											<canvas
												ref={previewCanvasRef}
												// Rounding is important so the canvas width and height matches/is a multiple for sharpness.
												style={{
													width: Math.round(completedCrop?.width ?? 0),
													height: Math.round(completedCrop?.height ?? 0),
													display: "none",
												}}
											/>
											<span className="d-block">
												<button
													type="button"
													className="btn btn-sm btn-secondary my-2 rounded"
													hidden={
														!completedCrop?.width || !completedCrop?.height
													}
													onClick={() =>
														ocrApiCall(previewCanvasRef.current, completedCrop)
													}
													id="crop-btn"
												>
													<span
														className="spinner-border spinner-border-sm d-none"
														id="crop-btn-spinner"
													></span>
													&nbsp; Crop &amp; Upload
												</button>
											</span>
										</>
									)}
								</div>
							</>
						) : null}
						<button
							type="button"
							className="btn btn-sm rounded next action-button"
							id="skip"
						>
							Skip
						</button>
					</fieldset>
					<fieldset>
						<h5>Provide the following information in order to proceed</h5>
						<div className="mx-auto text-left" style={{ maxWidth: "300px" }}>
							<div className="form-group">
								<label className="text-secondary" htmlFor="name">
									Name *
								</label>
								<input
									type="text"
									className="form-control"
									placeholder="E.g.: William Smith"
									onInput={e => (e.target.value = e.target.value.slice(0, 50))}
									id="name"
									required
								/>
								<small id="nameErr" className="form-text text-danger"></small>
							</div>
							<div className="form-group">
								<label className="text-secondary" htmlFor="name">
									Sex *
								</label>
								<select className="form-control text-secondary" id="sex">
									<option value="null" hidden>
										Select Gender
									</option>
									<option value="M">Male</option>
									<option value="F">Female</option>
									<option value="T">Trans</option>
									<option value="S">Sis</option>
								</select>
								<small id="sexErr" className="form-text text-danger"></small>
							</div>
							<div className="form-group">
								<label className="text-secondary" htmlFor="documentID">
									NID/Passport $
								</label>
								<input
									type="text"
									onInput={e => (e.target.value = e.target.value.slice(0, 17))}
									className="form-control"
									placeholder="Document ID"
									id="documentID"
								/>
								<small
									id="documentIDErr"
									className="form-text text-danger"
								></small>
							</div>
							<div className="form-group">
								<label className="text-secondary" htmlFor="dob">
									Birth Date *
								</label>
								<input
									type="date"
									max={setDate()}
									className="form-control"
									defaultValue={setDate()}
									id="dob"
									required
								/>
								<small id="dobErr" className="form-text text-danger"></small>
							</div>
							<div className="form-group">
								<label
									className="d-block text-secondary"
									htmlFor="mobile-prefix"
								>
									Mobile *
								</label>
								<div className="form-row">
									<input
										type="text"
										className="form-control col"
										style={{
											borderTopRightRadius: 0,
											borderBottomRightRadius: 0,
										}}
										value="+88"
										id="mobile-prefix"
										disabled
									/>
									<input
										type="tel"
										onInput={e =>
											(e.target.value = e.target.value.slice(0, 11))
										}
										className="form-control col-10"
										style={{
											borderTopLeftRadius: 0,
											borderBottomLeftRadius: 0,
										}}
										placeholder="E.g.: 018204****5"
										id="mobile"
										required
									/>
								</div>
								<small id="mobileErr" className="form-text text-danger"></small>
							</div>
							<div className="form-group">
								<label className="text-secondary" htmlFor="password">
									Password *
								</label>
								<input
									type="text"
									className="form-control"
									onInput={e => (e.target.value = e.target.value.slice(0, 25))}
									style={{
										borderTopRightRadius: 0,
										borderBottomRightRadius: 0,
									}}
									placeholder="4 - 25 characters"
									id="password"
									required
								/>
								<small
									id="passwordErr"
									className="form-text text-danger"
								></small>
							</div>
						</div>
						<button
							type="button"
							className="btn btn-sm rounded action-button previous previous_button"
						>
							<i className="bi bi-arrow-left h6 m-auto"></i>
						</button>
						<button
							type="button"
							className="btn btn-sm rounded next action-button"
							id="info"
						>
							Sign Up
						</button>
						<div className="mt-2 text-primary">
							<small className="mr-3">* - required</small>
							<small>$ - optional</small>
						</div>
					</fieldset>
				</form>
			</div>
		</>
	)
}

export default UserSignup
