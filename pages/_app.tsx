import AppLayout from "@layouts/AppLayout"
import AdminPanelLayout from "@layouts/AdminPanelLayout"

import "@styles/styles.css"

import type { AppProps } from "next/app"
import { useRouter } from "next/router"

export const Links = {
	Admin: {
		booking: "/booking",
		dashboard: "/admin/dashboard",
		login: "/admin",
		signup: "/admin/signup",
	},
	App: {
		404: "/404",
		500: "/500",
		about: "/about",
		booking: "/booking",
		contact: "/contact",
		doctor: "/doctor",
		home: "/",
		login: "/login",
		privacy: "/privacy",
		recover: "/recover",
		signup: "/signup",
		terms: "/terms",
	},
}

export default function AppMain({ Component, pageProps }: AppProps) {
	const isRouteRootAdmin = () => {
		return useRouter().asPath.includes("admin")
	}

	return (
		<>
			{isRouteRootAdmin() ? (
				<AdminPanelLayout>
					<Component {...pageProps} />
				</AdminPanelLayout>
			) : (
				<AppLayout>
					<Component {...pageProps} />
				</AppLayout>
			)}
		</>
	)
}
