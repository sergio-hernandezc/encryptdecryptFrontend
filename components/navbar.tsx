"use client"

import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, User } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { signOut } = useAuth()
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <Link href="/home" className="text-lg font-semibold">
            Cryptographic Operations Interface
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/home" className={pathname === "/home" ? "font-medium" : ""}>
            Home
          </Link>
          <Link href="/manage" className={pathname === "/manage" ? "font-medium" : ""}>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Account
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </nav>
      </div>
    </header>
  )
}
