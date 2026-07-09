"use client";

import { useState, useEffect } from "react";
import { Search, ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectDetailDialog } from "@/components/ProjectDetailDialog";

export function ProjectsClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  // Read URL hash on mount to automatically open the modal if direct linked (e.g. from Home page)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1);
      const project = projects.find((p) => p.id === id);
      if (project) {
        // Open modal
        setTimeout(() => {
          setSelectedCase(project);
        }, 150);
      }
    }
  }, []);

  // Filter projects by search
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      project.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-[var(--container-max-width)] mx-auto w-full pb-24 transition-all duration-300">
      {/* Header & Back Button */}
      <div className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors mb-6 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-4">
          Mis Proyectos
        </h1>
        <p className="text-base md:text-lg text-text-muted max-w-3xl leading-relaxed">
          Un registro honesto de mis desarrollos técnicos, investigaciones científicas, utilidades prácticas y laboratorios personales.
        </p>
      </div>

      {/* Smart Search Bar */}
      <div className="relative mb-12 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, tecnología o rol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-bg-surface border border-border/80 focus:border-accent hover:border-border-color focus:ring-1 focus:ring-accent rounded-xl text-text-primary placeholder:text-text-muted/65 text-sm md:text-base outline-none transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary text-xs font-semibold"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Unified Project Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedCase(project)}
              className="group relative flex flex-col justify-between bg-bg-surface border border-border rounded-xl p-5 cursor-pointer hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform overflow-hidden shrink-0">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-accent bg-accent/10 rounded-lg">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-sans px-2.5 py-0.5 rounded-full border font-semibold ${project.statusColor}`}>
                    {project.status}
                  </span>
                </div>
                <h3 className="text-[clamp(1.1rem,2.2vh,1.25rem)] font-bold text-text-primary mb-1 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs font-sans text-text-muted mb-3 font-semibold">{project.role}</p>
                <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-4">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border/50">
                {project.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs font-semibold text-text-primary bg-bg-primary border border-border px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="text-xs font-semibold text-text-muted bg-bg-primary border border-border px-1.5 py-0.5 rounded">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl bg-bg-surface text-center">
            <p className="text-text-muted font-mono mb-2">No se encontraron proyectos</p>
            <p className="text-xs text-text-muted">Prueba buscando palabras como &quot;Spring Boot&quot;, &quot;React&quot;, &quot;Zustand&quot; o &quot;TypeScript&quot;</p>
          </div>
        )}
      </div>

      <ProjectDetailDialog
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        project={selectedCase}
      />
    </div>
  );
}
