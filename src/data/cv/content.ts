export interface CvSkillGroup {
  label: string;
  skills: string[];
}

export interface CvImpactStat {
  value: string;
  title: string;
  detail: string;
}

export interface CvJob {
  role: string;
  company: string;
  location?: string;
  period: string;
  bullets: string[];
  technologies: string;
}

export interface CvProject {
  title: string;
  tag: string;
  detail: string;
}

export interface CvLanguage {
  name: string;
  level: string;
}

export interface CvContent {
  name: string;
  role: string;
  roleHeader: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  linkedinUrl: string;
  summary: string;
  sectionLabels: {
    impact: string;
    skills: string;
    summary: string;
    experience: string;
    experienceContinued: string;
    education: string;
    projects: string;
    languages: string;
    contact: string;
    contactLocation: string;
    contactEmail: string;
    contactPhone: string;
    contactLinkedin: string;
    pageOf: string;
  };
  impact: CvImpactStat[];
  skillGroups: CvSkillGroup[];
  experience: CvJob[];
  education: {
    degree: string;
    institution: string;
    period: string;
    detail: string;
  };
  projects: CvProject[];
  languages: CvLanguage[];
}

const contentEn: CvContent = {
  name: 'Eugenio Tesio',
  role: 'Mobile Expert & Systems Architect',
  roleHeader: 'MOBILE EXPERT & SYSTEMS ARCHITECT',
  location: 'San Francisco, Córdoba, Argentina',
  email: 'eugeniotesio@gmail.com',
  phone: '+54 9 3564 599945',
  linkedin: 'linkedin.com/in/eugenio-tesio',
  linkedinUrl: 'https://www.linkedin.com/in/eugenio-tesio/',
  summary:
    'Mobile Expert, Systems Architect, and Electronics Engineer with over 14 years building high-scale mobile platforms and resilient backends. Specialized in Flutter (BLoC & Riverpod), Python (FastAPI), Java (Spring Boot), GCP, and multi-agent AI engineering. At ueno bank (ITTI) through Nov 2026 he led architecture for 50+ Flutter engineers — Micro-App & App Shell, 15-day multi-store Release Trains, Fintech RASP, and AI-accelerated delivery.',
  sectionLabels: {
    impact: 'IMPACT IN NUMBERS',
    skills: 'CORE SKILLS',
    summary: 'PROFILE & EXECUTIVE SUMMARY',
    experience: 'PROFESSIONAL EXPERIENCE',
    experienceContinued: 'PROFESSIONAL EXPERIENCE (CONTINUED)',
    education: 'EDUCATION',
    projects: 'SELECTED PROJECTS',
    languages: 'LANGUAGES',
    contact: 'DIRECT CONTACT',
    contactLocation: 'LOCATION',
    contactEmail: 'EMAIL',
    contactPhone: 'PHONE',
    contactLinkedin: 'LINKEDIN',
    pageOf: 'Page {current} of {total}',
  },
  impact: [
    {
      value: '14+ Years',
      title: 'Engineering Career',
      detail: 'High-scale mobile platforms and resilient backends',
    },
    {
      value: '50+ Engineers',
      title: 'Architecture Leadership',
      detail: 'Flutter Micro-App & App Shell ecosystem at ueno bank (ITTI)',
    },
    {
      value: '15 Days',
      title: 'Release Train Cadence',
      detail: 'Continuous delivery to App Store, Google Play & AppGallery',
    },
    {
      value: 'AI + SDD',
      title: 'Multi-Agent Engineering',
      detail: 'Cursor, Copilot & SDD accelerating delivery',
    },
  ],
  skillGroups: [
    {
      label: 'Mobile',
      skills: ['Flutter', 'Dart', 'BLoC', 'Riverpod', 'Micro-Apps', 'App Shell'],
    },
    {
      label: 'Backend',
      skills: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'PostgreSQL', 'Nest.js'],
    },
    {
      label: 'DevOps',
      skills: ['Codemagic', 'GitHub Actions', 'Fastlane', 'Docker', 'Multi-store CD'],
    },
    {
      label: 'Security',
      skills: ['RASP', 'Root Detection', 'Secure WebView', 'SonarQube', 'Checkmarx'],
    },
    {
      label: 'AI & Observability',
      skills: ['SDD', 'Multi-agent AI', 'Cursor', 'Copilot', 'New Relic', 'Sentry'],
    },
    {
      label: 'IoT',
      skills: ['RS485', 'OCPP 1.6', 'WebSockets', 'Embedded C/C++', 'Pub/Sub'],
    },
  ],
  experience: [
    {
      role: 'Mobile Expert',
      company: 'ITTI S.A.E.C.A. | ueno bank',
      location: 'San Francisco / Remote',
      period: 'Sep 2023 – Nov 2026',
      bullets: [
        'Led the architectural migration from monolith to multi-repo Micro-App & App Shell, enabling concurrent development for 50+ Flutter engineers.',
        'Co-led consolidation of Individuos (retail) and Empresas (corporate) banking apps, harmonizing BLoC and Riverpod architectures across 300+ stakeholders.',
        'Established a predictable 15-day Release Train with automated Codemagic CD pipelines to Apple App Store, Google Play, and Huawei AppGallery.',
        'Hardened fintech security by integrating RASP for real-time jailbreak/root detection, enterprise secure WebView, and CI SAST gates (SonarQube & Checkmarx).',
        'Spec-Driven Development (SDD) & Multi-agent AI: Promoted and implemented SDD with Cursor and GitHub Copilot workflows to accelerate architectural refactoring and code-review consistency, leading mobile engineering standards (Hackathon Champion and promotion from Tech Lead to Mobile Expert).',
      ],
      technologies:
        'Flutter · Dart · BLoC · Riverpod · Micro-Apps · Spec-Driven Development (SDD) · Codemagic · GitHub Actions · Fastify · RASP · New Relic · Instabug',
    },
    {
      role: 'Full Stack Developer',
      company: 'PairTree',
      location: 'Seattle, WA (Remote)',
      period: 'Jun 2022 – May 2023',
      bullets: [
        'Built Flutter (BLoC) clients for adoption workflows with unit, widget, integration, and golden tests.',
        'Maintained FastAPI backends with SQLAlchemy/Alembic at 100% pytest coverage; automated CI/CD with GitHub Actions.',
        'Tracked production reliability with Sentry across mobile and API services.',
      ],
      technologies: 'Flutter · BLoC · FastAPI · Python · PostgreSQL · Docker · Sentry · GitHub Actions',
    },
    {
      role: 'Full Stack Developer',
      company: 'Tandamos',
      location: 'Remote',
      period: 'Feb 2022 – May 2023',
      bullets: [
        'Delivered customer-facing Flutter apps with Riverpod and a reusable UI component system.',
        'Extended Nest.js / TypeScript services with TypeORM over MySQL and Firebase auth/sync.',
      ],
      technologies: 'Flutter · Riverpod · Nest.js · TypeScript · TypeORM · MySQL · Firebase',
    },
    {
      role: 'Backend Developer',
      company: 'Valtech',
      location: 'Remote',
      period: 'Sep 2021 – Feb 2022',
      bullets: [
        'Built Spring Boot services for enterprise email via Google Pub/Sub and Oracle Responsys.',
        'Exposed REST APIs with Resilience4j circuit breakers; partnered with stakeholders for on-time delivery.',
      ],
      technologies: 'Spring Boot · Google Pub/Sub · App Engine · Oracle Responsys · Resilience4j',
    },
    {
      role: 'Full Stack Developer',
      company: 'Freelance & Contracting',
      location: 'San Francisco, Córdoba',
      period: 'Apr 2011 – Aug 2021',
      bullets: [
        'Delivered Flutter and native apps plus Spring Boot / FastAPI backends with zero store rejections.',
        'Integrated OCPP 1.6 EV charging networks and commercialized RS485 industrial telemetry (Smart Lub).',
      ],
      technologies: 'Flutter · Spring Boot · FastAPI · WebSockets · OCPP 1.6 · GCP · Docker · Firebase',
    },
  ],
  education: {
    degree: "Electronics Engineer (Electrical & Electronics Engineering)",
    institution: 'Universidad Tecnológica Nacional (UTN) — Facultad Regional San Francisco',
    period: '2000 – 2020',
    detail:
      'Graduation project — Smart Lub: RS485 industrial telemetry device for Vulcano Lubricación; Ethernet/Wi-Fi cloud sync; commissioned and commercialized.',
  },
  projects: [
    {
      title: 'ueno bank Micro-App Ecosystem',
      tag: 'Fintech Banking · Mobile Architecture',
      detail:
        'Enterprise banking platform unifying retail & corporate apps across 50+ Flutter engineers; 15-day multi-store Release Train.',
    },
    {
      title: 'PairTree Adoption Platform',
      tag: 'Full-Stack · Flutter & FastAPI',
      detail:
        'Full-stack Flutter + FastAPI adoption enablement platform with 100% backend test coverage.',
    },
    {
      title: 'Smart Lub & OCPP EV Network',
      tag: 'Industrial IoT · Electric Mobility',
      detail:
        'Commercial RS485 IoT device; OCPP 1.6 EV charging control with Python WebSockets and Flutter monitoring.',
    },
  ],
  languages: [
    { name: 'Spanish', level: 'Native' },
    { name: 'English', level: 'Professional' },
  ],
};

