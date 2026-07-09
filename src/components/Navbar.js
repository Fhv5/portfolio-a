"use client";

import { useEffect, useState } from "react";
import { Menu, X, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";

export function Navbar() {
  const { dict, lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: dict.navbar.about, href: "#about" },
    { name: dict.navbar.projects, href: "#work" },
    { name: dict.navbar.experience, href: "#experience" },
  ];

  const pathname = usePathname();
  const router = useRouter();

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    // Verificar si estamos en la raíz (ej: /es o /en o /)
    const isHome = pathname === `/${lang}` || pathname === "/";
    
    if (!isHome) {
      router.push(`/${lang}${targetId}`);
    } else {
      const elem = document.querySelector(targetId);
      if (elem) {
        const header = document.querySelector("header");
        const headerOffset = header ? header.offsetHeight : 80;
        window.scrollTo({
          top: elem.getBoundingClientRect().top + window.scrollY - headerOffset,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-bg-surface/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-[var(--container-max-width)] mx-auto px-6 lg:px-8 h-[var(--header-height)] flex items-center justify-between w-full transition-all duration-300">
        <div className="flex-1 flex justify-start">
          <Link
            href={`/${lang}`}
            onClick={(e) => {
              if (pathname === `/${lang}` || pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="logo-link font-sans text-xl font-bold tracking-tighter text-text-primary hover:text-accent transition-colors"
          >
            FHV<span className="text-accent animate-blink">_</span>
          </Link>
        </div>

        {/* Desktop Nav - Center */}
        <nav className="hidden md:flex flex-[2] justify-center items-center space-x-6 lg:space-x-8">
          {navLinks.slice(0, 4).map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-sm font-medium text-text-muted hover:text-accent transition-colors whitespace-nowrap"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Nav - Right */}
        <div className="hidden md:flex flex-1 justify-end items-center space-x-3.5">
          <a
            href="https://github.com/Fhv5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-accent transition-colors p-1"
            aria-label="GitHub"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/fabian-henry-vilaxa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-accent transition-colors p-1"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:fhenrynk@outlook.com"
            className="text-text-muted hover:text-accent transition-colors p-1"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>

          <span className="w-px h-4 bg-border/80 self-center" />

          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, "#contact")}
            className="text-sm font-medium text-text-muted hover:text-accent transition-colors"
          >
            {dict.navbar.contact}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden flex-1 justify-end items-center">
          <DropdownMenu.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenu.Trigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md text-text-primary focus:bg-transparent hover:bg-bg-surface/50"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="w-56 bg-bg-surface border border-border p-4 rounded-xl shadow-xl flex flex-col space-y-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 mt-2 origin-top-right md:hidden"
                sideOffset={8}
                align="end"
              >
                {navLinks.map((link) => (
                  <DropdownMenu.Item key={link.name} asChild>
                    <a
                      href={link.href}
                      onClick={(e) => handleScrollTo(e, link.href)}
                      className="text-sm font-medium text-text-primary py-2 border-b border-border/50 focus:outline-none focus:bg-accent/10 focus:text-accent rounded-md px-2 transition-all cursor-pointer block"
                    >
                      {link.name}
                    </a>
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Item asChild>
                  <a
                    href="#contact"
                    onClick={(e) => handleScrollTo(e, "#contact")}
                    className="text-sm font-medium text-text-primary py-2 border-b border-border/50 focus:outline-none focus:bg-accent/10 focus:text-accent rounded-md px-2 transition-all cursor-pointer block"
                  >
                    {dict.navbar.contact}
                  </a>
                </DropdownMenu.Item>

                {/* Social icons row */}
                <div className="flex items-center justify-around pt-2.5 px-1.5">
                  <a
                    href="https://github.com/Fhv5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent transition-colors p-1.5"
                    aria-label="GitHub"
                  >
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/in/fabian-henry-vilaxa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-accent transition-colors p-1.5"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:fhenrynk@outlook.com"
                    className="text-text-muted hover:text-accent transition-colors p-1.5"
                    aria-label="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}
