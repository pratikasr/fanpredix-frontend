'use client';

import Link from 'next/link'
import { motion } from 'framer-motion'

const Footer = () => {
  const footerLinks = [
    { name: 'About', href: '/about' },
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <Link href="/" className="text-2xl font-bold font-['Roboto_Condensed']">
              FanPredix
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              Predict, bet, and win on your favorite sports events!
            </p>
          </div>
          <nav className="w-full md:w-2/3 flex flex-wrap justify-end">
            {footerLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <motion.div
                  className="ml-6 text-sm hover:text-blue-400 transition-colors duration-200"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {link.name}
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FanPredix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer