import type { Metadata, Viewport } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Öz Mevsim Isı Sistemleri - Ankara İsıtma Soğutma Uzmanı",
    template: "%s | Öz Mevsim Isı Sistemleri"
  },
  description: "Ankara'nın güvenilir ısıtma ve soğutma sistemleri uzmanı. Kombi, klima, radyatör satış, montaj ve servis hizmetleri. 7/24 teknik destek.",
  keywords: [
    "ankara ısıtma",
    "ankara soğutma",
    "kombi servisi",
    "klima montajı",
    "radyatör",
    "ısı pompası",
    "ankara hvac",
    "Öz Mevsim",
    "İstanbul"
  ],
  authors: [{ name: "Öz Mevsim Isı Sistemleri" }],
  creator: "Öz Mevsim Isı Sistemleri",
  publisher: "Öz Mevsim Isı Sistemleri",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
    languages: {
      'tr-TR': '/',
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Öz Mevsim Isı Sistemleri",
    title: "Öz Mevsim Isı Sistemleri - Ankara İsıtma Soğutma Uzmanı",
    description: "Ankara'nın güvenilir ısıtma ve soğutma sistemleri uzmanı. Kombi, klima, radyatör satış, montaj ve servis hizmetleri.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Öz Mevsim Isı Sistemleri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Öz Mevsim Isı Sistemleri - Ankara İsıtma Soğutma Uzmanı",
    description: "Ankara'nın güvenilir ısıtma ve soğutma sistemleri uzmanı.",
    images: ["/og-image.jpg"],
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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Öz Mevsim",
    startupImage: [
      "/icons/icon-192x192.png"
    ],
  },
  verification: {
    google: "google-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ea580c' },
    { media: '(prefers-color-scheme: dark)', color: '#ea580c' },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ea580c" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="application-name" content="Öz Mevsim" />
        <meta name="apple-mobile-web-app-title" content="Öz Mevsim" />
        <meta name="theme-color" content="#e35d47" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${lexend.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
