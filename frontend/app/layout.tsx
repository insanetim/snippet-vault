import BaseLayout from "@/components/BaseLayout"
import Providers from "@/components/Providers"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Snippet Vault",
  description:
    "A compact service for storing useful snippets (links/notes/commands) with tagging and search functionality.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/vault.png"
        />
      </head>
      <body
        className={`${roboto.variable} font-sans antialiased bg-gray-50 min-h-screen`}
      >
        <Providers>
          <BaseLayout>{children}</BaseLayout>
          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </Providers>
      </body>
    </html>
  )
}
