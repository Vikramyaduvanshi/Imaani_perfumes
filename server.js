let dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
let cors = require("cors");
let express = require("express");

const Connectdb = require("./config/Connectdb");
const userrouter = require("./routes/userrouter");
const Productrouter = require("./routes/Products_routes");
const cartrouter = require("./routes/Cart_route");
const noderouter = require("./routes/Email.route");



let app = express();

/* ✅ COOKIE PARSER */
app.use(cookieParser());

/* ✅ BODY PARSERS (JSON + FORM DATA SUPPORT) */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ✅ CORS (COOKIE SUPPORT FIXED) */
app.use(cors({
  origin: [
    "http://localhost:5173",          // dev
    "https://your-frontend-domain",   // prod
  ],
  credentials: true
}));


let PORT = process.env.PORT || 5000;

/* TEST ROUTE */
app.get("/test", (req, res) => {
  res.json({ message: "test route successfully" });
});

/* ROUTES */
app.use("/users", userrouter);
app.use("/products", Productrouter);
app.use("/cart", cartrouter)

app.use("/email", noderouter)

/* ✅ GLOBAL ERROR HANDLER */
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR 👉", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

/* SERVER START */
app.listen(PORT,"0.0.0.0",() => {
  Connectdb();
  console.log(`🚀 Server running at port ${PORT}`);
});
