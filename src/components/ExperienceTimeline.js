"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import Image from "next/image";

export function ExperienceTimeline() {
  const experiences = [
    {
      type: "work",
      title: "Ingeniero de Software",
      company: "ValVilax",
      location: "Iquique, Chile",
      date: "Mar. 2026 – Presente",
      logo: "/valvilax_logo.png",
      badge: "Freelance",
      description: [
        "Liderazgo técnico en ciclo de vida completo de PWA para la gestión de reservas.",
        "Implementación eficiente con GraalVM (<100MB RAM, arranque en ms), SQLite embebido y migraciones Flyway.",
        "Despliegue Low Cost en AWS EC2 y Cloudflare Pages, con seguridad Nginx (SSL, Rate Limiting).",
        "Cero Downtime desde lanzamiento a producción.",
      ],
    },
    {
      type: "work",
      title: "Desarrollador y Analista Trainee",
      company: "Coordinación Nacional de Tecnología, MINEDUC",
      location: "Remoto, Santiago, Chile",
      date: "Ene. 2026 – Mar. 2026",
      logo: "/mineduc_logo.jpg",
      badge: "Práctica Profesional",
      description: [
        "Diseño e implementación de solución para mitigar vulnerabilidades críticas de seguridad en microservicios Spring Boot & Vue.",
        "Resolución de deuda técnica en Sonarqube e implementación de automatización de pruebas con cobertura >93%.",
        "Elaboración y ejecución del planes QA para funcionalidades recientemente implementadas.",
        "Gestión end-to-end de requerimiento ágil: levantamiento con stakeholders, modelado BPMN y liderazgo de refinamientos técnicos y de negocio.",
      ],
    },
    {
      type: "work",
      title: "Soporte Administrativo de Respaldos",
      company: "Asesorías Arsbyr",
      location: "Providencia, Santiago, Chile",
      date: "Dic. 2023 – Mar. 2024",
      logo: "/arsbyr_logo.jpg",
      badge: "Práctica Profesional",
      description: [
        "Responsable de garantizar la continuidad operacional gestionando plataformas de respaldo corporativas (Veeam, Data Protector, NetVault, vRanger).",
        "Gestión proactiva de incidencias y recuperaciones de archivos y maquinas virtuales para múltiples clientes.",
        "Desarrollo de pipelines en Python para la extracción, procesamiento y visualización de datos de backups y cintas para optimización de ciclos.",
        "Estandarización de documentación técnica para el monitoreo de respaldos en NetVault para mejorar la calidad de los SLAs.",
      ],
    },
    {
      type: "education",
      title: "Ingeniero Civil en Informática",
      company: "Universidad de Tarapacá",
      location: "Iquique, Chile",
      date: "2020 – 2026",
      logo: "/university_of_tarapaca_logo.png",
      description: [
        "Graduado con Máxima Distinción (Nota 6.5 / 7.0).",
        "Speaker en el 1er Congreso Estudiantil de Ingeniería (CEI 2024). Presenté el primer caso de éxito de implementación de metodologías ágiles (Scrum) en la formación académica de la Sede Iquique",
        "Ayudante de Tecnologías Web, Programación Avanzada e Investigación Operativa.",
        "A veces me invitan a dar charlas."
      ],
    },
  ];

  return (
    <section id="experience" className="py-[clamp(5rem,6vw,7rem)] px-6 lg:px-8 bg-bg-surface">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-[clamp(3.5rem,4vw,4.5rem)] text-center"
        >
          <h2 className="text-[clamp(1.75rem,4.5vh,2.5rem)] font-extrabold tracking-tight flex items-center justify-center mb-[clamp(0.75rem,2.5vh,1.5rem)] leading-tight">
            <span className="text-accent py-1">Experiencia y Estudios</span>
          </h2>
          <p className="text-[clamp(0.95rem,1.2vw,1.1rem)] text-text-muted max-w-2xl mx-auto leading-relaxed">
            En lo que he estado últimamente
          </p>
        </motion.div>

        <div className="relative border-l border-border ml-3 md:ml-6 space-y-[clamp(1.5rem,4vh,3rem)]">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute -left-3 top-1 bg-bg-surface p-1 border-2 border-accent rounded-full text-accent shadow-sm shadow-accent/20">
                {exp.type === "work" ? (
                  <Briefcase className="w-4 h-4" />
                ) : (
                  <GraduationCap className="w-4 h-4" />
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                <div className="flex items-center gap-3 flex-1">
                  {exp.logo && (
                    <div className="shrink-0 flex items-center">
                      <Image
                        src={exp.logo}
                        alt={exp.company}
                        width={96}
                        height={96}
                        className="object-contain h-[clamp(2.5rem,5vh,3rem)] w-[clamp(2.5rem,5vh,3rem)] rounded-sm overflow-hidden"
                      />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <h3 className="text-[clamp(1.1rem,2.2vh,1.25rem)] font-bold text-text-primary leading-tight">{exp.title}</h3>
                    {exp.badge && (
                      <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded w-max mt-1.5 border border-accent/20">
                        {exp.badge}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[clamp(0.8rem,1.6vh,0.875rem)] font-sans text-text-muted mt-1 sm:mt-0">
                  {exp.date}
                </span>
              </div>

              <div className="mb-[clamp(0.5rem,1.5vh,1rem)] text-accent text-[clamp(0.85rem,1.6vh,1rem)] font-medium">
                {exp.company} <span className="text-text-muted font-normal text-[clamp(0.85rem,1.6vh,1rem)]">| {exp.location}</span>
              </div>

              <ul className="space-y-[clamp(0.4rem,1vh,0.6rem)] text-text-muted text-[clamp(0.85rem,1.1vw,0.95rem)] leading-relaxed selection:bg-accent/20">
                {exp.description.map((item, i) => (
                  <li key={i} className="flex relative items-start">
                    <span className="text-accent mr-2 mt-1.5 opacity-60">▹</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
