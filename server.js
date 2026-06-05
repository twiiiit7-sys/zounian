const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs/promises");
const path = require("path");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const dataDir = path.resolve(process.env.DATA_DIR || "./data");
const frontendOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const createTimestampedRecord = (payload) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  receivedAt: new Date().toISOString(),
  ...payload
});

const writeRecord = async (fileName, payload) => {
  await fs.mkdir(dataDir, { recursive: true });
  const filePath = path.join(dataDir, fileName);
  let existing = [];

  try {
    const raw = await fs.readFile(filePath, "utf8");
    existing = JSON.parse(raw);
    if (!Array.isArray(existing)) existing = [];
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const record = createTimestampedRecord(payload);
  existing.push(record);
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf8");
  return record;
};

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (frontendOrigins.length === 0 || frontendOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin not allowed by CORS: ${origin}`));
  }
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "zounian-api",
    timestamp: new Date().toISOString()
  });
});

app.post("/api/reservations", async (req, res, next) => {
  try {
    const { course, date, time, guests, name, email, phone, note = "" } = req.body || {};
    const normalizedGuests = Number(guests);

    if (
      !isNonEmptyString(course) ||
      !isNonEmptyString(date) ||
      !isNonEmptyString(time) ||
      !Number.isInteger(normalizedGuests) ||
      normalizedGuests < 1 ||
      normalizedGuests > 8 ||
      !isNonEmptyString(name) ||
      !validateEmail(email || "") ||
      !isNonEmptyString(phone)
    ) {
      return res.status(400).json({
        ok: false,
        message: "Invalid reservation payload."
      });
    }

    const payload = {
      course: course.trim(),
      date: date.trim(),
      time: time.trim(),
      guests: normalizedGuests,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      note: String(note).trim()
    };

    const record = await writeRecord("reservations.json", payload);
    console.log("[reservation]", record);

    return res.status(201).json({
      ok: true,
      message: "Reservation received.",
      reservationId: record.id
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/contact", async (req, res, next) => {
  try {
    const { name, email, subject, message, category = "" } = req.body || {};

    if (
      !isNonEmptyString(name) ||
      !validateEmail(email || "") ||
      !isNonEmptyString(subject) ||
      !isNonEmptyString(message)
    ) {
      return res.status(400).json({
        ok: false,
        message: "Invalid contact payload."
      });
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      category: String(category).trim()
    };

    const record = await writeRecord("contacts.json", payload);
    console.log("[contact]", record);

    return res.status(201).json({
      ok: true,
      message: "Contact message received.",
      contactId: record.id
    });
  } catch (error) {
    return next(error);
  }
});

app.use((err, _req, res, _next) => {
  console.error("[api-error]", err);

  if (err.message && err.message.startsWith("Origin not allowed by CORS:")) {
    return res.status(403).json({
      ok: false,
      message: "CORS origin not allowed."
    });
  }

  return res.status(500).json({
    ok: false,
    message: "Server error."
  });
});

app.listen(port, () => {
  console.log(`Zounian API listening on http://localhost:${port}`);
});
