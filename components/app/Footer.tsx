import { Links } from "@pages/_app"
import Link from "next/link"

export interface FooterProps {}

const Footer: React.SFC<FooterProps> = () => {
	return (
		<footer className="bg-secondary text-light text-center text-lg-start mt-4 mt-lg-5">
			<section className="container py-3">
				<div className="row">
					<div className="col-lg-6 col-md-12 mb-4 mb-md-3">
						<h5>Smart MediCare</h5>
						<p className="mx-auto mt-2" style={{ maxWidth: "320px" }}>
							It is a platform where one can search and book for available
							hospital beds, ICU beds, cabin, VIP cabins etc. at the time of
							their needs to admit a patient.
						</p>
					</div>
					<div className="col-lg-3 col-md-6 mb-4 mb-md-0">
						<h5>Site Links</h5>
						<ul className="list-unstyled mb-0">
							<li>
								<Link href={Links.App.about}>
									<a className="text-white">About Us</a>
								</Link>
							</li>
							<li>
								<Link href={Links.App.contact}>
									<a className="text-white">Contact Us</a>
								</Link>
							</li>
							<li>
								<Link href={Links.App.privacy}>
									<a className="text-white">Privacy Policy</a>
								</Link>
							</li>
							<li>
								<Link href={Links.App.terms}>
									<a className="text-white">Terms of Service</a>
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-lg-3 col-md-6 mb-4 mb-md-0">
						<h5>Center Info</h5>
						<ul className="list-unstyled mb-0">
							<li>Dhaka: 0123456789</li>
							<li>Sylhet: 0123456789</li>
							<li>Mymensing: 0123456789</li>
							<li>Barisal: 0123456789</li>
							<li>Khulna: 0123456789</li>
						</ul>
					</div>
				</div>
			</section>
			<section className="bg-dark text-center text-light-50 py-2">
				<a className="btn btn-outline-primary mx-2" href="#">
					<i className="bi bi-facebook h5"></i>
				</a>
				<a className="btn btn-outline-primary mx-2" href="#">
					<i className="bi bi-twitter h5"></i>
				</a>
				<a className="btn btn-outline-primary mx-2" href="#">
					<i className="bi bi-instagram h5"></i>
				</a>
				<a className="btn btn-outline-primary mx-2" href="#">
					<i className="bi bi-linkedin h5"></i>
				</a>
			</section>
			<section
				className="text-center py-1"
				style={{ backgroundColor: "rgba( 0, 0, 0, 0.65)" }}
			>
				<small>Copyright &copy; All rights reserved</small>
			</section>
		</footer>
	)
}

export default Footer
