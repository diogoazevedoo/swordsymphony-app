import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-muted/30 py-12 border-t border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block group mb-4">
              <span className="font-bold text-2xl text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text transition-all duration-300 group-hover:from-primary/90 group-hover:to-primary">
                SwordSymphony
              </span>
            </Link>
            <p className="text-foreground/70 max-w-md">
              SwordSymphony is an AI-powered medical solution that orchestrates
              intelligent agents to provide accurate diagnoses and treatment
              plans.
            </p>

            <div className="flex space-x-4 mt-6 mb-6">
              {['twitter', 'linkedin', 'github', 'facebook'].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-foreground/60 hover:text-primary transition-colors"
                  aria-label={`${social} link`}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-primary/10 transition-colors">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-current"
                    >
                      {social === 'twitter' && (
                        <path
                          d="M22 4.01C21 4.5 20.02 4.69 19 5C17.879 3.735 16.217 3.665 14.62 4.263C13.023 4.861 11.977 6.323 12 8.01V9.01C8.755 9.083 5.865 7.605 4 5.01C4 5.01 0 13.01 8 17.01C6.214 18.169 4.122 18.85 2 19.01C10 24.01 20 19.01 20 8.01C19.9991 7.71851 19.9723 7.42795 19.92 7.14C20.94 6.14 21.62 4.86 22 4.01Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                      {social === 'linkedin' && (
                        <>
                          <path
                            d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 9H2V21H6V9Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </>
                      )}
                      {social === 'github' && (
                        <path
                          d="M9 19C4.7 20.4 4.7 16.5 3 16M15 21V17.5C15 16.5 15.1 16.1 14.5 15.5C17.3 15.2 20 14.1 20 9.50001C19.9988 8.30498 19.5325 7.15732 18.7 6.30001C19.0905 5.26198 19.0545 4.11164 18.6 3.10001C18.6 3.10001 17.5 2.80001 15.1 4.40001C13.0672 3.8706 10.9328 3.8706 8.9 4.40001C6.5 2.80001 5.4 3.10001 5.4 3.10001C4.94548 4.11164 4.90953 5.26198 5.3 6.30001C4.46745 7.15732 4.00122 8.30498 4 9.50001C4 14.1 6.7 15.2 9.5 15.5C8.9 16.1 8.9 16.7 9 17.5V21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                      {social === 'facebook' && (
                        <path
                          d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            <p className="text-foreground/70">
              &copy; {new Date().getFullYear()} SwordSymphony. All rights
              reserved.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4 border-b border-border/50 pb-2">
              Platform
            </h3>
            <ul className="space-y-3">
              {[
                { href: '#features', label: 'Features' },
                { href: '#how-it-works', label: 'How It Works' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '#', label: 'Documentation' },
                { href: '#', label: 'API Reference' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-primary transition-colors flex items-center"
                  >
                    <svg
                      width="6"
                      height="6"
                      viewBox="0 0 6 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 text-primary"
                    >
                      <circle cx="3" cy="3" r="3" fill="currentColor" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4 border-b border-border/50 pb-2">
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { href: '#', label: 'Privacy Policy' },
                { href: '#', label: 'Terms of Service' },
                { href: '#', label: 'Data Processing' },
                { href: '#', label: 'Cookie Policy' },
                { href: '#', label: 'HIPAA Compliance' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-foreground/70 hover:text-primary transition-colors flex items-center"
                  >
                    <svg
                      width="6"
                      height="6"
                      viewBox="0 0 6 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 text-primary"
                    >
                      <circle cx="3" cy="3" r="3" fill="currentColor" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/60 mb-4 md:mb-0">
            Designed for healthcare professionals. Not a substitute for
            professional medical advice.
          </p>
          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-sm text-foreground/60 hover:text-primary transition-colors"
            >
              Sitemap
            </Link>
            <Link
              href="#"
              className="text-sm text-foreground/60 hover:text-primary transition-colors"
            >
              Accessibility
            </Link>
            <Link
              href="#"
              className="text-sm text-foreground/60 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
