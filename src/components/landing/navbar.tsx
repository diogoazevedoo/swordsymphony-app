'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)

      const sections = ['features', 'how-it-works', 'about']
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })

      setActiveSection(currentSection || '')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#about', label: 'About' },
  ]

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/80 shadow-sm backdrop-blur-md border-b border-border/50'
          : 'bg-transparent',
      )}
    >
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex-1 flex justify-start">
          <Link href="/" className="group">
            <span className="font-bold text-xl text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text transition-all duration-300 group-hover:from-primary/90 group-hover:to-primary">
              SwordSymphony
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center justify-center flex-1">
          <div className="flex items-center space-x-1 bg-muted/30 rounded-full px-2 py-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 text-sm rounded-full transition-all duration-300',
                  activeSection === link.href.substring(1)
                    ? 'text-primary font-medium bg-primary/10 shadow-sm'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center justify-end flex-1 space-x-4">
          <ThemeToggle />
          <Button size="sm" className="h-9 px-4 group" asChild>
            <Link href="/dashboard">
              Enter App
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M6.66675 3.33325L10.6667 7.33325L6.66675 11.3333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </Button>
        </div>

        <div className="flex md:hidden justify-end flex-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-sm animate-in slide-in-from-top-5 duration-300">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-foreground/80 hover:text-foreground transition-colors py-3 px-4 rounded-md',
                  activeSection === link.href.substring(1) &&
                    'bg-primary/10 text-primary font-medium',
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border">
              <Button className="w-full" asChild>
                <Link href="/dashboard">Enter App</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
