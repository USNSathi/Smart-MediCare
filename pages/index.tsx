import Head from "next/head"
import HospitalList from "@components/app/HospitalList"
import Image from "next/image"
import Link from "next/link"
import $ from "jquery"

import { prisma } from "@functionalities/DB/prismaInstance"
import { useEffect } from "react"
import { Links } from "@pages/_app" 

export const getStaticProps = async () => {
	const retrievedData = await prisma.$queryRaw`
		SELECT vacant_bed_log.registration_no, hospital_name, image_source, last_updated, ward, special_ward, cabin, vip_cabin, icu, ccu, hdu, hfncu, emergency, covid, extra
		FROM vacant_bed_log, hospital
		WHERE last_updated IN 
		(
			SELECT MAX(last_updated) "last_updated"
			FROM vacant_bed_log vbl, hospital h
			WHERE vbl.registration_no = h.registration_no AND h.status <> 'private' AND h.status <> 'deleted'
			GROUP BY h.registration_no
			ORDER BY h.registration_no ASC
		)
        AND vacant_bed_log.registration_no = hospital.registration_no
        ORDER BY vacant_bed_log.registration_no
	`

	return {
		props: {
			vacantBedInfo: JSON.stringify(retrievedData),
		},
		revalidate: 90 /* returning revalidate property enables the ISR that rebuilds on data change */,
	}
}

export interface HomeProps {
	vacantBedInfo: string
}

const Home: React.FC<HomeProps> = ({ vacantBedInfo }) => {
	useEffect(function onFirstMount() {
		$("#callToAction").height(
			$("#heroImage").children("div").innerHeight() as number
		)

		$(window).on("resize", () => {
			$("#callToAction").height(
				$("#heroImage").children("div").innerHeight() as number
			)
		})
	}, [])
	return (
		<>
			<Head>
				<title>Home | Smart Medicare</title>
			</Head>
			<main>
				<section className="row mx-0 pb-4 pb-sm-0">
					<div className="col-12 col-md-6 px-0" id="heroImage">
						<Image
							src="/media/slider-image-2.jpg"
							width={1280}
							height={720}
							priority
						/>
					</div>
					<div
						className="col-12 col-md-6 px-0 row row-cols-1 row-cols-sm-2 mx-0 mt-n2 mt-md-0"
						id="callToAction"
					>
						<div
							className="col d-flex flex-column justify-content-center align-items-center"
							style={{ backgroundColor: "#013440" }}
						>
							<Link href={Links.App.booking}>
								<a
									className="d-block text-decoration-none my-2 animate__animated animate__fadeInUp"
									// style={{ top: "100%", position: "relative" }}
								>
									<i className="bi bi-bookmark-plus d-block text-center h3 text-light"></i>
									<span className="text-light h6 font-weight-light">
										Book a bed
									</span>
								</a>
							</Link>
						</div>
						<div
							className="col d-flex flex-column justify-content-center align-items-center"
							style={{ backgroundColor: "#385865" }}
						>
							<Link href={Links.App[404]}>
								<a
									className="d-block text-decoration-none my-2 animate__animated animate__fadeInUp"
									style={{ animationDelay: "0.3s" }}
								>
									<i className="bi bi-calendar-event d-block text-center h3 text-light"></i>
									<span className="text-light h6 font-weight-light">
										Take an appointment
									</span>
								</a>
							</Link>
						</div>
						<div
							className="col d-flex flex-column justify-content-center align-items-center"
							style={{ backgroundColor: "#42778C" }}
						>
							<Link href={Links.App.doctor}>
								<a
									className="d-block text-decoration-none my-2 animate__animated animate__fadeInUp"
									style={{ animationDelay: "0.5s" }}
								>
									<i className="bi bi-search d-block text-center h3 text-light"></i>
									<span className="text-light h6 font-weight-light">
										Find doctors
									</span>
								</a>
							</Link>
						</div>
						<div
							className="col d-flex flex-column justify-content-center align-items-center"
							style={{ backgroundColor: "#7EA6BF" }}
						>
							<Link href={Links.App.contact}>
								<a
									className="d-block text-decoration-none my-2 animate__animated animate__fadeInUp"
									style={{ animationDelay: "0.7s" }}
								>
									<i className="bi bi-exclamation-square d-block text-center h3 text-light"></i>
									<span className="text-light h6 font-weight-light">
										Report an issue
									</span>
								</a>
							</Link>
						</div>
					</div>
				</section>
				<div className="container mt-5 pt-5 pt-md-0">
					<HospitalList vacantBedInfo={JSON.parse(vacantBedInfo)} />
				</div>
			</main>
		</>
	)
}

export default Home
