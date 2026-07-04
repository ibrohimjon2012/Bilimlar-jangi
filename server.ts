import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high size limit for base64 image transfers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Lazy initializer for Google GenAI client to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY muhit o'zgaruvchisi topilmadi. Settings > Secrets panelidan uni sozlang.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. MATN BO'LIMI - Chat va Yozish yordamchisi API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], mode = "chat" } = req.body;

    if (!message) {
      res.status(400).json({ error: "Xabar kiritilmadi" });
      return;
    }

    const ai = getAiClient();

    // Define custom system instructions based on mode
    let systemInstruction = "Siz har qanday mavzuda yordam bera oladigan Universal AI yordamchisiz. Javoblaringizni doimo o'zbek tilida, qisqa, aniq va madaniyatli qilib bering.";
    
    if (mode === "qna") {
      systemInstruction = "Siz bilimdon va aniq savol-javob yordamchisisiz. Foydalanuvchining savollariga chuqur, ishonchli va faktlarga asoslangan javoblar bering. Javoblaringizni o'zbek tilida yozing.";
    } else if (mode === "write") {
      systemInstruction = "Siz matnlar, maqolalar va hikoyalar yozish bo'yicha professional ijodiy yordamchisiz. Foydalanuvchiga sifatli maqola, post, esse yoki ssenariy yozishda ko'maklashing. O'zbek tilida jozibali, boy va mukammal uslubda yozing.";
    } else if (mode === "translate") {
      systemInstruction = "Siz professional va tezkor tarjimon hamda tahrirchisiz. Berilgan matnlarni foydalanuvchi so'ragan tilga (agar ko'rsatilmagan bo'lsa, o'zbek tiliga) mukammal va tabiiy uslubda tarjima qilib bering. Faqat tarjima qilingan matnni va agar zarur bo'lsa, qisqa tushuntirishni taqdim eting.";
    } else if (mode === "correction") {
      systemInstruction = "Siz qat'iy va aqlli imlo va grammatika tekshiruvchisisiz. Foydalanuvchi taqdim etgan matndagi grammatik, uslubiy va imlo xatolarini tuzatib bering. Tuzatilgan variantni ko'rsating va qanday xatolar nima uchun tuzatilganini chiroyli tarzda o'zbek tilida tushuntiring.";
    }

    // Prepare stateless history format for generateContent
    const contents: any[] = [];
    
    for (const turn of history) {
      if (turn.text && turn.role) {
        contents.push({
          role: turn.role === "user" ? "user" : "model",
          parts: [{ text: turn.text }],
        });
      }
    }

    // Add the current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "Uzr, javobni shakllantirishda muammo yuz berdi.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Chat API xatosi:", error);
    res.status(500).json({ error: error.message || "Tizim xatoligi yuz berdi" });
  }
});

// 2. RASM BO'LIMI - Image Generation API
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Rasm uchun so'rov (prompt) kiritilmadi" });
      return;
    }

    const ai = getAiClient();

    try {
      // First, try real Gemini Image Generation model
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let base64Image = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            base64Image = part.inlineData.data;
            break;
          }
        }
      }

      if (base64Image) {
        res.json({
          success: true,
          image: `data:image/png;base64,${base64Image}`,
          method: "gemini",
        });
        return;
      }
    } catch (geminiError: any) {
      console.warn("Gemini Image generation failed, falling back to English translation + Unsplash:", geminiError.message);
    }

    // FALLBACK PROCESS: Use Gemini 3.5 Flash to generate 2-3 English keywords from the Uzbek prompt,
    // and then construct a high-quality Unsplash Featured image URL!
    let englishKeywords = "abstract,art";
    try {
      const keywordResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Foydalanuvchining rasm yaratish uchun yozgan so'rovidan eng mos keladigan 2-3 ta inglizcha kalit so'zni ajratib ber. Kalit so'zlar orasida albatta mavzuga aloqador sifatlar va otlar bo'lsin. Faqatgina kalit so'zlarni inglizcha holatda vergul bilan ajratib yoz, boshqa hech qanday izoh yoki gap qo'shma. Masalan: "baliq akvariumda suzyapti" so'rovi uchun javob faqat "goldfish,aquarium" bo'lishi kerak.
Foydalanuvchi so'rovi: "${prompt}"`,
      });

      if (keywordResponse.text) {
        const cleaned = keywordResponse.text.trim().toLowerCase().replace(/[^a-z0-9,\s-_]/g, "");
        if (cleaned.length > 2) {
          englishKeywords = cleaned.split(/\s+/).join("");
        }
      }
    } catch (err) {
      console.error("Keyword extraction failed, using defaults:", err);
    }

    // Return an Unsplash image URL with the English keywords
    const timestamp = Date.now();
    const unsplashUrl = `https://images.unsplash.com/featured/?${encodeURIComponent(englishKeywords)}&sig=${timestamp}`;

    res.json({
      success: true,
      image: unsplashUrl,
      keywords: englishKeywords,
      method: "unsplash",
    });
  } catch (error: any) {
    console.error("Rasm API xatosi:", error);
    res.status(500).json({ error: error.message || "Rasm yaratishda xatolik yuz berdi" });
  }
});

// 2. RASM BO'LIMI - Image Analysis API (Multimodal)
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { image, prompt = "Ushbu rasmni batafsil tahlil qiling va o'zbek tilida chiroyli qilib tavsiflab bering." } = req.body;

    if (!image) {
      res.status(400).json({ error: "Rasm yuklanmadi" });
      return;
    }

    // Extract base64 part and mimeType
    const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches) {
      res.status(400).json({ error: "Noto'g'ri rasm formati. Rasm base64 ma'lumoti bo'lishi kerak." });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const ai = getAiClient();

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
    });

    const analysis = response.text || "Uzr, rasm tahlili natijasini olishda muammo yuz berdi.";
    res.json({ analysis });
  } catch (error: any) {
    console.error("Rasm tahlili API xatosi:", error);
    res.status(500).json({ error: error.message || "Rasm tahlilida xatolik yuz berdi" });
  }
});

// Serve Frontend
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server port 3000 da ishga tushdi: http://localhost:${PORT}`);
  });
}

startServer();