const contentEs: CvContent = {
  name: 'Eugenio Tesio',
  role: 'Experto Mobile y Arquitecto de Sistemas',
  roleHeader: 'EXPERTO MOBILE Y ARQUITECTO DE SISTEMAS',
  location: 'San Francisco, Córdoba, Argentina',
  email: 'eugeniotesio@gmail.com',
  phone: '+54 9 3564 599945',
  linkedin: 'linkedin.com/in/eugenio-tesio',
  linkedinUrl: 'https://www.linkedin.com/in/eugenio-tesio/',
  summary:
    'Experto Mobile, Arquitecto de Sistemas e Ingeniero Electrónico con más de 14 años construyendo plataformas móviles de alta escala y backends resilientes. Especializado en Flutter (BLoC y Riverpod), Python (FastAPI), Java (Spring Boot), GCP e ingeniería con IA multiagente. En ueno bank (ITTI) hasta nov. 2026 lideró la arquitectura para más de 50 ingenieros Flutter — Micro-App y App Shell, Release Trains de 15 días multi-tienda, RASP fintech y entrega acelerada con IA.',
  sectionLabels: {
    impact: 'IMPACTO EN CIFRAS',
    skills: 'COMPETENCIAS CLAVE',
    summary: 'PERFIL & RESUMEN EJECUTIVO',
    experience: 'EXPERIENCIA PROFESIONAL',
    experienceContinued: 'EXPERIENCIA PROFESIONAL (CONTINUACIÓN)',
    education: 'EDUCACIÓN',
    projects: 'PROYECTOS SELECCIONADOS',
    languages: 'IDIOMAS',
    contact: 'CONTACTO DIRECTO',
    contactLocation: 'UBICACIÓN',
    contactEmail: 'CORREO',
    contactPhone: 'TELÉFONO',
    contactLinkedin: 'LINKEDIN',
    pageOf: 'Página {current} de {total}',
  },
  impact: [
    {
      value: '14+ Años',
      title: 'Trayectoria en Ingeniería',
      detail: 'Plataformas móviles de alta escala y backends resilientes',
    },
    {
      value: '50+ Ingenieros',
      title: 'Liderazgo de Arquitectura',
      detail: 'Ecosistema Flutter Micro-App y App Shell en ueno bank (ITTI)',
    },
    {
      value: '15 Días',
      title: 'Cadencia Release Train',
      detail: 'Entrega continua en App Store, Google Play y AppGallery',
    },
    {
      value: 'IA + SDD',
      title: 'Ingeniería Multiagente',
      detail: 'Cursor, Copilot y SDD acelerando la entrega',
    },
  ],
  skillGroups: [
    {
      label: 'Mobile',
      skills: ['Flutter', 'Dart', 'BLoC', 'Riverpod', 'Micro-Apps', 'App Shell'],
    },
    {
      label: 'Backend',
      skills: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'PostgreSQL', 'Nest.js'],
    },
    {
      label: 'DevOps',
      skills: ['Codemagic', 'GitHub Actions', 'Fastlane', 'Docker', 'Multi-store CD'],
    },
    {
      label: 'Seguridad',
      skills: ['RASP', 'Root Detection', 'Secure WebView', 'SonarQube', 'Checkmarx'],
    },
    {
      label: 'IA y observabilidad',
      skills: ['SDD', 'IA multiagente', 'Cursor', 'Copilot', 'New Relic', 'Sentry'],
    },
    {
      label: 'IoT',
      skills: ['RS485', 'OCPP 1.6', 'WebSockets', 'Embedded C/C++', 'Pub/Sub'],
    },
  ],
  experience: [
    {
      role: 'Experto Mobile',
      company: 'ITTI S.A.E.C.A. | ueno bank',
      location: 'San Francisco / Remoto',
      period: 'Sep 2023 – Nov 2026',
      bullets: [
        'Lideré la migración arquitectónica de monolito a Micro-App y App Shell multi-repo, agilizando el desarrollo concurrente para más de 50 ingenieros Flutter.',
        'Colideré la consolidación de las apps bancarias Individuos (retail) y Empresas (corporativa), armonizando arquitecturas BLoC y Riverpod entre más de 300 stakeholders.',
        'Establecí un Release Train predecible de 15 días con pipelines CD automatizados en Codemagic hacia Apple App Store, Google Play y Huawei AppGallery.',
        'Endurecí la seguridad fintech integrando RASP para detección en tiempo real de jailbreak/root, WebView seguro empresarial y gates SAST en CI (SonarQube y Checkmarx).',
        'Spec-Driven Development (SDD) e IA Multiagente: Promoví e implementé SDD junto a flujos de desarrollo con Cursor y GitHub Copilot para acelerar el refactoring arquitectónico y la consistencia en code reviews, liderando estándares de ingeniería móvil (Hackathon Champion y promoción de Tech Lead a Experto Mobile).',
      ],
      technologies:
        'Flutter · Dart · BLoC · Riverpod · Micro-Apps · Spec-Driven Development (SDD) · Codemagic · GitHub Actions · Fastify · RASP · New Relic · Instabug',
    },
    {
      role: 'Desarrollador Full Stack',
      company: 'PairTree',
      location: 'Seattle, WA (Remoto)',
      period: 'Jun 2022 – May 2023',
      bullets: [
        'Desarrollé clientes Flutter (BLoC) para flujos de adopción con tests unitarios, de widget, integración y golden.',
        'Mantuve backends FastAPI con SQLAlchemy/Alembic al 100 % de cobertura pytest; automatizé CI/CD con GitHub Actions.',
        'Seguí la confiabilidad en producción con Sentry en servicios móviles y de API.',
      ],
      technologies: 'Flutter · BLoC · FastAPI · Python · PostgreSQL · Docker · Sentry · GitHub Actions',
    },
    {
      role: 'Desarrollador Full Stack',
      company: 'Tandamos',
      location: 'Remoto',
      period: 'Feb 2022 – May 2023',
      bullets: [
        'Entregué apps Flutter orientadas al cliente con Riverpod y un sistema de componentes UI reutilizable.',
        'Extendí servicios Nest.js / TypeScript con TypeORM sobre MySQL y auth/sync con Firebase.',
      ],
      technologies: 'Flutter · Riverpod · Nest.js · TypeScript · TypeORM · MySQL · Firebase',
    },
    {
      role: 'Desarrollador Backend',
      company: 'Valtech',
      location: 'Remoto',
      period: 'Sep 2021 – Feb 2022',
      bullets: [
        'Construí servicios Spring Boot para email empresarial vía Google Pub/Sub y Oracle Responsys.',
        'Expuse APIs REST con circuit breakers Resilience4j; colaboré con stakeholders para entrega a tiempo.',
      ],
      technologies: 'Spring Boot · Google Pub/Sub · App Engine · Oracle Responsys · Resilience4j',
    },
    {
      role: 'Desarrollador Full Stack',
      company: 'Freelance y contratación',
      location: 'San Francisco, Córdoba',
      period: 'Abr 2011 – Ago 2021',
      bullets: [
        'Entregué apps Flutter y nativas más backends Spring Boot / FastAPI con cero rechazos en tiendas.',
        'Integré redes de carga EV OCPP 1.6 y comercialicé telemetría industrial RS485 (Smart Lub).',
      ],
      technologies: 'Flutter · Spring Boot · FastAPI · WebSockets · OCPP 1.6 · GCP · Docker · Firebase',
    },
  ],
  education: {
    degree: 'Ingeniero Electrónico (Ingeniería Eléctrica y Electrónica)',
    institution: 'Universidad Tecnológica Nacional (UTN) — Facultad Regional San Francisco',
    period: '2000 – 2020',
    detail:
      'Proyecto de graduación — Smart Lub: dispositivo de telemetría industrial RS485 para Vulcano Lubricación; sync cloud por Ethernet/Wi-Fi; puesto en marcha y comercializado.',
  },
  projects: [
    {
      title: 'Ecosistema Micro-App ueno bank',
      tag: 'Banca Fintech · Arquitectura Mobile',
      detail:
        'Plataforma de banca empresarial que unifica apps retail y corporativas entre 50+ ingenieros Flutter; Release Train multi-tienda de 15 días.',
    },
    {
      title: 'Plataforma de adopción PairTree',
      tag: 'Full-Stack · Flutter & FastAPI',
      detail:
        'Plataforma full-stack Flutter + FastAPI de habilitación de adopciones con 100 % de cobertura en backend.',
    },
    {
      title: 'Smart Lub y red EV OCPP',
      tag: 'IoT Industrial · Movilidad Eléctrica',
      detail:
        'Dispositivo IoT RS485 comercializado; control de carga EV OCPP 1.6 con WebSockets en Python y monitoreo Flutter.',
    },
  ],
  languages: [
    { name: 'Español', level: 'Nativo' },
    { name: 'Inglés', level: 'Profesional' },
  ],
};

export function getCvContent(locale: string): CvContent {
  return locale.startsWith('es') ? contentEs : contentEn;
}
