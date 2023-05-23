import './globals.css'
import { Inter } from 'next/font/google'
import ToasterContext from './context/ToasterContext'

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'Chatify',
  description: 'Chatify is a chat app built with Next.js and MongoDB.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterContext />
        {children}
      </body>
    </html>
  )
}