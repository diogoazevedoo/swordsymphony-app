'use client'

import {
  Bell,
  Menu,
  MessageSquare,
  Search,
  X,
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  FileSymlink,
  Bot,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { UserNav } from '@/components/app/user-nav'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  return (
    <>
      <header className="bg-background/70 backdrop-blur-lg border-b border-border/40 py-2.5 px-4 md:px-6 sticky top-0 z-30 pb-1.5">
        <div className="flex items-center justify-between h-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 rounded-md hover:bg-muted/50"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-4.5 w-4.5" />
              ) : (
                <Menu className="h-4.5 w-4.5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
            <div
              className="hidden md:flex items-center relative max-w-sm"
              onClick={() => setIsCommandOpen(true)}
            >
              <Button
                variant="outline"
                className="w-64 justify-start text-muted-foreground pl-3 pr-2 py-1.5 h-8 text-sm border-muted-foreground/20 hover:border-muted-foreground/30 hover:bg-muted/30"
              >
                <Search className="h-3.5 w-3.5 mr-2" />
                <span className="flex-1 text-left">Search...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-muted-foreground/20 bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 rounded-md hover:bg-muted/30"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary"></span>
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md hover:bg-muted/30"
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span className="sr-only">Messages</span>
            </Button>
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      <div
        className={cn(
          'md:hidden fixed inset-0 top-[57px] z-40 bg-background/98 backdrop-blur-sm',
          isMobileMenuOpen ? 'animate-in fade-in-0 duration-150' : 'hidden',
        )}
      >
        <div className="p-4 flex flex-col h-[calc(100vh-57px)]">
          <div className="relative mb-4">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 w-full h-9 border-muted-foreground/20"
              onClick={() => {
                setIsCommandOpen(true)
                setIsMobileMenuOpen(false)
              }}
            />
          </div>
          <nav className="space-y-1.5 flex-1">
            {[
              'Dashboard',
              'Cases',
              'Agents',
              'Workflows',
              'Orchestration',
              'Settings',
            ].map((item, i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start h-10 px-3 text-sm font-medium rounded-md hover:bg-muted/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </Button>
            ))}
          </nav>
          <Button
            variant="ghost"
            className="w-full justify-start mt-auto text-sm font-medium rounded-md text-red-500 hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>

      {isMounted && (
        <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
          <CommandInput placeholder="Search for anything..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              <CommandItem className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
              <CommandItem className="cursor-pointer">
                <FileSymlink className="mr-2 h-4 w-4" />
                <span>Cases</span>
              </CommandItem>
              <CommandItem className="cursor-pointer">
                <Bot className="mr-2 h-4 w-4" />
                <span>Agents</span>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CommandItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
              <CommandItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      )}
    </>
  )
}
