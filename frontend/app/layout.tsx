import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import Link from "next/link"
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
          href="/snippet-vault.png"
        />
      </head>
      <body
        className={`${roboto.variable} font-sans antialiased bg-gray-50 min-h-screen`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <Link
                  href="/"
                  className="text-xl font-semibold text-gray-900 hover:text-gray-700"
                >
                  Snippet Vault
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>

          <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-sm text-gray-500">
                Snippet Vault. Store and organize your snippets.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
