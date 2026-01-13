import type { Metadata } from "next"
import { Urbanist } from "next/font/google"
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import "@/node_modules/react-modal-video/css/modal-video.css"
import "/public/assets/css/main.css"
import AuthProvider from "@/context/AuthProvider"
import { FavoritesProvider } from "@/context/FavoritesContext"
import { CompareProvider } from "@/context/CompareContext"
import { ToastProvider } from "@/components/ui/Toast"
import CompareDrawer from "@/components/elements/CompareDrawer"

const urbanist = Urbanist({
	weight: ['300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	variable: "--urbanist",
	display: 'swap',
})

export const metadata: Metadata = {
	title: "Carento - Car Rental",
	description: "Car rental platform - Carento",
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()
	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body className={`${urbanist.variable}`}>
				<NextIntlClientProvider messages={messages}>
					<AuthProvider>
						<FavoritesProvider>
							<CompareProvider>
								<ToastProvider />
								{children}
								<CompareDrawer />
							</CompareProvider>
						</FavoritesProvider>
					</AuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
