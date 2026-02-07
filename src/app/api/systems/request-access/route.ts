import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { systemTitle, systemDescription, name, email } = body;

    if (!systemTitle || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email content
    const subject = `System Access Request: ${systemTitle}`;
    const emailBody = `
New system access request:

System: ${systemTitle}
Description: ${systemDescription || "N/A"}

Requested by:
Name: ${name}
Email: ${email}

---
This is an automated message from your website.
    `.trim();

    // Send email using Resend (if configured) or log for manual sending
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (RESEND_API_KEY) {
      // Use Resend API to send email
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "website@thesnehadas.com",
          to: "snehadas.iitr@gmail.com",
          subject: subject,
          text: emailBody,
        }),
      });

      if (!resendResponse.ok) {
        const errorData = await resendResponse.json();
        throw new Error(errorData.message || "Failed to send email");
      }
    } else {
      // Log the request if email service is not configured
      // You can set up Resend API key in environment variables for production
      console.log("System Access Request (Email service not configured):", {
        systemTitle,
        systemDescription,
        name,
        email,
        to: "snehadas.iitr@gmail.com",
        subject,
        body: emailBody,
      });
      
      // In production, you should set up RESEND_API_KEY in your environment variables
      // For now, we'll still return success so the form works
    }

    return NextResponse.json(
      { 
        success: true,
        message: "Request submitted successfully" 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing system access request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
