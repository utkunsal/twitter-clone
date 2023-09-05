import { ClerkProvider } from "@clerk/nextjs"
import { Metadata } from "next/types"
import { Inter } from "next/font/google"

import "../globals.css"

export const metadata: Metadata = {
  title: 'Auth',
  description: 'Auth',
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ 
  children 
}: {
  children: React.ReactNode
}) {
  return(
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="flex justify-center items-center w-full min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}