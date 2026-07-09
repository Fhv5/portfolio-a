"use client";

import { motion } from "framer-motion";
import { Mail, Download } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n-context";

export function Contact() {
  const { dict } = useI18n();

  return (
    <section id="contact" className="py-[clamp(5rem,6vw,7rem)] px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-[clamp(3.5rem,4vw,4.5rem)] text-center"
        >
          <h2 className="text-[clamp(1.75rem,4.5vh,2.5rem)] font-extrabold tracking-tight flex items-center justify-center mb-[clamp(0.75rem,2.5vh,1.5rem)] leading-tight">
            <span className="text-accent py-1">{dict.contact.title}</span>
          </h2>
          <p className="text-[clamp(0.95rem,1.2vw,1.1rem)] text-text-muted max-w-2xl mx-auto text-balance leading-relaxed">
            {dict.contact.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-[clamp(1rem,2vw,1.5rem)]"
        >
          <Button asChild size="lg" className="w-full sm:w-auto h-auto py-[clamp(0.85rem,1.8vh,1.25rem)] px-[clamp(1.5rem,3vw,2rem)] rounded-lg text-bg-surface bg-text-primary hover:bg-text-primary/90 shadow-lg shadow-text-primary/10 text-sm md:text-base">
            <a
              href="mailto:fhenrynk@outlook.com"
            >
              <Mail className="w-5 h-5 mr-3" />
              <span>fhenrynk@outlook.com</span>
            </a>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-auto py-[clamp(0.85rem,1.8vh,1.25rem)] px-[clamp(1.5rem,3vw,2rem)] rounded-lg text-sm md:text-base">
            <a
              href="https://linkedin.com/in/fabian-henry-vilaxa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin className="w-5 h-5 mr-3" />
              <span>LinkedIn</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
