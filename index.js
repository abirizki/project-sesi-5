// app.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Batas ukuran body JSON

// Validasi API Key
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('❌ ERROR: Environment variable GOOGLE_API_KEY belum disetel!');
  console.error('👉 Jalankan dengan: GOOGLE_API_KEY=your_api_key_here node app.js');
  process.exit(1);
}

// Inisialisasi Google Generative AI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Endpoint untuk generate teks
app.post('/Generate-text', async (req, res) => {
  const { prompt } = req.body;

  // Validasi input
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Prompt harus berupa string!',
      data: null
    });
  }

  try {
    // Siapkan model dengan instruksi sistem
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash', // ✅ Paling kompatibel
  systemInstruction: 'Balas dengan bahasa sunda.'
});

    // Kirim permintaan ke Gemini
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    // Ambil teks respons
    const responseText = result.response.text();

    // Kirim respons sukses
    return res.status(200).json({
      success: true,
      message: 'Berhasil dijawab oleh Gemini',
      data: responseText
    });
  } catch (error) {
    console.error('🔥 Error saat memanggil Gemini:', error.message || error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan di server saat memproses permintaan.',
      data: null
    });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Project Sesi 4 berjalan di http://localhost:${PORT}`);
});