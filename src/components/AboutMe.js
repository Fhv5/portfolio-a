"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaJava, FaAws } from "react-icons/fa";
import { DiRedis } from "react-icons/di";
import {
  SiSpringboot,
  SiPython,
  SiDocker,
  SiJenkins,
  SiSonarqubeserver,
  SiPostgresql,
  SiReact,
  SiTypescript,
  SiMongodb,
  SiVuedotjs,
  SiNestjs
} from "react-icons/si";

const TechCard = ({ skill, idx, isNew = false }) => (
  <motion.div
    layout
    initial={isNew ? { opacity: 0, scale: 0.8, y: 10 } : { opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ 
      duration: isNew ? 0.3 : 0.4, 
      delay: idx * 0.05
    }}
    className="flex items-center gap-2 px-3 py-2 bg-bg-surface border border-border/60 rounded-xl hover:border-accent hover:shadow-[0_8px_30px_rgb(3,105,161,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-default group h-fit"
  >
    <div className={`text-xl ${skill.color} drop-shadow-sm`}>
      {skill.icon}
    </div>
    <span className="text-xs font-bold text-text-primary tracking-tight">
      {skill.name}
    </span>
  </motion.div>
);

export function AboutMe() {
  const [showAllTech, setShowAllTech] = useState(false);
  const [currentFact, setCurrentFact] = useState(0);

  const funFacts = [
    "De pequeño tuve 9 gatos. Ahora les tengo alergia.",
    "Estudié psicología año y medio antes de cambiarme a informática.",
    "No soy fan de las mates, pero mi tesis fue matemática pura y dura.",
    "Autoproclamado mejor jugador de Age of Mythology en Iquique.",
    "Con excepción de la pizza, no me agrada mucho la comida italiana.",
    "Creo que sería buen cantante.",
    "Puedo tocar Ka$cade de Animals as Leaders al 80% de velocidad.",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [funFacts.length]);

  const mainTech = [
    { name: "Java", icon: <FaJava />, color: "text-[#ED8B00]" },
    { name: "Spring Boot", icon: <SiSpringboot />, color: "text-[#6DB33F]" },
    { name: "TypeScript", icon: <SiTypescript />, color: "text-[#3178C6]" },
    { name: "React", icon: <SiReact />, color: "text-[#61DAFB]" },
    { name: "Python", icon: <SiPython />, color: "text-[#3776AB]" },
    { name: "AWS", icon: <FaAws />, color: "text-[#FF9900]" },
    { name: "Docker", icon: <SiDocker />, color: "text-[#2496ED]" },
    { name: "PostgreSQL", icon: <SiPostgresql />, color: "text-[#4169E1]" },
  ];

  const otherTech = [
    { name: "MongoDB", icon: <SiMongodb />, color: "text-[#47A248]" },
    { name: "Redis", icon: <DiRedis />, color: "text-[#DC382D]" },
    { name: "Jenkins", icon: <SiJenkins />, color: "text-[#D24939]" },
    { name: "SonarQube", icon: <SiSonarqubeserver />, color: "text-[#4E9BCD]" },
    { name: "NestJS", icon: <SiNestjs />, color: "text-[#EA2845]" },
    { name: "Vue", icon: <SiVuedotjs />, color: "text-[#4FC08D]" },
  ];

  return (
    <section id="about" className="py-[clamp(5rem,6vw,7rem)] px-6 lg:px-8 bg-bg-primary overflow-hidden">
      <div className="max-w-[var(--container-max-width)] mx-auto transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-[clamp(3.5rem,4vw,4.5rem)] text-center"
        >
          <h2 className="text-[clamp(1.75rem,4.5vh,2.5rem)] font-extrabold tracking-tight flex items-center justify-center mb-[clamp(1rem,2vw,1.5rem)] leading-tight text-balance">
            <span className="text-accent py-1">Sobre mí</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-8 lg:gap-y-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-[clamp(1.25rem,2vw,1.75rem)] text-[clamp(0.95rem,1.2vw,1.1rem)] text-text-muted leading-relaxed text-justify lg:text-left">
              <p>
                ¡Hola! Soy <span className="text-text-primary font-semibold">Fabián</span>, 
                Ingeniero Civil en Informática con foco en <span className="text-accent font-medium">Backend</span>, <span className="text-accent font-medium">Arquitectura Cloud</span> y <span className="text-accent font-medium">DevOps</span>.
                Me gradué con Máxima Distinción de la Universidad de Tarapacá 
                (grande la UTA), donde también fui ayudante / tutor de varias cátedras.
              </p>
              <p>
                Recientemente fui seleccionado como uno de los becados del programa <span className="text-text-primary font-semibold"><a href="https://talentodigitalparachile.cl/crece-con-google/" target="_blank">Becas Google 2026</a></span>, y actualmente estoy cursando las certificaciones en <span className="text-accent font-medium">Ciberseguridad</span> y en <span className="text-accent font-medium">Análisis de Datos</span> para expandir mis horizontes. En paralelo, exploro el uso de IA en aplicaciones con <span className="text-accent font-medium">Spring AI</span> y <span className="text-accent font-medium">LangChain</span>. 
                {/* Actualmente estoy estudiando para certificarme como <span className="text-accent font-medium">AWS Solutions Architect Associate</span>  y explorando la implementación de sistemas
                basados en IA con <span className="text-accent font-medium">Spring AI</span> y <span className="text-accent font-medium">LangChain</span>. */}
              </p>
              <p>
                Fuera del código: leo, toco guitarra (eléctrica, claro), entreno, ando en bici por la ciudad, y de vez en cuando me meto en problemas de geometría computacional. De hecho, mi proyecto de título fue sobre eso.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-[280px] sm:max-w-[var(--photo-max-width)] relative transition-all duration-300">
              <div className="aspect-square relative flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-accent/25 rounded-full blur-[80px] opacity-50 pointer-events-none" />
                
                <div className="relative w-full aspect-square bg-bg-surface/70 backdrop-blur-md border border-border hover:border-accent/30 rounded-3xl shadow-2xl overflow-hidden group transition-colors duration-500">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-30 group-hover:opacity-50 transition-opacity z-10 pointer-events-none" />
                  
                  <Image
                    src="/profile.jpeg"
                    alt="Fabián Henry Vilaxa"
                    fill
                    sizes="(max-width: 400px) 100vw, 400px"
                    priority
                    className="object-cover transition-all duration-700 grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <div className="flex items-center mb-6 px-1">
              <h4 className="text-sm font-mono text-text-muted uppercase tracking-widest">FUN FACTS</h4>
            </div>
            <div className="h-16 flex items-center bg-transparent border border-border/40 rounded-xl px-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentFact}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-text-muted text-sm md:text-base italic font-medium leading-relaxed"
                >
                  {funFacts[currentFact]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-6 px-1">
              <h4 className="text-sm font-mono text-text-muted uppercase tracking-widest">MIS ARMAS FAVORITAS</h4>
              <button 
                onClick={() => setShowAllTech(!showAllTech)}
                className="text-xs font-bold text-accent hover:text-accent-alt transition-colors flex items-center gap-1 group outline-none"
              >
                {showAllTech ? "Ver menos" : "Ver más"}
                {showAllTech ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            
            <div className="min-h-[100px] flex flex-col justify-start">
              <div className="flex flex-wrap items-start content-start gap-[clamp(0.5rem,1.2vw,0.75rem)] justify-center lg:justify-start">
                {mainTech.map((skill, idx) => (
                  <TechCard key={skill.name} skill={skill} idx={idx} />
                ))}
                
                <AnimatePresence mode="popLayout">
                  {showAllTech ? (
                    [
                      ...otherTech.map((skill, idx) => (
                        <motion.div
                          key={skill.name}
                          layout
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                        >
                          <TechCard skill={skill} idx={idx} isNew={true} />
                        </motion.div>
                      )),
                      <motion.button 
                        key="ocultar-btn"
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2, delay: otherTech.length * 0.03 }}
                        onClick={() => setShowAllTech(false)}
                        className="flex items-center gap-2 px-3 py-2 bg-bg-primary border border-border/40 rounded-xl text-text-muted hover:text-accent hover:border-accent/50 transition-all text-xs font-bold h-fit"
                      >
                        <ChevronUp className="w-3 h-3" />
                        <span>Ocultar</span>
                      </motion.button>
                    ]
                  ) : (
                    <motion.button 
                      key="plus-btn"
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ 
                        duration: 0.2, 
                        delay: 0.4
                      }}
                      onClick={() => setShowAllTech(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-bg-primary border border-border/40 rounded-xl text-text-muted hover:text-accent hover:border-accent/50 transition-all text-xs font-bold h-fit"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{otherTech.length}+ más</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
