export const siteConfig = {
  company: {
    name: "TomNerb Digital Solutions",
    tagline: "We Turn Your Challenges Into Digital Solutions",
    founded: "2026",
    location: "Phnom Penh, Cambodia",
    email: "info@tomnerb.com",
    phone: "+855 969 983 479",
  },
  nav: {
    links: [
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Team", href: "#team" },
      { label: "Timeline", href: "#timeline" },
    ],
    cta: { label: "Contact Us", href: "#contact" },
  },
  hero: {
    tagline: "We Turn Your Challenges Into Digital Solutions.",
    subtitle: "Cambodia's startup tech team helping SMEs go digital — affordably.",
    ctas: [
      { label: "Get Started", href: "#contact", variant: "primary" },
      { label: "View Our Work", href: "#services", variant: "ghost" },
    ],
    stats: [
      { value: 50, suffix: "+", label: "Projects" },
      { value: 10, suffix: "+", label: "Clients" },
      { value: 3, suffix: "", label: "Industries" },
      { value: 100, suffix: "%", label: "Local-First" },
    ],
  },
  about: {
    sectionLabel: "01 — ABOUT US",
    headline: "A startup born in Cambodia, built for Cambodia.",
    description: "TomNerb Digital Solutions is a startup technology team focused on providing digital solutions for local businesses in Cambodia. Our goal is to help small and medium businesses transform from manual operations to modern digital systems through software, automation, and digital tools.",
    badge: { label: "Founded", value: "2026" },
    map: {
      country: "Cambodia",
      pinLocation: "Phnom Penh",
    },
  },
  visionMissionGoal: {
    sectionLabel: "02 — VISION",
    cards: [
      {
        number: "02",
        icon: "Telescope",
        title: "Our Vision",
        content: [
          "Become a trusted digital solution provider in Cambodia.",
          "Help local businesses adopt modern technology.",
          "Support Cambodia's digital economy.",
        ],
      },
      {
        number: "03",
        icon: "Rocket",
        title: "Our Mission",
        content: [
          "Develop affordable and scalable digital solutions.",
          "Help SMEs improve efficiency.",
          "Build reliable software platforms.",
        ],
      },
      {
        number: "04",
        icon: "Target",
        title: "Our Goal",
        content: [
          "Launch first digital product.",
          "Build a strong portfolio.",
          "Develop SaaS platforms for Cambodian SMEs.",
          "Expand across industries.",
        ],
      },
    ],
  },
  timeline: {
    sectionLabel: "05 — TIMELINE",
    title: "Our Journey",
    subtitle: "Building Cambodia's digital future, one milestone at a time.",
    milestones: [
      { year: "2026", title: "Planning & Team Formation", description: "Prepare infrastructure. Launch first portfolio projects." },
      { year: "2027", title: "First SaaS Product", description: "Partner with Ministry of Interior." },
      { year: "2028", title: "Expand Team", description: "Build strong portfolio. Multiple industry solutions." },
      { year: "2029", title: "First in Cambodia", description: "Become market leader." },
      { year: "2030", title: "Go Overseas", description: "Regional expansion." },
    ],
  },
  services: {
    sectionLabel: "06 — SERVICES",
    title: "What We Offer",
    subtitle: "Tailored digital solutions for your business needs",
    services: [
      {
        icon: "Code",
        title: "Custom Software Development",
        description: "We build tailor-made systems designed for your exact workflow.",
        link: { label: "Learn More", href: "#contact" },
      },
      {
        icon: "TrendingUp",
        title: "Digital Transformation for SMEs",
        description: "Transform your manual operations into modern digital systems.",
        link: { label: "Learn More", href: "#contact" },
      },
      {
        icon: "Building",
        title: "Business Management Systems",
        description: "Integrated platforms for managing your entire business.",
        link: { label: "Learn More", href: "#contact" },
      },
      {
        icon: "Zap",
        title: "Automation Tools",
        description: "Streamline repetitive tasks with intelligent automation.",
        link: { label: "Learn More", href: "#contact" },
      },
    ],
  },
  team: {
    sectionLabel: "07 — TEAM",
    title: "Meet Our Team",
    subtitle: "The passionate minds behind TomNerb",
    members: [
      { name: "Choeng Rayu", role: "CEO", linkedin: "#" },
      { name: "Yen Mara", role: "CMO", linkedin: "#" },
      { name: "Rithi Reach", role: "CTO", linkedin: "#" },
      { name: "Tep Somnang", role: "COO", linkedin: "#" },
      { name: "Povpanha Ngovseng", role: "CFO", linkedin: "#" },
      { name: "Prak Dararith", role: "Project Management", linkedin: "#" },
    ],
  },
  contact: {
    sectionLabel: "08 — CONTACT",
    headline: "Let's Work Together.",
    subtitle: "Tell us your challenge — we'll provide the digital solution.",
    info: [
      { icon: "Mail", label: "Email", value: "info@tomnerb.com", href: "mailto:info@tomnerb.com" },
      { icon: "Phone", label: "Phone", value: "+855 969 983 479", href: "tel:+855969983479" },
    ],
    form: {
      fields: [
        { name: "name", label: "Name", type: "text", required: true, placeholder: "Your name" },
        { name: "email", label: "Email", type: "email", required: true, placeholder: "your@email.com" },
        { name: "company", label: "Company / Business Name", type: "text", required: false, placeholder: "Your company" },
        { name: "message", label: "Message / Challenge Description", type: "textarea", required: true, placeholder: "Tell us about your project..." },
      ],
      submitButton: { label: "Send Message", loadingLabel: "Sending...", successLabel: "Message Sent!" },
      successMessage: "Thank you for your message! We'll get back to you within 24 hours.",
      errorMessage: "Something went wrong. Please try again or email us directly.",
    },
  },
  footer: {
    tagline: "We Turn Your Challenges Into Digital Solutions",
    quickLinks: [
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Team", href: "#team" },
      { label: "Timeline", href: "#timeline" },
      { label: "Contact", href: "#contact" },
    ],
    legal: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
    social: [
      { icon: "Linkedin", label: "LinkedIn", href: "#" },
      { icon: "Github", label: "GitHub", href: "#" },
    ],
    copyright: "© 2026 TomNerb Digital Solutions. All rights reserved.",
    madeIn: "Made with love in Cambodia 🇰🇭",
  },
  chat: {
    widgetTitle: "TomNerb Assistant",
    welcomeMessage: "👋 Hi! I'm TomNerb's digital assistant. How can I help your business today?",
    quickReplies: [
      { label: "Custom Software?", value: "Tell me about custom software development" },
      { label: "Get a Quote?", value: "I'd like to get a quote for a project" },
      { label: "Talk to the Team", value: "I'd like to talk to someone on the team" },
    ],
    placeholder: "Type your message...",
    leadCapture: {
      triggerWords: ["quote", "price", "pricing", "cost", "contact", "team", "talk", "speak", "call", "email"],
      questions: [
        { field: "name", question: "Great! I'd be happy to connect you with our team. What's your name?" },
        { field: "email", question: "Thanks {name}! What's your email address?" },
        { field: "message", question: "What challenge can we help you solve?" },
      ],
      confirmation: "Thank you {name}! We've received your message and will reach out to you at {email} within 24 hours.",
    },
    systemPrompt: `You are TomNerb's friendly digital assistant. TomNerb Digital Solutions is a Cambodian startup that helps SMEs go digital through custom software, automation, and business management systems. Answer questions concisely, always in a warm and professional tone. If asked about pricing or wanting to connect with the team, collect their name and email and assure them someone will reach out within 24 hours. Services offered: - Custom Software Development - Digital Transformation for SMEs - Business Management Systems - Automation Tools Contact: info@tomnerb.com, +855 969 983 479 If you cannot answer confidently, say: "Let me connect you with our team directly — what's your email?"`,
  },
};

export type SiteConfig = typeof siteConfig;
