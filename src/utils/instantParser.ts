import { Slide, SlideLayout } from "../types";

/**
 * Parses user input content strictly and accurately without any external AI,
 * preserving exactly what was uploaded (e.g., Malayalam unicode script or any text)
 * and placing it into pre-templated visual slide layouts.
 * 
 * Scaled and padded to match any target count (up to 100) by splitting lists and paragraphs.
 */
export function parseContentToSlides(text: string, slideCountTarget: number): Slide[] {
  const cleanText = text.trim();
  if (!cleanText) return [];

  // 1. Initial splitting to discover paragraphs/bullets or outline blocks
  let sections: string[] = [];

  if (cleanText.includes("---")) {
    // Split by Markdown slides separator
    sections = cleanText.split(/\r?\s*---\s*\r?\n/);
  } else if (/\r?\n\s*(?:Slide|Page|SLIDE|PAGE)\s*(?:\d+)/i.test(cleanText)) {
    // Split by page markers
    sections = cleanText.split(/\r?\n\s*(?:Slide|Page|SLIDE|PAGE)\s*(?:\d+)\s*:?/i);
  } else if (cleanText.split(/\r?\n\r?\n\r?\n/).length > 1) {
    sections = cleanText.split(/\r?\n\r?\n\r?\n/);
  } else {
    sections = cleanText.split(/\r?\n\r?\n+/);
  }

  sections = sections.map(s => s.trim()).filter(Boolean);

  // Collect all distinct lines of text to allow smart expansion if slideCountTarget is high (e.g., >= 15 slides)
  const allLines = cleanText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  // Let's build a roster of individual slide-worthy items
  let itemsToDistribute: Array<{ title: string; content: string[]; isList: boolean }> = [];

  sections.forEach((section, idx) => {
    const lines = section.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const title = lines[0].replace(/^[#\-\*\+•\s\d\.\:]+/, "").trim();
    const body = lines.slice(1);

    if (body.length > 3 && slideCountTarget >= 30) {
      // Split this section up to help meet the high slide page requirements!
      body.forEach((bLine, bIdx) => {
        itemsToDistribute.push({
          title: `${title} - Part ${bIdx + 1}`,
          content: [bLine],
          isList: bLine.startsWith("-") || bLine.startsWith("*") || bLine.startsWith("•")
        });
      });
    } else {
      itemsToDistribute.push({
        title: title || `Chapter ${idx + 1}`,
        content: body,
        isList: body.some(b => b.startsWith("-") || b.startsWith("*") || b.startsWith("•"))
      });
    }
  });

  // If still too short for target count (need up to 50+), split every single non-empty line into its own slide!
  if (itemsToDistribute.length < slideCountTarget && allLines.length > itemsToDistribute.length) {
    const newDistributed: typeof itemsToDistribute = [];
    allLines.forEach((line, index) => {
      const cleanLine = line.replace(/^[#\-\*\+•\s\d\.\:]+/, "").trim();
      if (cleanLine.length < 3) return;

      // Group every few lines so it doesn't get ridiculously empty
      newDistributed.push({
        title: cleanLine.length < 50 ? cleanLine : `Section ${index + 1}`,
        content: [line],
        isList: line.startsWith("-") || line.startsWith("*") || line.startsWith("•")
      });
    });
    if (newDistributed.length > itemsToDistribute.length) {
      itemsToDistribute = newDistributed;
    }
  }

  // Define layout cyclic rotation list so "more pretemplate" designs are evenly distributed
  const layoutRotation: SlideLayout[] = [
    "title",
    "content", 
    "split", 
    "grid", 
    "comparison", 
    "timeline", 
    "hero", 
    "numeric", 
    "quote"
  ];

  let slides: Slide[] = [];

  for (let idx = 0; idx < Math.max(slideCountTarget, itemsToDistribute.length); idx++) {
    // If we ran out of user content, cycle or padded copy-paste elements to ensure we meet the exact user count
    const item = itemsToDistribute[idx % itemsToDistribute.length] || {
      title: `Continuation Section`,
      content: [`Supporting presentation points detailing key factors.`],
      isList: false
    };

    const cleanTitle = item.title.replace(/^[#\-\*\+•\s\d\.\:]+/, "").trim();
    const remainingText = item.content.map(c => c.replace(/^[#\-\*\+•\s\d\.\:]+/, "").trim());
    const hasTopic = remainingText.length > 0;

    // Cycle themes / layouts
    let layout: SlideLayout = "content";
    if (idx === 0) {
      layout = "title";
    } else if (!hasTopic) {
      // If there is no topic details, use high impact "hero" layout so it serves as a crisp headline slide
      layout = "hero";
    } else {
      // Rotate through our pre-templates evenly
      layout = layoutRotation[idx % layoutRotation.length];
      if (layout === "title") {
        // Only one true Title cover slide, use standard layout for internal pages
        layout = "content";
      }
    }

    // Generate balanced items for advanced layouts - keep empty arrays if no topic is provided
    const bullets = hasTopic ? remainingText : [];
    const paragraphs = remainingText.length > 1 ? remainingText.slice(1) : (hasTopic ? [remainingText[0] || ""] : []);

    // Fill in placeholders specifically tailored to layout structure
    const statNumber = "50+";
    const statLabel = cleanTitle || "Scaling Metrics";
    
    const quoteText = hasTopic ? (remainingText[0] || "") : "";
    const quoteAuthor = "";

    slides.push({
      id: `instant_${idx}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: cleanTitle || `Slide ${idx + 1}`,
      subtitle: idx === 0 ? "Direct Text Presentation" : "",
      layout,
      bullets,
      paragraphs,
      statNumber,
      statLabel,
      quoteText,
      quoteAuthor
    });
  }

  // Constrain exactly to target count
  return slides.slice(0, slideCountTarget);
}
