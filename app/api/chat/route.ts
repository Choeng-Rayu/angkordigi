import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { validateEmail, checkAIMessageLimit, createRateLimitMessage } from "@/app/lib/chat";
import { siteConfig } from "@/app/data/siteData";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "",
  baseURL: process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1",
});

const MODEL = process.env.NVIDIA_MODEL || "nvidia/nemotron-3-nano-30b-a3b";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  mode?: "ai" | "lead";
  leadStep?: "name" | "email" | "message" | "complete";
  leadData?: {
    name?: string;
    email?: string;
  };
}

const SYSTEM_PROMPT = siteConfig.chat.systemPrompt;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, mode = "ai", leadStep, leadData } = body;

    const lastUserMessage = messages
      .filter(m => m.role === "user")
      .pop();

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: "No user message found" },
        { status: 400 }
      );
    }

    // Check rate limiting for AI messages
    if (mode === "ai") {
      if (!checkAIMessageLimit(messages)) {
        return NextResponse.json({
          message: {
            role: "assistant" as const,
            content: createRateLimitMessage("ai"),
          },
          mode: "ai",
          leadStep: undefined,
          leadData: leadData || {},
          rateLimited: true,
        });
      }
    }

    const userContent = lastUserMessage.content;

    // Handle lead capture mode
    if (mode === "lead" && leadStep) {
      return handleLeadCapture(leadStep, userContent, leadData);
    }

    // Check if we should trigger lead capture
    const leadTriggerWords = ["quote", "price", "pricing", "cost", "contact", "team", "talk", "speak", "call", "email", "consultation"];
    const lowerContent = userContent.toLowerCase();
    const shouldTriggerLead = leadTriggerWords.some(word => lowerContent.includes(word));

    if (shouldTriggerLead) {
      return NextResponse.json({
        message: {
          role: "assistant" as const,
          content: "I'd be happy to connect you with our team! What's your name?",
        },
        mode: "lead",
        leadStep: "name",
        leadData: {},
      });
    }

    // Call NVIDIA API
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const assistantMessage = completion.choices[0]?.message?.content || "I'm not sure how to respond to that.";

    return NextResponse.json({
      message: {
        role: "assistant" as const,
        content: assistantMessage,
      },
      mode: "ai",
      leadStep: undefined,
      leadData: leadData || {},
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      message: {
        role: "assistant" as const,
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or email us directly at info@tomnerb.com.",
      },
      mode: "ai",
      leadStep: undefined,
      leadData: {},
    });
  }
}

async function handleLeadCapture(
  step: "name" | "email" | "message" | "complete",
  userContent: string,
  leadData?: { name?: string; email?: string }
) {
  switch (step) {
    case "name": {
      const name = userContent.trim();
      if (name.length < 2) {
        return NextResponse.json({
          message: {
            role: "assistant" as const,
            content: "Please provide your full name so our team knows who to contact.",
          },
          mode: "lead",
          leadStep: "name",
          leadData: {},
        });
      }
      return NextResponse.json({
        message: {
          role: "assistant" as const,
          content: `Thanks ${name}! What's your email address?`,
        },
        mode: "lead",
        leadStep: "email",
        leadData: { name },
      });
    }

    case "email": {
      const email = userContent.trim();
      if (!validateEmail(email)) {
        return NextResponse.json({
          message: {
            role: "assistant" as const,
            content: "That doesn't look like a valid email address. Could you please double-check it?",
          },
          mode: "lead",
          leadStep: "email",
          leadData,
        });
      }
      return NextResponse.json({
        message: {
          role: "assistant" as const,
          content: "What challenge can we help you solve?",
        },
        mode: "lead",
        leadStep: "message",
        leadData: { ...leadData, email },
      });
    }

    case "message": {
      const message = userContent.trim();
      // Submit lead to /api/lead endpoint
      if (leadData?.name && leadData?.email) {
        try {
          const leadResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/lead`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: leadData.name,
              email: leadData.email,
              message: message,
              timestamp: new Date().toISOString(),
            }),
          });
          if (!leadResponse.ok) {
            console.error("Failed to submit lead:", await leadResponse.text());
          }
        } catch (leadError) {
          console.error("Error submitting lead:", leadError);
        }
      }
      return NextResponse.json({
        message: {
          role: "assistant" as const,
          content: `Thank you ${leadData?.name}! We've received your message and will reach out to you at ${leadData?.email} within 24 hours. Is there anything else I can help you with?`,
        },
        mode: "ai",
        leadStep: "complete",
        leadData: {},
      });
    }

    default:
      return NextResponse.json({
        message: {
          role: "assistant" as const,
          content: "How else can I help you today?",
        },
        mode: "ai",
        leadStep: undefined,
        leadData: {},
      });
  }
}
