import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const MSG91_AUTH_KEY = Deno.env.get("MSG91_AUTH_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoicePayload {
  email: string;
  phone: string;
  invoiceUrl: string;
  userName: string;
  invoiceNumber: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, phone, invoiceUrl, userName, invoiceNumber }: InvoicePayload = await req.json();

    const results: any = { email: null, whatsapp: null };

    // 1. Send Email via Resend
    if (RESEND_API_KEY && email) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "The Property For You <support@thepropertyforyou.com>",
          to: [email],
          subject: `Your Invoice ${invoiceNumber} is Ready`,
          html: `
            <h2>Hello ${userName},</h2>
            <p>Your payment has been successfully verified.</p>
            <p>You can download your invoice using the link below:</p>
            <p><a href="${invoiceUrl}" target="_blank">Download Invoice</a></p>
            <br />
            <p>Thank you for choosing The Property For You!</p>
          `,
        }),
      });
      results.email = await emailRes.json();
    }

    // 2. Send WhatsApp via MSG91
    // MSG91 WhatsApp API implementation based on standard MSG91 Campaign/Flow API
    if (MSG91_AUTH_KEY && phone) {
      // Assuming a pre-approved WhatsApp template with variables
      // Template name e.g. "invoice_dispatch", with variables for Name and Link
      const msg91Res = await fetch("https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authkey": MSG91_AUTH_KEY,
        },
        body: JSON.stringify({
          integrated_number: Deno.env.get("MSG91_WHATSAPP_NUMBER"), // Your MSG91 integrated number
          content_type: "template",
          payload: {
            messaging_product: "whatsapp",
            type: "template",
            template: {
              name: "invoice_receipt", // Replace with actual MSG91 approved template name
              language: { code: "en" },
              components: [
                {
                  type: "body",
                  parameters: [
                    { type: "text", text: userName || "Customer" },
                    { type: "text", text: invoiceNumber },
                  ]
                },
                {
                  type: "button",
                  sub_type: "url",
                  index: "0",
                  parameters: [
                    { type: "text", text: invoiceUrl } // If dynamic URL is supported
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
      results.whatsapp = await msg91Res.json();
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error sending invoice notifications:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
