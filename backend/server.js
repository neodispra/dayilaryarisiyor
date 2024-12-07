const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// JSON dosyası
const dataFile = "./data.json";

// Verileri oku
function readData() {
    const rawData = fs.readFileSync(dataFile);
    return JSON.parse(rawData);
}

// Verileri yaz
function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// API Endpoints

// 1. Tüm kullanıcıları getir
app.get("/scores", (req, res) => {
    const data = readData();
    res.json(data);
});

// 2. Yeni kullanıcı puanı ekle
app.post("/scores", (req, res) => {
    const { name, score } = req.body;
    if (!name || typeof score !== "number") {
        return res.status(400).json({ error: "Name ve score gerekli." });
    }

    const data = readData();
    data.push({ name, score });
    writeData(data);
    res.status(201).json({ message: "Puan başarıyla kaydedildi." });
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
