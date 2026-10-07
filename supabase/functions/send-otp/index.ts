import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";



const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  phone?: string;
  purpose: "signup" | "reset_password";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let { email, phone, purpose }: SendOTPRequest = await req.json();

    if (!email || !purpose) {
      return new Response(JSON.stringify({ error: "Email and purpose are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Initialize Supabase client
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(JSON.stringify({ error: "Internal server configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Starting OTP process for ${email} (${purpose})`);

    // Clean up old OTPs for this email and purpose
    try {
      const { error: deleteError } = await supabase
        .from("otp_codes")
        .delete()
        .eq("email", email)
        .eq("purpose", purpose);

      if (deleteError) {
        console.warn("Non-critical error deleting old OTPs:", deleteError);
      }
    } catch (e) {
      console.warn("Exception during OTP cleanup:", e);
    }

    // Lookup phone if missing (e.g., for reset_password)
    if (!phone) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("phone")
          .eq("email", email)
          .single();
        if (profile && profile.phone) {
          phone = profile.phone;
        }
      } catch (e) {
        console.warn("Exception during phone lookup:", e);
      }
    }

    // Store OTP in database (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const { error: insertError } = await supabase.from("otp_codes").insert({
      email,
      otp_code: otpCode,
      purpose,
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error("Error storing OTP in database:", insertError);
      return new Response(JSON.stringify({
        error: "Failed to generate OTP code. Please ensure database is configured correctly.",
        details: insertError.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send email with OTP
    const subject = purpose === "signup" ? "Verify Your Email - ThePropertyForYou" : "Reset Your Password - ThePropertyForYou";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
        <h1 style="color: #3b82f6; text-align: center;">ThePropertyForYou</h1>
        <h2 style="text-align: center;">${purpose === "signup" ? "Welcome!" : "Password Reset"}</h2>
        <p style="text-align: center; font-size: 16px; color: #4b5563;">Your verification code is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 4px; color: #1f2937;">
          ${otpCode}
        </div>
        <p style="text-align: center; font-size: 14px; color: #6b7280;">This code will expire in 10 minutes.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="text-align: center; font-size: 12px; color: #9ca3af;">If you didn't request this code, please ignore this email.</p>
      </div>
    `;

    // Send email using Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured in Supabase secrets");
      return new Response(JSON.stringify({
        error: "Email service not configured. Please set RESEND_API_KEY in Supabase secrets."
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      console.log(`Attempting to send email via Resend to ${email}`);

      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "ThePropertyForYou <support@thepropertyforyou.com>",
          to: [email],
          subject,
          html,
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error("Resend API error response:", emailData);
        return new Response(JSON.stringify({
          error: "Failed to send email via service provider.",
          details: emailData.message || "Unknown provider error"
        }), {
          status: emailResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      console.log("OTP email sent successfully:", emailData.id);
    } catch (emailError: any) {
      console.error("Network or internal error sending email:", emailError);

      // Delete the OTP since email failed
      await supabase.from("otp_codes").delete().eq("email", email).eq("otp_code", otpCode);

      return new Response(JSON.stringify({
        error: "Failed to connect to email service.",
        details: emailError.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send WhatsApp OTP via MSG91
    const msg91AuthKey = Deno.env.get("MSG91_AUTH_KEY");
    if (msg91AuthKey && phone) {
      try {
        console.log(`Attempting to send WhatsApp OTP to ${phone}`);
        const msg91Res = await fetch("https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authkey": msg91AuthKey,
          },
          body: JSON.stringify({
            integrated_number: Deno.env.get("MSG91_WHATSAPP_NUMBER"),
            content_type: "template",
            payload: {
              messaging_product: "whatsapp",
              type: "template",
              template: {
                name: "otp_template", // Replace with your approved MSG91 OTP template name
                language: { code: "en" },
                components: [
                  {
                    type: "body",
                    parameters: [
                      { type: "text", text: otpCode },
                    ]
                  }
                ]
              }
            },
            recipient: [
              { to: phone }
            ]
          }),
        });
        const msg91Data = await msg91Res.json();
        if (!msg91Res.ok) {
           console.error("MSG91 WhatsApp API error response:", msg91Data);
        } else {
           console.log("OTP WhatsApp sent successfully");
        }
      } catch (whatsappError) {
        console.error("Network or internal error sending WhatsApp:", whatsappError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP sent successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  } catch (error: any) {
    console.error("Unexpected error in send-otp function:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
