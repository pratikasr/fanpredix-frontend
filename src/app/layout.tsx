import './globals.css'
import type { Metadata } from 'next'
import { Roboto_Condensed, Orbitron } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const robotoCondensed = Roboto_Condensed({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto-condensed',
})

const orbitron = Orbitron({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: 'FanPredix - Sports Prediction Markets',
  description: 'Predict and bet on sports events with FanPredix',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${robotoCondensed.variable} ${orbitron.variable} font-sans bg-gray-900 text-white`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}