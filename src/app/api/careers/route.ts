import { NextRequest, NextResponse } from "next/server";
import * as brevo from "@getbrevo/brevo";
import { adminPost } from "@/lib/admin-api";

// Sanitize string to prevent injection
function sanitize(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();

    const fullName = sanitize((formData.get("fullName") as string) || "");
    const email = sanitize((formData.get("email") as string) || "");
    const phone = sanitize((formData.get("phone") as string) || "");
    const position = sanitize((formData.get("position") as string) || "");
    const experience = sanitize((formData.get("experience") as string) || "");
    const portfolio = sanitize((formData.get("portfolio") as string) || "");
    const coverLetter = sanitize((formData.get("coverLetter") as string) || "");
    const cvFile = formData.get("cv") as File | null;

    // Validate required fields
    if (!fullName || !email || !phone || !position) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields (Name, Email, Phone, Position)." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Validate CV upload
    if (!cvFile || typeof cvFile !== "object" || cvFile.size === 0) {
      return NextResponse.json(
        { success: false, message: "Please upload your CV/Resume (PDF, DOC, or DOCX)." },
        { status: 400 }
      );
    }

    // Max 10MB file size
    const MAX_SIZE = 10 * 1024 * 1024;
    if (cvFile.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "The CV file size must be under 10MB." },
        { status: 400 }
      );
    }

    // Validate file extension
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileName = cvFile.name || "resume.pdf";
    const fileExt = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json(
        { success: false, message: "Only PDF, DOC, and DOCX files are accepted." },
        { status: 400 }
      );
    }

    // Convert file to base64 for email attachment
    const arrayBuffer = await cvFile.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString("base64");

    const brevoApiKey = process.env.BREVO_API_KEY;
    const recipientEmail = "info@amoriaglobal.com";

    if (brevoApiKey) {
      try {
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, brevoApiKey);

        const sendSmtpEmail = new brevo.SendSmtpEmail();
        sendSmtpEmail.subject = `Job Application: ${fullName} - ${position}`;
        sendSmtpEmail.sender = {
          name: "Amoria Careers Portal",
          email: process.env.BREVO_SENDER_EMAIL || "info@amoriaglobal.com",
        };
        sendSmtpEmail.to = [
          {
            email: recipientEmail,
            name: "Amoria Global Tech Hiring Team",
          },
        ];
        sendSmtpEmail.replyTo = {
          email: email,
          name: fullName,
        };
        sendSmtpEmail.htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1e293b; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #2ba268, #1e8a55); padding: 24px; color: #ffffff;">
              <h2 style="margin: 0 0 6px 0; font-size: 22px;">New Job Application Received</h2>
              <p style="margin: 0; opacity: 0.9; font-size: 14px;">An applicant has submitted their CV via the Amoria Global Tech Careers Portal.</p>
            </div>
            
            <div style="padding: 24px;">
              <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Applicant Profile</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; width: 140px; font-weight: 600;">Full Name:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2ba268; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Phone:</td>
                  <td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #0f172a; text-decoration: none;">${phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Position:</td>
                  <td style="padding: 8px 0;"><span style="background: #e8f7ee; color: #1e8a55; padding: 3px 10px; border-radius: 50px; font-weight: 600; font-size: 13px;">${position}</span></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Experience:</td>
                  <td style="padding: 8px 0; color: #0f172a;">${experience || "Not specified"}</td>
                </tr>
                ${
                  portfolio
                    ? `<tr>
                        <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Portfolio / Link:</td>
                        <td style="padding: 8px 0;"><a href="${portfolio}" target="_blank" rel="noopener noreferrer" style="color: #2ba268; word-break: break-all;">${portfolio}</a></td>
                      </tr>`
                    : ""
                }
              </table>

              ${
                coverLetter
                  ? `<div style="background-color: #f8fafc; border-left: 4px solid #2ba268; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
                      <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">Cover Letter / Personal Note:</h4>
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${coverLetter}</p>
                    </div>`
                  : ""
              }

              <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 8px; font-size: 13px; color: #475569;">
                📎 <strong>Attached CV:</strong> ${fileName} (${(cvFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            </div>

            <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 24px; font-size: 12px; color: #94a3b8; text-align: center;">
              Amoria Global Tech &bull; Sent automatically from the Careers Application Form
            </div>
          </div>
        `;

        sendSmtpEmail.attachment = [
          {
            name: fileName,
            content: base64Content,
          },
        ];

        await apiInstance.sendTransacEmail(sendSmtpEmail);
      } catch (brevoError) {
        console.error("Brevo email send error:", brevoError);
      }
    } else {
      console.warn("[Careers] BREVO_API_KEY is not defined in environment variables. Application received for info@amoriaglobal.com.");
    }

    // Forward to internal Admin API if available
    try {
      await adminPost("/careers", {
        fullName,
        email,
        phone,
        position,
        experience,
        portfolio,
        coverLetter,
        fileName,
      });
    } catch {
      // Non-fatal if CMS admin API is offline
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for applying! Your application and CV have been received by info@amoriaglobal.com. Our hiring team will review your application and get in touch.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error handling career application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while processing your application. Please try again or email your CV directly to info@amoriaglobal.com.",
      },
      { status: 500 }
    );
  }
}
