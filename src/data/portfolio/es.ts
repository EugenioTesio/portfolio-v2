import { SkillCapability, ExperienceItem, ProjectItem, BlogPost } from '../../types';
import regeneratedProfileImage from '../../assets/images/regenerated_image_1788456283242.jpg';

export const PERSONAL_INFO = {
  name: 'Eugenio Tesio',
  role: 'Experto Mobile y Arquitecto de Sistemas',
  subtitle: 'Entusiasta Senior de Flutter y Python · Ingeniero Electrónico',
  location: 'San Francisco, Córdoba, Argentina',
  email: 'eugeniotesio@gmail.com',
  image: regeneratedProfileImage,
  bio: `Soy Eugenio Tesio, Experto Mobile, Arquitecto de Sistemas e Ingeniero Electrónico, con más de 14 años de experiencia profesional en ingeniería de software y telemetría de hardware. Me especializo en diseñar y escalar plataformas móviles de alta velocidad y backends resilientes con Flutter (BLoC y Riverpod), Python (FastAPI), Java (Spring Boot) y Google Cloud Platform. 

Actualmente soy Experto Mobile en ueno bank (ITTI S.A.E.C.A.), donde lideré la migración arquitectónica a un ecosistema multi-repo de Micro-App y App Shell que coordina a más de 50 ingenieros Flutter, unifiqué las aplicaciones insignia de banca minorista y empresarial, implementé Release Trains automatizados de 15 días hacia Apple App Store, Google Play y Huawei AppGallery, y fortalecí la postura de seguridad con RASP para fintech. En mi trayectoria previa logré 100 % de cobertura de tests en el backend FastAPI de PairTree (plataforma de habilitación de adopciones), entregué microservicios con Riverpod y Nest.js en Tandamos, construí pipelines empresariales de mensajería GCP Pub/Sub en Valtech, y durante una década desarrollé soluciones móviles e IoT a medida (incluidas redes de carga de vehículos eléctricos OCPP 1.6 y dispositivos de telemetría RS485 comercializados) con cero rechazos en las tiendas de aplicaciones.`,
  education: {
    degree: 'Ingeniero Electrónico (Ingeniería Eléctrica y Electrónica)',
    institution: 'Universidad Tecnológica Nacional (UTN) — Facultad Regional San Francisco',
    period: '2000 – 2020',
    capstone: 'Smart Lub: un dispositivo electrónico para Vulcano Lubricación que lee datos de equipos por RS485, los envía por Ethernet o Wi-Fi y los almacena en una base de datos en la nube para su visualización. Puesto en marcha y comercializado.'
  },
  stats: [
    { label: 'Experiencia en ingeniería', value: '14+ años', change: '5+ años de liderazgo en Flutter' },
    { label: 'Ingenieros mobile escalados', value: '50+', change: 'Arquitectura Micro-App' },
    { label: 'Release Train predecible', value: '15 días', change: 'Codemagic automatizado' },
    { label: 'Cobertura backend FastAPI', value: '100%', change: 'Tasa de regresiones cero' },
    { label: 'Publicaciones en tiendas', value: '0 rechazos', change: 'iOS, Android y Huawei' },
  ],
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:eugeniotesio@gmail.com'
  }
};

