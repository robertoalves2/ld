import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Liturgia Diária Católica - Leituras e Evangelho do Dia",
  description:
    "Acesse a liturgia católica diária com todas as leituras, evangelho, salmos e orações. Liturgia completa atualizada todos os dias para sua oração e meditação.",
  keywords:
    "liturgia diária, liturgia católica, leituras do dia, evangelho, salmo responsorial, primeira leitura, segunda leitura, oração do dia, antífona, missa, igreja católica, palavra de deus, bíblia, oração, meditação, espiritualidade",
  authors: [{ name: "Liturgia Diária", url: "https://liturgiadiaria.top" }],
  creator: "Liturgia Diária",
  publisher: "Liturgia Diária",
  robots: "index, follow",
  alternates: {
    canonical: "https://liturgiadiaria.top",
  },
  openGraph: {
    title: "Liturgia Diária Católica - Leituras e Evangelho do Dia",
    description:
      "Acesse a liturgia católica diária com todas as leituras, evangelho, salmos e orações. Liturgia completa atualizada todos os dias.",
    type: "website",
    locale: "pt_BR",
    url: "https://liturgiadiaria.top",
    siteName: "Liturgia Diária",
    images: [
      {
        url: "/liturgia-icon.webp",
        width: 1200,
        height: 630,
        alt: "Liturgia Diária Católica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liturgia Diária Católica - Leituras e Evangelho do Dia",
    description: "Acesse a liturgia católica diária com todas as leituras, evangelho e orações.",
    images: ["/liturgia-icon.webp"],
    creator: "@liturgiadiaria",
  },
  verification: {
    google: "google-site-verification-code",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Liturgia Diária",
  },
  icons: {
    icon: "/liturgia-icon.webp",
    shortcut: "/liturgia-icon.webp",
    apple: "/liturgia-icon.webp",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/liturgia-icon.webp" />
        <link rel="apple-touch-icon" href="/liturgia-icon.webp" />
        <link rel="shortcut icon" href="/liturgia-icon.webp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8b5cf6" />
        <link rel="manifest" href="/manifest.json" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Liturgia Diária" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Liturgia Diária" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-TileImage" content="/liturgia-icon.webp" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Additional Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/liturgia-icon.webp" />
        <link rel="apple-touch-icon" sizes="152x152" href="/liturgia-icon.webp" />
        <link rel="apple-touch-icon" sizes="144x144" href="/liturgia-icon.webp" />
        <link rel="apple-touch-icon" sizes="120x120" href="/liturgia-icon.webp" />
        <link rel="apple-touch-icon" sizes="114x114" href="/liturgia-icon.webp" />
        <link rel="apple-touch-icon" sizes="76x76" href="/liturgia-icon.webp" />
        <link rel="apple-touch-icon" sizes="72x72" href="/liturgia-icon.webp" />
        <link rel="apple-touch-icon" sizes="60x60" href="/liturgia-icon.webp" />
        <link rel="apple-touch-icon" sizes="57x57" href="/liturgia-icon.webp" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Liturgia Diária",
              description: "Liturgia católica diária com leituras, evangelho e orações",
              url: "https://liturgiadiaria.top",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://liturgiadiaria.top/?date={search_term_string}",
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "Liturgia Diária",
                url: "https://liturgiadiaria.top",
                logo: {
                  "@type": "ImageObject",
                  url: "https://liturgiadiaria.top/liturgia-icon.webp",
                },
              },
              inLanguage: "pt-BR",
              isAccessibleForFree: true,
              audience: {
                "@type": "Audience",
                audienceType: "Catholics, Christians",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <SpeedInsights />
        <Analytics />

        {/* Enhanced Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                      
                      // Check for updates
                      registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                          newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                              // New content is available, refresh the page
                              if (confirm('Nova versão disponível! Deseja atualizar?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                              }
                            }
                          });
                        }
                      });
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
                
                // Listen for controlling service worker changes
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                  window.location.reload();
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
