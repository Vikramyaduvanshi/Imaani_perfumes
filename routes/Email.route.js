let nodemail= require("nodemailer");
let express= require("express")
let noderouter= express.Router()


const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

noderouter.post("/sendemail", async (req, res) => {
  console.log("email route hit");

  const { email, name, description, number, Businesstype } = req.body;

  // Auto-reply to sender
  async function replytosender() {
    await transporter.sendMail({
      from: `IMANI PERFUMES <${process.env.USER}>`,
      to: email,
      subject: "Thank you for contacting IMANI PERFUMES",
      html: `
<div style="background:#f4f6f8; padding:10px; font-family:Arial, sans-serif;">
  <div style="max-width:650px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
   <div style="background:#111827; padding:25px; text-align:center;">
  <img 
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW71n4ESXZAnKxlFmhcwNImr7-WJvET3cEKg&s"
    alt="IMANI PERFUMES LOGO"
    width="140"
    style="margin-bottom:12px;"
  />
  <h2 style="color:#ffffff; margin:0;">IMANI PERFUMES</h2>
  <p style="color:#cbd5e1; margin-top:6px; font-size:14px;">
    Wholesale Perfumes & Cosmetics
  </p>
</div>


    <!-- Body -->
    <div style="padding:10px;">
      <h3 style="color:#111827;">Dear ${name || "Valued Customer"},</h3>

      <p style="font-size:15px; color:#333;">
        Thank you for contacting <strong>IMANI PERFUMES</strong>.
        We truly appreciate your interest in our products and business offerings.
      </p>

      <p style="font-size:15px; color:#333;">
        Your enquiry has been successfully received by our team.
        One of our representatives will get back to you shortly with
        detailed information regarding pricing, availability, and next steps.
      </p>

      <div style="background:#f8f9fa; padding:18px; border-left:4px solid #111827; margin:5px 0;">
        <p style="margin:0; font-size:15px;">
          If your enquiry is related to <strong>bulk orders, wholesale supply, or long-term business collaboration</strong>,
          we look forward to building a strong and reliable partnership with you.
        </p>
      </div>

      <p style="font-size:15px; color:#333;">
        Meanwhile, feel free to explore our premium range of perfumes and cosmetic products.
      </p>

      <p style="margin-top:30px; font-size:15px;">
        Warm regards,<br/>
        <strong>IMANI PERFUMES</strong><br/>
        <span style="color:#555;">Wholesale & Business Sales Team</span>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f1f3f5; padding:15px; text-align:center; font-size:13px; color:#666;">
      This is an automated response. Please do not reply to this email.
    </div>

  </div>
</div>
`

    });
  }

  try {
    // Mail to admin / business owner
    await transporter.sendMail({
      from: `"${name}" <${process.env.USER}>`,
      to: "imaaniperfumesweb@gmail.com",
      replyTo: email,
      subject: "New Business / Wholesale Enquiry",
      html: `
<div style="background:#f4f6f8; padding:30px; font-family:Arial, sans-serif;">
  <div style="max-width:650px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#0d6efd; padding:20px;">
      <h2 style="color:#ffffff; margin:0;">New Business / Wholesale Enquiry</h2>
      <p style="color:#e9f1ff; margin:5px 0 0; font-size:14px;">
        IMANI PERFUMES – Wholesale & B2B Enquiries
      </p>
    </div>

    <!-- Body -->
    <div style="padding:25px;">
      <p style="font-size:15px; color:#333;">
        You have received a new enquiry from your website.
      </p>

      <table style="width:100%; border-collapse:collapse; margin-top:15px;">
        <tr>
          <td style="padding:10px; background:#f8f9fa; width:35%; font-weight:bold;">Customer Name</td>
          <td style="padding:10px;">${name}</td>
        </tr>
        <tr>
          <td style="padding:10px; background:#f8f9fa; width:35%; font-weight:bold;">Customer Number</td>
          <td style="padding:10px;">${number}</td>
        </tr>
        <tr>
          <td style="padding:10px; background:#f8f9fa; font-weight:bold;">Email Address</td>
          <td style="padding:10px;">
            <a href="mailto:${email}" style="color:#0d6efd; text-decoration:none;">
              ${email}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px; background:#f8f9fa; width:35%; font-weight:bold;">Business type</td>
          <td style="padding:10px;">${Businesstype}</td>
        </tr>

      </table>

      <div style="margin-top:20px;">
        <p style="font-weight:bold; margin-bottom:6px;">Message / Requirement</p>
        <div style="background:#f8f9fa; padding:15px; border-left:4px solid #0d6efd;">
          <p style="margin:0; font-size:15px; color:#333;">
            ${description}
          </p>
        </div>
      </div>

      <p style="margin-top:25px; font-size:14px; color:#555;">
        Please respond to this enquiry at your earliest convenience.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f1f3f5; padding:15px; text-align:center; font-size:13px; color:#666;">
      © ${new Date().getFullYear()} IMANI PERFUMES • Business Enquiry Notification
    </div>

  </div>
</div>
`

    });

    await replytosender();

    res.json({ message: "Email has been sent successfully" ,suceess:true});
  } catch (e) {
    res.status(500).json({ message: e.message ,success:false});
  }
});


module.exports = noderouter