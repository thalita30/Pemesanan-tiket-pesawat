const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const readJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJSON = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

const COUNTRIES = path.join(__dirname, "data", "countries.json");
const BOOKINGS = path.join(__dirname, "data", "bookings.json");

// List negara
app.get("/api/countries", (req, res) => {
  res.json(readJSON(COUNTRIES));
});

// Tambah booking
app.post("/api/book", (req, res) => {
  const { name, email, destinationCode, passengers, paymentMethod } = req.body;
  if (!name || !email || !destinationCode || !passengers)
    return res.status(400).json({ error: "data kurang" });

  const countries = readJSON(COUNTRIES);
  const dest = countries.find((c) => c.code === destinationCode);
  const total = dest.price * passengers;

  const booking = {
    id: uuidv4(),
    name,
    email,
    destination: dest.name,
    passengers,
    pricePer: dest.price,
    total,
    paymentMethod,
    createdAt: new Date().toISOString(),
  };

  const all = readJSON(BOOKINGS);
  all.push(booking);
  writeJSON(BOOKINGS, all);

  res.json({ success: true, booking });
});

// Lihat semua booking
app.get("/api/bookings", (req, res) => {
  res.json(readJSON(BOOKINGS));
});

app.listen(PORT, () => console.log("Server jalan di http://localhost:" + PORT));
