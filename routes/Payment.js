import express from "express";
import crypto from "crypto";

const router = express.Router();

router.post("/create", (req, res) => {
  const { amount, item_name } = req.body;

  const data = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    amount,
    item_name,
    return_url: `${process.env.FRONTEND_URL}/payment-success`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    notify_url: `${process.env.BASE_URL}/api/payfast/notify`
  };

  // signature
  const query = Object.keys(data)
    .sort()
    .map(k => `${k}=${encodeURIComponent(data[k]).replace(/%20/g, "+")}`)
    .join("&");

  data.signature = crypto
    .createHash("md5")
    .update(query + `&passphrase=${process.env.PAYFAST_PASSPHRASE}`)
    .digest("hex");

  res.json({
    payfast_url: "https://www.payfast.co.za/eng/process",
    ...data
  });
});


router.post("/notify", (req, res) => {
  const data = req.body;

  console.log("PayFast Notify:", data);

  if (data.payment_status === "COMPLETE") {
    // ✅ yahin order PAID mark karo
    // data.m_payment_id se order identify karo

    console.log("Payment successful for order:", data.m_payment_id);
  }

  res.status(200).send("OK");
});
