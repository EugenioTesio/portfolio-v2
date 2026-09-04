import { SkillCapability, ExperienceItem, ProjectItem, BlogPost } from '../types';
import regeneratedProfileImage from '../assets/images/regenerated_image_1788456283242.jpg';

export const PERSONAL_INFO = {
  name: 'Eugenio Tesio',
  role: 'Mobile Expert & Systems Architect',
  subtitle: 'Senior Flutter & Python Enthusiast · Electronics Engineer',
  location: 'San Francisco, Córdoba, Argentina',
  email: 'eugenio.tesio@itti.digital',
  image: regeneratedProfileImage,
  bio: `I'm Eugenio Tesio, a passionate Mobile Expert, Systems Architect, and Electronics Engineer with over 14 years of professional software engineering and hardware telemetry experience. I specialize in designing and scaling high-velocity mobile platforms and resilient backends with Flutter (BLoC & Riverpod), Python (FastAPI), Java (Spring Boot), and Google Cloud Platform. 

Currently serving as Mobile Expert at ueno bank (ITTI S.A.E.C.A.), I pioneered the architectural migration to a multi-repo Micro-App & App Shell ecosystem that coordinates 50+ Flutter engineers, unified the flagship retail and business banking applications, built automated 15-day Release Trains to Apple App Store, Google Play, and Huawei AppGallery, and hardened security posture with Fintech RASP. My past career includes achieving 100% backend test coverage with FastAPI at PairTree (adoption enablement platform), delivering Riverpod and Nest.js microservices at Tandamos, building enterprise GCP Pub/Sub messaging pipelines at Valtech, and a decade of delivering custom mobile/IoT solutions (including OCPP 1.6 EV charging networks and commercialized RS485 telemetry devices) with zero mobile store rejections.`,
  education: {
    degree: "Engineer’s degree, Electrical and Electronics Engineering (Ingeniero Electrónico)",
    institution: 'Universidad Tecnológica Nacional (UTN) — Facultad Regional San Francisco',
    period: '2000 – 2020',
    capstone: 'Smart Lub: an electronic device for Vulcano Lubricación that reads equipment data over RS485, sends it over Ethernet or Wi-Fi, and stores it in a cloud database for downstream display. Commissioned and commercialized.'
  },
  stats: [
    { label: 'Engineering Experience', value: '14+ Yrs', change: '5+ yrs Flutter leadership' },
    { label: 'Mobile Engineers Scaled', value: '50+', change: 'Micro-App Architecture' },
    { label: 'Predictable Release Train', value: '15-Day', change: 'Automated Codemagic' },
    { label: 'FastAPI Backend Coverage', value: '100%', change: 'Zero regression rate' },
    { label: 'Store App Submissions', value: '0 Rejections', change: 'iOS, Android & Huawei' },
  ],
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    email: 'mailto:eugenio.tesio@itti.digital'
  }
};

