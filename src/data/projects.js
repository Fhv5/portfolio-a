export const projects = [
  {
    id: "valvilax",
    title: "Valvilax Reservas",
    status: "En Producción",
    statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    role: "Arquitecto / Full-Stack Dev",
    description: "PWA de gestión y automatización de reservas implementada para un cliente real en Iquique, Chile. Esta solución automatiza el agendamiento y control de reservas en tiempo real de forma interactiva sin depender de SaaS externos costosos y comisiones de intermediarios, manteniendo una huella de servidor virtual extremadamente compacta.",
    challenge: "Optimización de recursos técnicos y costos para despliegues de bajo presupuesto.",
    specs: [
      "Compilación del backend con GraalVM Native Image, reduciendo la memoria RAM a <100MB y logrando arranques en milisegundos.",
      "Persistencia integrada mediante SQLite embebido con migraciones Flyway compiladas en el propio binario nativo.",
      "Frontend en Cloudflare Pages y Backend ejecutado en instancia AWS EC2.",
      "Seguridad perimetral administrada en Nginx mediante SSL robusto, cifrado TLS 1.3 y Rate Limiting estricto."
    ],
    tags: ["React", "Spring Boot", "GraalVM", "SQLite", "AWS EC2", "Cloudflare Pages", "Nginx"],
    image: "/valvilax_logo.png",
    githubUrl: null,
    demoUrl: null,
    featured: true
  },
  {
    id: "visualizador",
    title: "Visualizador de Empaquetamientos",
    status: "Investigación",
    statusColor: "text-accent bg-accent/10 border-accent/20",
    role: "Investigador / Desarrollador",
    description: "Herramienta interactiva de investigación científica y simulación geométrica desarrollada como el complemento interactivo principal de mi tesis de grado en geometría computacional. Permite explorar la geometría de configuraciones mediante simulaciones físicas, perturbar coordenadas de forma manual o automatizada para verificar variaciones en el perímetro de su envolvente convexa, y analizar estabilidad y curvatura.",
    challenge: "Resolución de restricciones geométricas complejas y modelamiento matemático.",
    specs: [
      "Simulación de 'Rolling' que permite programar motores virtuales para desplazar discos respetando tangencias.",
      "Cálculo del perímetro (con punto flotante) en tiempo real según el ciclo de la envolvente.",
      "Historial con gráficos que trazan las variaciones del perímetro bajo deformación.",
      "Control preciso de coordenadas con soporte de expresiones matemáticas.",
      "Exportación masiva de datos en formato JSON con filtros activos."
    ],
    tags: ["Next.js 16", "TypeScript", "Zustand", "Math.js", "ML-Matrix", "KaTeX", "Cloudflare Pages"],
    image: "/university_of_tarapaca_logo.png",
    githubUrl: null,
    demoUrl: "https://packings.fhenry.site/",
    featured: true
  },
  {
    id: "prostagma",
    title: "Prostagma? (Πρόσταγμα;)",
    status: "Terminado",
    statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    role: "Desarrollador",
    description: "Herramienta de aprendizaje de idiomas y accesibilidad creada para aprender griego mediante inmersión con el juego Age of Mythology. Permite capturar en tiempo real textos de la UI para recibir traducciones literales y contextuales junto con el audio de pronunciación en una ventana flotante, todo de forma externa para no generar sospechas de trampas en el juego.",
    challenge: "Optimización de la latencia de arranque en frío de los modelos locales de Ollama tras periodos prolongados de inactividad.",
    specs: [
      "Ventana flotante de overlay que permanece por encima del juego.",
      "Módulo OCR para la extracción de texto en griego a partir de capturas de pantalla en el portapapeles.",
      "Traducción contextual mediante inferencia con modelos LLM locales (Ollama) e integración de respaldo con Google Translate API.",
      "Reproducción sintética de audio para la pronunciación correcta de los vocablos.",
      "Atajos de teclado configurables para agilizar el flujo de uso durante el juego."
    ],
    tags: ["Java", "Spring Boot", "Python", "Ollama", "OCR", "API de Google Translate"],
    githubUrl: "https://github.com/Fhv5/prostagma",
    demoUrl: null,
    featured: false
  },
  {
    id: "excalidraw-stylus-radial",
    title: "Excalidraw Stylus Radial",
    status: "Terminado",
    statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    role: "Desarrollador",
    description: "Plugin de productividad para Obsidian desarrollado para eliminar la necesidad de barras de herramientas fijas en Excalidraw al dibujar con lápiz óptico. Implementa un menú radial flotante contextual que aparece exactamente en las coordenadas de contacto del lápiz en respuesta al botón del stylus (como el botón lateral del Samsung S Pen).",
    challenge: "Integración limpia con el ciclo de eventos del canvas de Excalidraw dentro del entorno de plugins de Obsidian, previniendo colisiones de gestos.",
    specs: [
      "Menú radial flotante que se despliega inmediatamente en el punto de contacto al presionar el botón lateral del lápiz.",
      "Selector rápido de herramientas de dibujo (lápiz, borrador, mover, seleccionar) y figuras geométricas mediante pulsaciones largas.",
      "Diferenciación visual estilizada de herramientas, operaciones de portapapeles (azul) e historial (moteado y pequeño).",
      "Acceso directo a operaciones de historial (Undo/Redo) directamente desde el menú contextual.",
      "Copiado y pegado inteligente que duplica elementos aplicando offsets coordenados y preservando jerarquías/bindings."
    ],
    tags: ["TypeScript", "Obsidian API", "Node.js", "Excalidraw API"],
    githubUrl: "https://github.com/Fhv5/excalidraw-stylus-radial",
    demoUrl: null,
    featured: false
  },
  {
    id: "finsight",
    title: "Finsight",
    status: "En Desarrollo",
    statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    role: "Desarrollador",
    description: "API REST de gestión financiera personal estructurada con Java 25 y Spring Boot 4.0.5. Diseñada bajo un enfoque modular, seguro y altamente escalable para llevar el control de ingresos, gastos, ahorros y presupuestos sin recurrir a plataformas de terceros, con aislamiento completo de información por usuario.",
    challenge: "Mantener la coherencia transaccional y recalculación de balances al reversar operaciones complejas (ingresos, egresos, transferencias).",
    specs: [
      "Administración de cuentas financieras con actualizaciones automáticas de saldo basadas en transacciones.",
      "Clasificación dinámica de movimientos mediante categorías personalizadas por usuario con restricciones de integridad.",
      "Registro de transacciones transaccionales (ingresos, gastos, transferencias) con reversión automática en caso de fallos.",
      "Control mensual de presupuestos calculados en tiempo real según la zona horaria del usuario.",
      "Módulo de metas de ahorro con visualización del progreso.",
      "Aislamiento estricto de datos de usuario en base de datos mediante seguridad JWT."
    ],
    tags: ["Java 25", "Spring Boot 4.0.5", "PostgreSQL", "Flyway", "JWT Auth", "Docker Compose"],
    githubUrl: "https://github.com/Fhv5/finsight",
    demoUrl: null,
    featured: false
  },
  {
    id: "portfolio",
    title: "Portafolio",
    status: "Terminado",
    statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    role: "Desarrollador",
    description: "Mi portafolio profesional. Desarrollado y estructurado con Next.js, estilizado con TailwindCSS v4, y diseñado bajo una estética de alto contraste.",
    challenge: null,
    specs: [],
    tags: ["Next.js", "React", "TailwindCSS", "Radix UI", "Cloudflare Pages"],
    githubUrl: "https://github.com/Fhv5/portfolio",
    demoUrl: null,
    featured: false
  },
  {
    id: "riff",
    title: "Riff",
    status: "En Desarrollo",
    statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    role: "Desarrollador",
    description: "Clon experimental de mensajería grupal y comunicación por hilos en tiempo real basado en WebSockets. Construido bajo principios de Clean Architecture y microservicios, desplegado localmente en un entorno físico Dockerizado y analizado mediante pipelines CI/CD locales. Uno de mis proyectos más ambiciosos.",
    challenge: "Orquestación del entorno de desarrollo y testing Dockerizado e integración de automatización de análisis estático con Jenkins. Implementación de live streaming & voice chat.",
    specs: [
      "Comunicación bidireccional y mensajería en tiempo real mediante WebSockets.",
      "Estructuración de microservicios, workers y tareas de procesamiento en lote.",
      "Autenticación y autorización con JWT.",
      "Pipeline CI/CD on-premise con Jenkins y SonarQube.",
      "Entorno dockerizado con enrutamiento gestionado por Caddy en Raspberry Pi.",
      "(En desarollo) Live streaming & voice chat."
    ],
    tags: ["Spring Boot", "React", "WebSockets", "Microservicios", "Docker", "Jenkins", "SonarQube", "Caddy"],
    githubUrl: null,
    demoUrl: null,
    featured: false
  }
];
