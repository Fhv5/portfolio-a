"use client";

import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  return (
    <footer className="py-8 px-6 lg:px-8 border-t border-border bg-bg-primary text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="flex gap-6">
          <a
            href="https://github.com/Fhv5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-accent transition-colors"
            aria-label="GitHub"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/fabian-henry-vilaxa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-accent transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:fhenrynk@outlook.com"
            className="text-text-muted hover:text-accent transition-colors"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
        
        {/* Language Switcher integrado en el footer como se solicitó */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
