'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  FileSymlink,
  Network,
  Workflow,
  Bot,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Cases',
    href: '/cases',
    icon: FileSymlink,
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: Bot,
  },
  {
    title: 'Workflows',
    href: '/workflows',
    icon: Workflow,
  },
  {
    title: 'Orchestration',
    href: '/orchestration',
    icon: Network,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedState = localStorage.getItem('sidebarCollapsed')
    if (storedState) {
      setCollapsed(storedState === 'true')
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !collapsed
    setCollapsed(newState)
    if (mounted) {
      localStorage.setItem('sidebarCollapsed', String(newState))
    }
  }

  return (
    <div
      className={cn(
        'hidden md:flex md:flex-col h-screen bg-background transition-all duration-300 ease-in-out border-r border-border/40 relative',
        collapsed ? 'md:w-14' : 'md:w-56',
      )}
    >
      <div className="flex flex-col flex-1 h-full">
        <div className="flex items-center h-[57px] flex-shrink-0 px-3 border-b border-border/40">
          {!collapsed ? (
            <Link
              href="/dashboard"
              className="flex items-center group truncate"
            >
              <span className="font-semibold text-base text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text transition-all duration-300 group-hover:from-primary/90 group-hover:to-primary whitespace-nowrap">
                SwordSymphony
              </span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center"
            >
              <span className="font-bold text-xl text-primary">S</span>
            </Link>
          )}
        </div>

        <nav
          className={cn(
            'flex-1 py-4 space-y-0.5 overflow-y-auto',
            collapsed ? 'px-2' : 'px-2',
          )}
        >
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) =>
              collapsed ? (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-center h-8 w-8 rounded-md transition-colors',
                        pathname === item.href
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-medium text-xs">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center px-2.5 py-1.5 h-8 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              ),
            )}
          </TooltipProvider>
        </nav>

        <div
          className={cn(
            'border-t border-border/40 py-3',
            collapsed ? 'px-2' : 'px-2',
          )}
        >
          {collapsed ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md text-red-500 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium text-xs">
                  Log out
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-sm font-medium rounded-md text-red-500 hover:bg-red-500/10 hover:text-red-500 h-8 px-2.5"
            >
              <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
              Log out
            </Button>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-2.5 top-20 h-5 w-5 rounded-full border border-border/40 bg-background shadow-sm hover:bg-muted flex items-center justify-center p-0"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}
