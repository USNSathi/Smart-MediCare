import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import $ from "jquery"
import { Links } from "@pages/_app"

export interface AppNavbarProps {}

const AppNavbar: React.FC<AppNavbarProps> = () => {
	const isRouteHome = () => {
		return useRouter().asPath == "/"
	}

	useEffect(function onEveryMount() {
		// adds active class to nav on every page change
		$("nav > div > div > ul")
			.children("li")
			.map((index, element) => {
				if (
					$(element).children("a").attr("href") === window.location.pathname &&
					!$(element).children("a").hasClass("active")
				) {
					$(element).children("a").addClass("active")
				} else {
					if (
						$(element).children("a").attr("href") !==
							window.location.pathname &&
						$(element).children("a").hasClass("active")
					) {
						$(element).children("a").removeClass("active")
					}
				}
			})

		// closes nav menu on click inside
		$("#nav-div .nav-item, #nav-div > .nav-item a")
			.children()
			.on("click", () => {
				$("#nav-div").hasClass("show")
				$("#nav-div").removeClass("show")
			})
	})

	return (
		<>
			<nav className="navbar navbar-expand-md navbar-light bg-light shadow sticky-top mb-3 justify-content-center bg-faded">
				<div className="container">
					<a className="navbar-brand" href="/">
						Smart MediCare
					</a>
					<button
						className="navbar-toggler ml-auto"
						type="button"
						data-toggle="collapse"
						data-target="#nav-div"
					>
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className="collapse navbar-collapse text-center" id="nav-div">
						<ul className="navbar-nav mr-auto">
							<li className="nav-item">
								<Link href={Links.App.home}>
									<a className="nav-link">Home</a>
								</Link>
							</li>
							<li className="nav-item">
								<Link href={Links.App.booking}>
									<a className="nav-link">Booking</a>
								</Link>
							</li>
							<li className="nav-item">
								<Link href={Links.App.about}>
									<a className="nav-link">About</a>
								</Link>
							</li>
							{/* <li className="nav-item dropdown">
								<a
									className="nav-link dropdown-toggle"
									href="#"
									id="dropdown09"
									data-toggle="dropdown"
									aria-haspopup="true"
									aria-expanded="false"
								>
									Dropdown
								</a>
								<div className="dropdown-menu" aria-labelledby="dropdown09">
									<a className="dropdown-item" href="#">
										Action
									</a>
									<a className="dropdown-item" href="#">
										Another action
									</a>
									<a className="dropdown-item" href="#">
										Something else here
									</a>
								</div>
							</li> */}
						</ul>
						{isRouteHome() ? (
							<form
								className="d-flex mx-3 my-2 my-md-0 animate__animated animate__fadeInDown"
								style={{ flex: "auto" }}
								onSubmit={event => {
									event.preventDefault()
									event.stopPropagation()
								}}
							>
								<input
									className="form-control mx-auto rounded-lg"
									style={{ maxWidth: "512px" }}
									type="search"
									placeholder="Search Hospitals"
									onChange={e => {
										// todo implement search functionality
										console.log(e.target.value)
									}}
								/>
							</form>
						) : null}
						<div className="nav-item d-inline">
							<Link href={Links.App.login}>
								<a className="text-decoration-none pl-2 pr-1 py-2">
									<small>Login</small>
								</a>
							</Link>
							<strong>|</strong>
							<Link href={Links.App.signup}>
								<a className="text-decoration-none pl-1 pr-2 py-2">
									<small>Sign Up</small>
								</a>
							</Link>
						</div>
					</div>
				</div>
			</nav>
		</>
	)
}

export default AppNavbar
