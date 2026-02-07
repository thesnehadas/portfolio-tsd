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
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "sneha@importai.in";
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Email service not configured. Please set RESEND_API_KEY." },
        { status: 500 }
      );
    }
    
    // Use Resend API to send email
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: "snehadas.iitr@gmail.com",
        subject: subject,
        text: emailBody,
      }),
    });

    const responseData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API Error:", {
        status: resendResponse.status,
        statusText: resendResponse.statusText,
        error: responseData,
      });
      throw new Error(responseData.message || `Failed to send email: ${resendResponse.statusText}`);
    }

    // Log successful email send
    console.log("Email sent successfully:", {
      id: responseData.id,
      from: FROM_EMAIL,
      to: "snehadas.iitr@gmail.com",
      subject: subject,
    });

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
