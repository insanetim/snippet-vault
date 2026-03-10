import Image from "next/image"
import Link from "next/link"
import React, { PropsWithChildren } from "react"

const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-semibold text-gray-900 hover:text-gray-700"
            >
              <Image
                src="/vault.png"
                alt="Snippet Vault"
                width={40}
                height={40}
              />
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
  )
}

export default BaseLayout
