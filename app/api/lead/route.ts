import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { validateEmail } from "@/app/lib/chat";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@tomnerb.com";
const TO_EMAIL = process.env.RESEND_TO_EMAIL || "info@tomnerb.com";

interface LeadSubmitRequest {
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please contact us directly." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const body: LeadSubmitRequest = await request.json();
    const { name, email, message, timestamp } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: "New Lead from Chat Widget",
      html: `
        <h2>New Lead from Chat Widget</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr />
        <p><em>Sent from TomNerb Chat Widget</em></p>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again or contact us directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully",
      data,
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again or contact us directly." },
      { status: 500 }
    );
  }
}
