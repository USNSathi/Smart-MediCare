import Head from "next/head"

export interface DoctorProps {}

const Doctor: React.FC<DoctorProps> = () => {
	return (
		<>
			<Head>
				<title>Doctors | Smart Medicare</title>
			</Head>
			<main className="container">Please design me</main>
		</>
	)
}

export default Doctor
