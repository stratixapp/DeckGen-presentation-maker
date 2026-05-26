import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' })); // support large pasted text sizes

const PORT = 3000;

// Lazy initialized Gemini client to prevent crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please manage it in Settings -> Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// REST endpoint to generate slides with Gemini
app.post("/api/generate-ppt", async (req, res) => {
  try {
    const { topic, rawContent, tone, slideCount = 6 } = req.body;

    if (!topic && !rawContent) {
       return res.status(400).json({ error: "Please provide either a topic or outline/content for the slides." });
    }

    const ai = getAiClient();

    let userPromptText = "";
    if (rawContent && rawContent.trim().length > 0) {
      userPromptText = `We are generating a PowerPoint-style presentation deck based on the following PROVIDED content:
---
${rawContent}
---
The target slide count is approximately ${slideCount} slides. Please synthesize, summarize, and layout the provided text into the presentation slides.
The requested tone is: ${tone || "Professional and engaging"}. Please do NOT invent major outside research, but you can add logical headings or short framing where helpful. Ensure slide flow is highly structured and organized.

CRITICAL FOR MALAYALAM (മലയാളം) & DIRECT TEXT TRANSFER:
If the input content contains Malayalam text (മലയാളം unicode characters), you MUST write all slide text, titles, descriptions, bullets, and labels in MALAYALAM. Do NOT translate Malayalam into English. Copy-paste or extract the exact Malayalam sentences, words, and labels directly into the slide elements to preserve the user's uploaded material perfectly.`;
    } else {
      userPromptText = `We are generating a highly engaging, professional PowerPoint-style presentation deck based on the following TOPIC:
"${topic}"
The target slide count is ${slideCount} slides.
The requested tone of the slides is: ${tone || "Professional, modern, and engaging"}.

CRITICAL FOR MALAYALAM (മലയാളം) & DIRECT TEXT TRANSFER:
If the topic or query contains Malayalam text (മലയാളം unicode characters), you MUST write all slide text, titles, descriptions, bullets, and labels in MALAYALAM. Do NOT translate Malayalam into English. Create the presentation in Malayalam.`;
    }

    const systemInstruction = `You are an elite, professional presentation and slide design architect. Your goal is to structure high-impact slides.
Follow these rigid slide design principles:
1. First slide (Slide 1) MUST always utilize the "title" layout (intended as the cover/introduction slide of the deck).
2. Bullet points MUST be snappy (maximum 1-2 lines each, clear, crisp ideas, list-oriented).
3. Do not over-clutter slides. Keep slide body concise.
4. Design a dynamic rhythm of visual layouts. Available layouts and their intended use cases:
   - "title": Only for the deck cover/intro. Needs a clear title & optional subtitle.
   - "content": Standard punchy bullet list slide (at least 2-4 bullets, maybe with thin subtitles).
   - "split": A dual-column layout. Use bullets on one side and a short body paragraph/extra details on the other.
   - "numeric": Focus on a single striking metric or big statistic (e.g. "87%", "$4.3B", "Top 5", "10x"). Highlight the stat number and explain it with a text stat label.
   - "quote": An elegant full-slide quote with the text and author name, great for highlighting key voices or critical summary take-aways.
5. Do NOT consecutive-repeat layouts if you can avoid it (except 'content' is okay once in a while, but break it up with 'numeric', 'split', or 'quote' to make the presentation extremely engaging to look at!).
6. LANGUAGE & SCRIPT FIDELITY: If the user provides Malayalam (മലയാളം) script or other non-English script, you MUST output the slide information in that exact script/language. Do NOT translate it to English. Copy-paste key lines directly from the user's text into the slides.
7. Strictly return only JSON matching the schema. Do not output conversational text or markdown wrappers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPromptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["title", "slides"],
          properties: {
            title: {
              type: Type.STRING,
              description: "The complete name/title of this slide deck",
            },
            slides: {
              type: Type.ARRAY,
              description: "Sequential list of presentation slides",
              items: {
                type: Type.OBJECT,
                required: ["title", "layout"],
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "Captivating and concise slide title (3-7 words recommended)",
                  },
                  subtitle: {
                    type: Type.STRING,
                    description: "Optional thin subtitle for further context (1 sentence max)",
                  },
                  layout: {
                    type: Type.STRING,
                    enum: ["title", "content", "split", "numeric", "quote"],
                    description: "Select the slide visual composition",
                  },
                  bullets: {
                    type: Type.ARRAY,
                    description: "Snappy, concise bullet points for 'content' or 'split' layouts.",
                    items: { type: Type.STRING }
                  },
                  paragraphs: {
                    type: Type.ARRAY,
                    description: "Short descriptive body text blocks (mainly used in 'split' and 'content' layouts)",
                    items: { type: Type.STRING }
                  },
                  statNumber: {
                    type: Type.STRING,
                    description: "Striking number/percentage for the 'numeric' layout (e.g., '92%')",
                  },
                  statLabel: {
                    type: Type.STRING,
                    description: "Brief text explaining the statistic number (e.g., 'efficiency increase')",
                  },
                  quoteText: {
                    type: Type.STRING,
                    description: "Body of the key quote for the 'quote' layout",
                  },
                  quoteAuthor: {
                    type: Type.STRING,
                    description: "Person, company, or citation for the quote layout (e.g., 'Ada Lovelace, 1843')",
                  }
                }
              }
            }
          }
        }
      }
    });

    const textOfResponse = response.text;
    if (!textOfResponse) {
      throw new Error("No response content from Gemini model.");
    }

    const pptData = JSON.parse(textOfResponse);
    res.json(pptData);
  } catch (error: any) {
    console.error("Gemini PPT Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate presentation slides." });
  }
});

// Configure Vite or Static server
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
