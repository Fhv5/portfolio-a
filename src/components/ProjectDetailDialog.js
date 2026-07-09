"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronRight, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function ProjectDetailDialog({ isOpen, onClose, project }) {
  if (!project) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] flex flex-col bg-bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-bg-surface sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden shrink-0">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-accent bg-accent/10 rounded-lg">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div>
                <Dialog.Title className="text-xl sm:text-2xl font-bold text-text-primary">
                  {project.title}
                </Dialog.Title>
                <Dialog.Description className="text-accent font-sans mt-0.5 text-sm font-semibold">
                  {project.role}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider">Estado:</span>
              <span className={`text-xs font-sans px-2.5 py-0.5 rounded-full border font-semibold ${project.statusColor}`}>
                {project.status}
              </span>
            </div>

            {/* Context and Description */}
            <div>
              <h4 className="text-base font-bold text-text-primary mb-2">Contexto y Descripción</h4>
              <p className="text-text-muted leading-relaxed text-sm md:text-base">
                {project.description}
              </p>
            </div>

            {/* Technical Challenge */}
            {project.challenge && (
              <div>
                <h4 className="text-base font-bold text-text-primary mb-2">Reto Técnico / Decisiones</h4>
                <p className="text-text-muted leading-relaxed text-sm">
                  {project.challenge}
                </p>
              </div>
            )}

            {/* Specifications & Features */}
            {project.specs && project.specs.length > 0 && (
              <div>
                <h4 className="text-base font-bold text-text-primary mb-2">Características Principales</h4>
                <ul className="space-y-2.5">
                  {project.specs.map((spec, i) => (
                    <li key={i} className="flex items-start text-sm text-text-muted leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-accent shrink-0 mt-1 mr-2" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            <div>
              <h4 className="text-base font-bold text-text-primary mb-2">Stack Tecnológico</h4>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, i) => (
                  <span key={i} className="text-xs font-medium text-text-primary bg-bg-primary border border-border px-2.5 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            {(project.githubUrl || project.demoUrl) && (
              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-4 justify-end">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-bg-surface hover:bg-bg-primary text-text-primary border border-border font-sans font-bold text-sm rounded-lg transition-colors"
                  >
                    <FaGithub className="w-4 h-4" />
                    <span>Ver en GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
                  </a>
                )}
                
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-alt text-white font-sans font-bold text-sm rounded-lg transition-colors shadow-sm"
                  >
                    <span>Ver Demo</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
