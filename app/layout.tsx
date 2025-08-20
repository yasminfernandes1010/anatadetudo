import type React from "react"
import type { Metadata } from "next"
import { Inter, Fredoka } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
})

export const metadata: Metadata = {
  title: "BrinquedoLand - Brinquedos para Crianças de 3-5 Anos",
  description: "Os melhores brinquedos para crianças de 3 a 5 anos com 70% de desconto!",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fredoka.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
