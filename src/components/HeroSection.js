"use client";

import { motion } from "framer-motion";
import { Download, ChevronRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { DiskPackingHero } from "./DiskPackingHero";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";
import { getAssetUrl } from "@/lib/utils/assets";

export function HeroSection() {
  const { dict } = useI18n();

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const elem = document.querySelector(targetId);
    if (elem) {
      const header = document.querySelector("header");
      const headerOffset = header ? header.offsetHeight : 80;
      window.scrollTo({
        top: elem.getBoundingClientRect().top + window.scrollY - headerOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center pt-20 px-6 lg:px-8 overflow-hidden"
    >
      {/* Animated Disk Packing Background */}
      <DiskPackingHero />

      <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[clamp(2.2rem,7.5vh,4.25rem)] font-extrabold tracking-tight text-text-primary mb-[clamp(0.5rem,1.8vh,1.25rem)]"
        >
          {dict.hero.title}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[clamp(0.95rem,2.2vh,1.25rem)] text-text-muted mb-[clamp(1rem,2.5vh,2rem)] max-w-2xl text-balance"
        >
          {dict.hero.subtitle}
          <span className="text-text-primary font-medium">
            {dict.hero.highlight}
          </span>
          {dict.hero.subtitle2}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pointer-events-auto"
        >
          <Button
            asChild
            className="w-full sm:w-auto group px-8 py-6 rounded-lg bg-text-primary text-bg-surface hover:bg-text-primary/90 shadow-lg shadow-text-primary/10"
          >
            <a href="#work" onClick={(e) => handleScrollTo(e, "#work")}>
              <span>{dict.hero.viewProjects}</span>
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto px-8 py-6 rounded-lg"
          >
            <a
              href={getAssetUrl("/Fabian_Henry_CV.pdf")}
              download="Fabian_Henry_CV.pdf"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>{dict.hero.downloadCV}</span>
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-[clamp(1rem,3.5vh,2.5rem)] flex items-center gap-4 pointer-events-auto"
        >
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full hover:text-accent"
          >
            <a
              href="https://linkedin.com/in/fabian-henry-vilaxa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="rounded-full hover:text-accent"
          >
            <a
              href="https://github.com/Fhv5"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
