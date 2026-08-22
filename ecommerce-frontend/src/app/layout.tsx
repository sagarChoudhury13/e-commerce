import "./globals.css";
import { Navbar } from "@/components/layout/Navbar"; 

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
