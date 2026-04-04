import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import RootLayoutClient from "@/components/root-layout-client"
import { getPublicAppBranding } from "@/lib/data"

const inter = Inter({ subsets: ["latin"] })

const baseDescription =
  "Platform tiket event terpercaya dengan sistem pembayaran yang aman dan mudah. Dapatkan tiket event favorit Anda dengan cepat dan mudah."

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getPublicAppBranding()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://event.kreativaglobal.id"
  return {
    generator: "v0.app",
    title: branding.title,
    description: baseDescription,
    keywords: "tiket event, platform tiket, event indonesia, pembayaran online, tiket konser",
    authors: [{ name: branding.title }],
    creator: branding.title,
    publisher: branding.title,
    icons: {
      icon: branding.faviconUrl,
      shortcut: branding.faviconUrl,
      apple: branding.faviconUrl,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: branding.title,
      description: baseDescription,
      url: baseUrl,
      siteName: branding.title,
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: branding.title,
      description: baseDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const branding = await getPublicAppBranding()
  return (
    <html lang="id">
      <RootLayoutClient
        className={inter.className}
        headerLogoUrl={branding.logoUrl}
        headerTitle={branding.title}
      >
        {children}
      </RootLayoutClient>
    </html>
  )
}
