"use client";

import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Deduce el idioma actual basándose en la URL (ej. /en/projects -> 'en')
  const currentLang = pathname.startsWith("/en") ? "en" : "es";

  const switchLanguage = (newLang) => {
    if (newLang === currentLang) return;
    
    // Reemplaza el segmento del idioma actual en la URL
    const segments = pathname.split("/");
    if (segments.length > 1 && (segments[1] === "en" || segments[1] === "es")) {
      segments[1] = newLang;
      router.push(segments.join("/"));
    } else {
      router.push(`/${newLang}${pathname}`);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-text-muted hover:text-text-primary px-3 py-1.5 rounded-full border border-border bg-bg-surface hover:bg-bg-primary transition-colors text-xs font-semibold uppercase font-mono"
        >
          <Globe className="w-4 h-4" />
          <span>{currentLang}</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="center"
          sideOffset={8}
          className="z-50 bg-bg-surface border border-border p-2 rounded-xl shadow-xl flex flex-col gap-1 w-32 font-sans"
        >
          <DropdownMenu.Item
            onClick={() => switchLanguage("es")}
            className={`text-sm py-2 px-3 rounded-md cursor-pointer outline-none transition-colors ${currentLang === 'es' ? 'bg-accent/10 text-accent font-bold' : 'text-text-primary hover:bg-bg-primary hover:text-accent'}`}
          >
            Español
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => switchLanguage("en")}
            className={`text-sm py-2 px-3 rounded-md cursor-pointer outline-none transition-colors ${currentLang === 'en' ? 'bg-accent/10 text-accent font-bold' : 'text-text-primary hover:bg-bg-primary hover:text-accent'}`}
          >
            English
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