export const CAPABILITIES: SkillCapability[] = [
  {
    id: 'mobile-architecture',
    title: 'Arquitectura Micro-App y App Shell',
    shortDescription: 'Migración de monolitos complejos a micro-apps modulares multi-repo. Armonización de BLoC y Riverpod en equipos de ingeniería de gran escala.',
    category: 'mobile',
    icon: 'Layers',
    badge: 'Sistemas móviles',
    evidenceKey: 'itti-ueno',
    skills: ['Flutter', 'Dart', 'BLoC', 'Riverpod', 'Micro-Apps', 'App Shell', 'Modular Routing']
  },
  {
    id: 'backend-apis',
    title: 'Backends resilientes en Python y Java',
    shortDescription: 'Arquitectura de APIs de alto rendimiento con FastAPI y Spring Boot. Tests basados en fixtures con 100 % de cobertura y migraciones sin downtime.',
    category: 'backend',
    icon: 'Server',
    badge: 'Alto rendimiento',
    evidenceKey: 'pairtree',
    skills: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'SQLAlchemy', 'Alembic', 'PostgreSQL', 'Node.js Fastify']
  },
  {
    id: 'devsecops-release',
    title: 'Release Train móvil automatizado de 15 días',
    shortDescription: 'Firma y distribución automatizada multi-tienda en Apple App Store, Google Play Store y Huawei AppGallery con Codemagic y GitHub Actions.',
    category: 'devops',
    icon: 'Cpu',
    badge: 'CI/CD y entrega',
    evidenceKey: 'itti-release',
    skills: ['Codemagic', 'GitHub Actions', 'Fastlane', 'App Store Connect', 'Google Play Console', 'Huawei AppGallery']
  },
  {
    id: 'fintech-security',
    title: 'Seguridad móvil fintech y RASP',
    shortDescription: 'Ingeniería de Runtime Application Self-Protection (RASP), detección en tiempo real de jailbreak y root, WebViews endurecidas y gates SAST con Checkmarx/Sonar.',
    category: 'security',
    icon: 'ShieldCheck',
    badge: 'DevSecOps',
    evidenceKey: 'itti-security',
    skills: ['RASP', 'Root Detection', 'Secure WebView', 'SonarQube', 'Checkmarx SAST', 'Biometrics']
  },
  {
    id: 'ai-engineering',
    title: 'Flujos de ingeniería aumentados con IA',
    shortDescription: 'Flujos de desarrollo multiagente con Cursor y GitHub Copilot para acelerar la entrega, el refactoring arquitectónico y la consistencia en code review.',
    category: 'ai',
    icon: 'Sparkles',
    badge: 'IA multiagente',
    evidenceKey: 'itti-ai',
    skills: ['Multi-Agent AI', 'Cursor', 'GitHub Copilot', 'Spec-Driven Development (SDD)', 'Automated Refactoring']
  },
  {
    id: 'observability-telemetry',
    title: 'Observabilidad y confiabilidad móvil',
    shortDescription: 'Triage en producción en tiempo real, seguimiento de crash velocity y dashboards de telemetría personalizados con New Relic, Instabug y Sentry.',
    category: 'devops',
    icon: 'Activity',
    badge: 'Observabilidad',
    evidenceKey: 'pairtree-sentry',
    skills: ['New Relic', 'Instabug', 'Sentry', 'Crashlytics', 'Google Logging', 'Prometheus']
  },
  {
    id: 'iot-embedded',
    title: 'Telemetría de hardware e IoT industrial',
    shortDescription: 'Traducción de señales de bus físico (RS485 Modbus, cargadores EV OCPP 1.6) a backends event-driven seguros con WebSocket y nube.',
    category: 'iot',
    icon: 'Radio',
    badge: 'Electrónica e IoT',
    evidenceKey: 'smart-lub',
    skills: ['RS485 Serial', 'OCPP 1.6', 'WebSockets', 'Embedded C/C++', 'Microcontrollers', 'GCP Pub/Sub']
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'itti-ueno',
    role: 'Experto Mobile',
    company: 'ITTI S.A.E.C.A. | ueno bank',
    location: 'San Francisco / Remoto',
    period: 'Sep. 2023 – Actualidad',
    current: true,
    summary: 'Autoridad arquitectónica líder en escalabilidad de banca móvil, aceleración con IA multiagente y entrega automatizada en el ecosistema bancario insignia.',
    featuredStat: {
      value: '50+ ingenieros',
      label: 'Habilitados con arquitectura Micro-App'
    },
    backedCapabilities: [
      'mobile-architecture',
      'devsecops-release',
      'fintech-security',
      'ai-engineering',
      'observability-telemetry'
    ],
    bulletPoints: [
      {
        category: 'Arquitectura y escalabilidad',
        text: 'Lideré la migración arquitectónica de la plataforma móvil de ueno bank de un monolito a una arquitectura multi-repo Micro-App y App Shell, agilizando el desarrollo concurrente de más de 50 ingenieros Flutter.',
        metrics: 'Más de 50 ingenieros Flutter coordinados sin cuellos de botella de merge',
        capabilityTag: 'Micro-App y App Shell'
      },
      {
        category: 'Unificación del ecosistema insignia',
        text: 'Colideré la consolidación de las apps bancarias Empresas (corporativa) e Individuos (minorista), armonizando las arquitecturas BLoC y Riverpod entre más de 300 stakeholders transversales.',
        metrics: '2 productos bancarios insignia unificados en 1 design system escalable',
        capabilityTag: 'Armonización BLoC + Riverpod'
      },
      {
        category: 'Ingeniería aumentada con IA',
        text: 'Impulsé flujos de desarrollo multiagente con Cursor y GitHub Copilot para acelerar la entrega, el refactoring arquitectónico y la consistencia en code review.',
        metrics: 'Reducción drástica del ciclo de refactoring arquitectónico',
        capabilityTag: 'Flujos de IA multiagente'
      },
      {
        category: 'Release engineering y despliegues en tiendas',
        text: 'Establecí un Release Train predecible de 15 días con pipelines CD automatizados en Codemagic para firma y distribución multi-tienda en Apple App Store, Google Play Store y Huawei AppGallery.',
        metrics: 'Releases automatizados quincenales en 3 tiendas globales',
        capabilityTag: 'Release Train de 15 días'
      },
      {
        category: 'Automatización de CI, calidad y seguridad',
        text: 'Implementé CI con GitHub Actions en cada push y PR de los micro-repositorios, exigiendo unit tests, Dart analyzer, Sonar y gates SAST de Checkmarx.',
        metrics: '100 % de PRs con gates de verificación obligatorios',
        capabilityTag: 'Calidad CI/CD y SAST'
      },
      {
        category: 'Endurecimiento de seguridad fintech',
        text: 'Integré RASP para detección en tiempo real de jailbreak/root, remedié vulnerabilidades centrales e implementé un componente WebView seguro de nivel empresarial.',
        metrics: 'Protección frente a manipulación en runtime e ingeniería inversa',
        capabilityTag: 'RASP y seguridad fintech'
      },
      {
        category: 'Observabilidad y confiabilidad',
        text: 'Mejoré el uptime en producción y el triage al integrar Instabug y dashboards móviles especializados de New Relic con consultas de telemetría.',
        metrics: 'Seguimiento de crash velocity en tiempo real y diagnóstico rápido de incidentes',
        capabilityTag: 'Telemetría móvil y APM'
      },
      {
        category: 'BFF y despliegue en la nube',
        text: 'Construí servicios Backend-for-Frontend de alto rendimiento con Fastify (Node.js) en NullPlatform, optimizando la eficiencia de payloads y el rendimiento de red móvil.',
        metrics: 'Menor latencia móvil y menor ancho de banda de payload',
        capabilityTag: 'BFF Fastify Node.js'
      },
      {
        category: 'Liderazgo técnico y cultura',
        text: 'Promoví Spec-Driven Development (SDD), obtuve el reconocimiento Hackathon Champion y lideré los estándares de ingeniería móvil, lo que derivó en la promoción de Tech Lead a Experto Mobile.',
        metrics: 'Hackathon Champion y promoción a Experto Mobile',
        capabilityTag: 'Liderazgo técnico'
      }
    ],
    technologies: [
      'Flutter', 'Dart', 'BLoC', 'Riverpod', 'Micro-Apps', 'App Shell Architecture',
      'Multi-Agent AI (Cursor, Copilot)', 'Codemagic', 'GitHub Actions', 'CI/CD',
      'Sonar', 'Checkmarx', 'Node.js', 'Fastify', 'NullPlatform', 'RASP',
      'Mobile Security', 'New Relic', 'Instabug', 'App Store Connect',
      'Google Play Console', 'Huawei AppGallery', 'Spec-Driven Development'
    ]
  },
  {
    id: 'pairtree',
    role: 'Desarrollador Full Stack',
    company: 'PairTree',
    location: 'Seattle, WA (Remoto)',
    period: 'Jun. 2022 – May. 2023',
    summary: 'Desarrollé funcionalidades full-stack para PairTree, una plataforma de habilitación de adopciones que conecta profesionales licenciados, familias adoptantes y madres gestantes — impulsando Connect Pro (colaboración profesional a nivel nacional), Home Base (gestión de home study) y la experiencia móvil PairTree Family. Entregué clientes Flutter con BLoC y golden widget tests, y mantuve servicios backend FastAPI con 100 % de cobertura. La empresa cesó operaciones y la app ya no está disponible.',
    featuredStat: {
      value: '100 % de cobertura',
      label: 'Backend FastAPI con fixtures de Pytest'
    },
    backedCapabilities: [
      'mobile-architecture',
      'backend-apis',
      'devsecops-release',
      'observability-telemetry'
    ],
    bulletPoints: [
      {
        category: 'Plataforma móvil de adopción',
        text: 'Desarrollé apps Flutter con BLoC para PairTree Family — flujos de tareas de home study, matching de perfiles y herramientas para profesionales de adopción, con tests unitarios, de widget, de integración y golden.',
        metrics: 'Seguridad de regresión visual pixel-perfect con Golden Tests en cada release',
        capabilityTag: 'Flutter BLoC y Golden Tests'
      },
      {
        category: 'Automatización CI/CD',
        text: 'Construí pipelines de GitHub Actions para test y deploy automatizados en servicios móviles y de backend, acortando los ciclos de feedback en review.',
        metrics: 'Suites de tests automatizados ejecutadas en cada commit',
        capabilityTag: 'Automatización GitHub Actions'
      },
      {
        category: 'Calidad de backend',
        text: 'Contribuí a servicios FastAPI que respaldan flujos de home study y colaboración profesional, con SQLAlchemy, Alembic y 100 % de cobertura pytest mediante fixtures para tests funcionales y de regresión.',
        metrics: '100 % de cobertura de código lograda y mantenida',
        capabilityTag: 'FastAPI con 100 % de cobertura'
      },
      {
        category: 'Confiabilidad',
        text: 'Seguí defectos con Sentry y colaboré con desarrolladores para diagnosticar y resolver incidentes de producción en servicios móviles y de API.',
        metrics: 'Cero excepciones de producción sin monitoreo',
        capabilityTag: 'Seguimiento de errores con Sentry'
      }
    ],
    technologies: [
      'Flutter', 'Dart', 'BLoC', 'Beamer', 'GitHub Actions', 'CI/CD',
      'FastAPI', 'Python', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'Docker', 'Sentry'
    ]
  },
  {
    id: 'tandamos',
    role: 'Desarrollador Full Stack',
    company: 'Tandamos',
    period: 'Feb. 2022 – May. 2023',
    summary: 'Desarrollé aplicaciones Flutter orientadas al cliente con Riverpod y backends escalables Nest.js en TypeScript con TypeORM y sincronización Firebase.',
    featuredStat: {
      value: 'Riverpod + Nest.js',
      label: 'Entrega full stack multiplataforma'
    },
    backedCapabilities: [
      'mobile-architecture',
      'backend-apis'
    ],
    bulletPoints: [
      {
        category: 'App de cliente',
        text: 'Entregué una app Flutter orientada al cliente con Riverpod y componentes de UI reutilizables, mejorando la consistencia entre pantallas.',
        metrics: 'Design system multiplataforma reutilizado en más de 30 vistas',
        capabilityTag: 'Gestión de estado con Riverpod'
      },
      {
        category: 'Mejora de backend',
        text: 'Extendí servicios Nest.js / TypeScript y una capa TypeORM sobre MySQL, simplificando el acceso a datos.',
        metrics: 'Relaciones de esquema optimizadas y capa de acceso a datos simplificada',
        capabilityTag: 'Backend Nest.js y TypeScript'
      },
      {
        category: 'Calidad y plataforma',
        text: 'Agregué tests automatizados unitarios, de widget y de integración; usé Firebase para autenticación y sync; extraje funciones Node.js reutilizables, reduciendo redundancia.',
        metrics: 'Suite de tests automatizados y sync de Firebase simplificado',
        capabilityTag: 'Firebase y tests automatizados'
      }
    ],
    technologies: [
      'Flutter', 'Dart', 'Riverpod', 'Nest.js', 'TypeScript', 'TypeORM', 'MySQL', 'Docker', 'Firebase'
    ]
  },
  {
    id: 'valtech',
    role: 'Desarrollador Backend',
    company: 'Valtech',
    period: 'Sep. 2021 – Feb. 2022',
    summary: 'Desarrollé microservicios Spring Boot de misión crítica en Google Cloud Platform para enrutamiento de correo empresarial y pipelines de comunicaciones.',
    featuredStat: {
      value: 'Google Cloud Platform',
      label: 'Mensajería Spring Boot + Pub/Sub'
    },
    backedCapabilities: [
      'backend-apis',
      'observability-telemetry'
    ],
    bulletPoints: [
      {
        category: 'Plataforma de email',
        text: 'Construí un servicio Spring Boot para que los sistemas internos enviaran email vía Google Pub/Sub y Oracle Responsys, mejorando confiabilidad y escala de entrega.',
        metrics: 'Procesamiento de colas de eventos de alto rendimiento con cero pérdida de paquetes',
        capabilityTag: 'Spring Boot y Google Pub/Sub'
      },
      {
        category: 'APIs y calidad',
        text: 'Expuse APIs RESTful, agregué tests unitarios y de integración, y resolví defectos y conflictos con terceros a lo largo del ciclo de vida de la aplicación.',
        metrics: 'Circuit breakers Resilience4j y reintentos fail-safe',
        capabilityTag: 'APIs RESTful empresariales'
      },
      {
        category: 'Colaboración',
        text: 'Colaboré con desarrolladores y stakeholders para publicar el servicio y adoptar herramientas que mejoraron la funcionalidad.',
        metrics: 'Entrega a tiempo con puentes de Google DialogFlow y Twilio',
        capabilityTag: 'Ingeniería transversal'
      }
    ],
    technologies: [
      'Spring Boot', 'Oracle Responsys', 'Google App Engine', 'Google Pub/Sub',
      'Google Logging', 'Google DialogFlow', 'Express', 'Twilio', 'Resilience4j', 'Thymeleaf'
    ]
  },
  {
    id: 'freelance',
    role: 'Desarrollador Full Stack',
    company: 'Freelance y contratación',
    period: 'Abr. 2011 – Ago. 2021',
    summary: 'Una década entregando aplicaciones móviles y backends de extremo a extremo, incluidas redes de carga EV OCPP 1.6, despliegues en GCP y cero rechazos en tiendas.',
    featuredStat: {
      value: '10 años',
      label: '0 rechazos en tiendas iOS y Android'
    },
    backedCapabilities: [
      'mobile-architecture',
      'backend-apis',
      'iot-embedded'
    ],
    bulletPoints: [
      {
        category: 'Apps móviles y web',
        text: 'Entregué apps Flutter con Provider, BLoC, Riverpod y GetX, con tests unitarios, de widget, golden y de integración.',
        metrics: 'Cobertura integral de tests de UI en apps de clientes diversos',
        capabilityTag: 'Dominio multi-patrón en Flutter'
      },
      {
        category: 'Backends Java',
        text: 'Construí sistemas Spring Boot con Security, OAuth2, WebSockets, Actuator, Swagger y almacenamiento/mensajería GCP.',
        metrics: 'OAuth2 de nivel empresarial y streaming WebSocket',
        capabilityTag: 'Spring Boot OAuth2'
      },
      {
        category: 'Servicios Python',
        text: 'Construí backends Flask/FastAPI con WebSockets, SQLAlchemy, asyncio, Pydantic y migraciones Alembic.',
        metrics: 'Arquitecturas backend Python asíncronas de alto rendimiento',
        capabilityTag: 'Python asíncrono y FastAPI'
      },
      {
        category: 'Publicaciones en tiendas',
        text: 'Publiqué apps móviles en Google Play y App Store sin rechazos.',
        metrics: 'Historial impecable de cumplimiento en más de 10 revisiones de tienda',
        capabilityTag: 'Experto en cumplimiento de tiendas'
      },
      {
        category: 'Entrega de dominio (IoT y EV)',
        text: 'Integré cargadores EV OCPP 1.6; relevé requisitos; formé desarrolladores; lideré despliegues a gran escala.',
        metrics: 'Hardware físico de carga EV conectado a controladores en la nube',
        capabilityTag: 'Integración EV OCPP 1.6'
      }
    ],
    technologies: [
      'Flutter', 'Dart', 'Riverpod', 'Android Native', 'Spring Boot', 'Python',
      'FastAPI', 'WebSockets', 'Angular', 'Google App Engine', 'Google Pub/Sub',
      'Google Logging', 'MySQL', 'Docker', 'Firebase', 'Sentry'
    ]
  },
  {
    id: 'utn-education',
    role: 'Ingeniero Electrónico (proyecto de graduación: Smart Lub)',
    company: 'Universidad Tecnológica Nacional (UTN)',
    period: '2000 – 2020',
    summary: 'Graduado como Ingeniero Electrónico. Diseñé Smart Lub para Vulcano Lubricación: un dispositivo físico de telemetría que lee datos de equipos por RS485 y los envía por Ethernet/Wi-Fi a bases de datos en la nube.',
    featuredStat: {
      value: 'Smart Lub',
      label: 'Dispositivo industrial RS485 comercializado'
    },
    backedCapabilities: [
      'iot-embedded'
    ],
    bulletPoints: [
      {
        category: 'Ingeniería de hardware y embebidos',
        text: 'Diseñé y construí el dispositivo electrónico para Vulcano Lubricación que captura telemetría de equipos industriales sobre buses diferenciales RS485.',
        metrics: 'Producto de telemetría industrial comercializado',
        capabilityTag: 'Hardware y firmware RS485'
      },
      {
        category: 'Ingesta de red y nube',
        text: 'Diseñé el stack de red para transmitir datos de sensores industriales por Ethernet o Wi-Fi a una base de datos remota para visualización en dashboards.',
        metrics: 'Cero pérdida de paquetes bajo ruido industrial severo',
        capabilityTag: 'Pipeline hardware-a-nube'
      }
    ],
    technologies: ['RS485', 'Embedded Systems', 'Ethernet', 'Wi-Fi', 'Microcontrollers', 'C/C++', 'Database Ingestion']
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'ueno-bank',
    title: 'Ecosistema móvil ueno bank y App Shell Micro-App',
    tagline: 'Plataforma de banca digital empresarial que unifica banca minorista y corporativa entre más de 50 ingenieros Flutter.',
    category: 'mobile',
    categoryLabel: 'Mobile y Flutter',
    featured: true,
    bannerGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    technologies: ['Flutter', 'Dart', 'BLoC', 'Riverpod', 'Micro-Apps', 'App Shell', 'Fastify', 'RASP', 'Codemagic'],
    metrics: [
      { label: 'Ingenieros concurrentes', value: '50+' },
      { label: 'Ciclo de Release Train', value: '15 días' },
      { label: 'Cobertura de tiendas', value: 'iOS, Android y Huawei' },
      { label: 'Modelo de arquitectura', value: 'Shell multi-repo' }
    ],
    overview: 'La aplicación móvil insignia de banca de ueno bank, que procesa millones de transacciones. Eugenio lideró la transición arquitectónica de un monolito sobredimensionado a una estructura autónoma de Micro-App y App Shell, permitiendo que squads independientes desplieguen sin cuellos de botella por conflictos de merge.',
    challenge: 'Un codebase monolítico masivo sufría horas de cola de builds de CI, colisiones constantes de merge entre más de 50 ingenieros y librerías de estado en conflicto (BLoC vs Riverpod) en distintos módulos de funcionalidad.',
    solution: 'Diseñé e implementé la arquitectura Micro-App con un App Shell centralizado a cargo de autenticación, navegación y guards de seguridad. Estandaricé contratos entre módulos y establecí Release Trains automatizados con Codemagic.',
    architectureHighlights: [
      'Micro-apps desacopladas que compilan de forma independiente con runners aislados',
      'Event bus entre módulos basado en contratos para evitar dependencias circulares',
      'Release Train automatizado quincenal de 15 días con firma automática en tiendas',
      'RASP (Runtime Application Self-Protection) embebido y sandboxes de WebView seguras',
      'BFF (Backend-For-Frontend) personalizado en Fastify Node.js para optimizar payloads de red'
    ],
    results: [
      'Más de 50 desarrolladores Flutter commiteando en paralelo sin bloqueos del monolito',
      'Tiempo de verificación de release reducido de 8 días hábiles a menos de 24 horas',
      'Cero brechas de seguridad o bypasses de root reportados en producción'
    ],
    links: [
      { label: 'Portal ueno bank', url: 'https://uenobank.com.py', type: 'live' }
    ]
  },
  {
    id: 'pairtree-adoption',
    title: 'Plataforma de habilitación de adopciones PairTree',
    tagline: 'Plataforma full-stack de adopción que conecta profesionales, familias y madres gestantes — app Flutter con backend FastAPI al 100 % de cobertura.',
    category: 'mobile',
    categoryLabel: 'Mobile y Flutter',
    featured: true,
    bannerGradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    technologies: ['FastAPI', 'Python', 'Flutter', 'BLoC', 'SQLAlchemy', 'Alembic', 'PostgreSQL', 'Docker', 'Sentry'],
    metrics: [
      { label: 'Cobertura de tests de backend', value: '100%' },
      { label: 'Seguridad de regresión de UI', value: 'Golden Tests' },
      { label: 'Migraciones de base de datos', value: 'Sin downtime' },
      { label: 'Seguimiento de errores', value: 'Monitoreado con Sentry' }
    ],
    overview: 'PairTree fue una plataforma de habilitación de adopciones con sede en Seattle que conectaba profesionales licenciados, familias adoptantes y madres gestantes. Impulsaba Connect Pro (colaboración profesional a nivel nacional), Home Base (gestión de home study) y la app móvil PairTree Family — centralizando tareas de home study, matching por personalidad, apoyo legal y recursos post-adopción en un entorno seguro y libre de estafas. La empresa cesó operaciones y la app ya no está disponible.',
    challenge: 'La adopción privada en EE. UU. depende de procesos fragmentados y analógicos entre profesionales licenciados, familias y madres gestantes, con honorarios altos, plazos largos y poca interoperabilidad entre proveedores. PairTree necesitaba una plataforma digital segura que agilizara los home studies, habilitara colaboración profesional nacional y ofreciera una experiencia móvil confiable, sin tolerancia a errores de regresión en el backend.',
    solution: 'Desarrollé clientes móviles Flutter BLoC para PairTree Family con Golden Tests de regresión a nivel de píxel. Construí microservicios backend FastAPI para flujos de home study y colaboración profesional, con fixtures Pytest exhaustivos que mantuvieron 100 % de cobertura en todas las rutas y migraciones de base de datos.',
    architectureHighlights: [
      'Base de datos centralizada Connect Pro para colaboración nacional entre profesionales de adopción licenciados',
      'Gestión de home study Home Base con guía de tareas paso a paso según el estado',
      'App móvil PairTree Family para tareas de home study, matching y servicios de apoyo',
      'Fixtures transaccionales de rollback para ejecución rápida de pytest en memoria',
      'Golden Tests de UI para evitar roturas visuales inesperadas ante actualizaciones del SO móvil',
      'Pipelines de seguridad de migraciones Alembic ejecutados en GitHub Actions antes del deploy a staging'
    ],
    results: [
      '100 % de cobertura de código verificada en cada pull request',
      'Cero regresiones críticas de backend reportadas durante 12 meses consecutivos',
      'Plataforma unificada de adopción que reemplazó flujos analógicos fragmentados'
    ],
    links: [
      { label: 'PairTree (LinkedIn)', url: 'https://www.linkedin.com/company/pairtree/', type: 'docs' }
    ]
  },
  {
    id: 'tandamos-fintech',
    title: 'Plataforma fintech de ahorro comunitario Tandamos',
    tagline: 'Plataforma financiera colaborativa de grupos construida con Flutter Riverpod y servicios Nest.js en TypeScript.',
    category: 'mobile',
    categoryLabel: 'Mobile y Flutter',
    featured: false,
    bannerGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    technologies: ['Flutter', 'Riverpod', 'Nest.js', 'TypeScript', 'TypeORM', 'MySQL', 'Firebase', 'Docker'],
    metrics: [
      { label: 'Gestión de estado', value: 'Riverpod' },
      { label: 'Stack de backend', value: 'Nest.js / TypeORM' },
      { label: 'Sync en tiempo real', value: 'Motor Firebase' }
    ],
    overview: 'Aplicación fintech moderna para pools rotativos de ahorro comunitario (tandas). Diseñada para máxima transparencia, alertas programadas de aportes e integraciones de billetera digital.',
    challenge: 'Se necesitaba un design system cohesivo que se comportara de forma fluida en Android e iOS, con sincronización de saldos en tiempo real e identificación segura de usuarios.',
    solution: 'Desarrollé la app móvil con Riverpod para actualizaciones de estado granulares. Construí un backend Nest.js estructurado con TypeORM sobre MySQL e integré Firebase Authentication y Cloud Messaging para notificaciones instantáneas.',
    architectureHighlights: [
      'Listeners de estado declarativos con providers Riverpod para actualizaciones de saldo reactivas',
      'Relaciones de entidades TypeORM limpias con indexación para consultas rápidas',
      'Suite automatizada de tests de widget e integración ejecutada en contenedores Docker'
    ],
    results: [
      'Lanzamiento al cliente a tiempo con recepción de 4.8 estrellas',
      '40 % menos de código boilerplate mediante paquetes utilitarios Node.js modulares'
    ]
  },
  {
    id: 'valtech-email-engine',
    title: 'Despachador de mensajería empresarial a escala (Valtech)',
    tagline: 'Pipeline de eventos Spring Boot de alto rendimiento que integra Google Pub/Sub con Oracle Responsys y DialogFlow.',
    category: 'backend',
    categoryLabel: 'Backend y APIs',
    featured: false,
    bannerGradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    technologies: ['Spring Boot', 'Java', 'Google Pub/Sub', 'Oracle Responsys', 'DialogFlow', 'Resilience4j', 'GCP'],
    metrics: [
      { label: 'Motor de mensajes', value: 'Google Pub/Sub' },
      { label: 'Resiliencia', value: 'Circuit breakers' },
      { label: 'Hosting', value: 'GCP App Engine' }
    ],
    overview: 'Gateway de comunicaciones de alto volumen que permite a aplicaciones empresariales multi-tenant despachar emails transaccionales y respuestas conversacionales impulsadas por IA.',
    challenge: 'Los límites de tasa de proveedores de entrega de terceros y las fallas transitorias de conexión amenazaban los SLAs de entrega de mensajes para avisos al cliente con sensibilidad temporal.',
    solution: 'Diseñé un pipeline asíncrono desacoplado en Spring Boot usando colas Google Pub/Sub, circuit breakers Resilience4j, políticas de reintento automatizadas y logs de auditoría estructurados.',
    architectureHighlights: [
      'Arquitectura publisher/subscriber desacoplada que evita colapsos por backpressure',
      'Integración con Oracle Responsys y fallbacks SMS de Twilio',
      'Manejo de webhooks de lenguaje natural con Google DialogFlow para plantillas de email dinámicas'
    ],
    results: [
      'Picos de cientos de miles de notificaciones diarias sin pérdida de paquetes',
      'Recuperación elegante de fallos con reprocesamiento automatizado de dead-letter queues'
    ]
  },
  {
    id: 'smart-lub-iot',
    title: 'Dispositivo industrial de telemetría RS485 Smart Lub',
    tagline: 'Dispositivo IoT industrial comercializado que captura telemetría de equipos por RS485 y la transmite a bases de datos en la nube.',
    category: 'iot',
    categoryLabel: 'IoT y hardware',
    featured: true,
    bannerGradient: 'from-amber-500/20 via-red-500/10 to-transparent',
    technologies: ['RS485', 'Modbus', 'C/C++', 'Ethernet / Wi-Fi', 'Microcontrollers', 'Cloud Databases'],
    metrics: [
      { label: 'Capa física', value: 'Bus serial RS485' },
      { label: 'Estado', value: 'Producto comercializado' },
      { label: 'Cliente', value: 'Vulcano Lubricación' }
    ],
    overview: 'Proyecto de graduación encargado por Vulcano Lubricación en UTN San Francisco. Un dispositivo electrónico de hardware que monitorea parámetros de lubricación de maquinaria pesada sobre buses seriales RS485 y transmite datos por Ethernet/Wi-Fi a backends en la nube.',
    challenge: 'Los entornos de fábrica están saturados de interferencia electromagnética (EMI). Los paquetes de datos debían capturarse con precisión desde sensores remotos y almacenarse de forma segura durante cortes de red en planta.',
    solution: 'Desarrollé firmware personalizado para microcontrolador con verificación de errores CRC, transceptores diferenciales RS485 y drivers robustos de failover Ethernet/Wi-Fi. Implementé buffering local de paquetes en EEPROM para reenvío a la nube sin pérdidas.',
    architectureHighlights: [
      'Rechazo de ruido a nivel de hardware y decodificación de señal serial diferencial',
      'Protocolo de transmisión de paquetes idempotente sobre TCP/IP',
      'Transición de prototipo académico a producto comercial certificado'
    ],
    results: [
      'Puesto en marcha y comercializado por Vulcano Lubricación para clientes industriales',
      'Título de Ingeniero Electrónico otorgado por la UTN'
    ]
  },
  {
    id: 'ocpp-ev-network',
    title: 'Red de estaciones de carga de vehículos eléctricos OCPP 1.6',
    tagline: 'Controlador de infraestructura de carga EV inteligente con WebSockets en Python y monitoreo en tiempo real con Flutter.',
    category: 'iot',
    categoryLabel: 'IoT y hardware',
    featured: false,
    bannerGradient: 'from-blue-500/20 via-emerald-500/10 to-transparent',
    technologies: ['OCPP 1.6', 'Python', 'WebSockets', 'Flutter', 'Docker', 'FastAPI', 'PostgreSQL'],
    metrics: [
      { label: 'Protocolo', value: 'OCPP 1.6-J (JSON)' },
      { label: 'Transporte', value: 'WebSockets seguros (WSS)' },
      { label: 'Monitoreo en vivo', value: 'Dashboard Flutter' }
    ],
    overview: 'Sistema central de gestión (CSMS) para cargadores de vehículos eléctricos en red que se comunican mediante el protocolo OCPP 1.6. Ofrecía estado de carga en vivo, medición de facturación y control remoto de reinicio.',
    challenge: 'Sincronizar telemetría de alta frecuencia de voltaje, amperaje y kilovatios-hora entre decenas de postes de carga físicos, permitiendo a los operadores disparar comandos remotos de inicio/parada en menos de 200 milisegundos.',
    solution: 'Desarrollé un gateway asíncrono Python WebSocket que mantiene conexiones TLS persistentes con el hardware de carga. Lo emparejé con un dashboard administrativo Flutter para técnicos y conductores EV.',
    architectureHighlights: [
      'Event loop asíncrono para frames JSON bidireccionales OCPP 1.6',
      'Cálculos de medición en tiempo real y conciliación automatizada de facturación',
      'Dashboard Flutter multiplataforma para diagnóstico remoto de cargadores'
    ],
    results: [
      'Desplegado en hubs de estacionamiento comercial multi-sede con 99.9 % de confiabilidad de red',
      'Actualizaciones remotas instantáneas de firmware y limitación de potencia'
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'large-scale-flutter-banking-architecture',
    title: 'Arquitectura de una app Flutter bancaria a gran escala para más de 50 ingenieros',
    excerpt: 'App shell, micro-apps, registro de capacidades y estructura de paquetes internos — cómo los squads se integran y se comunican sin importarse entre sí.',
    date: '4 sep 2026',
    readTime: '14 min de lectura',
    category: 'Arquitectura',
    tags: ['Flutter', 'Banking', 'Micro-Apps', 'App Shell', 'Architecture'],
    author: 'Eugenio Tesio',
    filename: 'large-scale-flutter-banking-architecture.html',
    format: 'html'
  },
  {
    slug: 'rasp-mobile-security',
    title: 'Endurecimiento móvil fintech: implementación de RASP, detección de root y WebViews seguras',
    excerpt: 'RASP en el app shell, postura multi-vector y WebViews en sandbox — cómo un binario bancario trata el teléfono como hostil sin cincuenta chequeos de jailbreak por squad.',
    date: '5 dic 2024',
    readTime: '13 min de lectura',
    category: 'Seguridad',
    tags: ['RASP', 'Security', 'Fintech', 'Flutter', 'Root Detection'],
    author: 'Eugenio Tesio',
    filename: 'rasp-mobile-security.html',
    format: 'html'
  },
  {
    slug: 'iot-rs485-to-cloud',
    title: 'De RS485 y OCPP 1.6 a backends en la nube: lecciones de telemetría IoT industrial',
    excerpt: 'CRC en el cable, logs duraderos en el edge e ingesta idempotente — cómo Smart Lub y OCPP 1.6 sobreviven EMI, apagones y replay sin inventar medición.',
    date: '20 feb 2025',
    readTime: '12 min de lectura',
    category: 'IoT y sistemas',
    tags: ['IoT', 'RS485', 'Hardware', 'OCPP 1.6', 'Embedded'],
    author: 'Eugenio Tesio',
    filename: 'iot-rs485-to-cloud.html',
    format: 'html'
  }
];
