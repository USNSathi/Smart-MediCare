import Head from "next/head"
import { useRouter } from "next/router"

import AdminPanelNavbar from "@components/admin/AdminPanelNavbar"

export interface AdminPanelLayoutProps {}

const AdminPanelLayout: React.FC<AdminPanelLayoutProps> = ({
	children,
}: any) => {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="robots" content="noindex, nofollow, noarchive" />

				<title>Admin Panel | Smart Medicare</title>
				{/* <link
					rel="shortcut icon"
					href="/media/assets/favicon.png"
					type="image/x-icon"
				/> */}
				<link rel="stylesheet" href="/bootstrap/bootstrap.min.css" />
				<script defer src="/bootstrap/jquery-3.6.0.slim.min.js"></script>
				<script defer src="/bootstrap/bootstrap.bundle.min.js"></script>

				{/* <!-- bootstrap 4.6 --> */}

				<link rel="stylesheet" href="/lib/animate.min.css" />

				{/* <!-- animate 4.1.1 - animation library --> */}

				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"
				/>

				{/* <!-- bootstrap icons --> */}

				<link
					rel="stylesheet"
					href="https://cdn.iconmonstr.com/1.3.0/css/iconmonstr-iconic-font.min.css"
					crossOrigin="anonymous"
				/>

				{/* <!-- iconmonstr Icons --> */}
			</Head>

			{/* <AdminPanelNavbar /> */}

			{children}
		</>
	)
}

export default AdminPanelLayout
