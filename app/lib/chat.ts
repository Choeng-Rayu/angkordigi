export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  mode: "ai" | "lead";
  leadData: {
    name?: string;
    email?: string;
    message?: string;
    step?: "name" | "email" | "message" | "complete";
  };
}

export const SYSTEM_PROMPT = `You are TomNerb's friendly digital assistant. TomNerb Digital Solutions is a Cambodian startup that helps SMEs go digital through custom software, automation, and business management systems.

TomNerb offers:
- Custom Software Development (web apps, mobile apps, internal tools)
- Business Process Automation (workflows, integrations, reduce manual work)
- Business Management Systems (ERP, CRM, inventory, HR)
- AI/ML Solutions (chatbots, predictive analytics, data processing)
- Digital Transformation Consulting

Answer questions concisely, always in a warm and professional tone. Be helpful and encouraging. If asked about pricing, explain that it varies by project scope, and offer to connect them with the team. If they want to talk to the team or get a quote, collect their contact information.`;



export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function createMessage(role: "user" | "assistant", content: string): Message {
  return {
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
  };
}

export function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes("custom software") || lowerMessage.includes("web app") || lowerMessage.includes("mobile")) {
    return "We build custom software tailored to your business needs! From web applications to mobile apps and internal tools. What's your biggest challenge right now?";
  }
  
  if (lowerMessage.includes("automation") || lowerMessage.includes("workflow")) {
    return "Business process automation is our specialty! We help eliminate repetitive tasks and streamline operations. What processes are taking up too much of your time?";
  }
  
  if (lowerMessage.includes("ai") || lowerMessage.includes("machine learning") || lowerMessage.includes("ml")) {
    return "We offer AI/ML solutions including chatbots, predictive analytics, and intelligent data processing. What kind of AI solution are you exploring?";
  }
  
  if (lowerMessage.includes("erp") || lowerMessage.includes("crm") || lowerMessage.includes("system")) {
    return "We build and integrate business management systems like ERPs and CRMs that actually fit how you work. What system are you currently using?";
  }
  
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much") || lowerMessage.includes("quote")) {
    return "Pricing depends on project scope and requirements. I'd love to connect you with our team for a detailed quote. Could you share your name and email so someone can reach out within 24 hours?";
  }
  
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return "Hello! 👋 Ready to help your business grow with technology. What brings you here today?";
  }
  
  if (lowerMessage.includes("team") || lowerMessage.includes("contact") || lowerMessage.includes("speak")) {
    return "I'd be happy to connect you with our team! Please share your name and email, and someone from TomNerb will reach out within 24 hours.";
  }
  
  if (lowerMessage.includes("cambodia") || lowerMessage.includes("phnom penh")) {
    return "Yes, we're based in Cambodia and serve businesses throughout Southeast Asia! We understand the local market and regional business needs.";
  }
  
  if (lowerMessage.includes("sme") || lowerMessage.includes("startup")) {
    return "We love working with SMEs and startups! We understand budget constraints and focus on delivering maximum value. Let's discuss how we can help you scale!";
  }
  
  return "That's interesting! I'd love to learn more about your business and how we can help. Would you like to tell me more about what you're looking for, or would you prefer to speak directly with our team?";
}

export function checkLeadCaptureTrigger(message: string): boolean {
  const triggers = ["quote", "price", "pricing", "cost", "contact", "team", "speak", "talk", "reach out", "call", "email", "consultation"];
  const lowerMessage = message.toLowerCase();
  return triggers.some(trigger => lowerMessage.includes(trigger));
}

export function generateLeadCaptureResponse(step: "name" | "email" | "message" | "complete", data?: { name?: string; email?: string }): string {
  switch (step) {
    case "name":
      return "Great! Let's get you connected. What's your name?";
    case "email":
      return `Nice to meet you, ${data?.name}! What's the best email to reach you at?`;
    case "message":
      return "Perfect! Now, briefly tell us about your project or challenge so our team can come prepared:";
    case "complete":
      return `Thank you, ${data?.name}! 🎉 We've received your information and our team will contact you at ${data?.email} within 24 hours. Is there anything else I can help you with in the meantime?`;
    default:
      return "I'd be happy to connect you with our team!";
  }
}
