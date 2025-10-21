// app.js
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Validasi API Key
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('❌ ERROR: Environment variable GOOGLE_API_KEY belum disetel!');
  console.error('👉 Jalankan dengan: GOOGLE_API_KEY=your_api_key_here node app.js');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Prompt harus berupa string!',
      data: null
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', // ⚠️ 'gemini-2.5-flash' belum tersedia publik (per Oktober 2025)
      systemInstruction: 'Balas dengan bahasa sunda.'
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const responseText = result.response.text();

    return res.status(200).json({
      success: true,
      message: 'Berhasil dijawab oleh Gemini',
      data: responseText
    });
  } catch (error) {
    console.error('🔥 Error saat memanggil Gemini:', error.message || error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan di server.',
      data: null
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Project Sesi 5 berjalan di http://localhost:${PORT}`);
});