"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileEdit } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Header() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-foreground uppercase">ANVANCE</span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground -mt-0.5 sm:-mt-1">Production</span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher */}
          <div className="flex items-center border border-border rounded-md overflow-hidden mr-1 sm:mr-2">
            <button
              onClick={() => setLanguage("it")}
              className={`px-2 py-1 text-xs font-medium transition-colors ${
                language === "it" 
                  ? "bg-foreground text-background" 
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              IT
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 text-xs font-medium transition-colors ${
                language === "en" 
                  ? "bg-foreground text-background" 
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>

          <Button
            variant={!isAdmin ? "default" : "ghost"}
            size="sm"
            asChild
            className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
          >
            <Link href="/">
              <FileEdit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">{t("header.clientBrief")}</span>
            </Link>
          </Button>
          <Button
            variant={isAdmin ? "default" : "ghost"}
            size="sm"
            asChild
            className="gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3"
          >
            <Link href="/admin">
              <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline text-xs sm:text-sm">{t("header.dashboard")}</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