export const CAPABILITIES: SkillCapability[] = [
  {
    id: 'mobile-architecture',
    title: 'Micro-App & App Shell Architecture',
    shortDescription: 'Migrating complex monoliths into modular multi-repo micro-apps. Harmonizing BLoC and Riverpod across massive engineering teams.',
    category: 'mobile',
    icon: 'Layers',
    badge: 'Mobile Systems',
    evidenceKey: 'itti-ueno',
    skills: ['Flutter', 'Dart', 'BLoC', 'Riverpod', 'Micro-Apps', 'App Shell', 'Modular Routing']
  },
  {
    id: 'backend-apis',
    title: 'Resilient Python & Java Backends',
    shortDescription: 'Architecting high-throughput APIs with FastAPI and Spring Boot. Fixture-driven testing achieving 100% test coverage with zero downtime migrations.',
    category: 'backend',
    icon: 'Server',
    badge: 'High Throughput',
    evidenceKey: 'pairtree',
    skills: ['Python', 'FastAPI', 'Java', 'Spring Boot', 'SQLAlchemy', 'Alembic', 'PostgreSQL', 'Node.js Fastify']
  },
  {
    id: 'devsecops-release',
    title: '15-Day Automated Mobile Release Train',
    shortDescription: 'Establishing automated multi-store signing and distribution across Apple App Store, Google Play Store, and Huawei AppGallery with Codemagic and GitHub Actions.',
    category: 'devops',
    icon: 'Cpu',
    badge: 'CI/CD & Delivery',
    evidenceKey: 'itti-release',
    skills: ['Codemagic', 'GitHub Actions', 'Fastlane', 'App Store Connect', 'Google Play Console', 'Huawei AppGallery']
  },
  {
    id: 'fintech-security',
    title: 'Fintech Mobile Security & RASP',
    shortDescription: 'Engineering Runtime Application Self-Protection (RASP), real-time jailbreak and root detection, hardened WebViews, and Checkmarx/Sonar SAST gates.',
    category: 'security',
    icon: 'ShieldCheck',
    badge: 'DevSecOps',
    evidenceKey: 'itti-security',
    skills: ['RASP', 'Root Detection', 'Secure WebView', 'SonarQube', 'Checkmarx SAST', 'Biometrics']
  },
  {
    id: 'ai-engineering',
    title: 'AI-Augmented Engineering Workflows',
    shortDescription: 'Pioneering multi-agent AI development workflows with Cursor and GitHub Copilot to accelerate delivery, architectural refactoring, and code review consistency.',
    category: 'ai',
    icon: 'Sparkles',
    badge: 'AI Multi-Agent',
    evidenceKey: 'itti-ai',
    skills: ['Multi-Agent AI', 'Cursor', 'GitHub Copilot', 'Spec-Driven Development (SDD)', 'Automated Refactoring']
  },
  {
    id: 'observability-telemetry',
    title: 'Mobile Observability & Reliability',
    shortDescription: 'Real-time production triage, crash velocity tracking, and custom telemetry query dashboards via New Relic, Instabug, and Sentry.',
    category: 'devops',
    icon: 'Activity',
    badge: 'Observability',
    evidenceKey: 'pairtree-sentry',
    skills: ['New Relic', 'Instabug', 'Sentry', 'Crashlytics', 'Google Logging', 'Prometheus']
  },
  {
    id: 'iot-embedded',
    title: 'Hardware Telemetry & Industrial IoT',
    shortDescription: 'Translating physical bus signals (RS485 Modbus, OCPP 1.6 EV chargers) into secure WebSocket and cloud event-driven backends.',
    category: 'iot',
    icon: 'Radio',
    badge: 'Electronics & IoT',
    evidenceKey: 'smart-lub',
    skills: ['RS485 Serial', 'OCPP 1.6', 'WebSockets', 'Embedded C/C++', 'Microcontrollers', 'GCP Pub/Sub']
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'itti-ueno',
    role: 'Mobile Expert',
    company: 'ITTI S.A.E.C.A. | ueno bank',
    location: 'San Francisco / Remote',
    period: 'Sep. 2023 – Present',
    current: true,
    summary: 'Lead architectural authority driving mobile banking scalability, multi-agent AI acceleration, and automated delivery across the flagship banking ecosystem.',
    featuredStat: {
      value: '50+ Engineers',
      label: 'Enabled via Micro-App Architecture'
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
        category: 'Architecture & Scalability',
        text: 'Spearheaded the architectural migration of the ueno bank mobile platform from a monolith to a multi-repo Micro-App & App Shell architecture, streamlining concurrent development for 50+ Flutter engineers.',
        metrics: '50+ Flutter engineers coordinated without merge bottlenecks',
        capabilityTag: 'Micro-App & App Shell'
      },
      {
        category: 'Flagship Ecosystem Unification',
        text: 'Co-led consolidation of the Empresas (Corporate) and Individuos (Retail) banking apps, harmonizing BLoC and Riverpod architectures across 300+ cross-functional stakeholders.',
        metrics: 'Unified 2 flagship banking products into 1 scalable design system',
        capabilityTag: 'BLoC + Riverpod Harmonization'
      },
      {
        category: 'AI-Augmented Engineering',
        text: 'Pioneered multi-agent AI development workflows with Cursor and GitHub Copilot to accelerate delivery, architectural refactoring, and code-review consistency.',
        metrics: 'Cut architectural refactoring cycle time drastically',
        capabilityTag: 'Multi-Agent AI Workflows'
      },
      {
        category: 'Release Engineering & Store Deployments',
        text: 'Established a predictable 15-day Release Train with automated Codemagic CD pipelines for multi-store signing and distribution to the Apple App Store, Google Play Store, and Huawei AppGallery.',
        metrics: 'Bi-weekly automated releases across 3 global app stores',
        capabilityTag: '15-Day Release Train'
      },
      {
        category: 'CI, Quality & Security Automation',
        text: 'Built GitHub Actions CI on every push and PR across micro-repositories, enforcing unit tests, Dart analyzer, Sonar, and Checkmarx SAST gates.',
        metrics: '100% PR verification gate pass rate enforced',
        capabilityTag: 'CI/CD & SAST Quality'
      },
      {
        category: 'Fintech Security Hardening',
        text: 'Integrated RASP for real-time jailbreak/root detection, remediated core vulnerabilities, and engineered an enterprise-ready secure WebView component.',
        metrics: 'Hardened against runtime tampering & reverse engineering',
        capabilityTag: 'Fintech RASP & Security'
      },
      {
        category: 'Observability & Reliability',
        text: 'Improved production uptime and triage by integrating Instabug and specialized New Relic mobile dashboards and telemetry queries.',
        metrics: 'Real-time crash velocity tracking & rapid incident diagnosis',
        capabilityTag: 'Mobile Telemetry & APM'
      },
      {
        category: 'BFF & Cloud Deployment',
        text: 'Built high-throughput Backend-for-Frontend services with Fastify (Node.js) on NullPlatform, optimizing payload efficiency and mobile network performance.',
        metrics: 'Minimized mobile latency and payload bandwidth',
        capabilityTag: 'Fastify Node.js BFF'
      },
      {
        category: 'Technical Leadership & Culture',
        text: 'Championed Spec-Driven Development (SDD), earned Hackathon Champion recognition, and led mobile engineering standards — resulting in promotion from Tech Lead to Mobile Expert.',
        metrics: 'Earned Hackathon Champion & Promotion to Mobile Expert',
        capabilityTag: 'Technical Leadership'
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
    role: 'Full Stack Developer',
    company: 'PairTree',
    location: 'Seattle, WA (Remote)',
    period: 'Jun. 2022 – May. 2023',
    summary: 'Built full-stack features for PairTree, an adoption enablement platform that connects licensed adoption professionals, adopting families, and expectant moms — powering Connect Pro (nationwide professional collaboration), Home Base (home study management), and the PairTree Family mobile experience. Delivered Flutter clients on BLoC with golden widget tests and maintained FastAPI backend services at 100% test coverage. The company has since ceased operations and the app is no longer available.',
    featuredStat: {
      value: '100% Coverage',
      label: 'FastAPI Backend with Pytest Fixtures'
    },
    backedCapabilities: [
      'mobile-architecture',
      'backend-apis',
      'devsecops-release',
      'observability-telemetry'
    ],
    bulletPoints: [
      {
        category: 'Adoption Mobile Platform',
        text: 'Built Flutter apps on BLoC for PairTree Family — home study task flows, profile matching, and adoption professional tooling, with unit, widget, integration, and golden tests.',
        metrics: 'Golden pixel-perfect regression safety across releases',
        capabilityTag: 'Flutter BLoC & Golden Tests'
      },
      {
        category: 'CI/CD Automation',
        text: 'Built GitHub Actions pipelines for automated test and deploy across mobile and backend services — shortening review feedback loops.',
        metrics: 'Automated test suites executed on every single commit',
        capabilityTag: 'GitHub Actions Automation'
      },
      {
        category: 'Backend Quality',
        text: 'Contributed to FastAPI services backing home study workflows and professional collaboration features, with SQLAlchemy, Alembic, and 100% pytest coverage using fixtures for functional and regression tests.',
        metrics: '100% code coverage achieved and maintained',
        capabilityTag: 'FastAPI 100% Coverage'
      },
      {
        category: 'Reliability',
        text: 'Tracked defects with Sentry and partnered with developers to diagnose and resolve production issues across mobile and API services.',
        metrics: 'Zero unmonitored production exceptions',
        capabilityTag: 'Sentry Error Tracking'
      }
    ],
    technologies: [
      'Flutter', 'Dart', 'BLoC', 'Beamer', 'GitHub Actions', 'CI/CD',
      'FastAPI', 'Python', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'Docker', 'Sentry'
    ]
  },
  {
    id: 'tandamos',
    role: 'Full Stack Developer',
    company: 'Tandamos',
    period: 'Feb. 2022 – May. 2023',
    summary: 'Built customer-facing Flutter applications utilizing Riverpod and developed scalable Nest.js TypeScript backends with TypeORM and Firebase sync.',
    featuredStat: {
      value: 'Riverpod + Nest.js',
      label: 'Full Stack Cross-Platform Delivery'
    },
    backedCapabilities: [
      'mobile-architecture',
      'backend-apis'
    ],
    bulletPoints: [
      {
        category: 'Customer App',
        text: 'Delivered a customer-facing Flutter app with Riverpod and reusable UI components — improving consistency across screens.',
        metrics: 'Cross-platform design system reused across 30+ views',
        capabilityTag: 'Riverpod State Management'
      },
      {
        category: 'Backend Enhancement',
        text: 'Extended Nest.js / TypeScript services and a TypeORM layer over MySQL — simplifying data access.',
        metrics: 'Optimized schema relations and simplified data access layer',
        capabilityTag: 'Nest.js & TypeScript Backend'
      },
      {
        category: 'Quality & Platform',
        text: 'Added automated unit, widget, and integration tests; used Firebase for auth and sync; extracted reusable Node.js functions — reducing redundancy.',
        metrics: 'Automated test suite and streamlined Firebase sync',
        capabilityTag: 'Firebase & Automated Testing'
      }
    ],
    technologies: [
      'Flutter', 'Dart', 'Riverpod', 'Nest.js', 'TypeScript', 'TypeORM', 'MySQL', 'Docker', 'Firebase'
    ]
  },
  {
    id: 'valtech',
    role: 'Backend Developer',
    company: 'Valtech',
    period: 'Sep. 2021 – Feb. 2022',
    summary: 'Engineered mission-critical Spring Boot microservices on Google Cloud Platform for enterprise email routing and communications pipelines.',
    featuredStat: {
      value: 'Google Cloud Platform',
      label: 'Spring Boot + Pub/Sub Messaging'
    },
    backedCapabilities: [
      'backend-apis',
      'observability-telemetry'
    ],
    bulletPoints: [
      {
        category: 'Email Platform',
        text: 'Built a Spring Boot service so internal systems could send email via Google Pub/Sub and Oracle Responsys — improving delivery reliability and scale.',
        metrics: 'High-throughput event queue processing with zero packet loss',
        capabilityTag: 'Spring Boot & Google Pub/Sub'
      },
      {
        category: 'APIs & Quality',
        text: 'Exposed RESTful APIs, added unit and integration tests, and resolved defects and third-party conflicts across the full application lifecycle.',
        metrics: 'Resilience4j circuit breakers and fail-safe retries',
        capabilityTag: 'Enterprise RESTful APIs'
      },
      {
        category: 'Collaboration',
        text: 'Partnered with developers and stakeholders to ship the service and adopt tools that improved functionality.',
        metrics: 'On-time delivery with Google DialogFlow and Twilio bridges',
        capabilityTag: 'Cross-Functional Engineering'
      }
    ],
    technologies: [
      'Spring Boot', 'Oracle Responsys', 'Google App Engine', 'Google Pub/Sub',
      'Google Logging', 'Google DialogFlow', 'Express', 'Twilio', 'Resilience4j', 'Thymeleaf'
    ]
  },
  {
    id: 'freelance',
    role: 'Full Stack Developer',
    company: 'Freelance & Contracting',
    period: 'Apr. 2011 – Aug. 2021',
    summary: 'A decade of delivering end-to-end mobile applications and backends, including OCPP 1.6 EV charging networks, GCP deployments, and zero store rejections.',
    featuredStat: {
      value: '10 Years',
      label: '0 Store Rejections Across iOS & Android'
    },
    backedCapabilities: [
      'mobile-architecture',
      'backend-apis',
      'iot-embedded'
    ],
    bulletPoints: [
      {
        category: 'Mobile & Web Apps',
        text: 'Delivered Flutter apps using Provider, BLoC, Riverpod, and GetX, with unit, widget, golden, and integration tests.',
        metrics: 'Comprehensive UI test coverage across diverse client apps',
        capabilityTag: 'Flutter Multi-Pattern Mastery'
      },
      {
        category: 'Java Backends',
        text: 'Built Spring Boot systems with Security, OAuth2, WebSockets, Actuator, Swagger, and GCP storage/messaging.',
        metrics: 'Enterprise-grade OAuth2 and WebSocket streaming',
        capabilityTag: 'Spring Boot OAuth2'
      },
      {
        category: 'Python Services',
        text: 'Built Flask/FastAPI backends with WebSockets, SQLAlchemy, asyncio, Pydantic, and Alembic migrations.',
        metrics: 'High-performance async Python backend architectures',
        capabilityTag: 'Async Python & FastAPI'
      },
      {
        category: 'Store Releases',
        text: 'Shipped mobile apps to Google Play and the App Store without rejection.',
        metrics: 'Flawless compliance record across 10+ store reviews',
        capabilityTag: 'Store Compliance Expert'
      },
      {
        category: 'Domain Delivery (IoT & EV)',
        text: 'Integrated OCPP 1.6 EV chargers; gathered requirements; trained developers; led large-scale deployments.',
        metrics: 'Connected physical EV charging hardware to cloud controllers',
        capabilityTag: 'OCPP 1.6 EV Integration'
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
    role: 'Electrical & Electronics Engineer (Graduation Project: Smart Lub)',
    company: 'Universidad Tecnológica Nacional (UTN)',
    period: '2000 – 2020',
    summary: 'Graduated as Ingeniero Electrónico. Engineered "Smart Lub" for Vulcano Lubricación: a physical telemetry device reading RS485 equipment data and sending it over Ethernet/Wi-Fi to cloud databases.',
    featuredStat: {
      value: 'Smart Lub',
      label: 'Commercialized RS485 Industrial Device'
    },
    backedCapabilities: [
      'iot-embedded'
    ],
    bulletPoints: [
      {
        category: 'Hardware & Embedded Engineering',
        text: 'Designed and built the electronic device for Vulcano Lubricación to capture industrial equipment telemetry over RS485 differential buses.',
        metrics: 'Commercialized industrial telemetry product',
        capabilityTag: 'RS485 Hardware & Firmware'
      },
      {
        category: 'Network & Cloud Ingestion',
        text: 'Engineered network stack to transmit industrial sensor data over Ethernet or Wi-Fi to a remote database for downstream dashboard visualization.',
        metrics: 'Zero data packet loss under severe industrial noise',
        capabilityTag: 'Hardware-to-Cloud Pipeline'
      }
    ],
    technologies: ['RS485', 'Embedded Systems', 'Ethernet', 'Wi-Fi', 'Microcontrollers', 'C/C++', 'Database Ingestion']
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'ueno-bank',
    title: 'ueno bank Mobile Ecosystem & Micro-App Shell',
    tagline: 'Enterprise digital banking platform unifying retail and corporate banking across 50+ Flutter engineers.',
    category: 'mobile',
    categoryLabel: 'Mobile & Flutter',
    featured: true,
    bannerGradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    technologies: ['Flutter', 'Dart', 'BLoC', 'Riverpod', 'Micro-Apps', 'App Shell', 'Fastify', 'RASP', 'Codemagic'],
    metrics: [
      { label: 'Concurrent Engineers', value: '50+' },
      { label: 'Release Train Cycle', value: '15 Days' },
      { label: 'Store Coverage', value: 'iOS, Android & Huawei' },
      { label: 'Architecture Model', value: 'Multi-Repo Shell' }
    ],
    overview: 'The flagship mobile banking application for ueno bank, serving millions of transactions. Eugenio spearheaded the architectural transition from an overgrown monolith into an autonomous Micro-App and App Shell structure, allowing independent squads to deploy without merge conflict bottlenecks.',
    challenge: 'A massive monolithic codebase suffered from hours of CI build queuing, constant merge collisions across 50+ engineers, and conflicting state management libraries (BLoC vs Riverpod) across different feature modules.',
    solution: 'Designed and implemented the Micro-App architecture with a centralized App Shell handling authentication, navigation, and security guards. Standardized contracts between modules and established automated Codemagic release trains.',
    architectureHighlights: [
      'Decoupled micro-apps compiling independently with isolated runner targets',
      'Contract-based inter-module event bus preventing circular dependencies',
      'Bi-weekly automated 15-day Release Train with automated store signing',
      'Embedded RASP (Runtime Application Self-Protection) and secure WebView sandboxes',
      'Custom Fastify Node.js BFF (Backend-For-Frontend) to optimize network payloads'
    ],
    results: [
      'Enabled 50+ Flutter developers to commit concurrently with zero monolith lockouts',
      'Decreased release verification turnaround from 8 business days to under 24 hours',
      'Zero security breaches or root bypasses reported in production'
    ],
    links: [
      { label: 'ueno bank Portal', url: 'https://uenobank.com.py', type: 'live' }
    ]
  },
  {
    id: 'pairtree-adoption',
    title: 'PairTree Adoption Enablement Platform',
    tagline: 'Full-stack adoption platform connecting professionals, families, and expectant moms — Flutter app with 100% test-covered FastAPI backend.',
    category: 'mobile',
    categoryLabel: 'Mobile & Flutter',
    featured: true,
    bannerGradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    technologies: ['FastAPI', 'Python', 'Flutter', 'BLoC', 'SQLAlchemy', 'Alembic', 'PostgreSQL', 'Docker', 'Sentry'],
    metrics: [
      { label: 'Backend Test Coverage', value: '100%' },
      { label: 'UI Regression Safety', value: 'Golden Tests' },
      { label: 'Database Migrations', value: 'Zero-Downtime' },
      { label: 'Error Tracking', value: 'Sentry Monitored' }
    ],
    overview: 'PairTree was an adoption enablement platform headquartered in Seattle that connected licensed adoption professionals, adopting families, and expectant moms. The platform powered Connect Pro (nationwide professional collaboration), Home Base (home study management), and the PairTree Family mobile app — centralizing home study tasks, personality-based matching, legal support, and post-adoption resources in a safe, scam-free environment. The company has since ceased operations and the app is no longer available.',
    challenge: 'Private adoption in the US relies on fragmented, analog processes across licensed professionals, families, and expectant moms — with high fees, long timelines, and limited interoperability between providers. PairTree needed a secure digital platform that could streamline home studies, enable nationwide professional collaboration, and deliver a trustworthy mobile experience with zero tolerance for backend regression errors.',
    solution: 'Engineered Flutter BLoC mobile clients for PairTree Family with pixel-accurate Golden regression tests. Built FastAPI backend microservices for home study workflows and professional collaboration with comprehensive Pytest fixtures maintaining 100% code coverage across all routes and database migrations.',
    architectureHighlights: [
      'Connect Pro centralized database enabling nationwide collaboration among licensed adoption professionals',
      'Home Base home study management with step-by-step, state-specific task guidance',
      'PairTree Family mobile app for home study tasks, matching, and support services',
      'Transactional rollback database fixtures for fast in-memory pytest execution',
      'Golden UI tests preventing unexpected visual breakage across mobile OS updates',
      'Alembic migration safety pipelines executed in GitHub Actions prior to staging deploy'
    ],
    results: [
      '100% code coverage verified on every pull request',
      'Zero critical backend regressions reported over 12 consecutive months',
      'Delivered a unified adoption platform replacing fragmented analog workflows'
    ],
    links: [
      { label: 'PairTree (LinkedIn)', url: 'https://www.linkedin.com/company/pairtree/', type: 'docs' }
    ]
  },
  {
    id: 'tandamos-fintech',
    title: 'Tandamos Community Savings & FinTech Platform',
    tagline: 'Collaborative group financial platform built with Flutter Riverpod and Nest.js TypeScript services.',
    category: 'mobile',
    categoryLabel: 'Mobile & Flutter',
    featured: false,
    bannerGradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    technologies: ['Flutter', 'Riverpod', 'Nest.js', 'TypeScript', 'TypeORM', 'MySQL', 'Firebase', 'Docker'],
    metrics: [
      { label: 'State Management', value: 'Riverpod' },
      { label: 'Backend Stack', value: 'Nest.js / TypeORM' },
      { label: 'Real-Time Sync', value: 'Firebase Engine' }
    ],
    overview: 'Modern fintech application facilitating revolving community savings pools (tandas). Designed for maximum transparency, scheduled contribution alerts, and digital wallet integrations.',
    challenge: 'Needed a cohesive design system that behaved seamlessly across Android and iOS with real-time balance synchronizations and secure user identification.',
    solution: 'Engineered the mobile app using Riverpod for granular state updates. Built a structured Nest.js backend with TypeORM over MySQL and integrated Firebase Authentication and Cloud Messaging for instant notifications.',
    architectureHighlights: [
      'Declarative state listeners with Riverpod providers for responsive balance updates',
      'Clean TypeORM entity relations with database indexing for rapid queries',
      'Automated widget and integration test suite executing in Docker containers'
    ],
    results: [
      'Delivered on-time customer launch with 4.8-star user reception',
      'Decreased boilerplate code by 40% using modular Node.js utility packages'
    ]
  },
  {
    id: 'valtech-email-engine',
    title: 'Enterprise Scaled Messaging Dispatcher (Valtech)',
    tagline: 'High-throughput Spring Boot event pipeline integrating Google Pub/Sub with Oracle Responsys and DialogFlow.',
    category: 'backend',
    categoryLabel: 'Backend & APIs',
    featured: false,
    bannerGradient: 'from-purple-500/20 via-pink-500/10 to-transparent',
    technologies: ['Spring Boot', 'Java', 'Google Pub/Sub', 'Oracle Responsys', 'DialogFlow', 'Resilience4j', 'GCP'],
    metrics: [
      { label: 'Message Engine', value: 'Google Pub/Sub' },
      { label: 'Resilience', value: 'Circuit Breakers' },
      { label: 'Hosting', value: 'GCP App Engine' }
    ],
    overview: 'High-volume communication gateway enabling multi-tenant enterprise applications to dispatch transactional emails and AI-driven conversational responses.',
    challenge: 'Third-party delivery provider rate limits and transient connection failures threatened message delivery SLAs for time-sensitive customer notices.',
    solution: 'Designed an asynchronous decoupled Spring Boot pipeline using Google Pub/Sub queues with Resilience4j circuit breakers, automated retry policies, and structured audit logs.',
    architectureHighlights: [
      'Decoupled publisher/subscriber architecture preventing backpressure collapses',
      'Integration with Oracle Responsys and Twilio SMS fallbacks',
      'Google DialogFlow natural language webhook handling for dynamic email templates'
    ],
    results: [
      'Handled spikes of hundreds of thousands of daily notifications with zero packet drop',
      'Graceful failure recovery with automated dead-letter queue reprocessing'
    ]
  },
  {
    id: 'smart-lub-iot',
    title: 'Smart Lub Industrial RS485 Telemetry Device',
    tagline: 'Commercial industrial IoT device capturing equipment telemetry over RS485 and streaming to cloud databases.',
    category: 'iot',
    categoryLabel: 'IoT & Hardware',
    featured: true,
    bannerGradient: 'from-amber-500/20 via-red-500/10 to-transparent',
    technologies: ['RS485', 'Modbus', 'C/C++', 'Ethernet / Wi-Fi', 'Microcontrollers', 'Cloud Databases'],
    metrics: [
      { label: 'Physical Layer', value: 'RS485 Serial Bus' },
      { label: 'Status', value: 'Commercialized Product' },
      { label: 'Client', value: 'Vulcano Lubricación' }
    ],
    overview: 'Commissioned capstone project for Vulcano Lubricación at UTN San Francisco. An electronic hardware device that monitors heavy machinery lubrication parameters over serial RS485 buses and streams data over Ethernet/Wi-Fi to cloud backends.',
    challenge: 'Factory environments are saturated with heavy electromagnetic interference (EMI). Data packets had to be captured accurately from remote sensors and buffered safely during factory network outages.',
    solution: 'Engineered custom microcontroller firmware with CRC error-checking, differential RS485 transceivers, and robust Ethernet/Wi-Fi failover drivers. Developed local EEPROM packet buffering for zero-loss cloud replay.',
    architectureHighlights: [
      'Hardware-level noise rejection and differential serial signal decoding',
      'Idempotent packet transmission protocol over TCP/IP',
      'Transition from academic prototype to certified commercial product'
    ],
    results: [
      'Commissioned and commercialized by Vulcano Lubricación for industrial clients',
      'Earned Electrical & Electronics Engineering Degree (Ingeniero Electrónico) from UTN'
    ]
  },
  {
    id: 'ocpp-ev-network',
    title: 'OCPP 1.6 Electric Vehicle Charging Station Network',
    tagline: 'Smart EV charging infrastructure controller with Python WebSockets and Flutter real-time monitoring.',
    category: 'iot',
    categoryLabel: 'IoT & Hardware',
    featured: false,
    bannerGradient: 'from-blue-500/20 via-emerald-500/10 to-transparent',
    technologies: ['OCPP 1.6', 'Python', 'WebSockets', 'Flutter', 'Docker', 'FastAPI', 'PostgreSQL'],
    metrics: [
      { label: 'Protocol', value: 'OCPP 1.6-J (JSON)' },
      { label: 'Transport', value: 'Secure WebSockets (WSS)' },
      { label: 'Live Monitoring', value: 'Flutter Dashboard' }
    ],
    overview: 'Central management system (CSMS) for networked Electric Vehicle chargers communicating via the OCPP 1.6 protocol. Provided live charging status, billing metering, and remote reboot controls.',
    challenge: 'Synchronizing high-frequency voltage, amperage, and kilowatt-hour telemetry across dozens of physical charging poles while allowing operators to trigger remote start/stop commands in under 200 milliseconds.',
    solution: 'Engineered an asynchronous Python WebSocket gateway maintaining persistent TLS connections to charging hardware. Paired with a Flutter administrative dashboard for technicians and EV drivers.',
    architectureHighlights: [
      'Asynchronous event loop handling bidirectional OCPP 1.6 JSON frames',
      'Real-time metering calculations and automated billing reconciliation',
      'Cross-platform Flutter dashboard for remote charger diagnostics'
    ],
    results: [
      'Deployed across multi-site commercial parking hubs with 99.9% network reliability',
      'Enabled instant remote firmware updates and power throttling'
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'large-scale-flutter-banking-architecture',
    title: 'Architecting a Large-Scale Flutter Banking App for 50+ Engineers',
    excerpt: 'App shell, micro-apps, capability registry, and internal package structure — how squads integrate and communicate without importing each other.',
    date: 'Sep 04, 2026',
    readTime: '14 min read',
    category: 'Architecture',
    tags: ['Flutter', 'Banking', 'Micro-Apps', 'App Shell', 'Architecture'],
    author: 'Eugenio Tesio',
    filename: 'large-scale-flutter-banking-architecture.html',
    format: 'html'
  },
  {
    slug: 'micro-app-architecture',
    title: 'Migrating Monoliths to Flutter Micro-App & App Shell Architecture',
    excerpt: 'How we scaled ueno bank to 50+ Flutter engineers by decoupling features into autonomous packages and harmonizing BLoC with Riverpod.',
    date: 'Oct 18, 2024',
    readTime: '7 min read',
    category: 'Architecture',
    tags: ['Flutter', 'Micro-Apps', 'BLoC', 'Riverpod', 'Architecture'],
    author: 'Eugenio Tesio',
    filename: 'micro-app-architecture.md'
  },
  {
    slug: '15-day-release-train',
    title: 'Architecting a 15-Day Automated Mobile Release Train with Codemagic',
    excerpt: 'Establishing automated multi-store signing and distribution across Apple App Store, Google Play Store, and Huawei AppGallery with Codemagic and GitHub Actions.',
    date: 'Nov 12, 2024',
    readTime: '6 min read',
    category: 'CI/CD & DevOps',
    tags: ['Codemagic', 'CI/CD', 'App Store', 'Google Play', 'Huawei'],
    author: 'Eugenio Tesio',
    filename: '15-day-release-train.md'
  },
  {
    slug: 'rasp-mobile-security',
    title: 'Fintech Mobile Hardening: Implementing RASP, Root Detection & Secure WebViews',
    excerpt: 'Protecting banking apps in hostile environments: multi-vector root detection, anti-debugging, memory hooks, and hardened WebViews in Flutter.',
    date: 'Dec 05, 2024',
    readTime: '8 min read',
    category: 'Security',
    tags: ['RASP', 'Security', 'Fintech', 'Flutter', 'Root Detection'],
    author: 'Eugenio Tesio',
    filename: 'rasp-mobile-security.md'
  },
  {
    slug: 'fastapi-100-coverage',
    title: 'Attaining 100% Test Coverage in FastAPI with SQLAlchemy Fixtures',
    excerpt: 'A practical, frictionless guide to reaching and maintaining 100% backend code coverage using rollback database fixtures and dependency overrides.',
    date: 'Jan 15, 2025',
    readTime: '5 min read',
    category: 'Backend',
    tags: ['Python', 'FastAPI', 'Testing', 'SQLAlchemy', 'Alembic'],
    author: 'Eugenio Tesio',
    filename: 'fastapi-100-coverage.md'
  },
  {
    slug: 'iot-rs485-to-cloud',
    title: 'From RS485 & OCPP 1.6 to Cloud Backends: Industrial IoT Telemetry Lessons',
    excerpt: 'Bridging electrical hardware with modern cloud backends: differential noise handling, local packet buffering, and lessons from the Smart Lub project.',
    date: 'Feb 20, 2025',
    readTime: '6 min read',
    category: 'IoT & Systems',
    tags: ['IoT', 'RS485', 'Hardware', 'OCPP 1.6', 'Embedded'],
    author: 'Eugenio Tesio',
    filename: 'iot-rs485-to-cloud.md'
  }
];
