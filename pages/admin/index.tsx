import { Links } from "@pages/_app"
import Link from "next/link"
import router from "next/router"

export interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
	return (
		<>
			<div className="card m-auto shadow-lg" style={{ maxWidth: "330px" }}>
				<i className="bi bi-building mx-auto mt-5 mb-2 h3 text-primary"></i>
				<h6 className="mx-auto">Administration Login</h6>
				<div className="card-body">
					<form
						className="d-flex flex-column"
						onSubmit={event => {
							event.preventDefault()
							event.stopPropagation()
						}}
					>
						<div className="form-group">
							<label className="text-secondary" htmlFor="mobile">
								Mobile *
							</label>
							<div className="form-row">
								<input
									type="tel"
									className="form-control col"
									style={{
										borderTopRightRadius: 0,
										borderBottomRightRadius: 0,
									}}
									value="+88"
									disabled
								/>
								<input
									type="tel"
									className="form-control col-10"
									style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
									placeholder="E.g.: 01*********"
									onInput={e => (e.target.value = e.target.value.slice(0, 11))}
									required
									id="mobile"
								/>
							</div>
							<small id="mobileErr" className="form-text text-danger"></small>
						</div>
						<div className="form-group">
							<label className="text-secondary" htmlFor="password">
								Password *
							</label>
							<input
								type="password"
								className="form-control"
								placeholder="4 - 25 characters"
								onInput={e => (e.target.value = e.target.value.slice(0, 25))}
								id="password"
								required
							/>
							<small
								id="passwordErr"
								className="form-text text-danger pl-1"
							></small>
						</div>
						<button
							type="submit"
							className="btn btn-sm btn-primary mx-auto"
							onClick={async event => {
								const data = {
									mobile: "+88" + $("#mobile").val(),
									password: $("#password").val(),
								}

								await fetch("/api/hospitalstafflogin", {
									method: "POST",
									headers: new Headers({ "content-type": "application/json" }),
									body: JSON.stringify({
										data,
									}),
									redirect: "follow",
								})
									.then(response => response.json())
									.then(res => {
										let collection = {
												mobile: "Mobile",
												password: "Password",
											},
											flaggedError = {
												mobile: false,
												password: false,
											}

										if (res.staff != undefined) {
											$("#mobileErr").text(res.staff)
											flaggedError.mobile = true
										} else if (res.error != undefined) {
											$("#passwordErr").text(res.error)
											flaggedError.password = true
										} else if (res.errors != undefined) {
											res.errors.map((errorMsg: any) => {
												Object.keys(collection).map(keyName => {
													if (errorMsg.includes(keyName)) {
														$("#" + keyName + "Err").text(
															errorMsg.replace(keyName, collection[keyName])
														)

														flaggedError[keyName] = true
													}
												})
											})
										} else {
											// todo login staff with session

											router.replace(
												`/admin/dashboard?reg=${res.registration_no}&user=${res.email}`,
												`/admin/dashboard`
											)
										}

										Object.keys(flaggedError).map(keyName => {
											if (flaggedError[keyName] == false)
												$("#" + keyName + "Err").text("")
										})
									})
									.catch(error => {
										console.error(error)
									})
							}}
						>
							Login
						</button>
						<small className="text-secondary mt-2">* - required</small>
						<div className="text-secondary mt-2 text-center">
							<small>
								Need an account?
								<Link href={Links.Admin.signup}>
									<a className="text-decoration-none font-weight-bold">
										&nbsp;Sign Up&nbsp;
									</a>
								</Link>
								<strong>|</strong>
								<Link href={Links.App.recover + "?account=staff"}>
									<a className="text-decoration-none font-weight-bold">
										&nbsp;Forgot Password?
									</a>
								</Link>
							</small>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default Login
