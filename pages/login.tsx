import Head from "next/head"
import Link from "next/link"
import { Links } from "@pages/_app"
import router from "next/router"

export interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
	return (
		<>
			<Head>
				<title>Login | Smart Medicare</title>
			</Head>
			<div className="card m-auto shadow-lg" style={{ maxWidth: "330px" }}>
				<i className="bi bi-person mx-auto mt-5 mb-2 h3 text-success"></i>
				<h6 className="mx-auto">Login</h6>
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
							className="btn btn-sm btn-success mx-auto"
							onClick={async event => {
								const data = {
									mobile: "+88" + $("#mobile").val(),
									password: $("#password").val(),
								}

								await fetch("/api/userlogin", {
									method: "POST",
									headers: new Headers({ "content-type": "application/json" }),
									body: JSON.stringify({
										data,
									}),
									redirect: "follow",
								})
									.then(response => response.json())
									.then(res => {
										console.log(res)
										let collection = {
												mobile: "Mobile",
												password: "Password",
											},
											flaggedError = {
												mobile: false,
												password: false,
											}

										if (res.user != undefined) {
											$("#mobileErr").text(res.user)
											flaggedError.mobile = true
										} else if(res.error){
											$("#passwordErr").text(
																res.error
															)
										} 
										else if (res.errors != undefined) {
											res.errors.map((errorMsg: string) => {
												Object.keys(collection).map(
													(keyName: keyof typeof collection) => {
														if (errorMsg.includes(keyName)) {
															$("#" + keyName + "Err").text(
																errorMsg.replace(keyName, collection[keyName])
															)

															flaggedError[keyName] = true
														}
													}
												)
											})
										} else {
											router.replace(Links.App.home)
											// todo login user
										}

										Object.keys(flaggedError).map(
											(keyName: keyof typeof collection) => {
												if (flaggedError[keyName] == false)
													$("#" + keyName + "Err").text("")
											}
										)
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
								<Link href={Links.App.signup}>
									<a className="text-decoration-none font-weight-bold">
										&nbsp;Sign Up&nbsp;
									</a>
								</Link>
								<strong>|</strong>
								<Link href={Links.App.recover + "?account=user"}>
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
