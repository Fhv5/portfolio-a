"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects";
import { ProjectDetailDialog } from "@/components/ProjectDetailDialog";

export function CaseStudies() {
  const [selectedCase, setSelectedCase] = useState(null);

  // Filter only featured projects for the Home Page
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section id="work" className="py-[clamp(5rem,6vw,7rem)] px-6 lg:px-8">
      <div className="max-w-[var(--container-max-width)] mx-auto transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-[clamp(3.5rem,4vw,4.5rem)] text-center"
        >
          <h2 className="text-[clamp(1.75rem,4.5vh,2.5rem)] font-extrabold tracking-tight flex items-center justify-center mb-[clamp(0.75rem,2.5vh,1.5rem)] leading-tight text-balance">
            <span className="text-accent py-1">Proyectos</span>
          </h2>
          <p className="text-[clamp(0.95rem,1.2vw,1.1rem)] text-text-muted max-w-2xl mx-auto leading-relaxed">
            De los que estoy más orgulloso
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-[clamp(1.5rem,2.5vw,2rem)] max-w-4xl mx-auto">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => {
                setSelectedCase(project);
              }}
              className="group relative flex flex-col justify-between bg-bg-surface border border-border rounded-xl p-[clamp(1.25rem,2vw,1.75rem)] cursor-pointer hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 flex items-center justify-center group-hover:-translate-y-1 transition-transform overflow-hidden font-semibold">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent bg-accent/10 rounded-lg">
                        <ChevronRight className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-sans px-2.5 py-1 rounded-full border font-semibold ${project.statusColor}`}>
                    {project.status}
                  </span>
                </div>
                <h3 className="text-[clamp(1.15rem,2.2vh,1.35rem)] font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm font-sans text-text-muted mb-4 font-semibold">{project.role}</p>
                <p className="text-sm text-text-muted leading-relaxed mb-[clamp(1rem,2vh,1.5rem)] line-clamp-3">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/50">
                {project.tags.slice(0, 4).map((tag, i) => (
                  <span key={i} className="text-xs font-semibold text-text-primary bg-bg-primary border border-border px-2.5 py-1 rounded">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="text-xs font-semibold text-text-muted bg-bg-primary border border-border px-2 py-1 rounded">
                    +{project.tags.length - 4}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-[clamp(2.5rem,6vh,4rem)] flex justify-center">
          <Button asChild variant="outline" className="group h-auto py-[clamp(0.85rem,1.8vh,1.25rem)] px-[clamp(1.5rem,3vw,2rem)] rounded-lg text-text-primary shadow-sm text-sm md:text-base border-border hover:border-accent/40">
            <Link href="/projects">
              <span>Revisa los demás</span>
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      <ProjectDetailDialog
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        project={selectedCase}
      />
    </section>
  );
}
