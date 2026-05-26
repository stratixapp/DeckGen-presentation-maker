import pptxgen from "pptxgenjs";
import { type Presentation } from "../types";

export function exportToPPTX(presentation: Presentation, themeId: string, customBgHex?: string, customTextHex?: string) {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  // Explicit theme color definitions mapping nicely to PPT Hex values
  const themeColors = {
    geometric: { bg: 'FFFFFF', text: '0F172A', accent: '4F46E5', secondary: '64748B' },
    cosmic: { bg: '020617', text: 'FFFFFF', accent: '22D3EE', secondary: '9FADBD' },
    nordic: { bg: 'F4F4F5', text: '18181B', accent: '4F46E5', secondary: '52525B' },
    editorial: { bg: 'FFFDF9', text: '1C1917', accent: '854D00', secondary: '57534E' },
    cyberpunk: { bg: '000000', text: 'FFFFFF', accent: 'FACC15', secondary: 'A1A1AA' },
    forest: { bg: '022C22', text: 'F0FDF4', accent: '2DD4BF', secondary: 'A7F3D0' }
  };

  const defaultThemeColors = themeColors[themeId as keyof typeof themeColors] || themeColors.cosmic;
  
  // Clone colors to avoid modifying global structures
  const colors = { ...defaultThemeColors };

  if (customBgHex && customBgHex.trim() !== "") {
    // Strip leading # if present
    colors.bg = customBgHex.replace("#", "").trim();
  }
  if (customTextHex && customTextHex.trim() !== "") {
    colors.text = customTextHex.replace("#", "").trim();
  }

  presentation.slides.forEach((slide) => {
    const pptxSlide = pptx.addSlide();
    
    // Set active background details
    pptxSlide.background = { fill: colors.bg };

    if (slide.layout === 'title') {
      // Main Center Cover Title Slide
      pptxSlide.addText(slide.title, {
        x: 1.0,
        y: 2.2,
        w: 8.0,
        h: 1.5,
        fontSize: 34,
        bold: true,
        fontFace: 'Georgia',
        color: colors.text,
        align: 'center'
      });

      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: 1.0,
          y: 3.8,
          w: 8.0,
          h: 0.8,
          fontSize: 15,
          fontFace: 'Arial',
          color: colors.accent,
          align: 'center'
        });
      }
    } else if (slide.layout === 'numeric') {
      // Metric stat slide layout (large numeric value emphasis)
      pptxSlide.addText(slide.title, {
        x: 0.6,
        y: 0.5,
        w: 8.8,
        h: 0.6,
        fontSize: 18,
        bold: true,
        fontFace: 'Arial',
        color: colors.accent
      });

      if (slide.statNumber) {
        pptxSlide.addText(slide.statNumber, {
          x: 1.0,
          y: 1.6,
          w: 8.0,
          h: 1.8,
          fontSize: 80,
          bold: true,
          fontFace: 'Arial',
          color: colors.text,
          align: 'center'
        });
      }

      if (slide.statLabel) {
        pptxSlide.addText(slide.statLabel, {
          x: 1.0,
          y: 3.6,
          w: 8.0,
          h: 1.2,
          fontSize: 15,
          fontFace: 'Arial',
          color: colors.secondary,
          align: 'center'
        });
      }
    } else if (slide.layout === 'quote') {
      // Hero quote block layout (full italic quotation block)
      if (slide.quoteText) {
        pptxSlide.addText(`"${slide.quoteText}"`, {
          x: 1.2,
          y: 1.8,
          w: 7.6,
          h: 2.0,
          fontSize: 20,
          italic: true,
          fontFace: 'Georgia',
          color: colors.text,
          align: 'center'
        });
      }

      if (slide.quoteAuthor) {
        pptxSlide.addText(`— ${slide.quoteAuthor}`, {
          x: 1.2,
          y: 4.1,
          w: 7.6,
          h: 0.5,
          fontSize: 13,
          bold: true,
          fontFace: 'Arial',
          color: colors.accent,
          align: 'center'
        });
      }
    } else if (slide.layout === 'split') {
      // Split 2-column layout (bullet list in column 1, detailed paragraph in column 2)
      pptxSlide.addText(slide.title, {
        x: 0.6,
        y: 0.5,
        w: 8.8,
        h: 0.6,
        fontSize: 20,
        bold: true,
        fontFace: 'Arial',
        color: colors.accent
      });

      // Left column: Bullet details
      if (slide.bullets && slide.bullets.length > 0) {
        const bulletLines = slide.bullets.map(b => ({ text: b, options: { bullet: true, color: colors.text } }));
        pptxSlide.addText(bulletLines, {
          x: 0.6,
          y: 1.4,
          w: 4.1,
          h: 3.8,
          fontSize: 13,
          fontFace: 'Arial',
          color: colors.text
        });
      }

      // Right column: Paragraph explanation blocks
      if (slide.paragraphs && slide.paragraphs.length > 0) {
        const fullParaText = slide.paragraphs.join('\n\n');
        pptxSlide.addText(fullParaText, {
          x: 5.1,
          y: 1.4,
          w: 4.1,
          h: 3.8,
          fontSize: 13,
          color: colors.secondary,
          fontFace: 'Arial'
        });
      }
    } else if (slide.layout === 'grid') {
      pptxSlide.addText(slide.title, {
        x: 0.6,
        y: 0.5,
        w: 8.8,
        h: 0.6,
        fontSize: 20,
        bold: true,
        fontFace: 'Arial',
        color: colors.accent
      });
      [0, 1, 2, 3].map((gridIdx) => {
        const itemVal = (slide.bullets || [])[gridIdx] || (slide.paragraphs || [])[gridIdx - (slide.bullets || []).length] || `Topic Element ${gridIdx + 1}`;
        const xPos = 0.6 + gridIdx * 2.2;
        pptxSlide.addText(`0${gridIdx+1}\n\n${itemVal}`, {
          x: xPos,
          y: 1.4,
          w: 2.0,
          h: 3.6,
          fontSize: 12,
          fontFace: 'Arial',
          color: colors.text,
          fill: { color: colors.bg === 'FFFFFF' || colors.bg === 'FFFDF9' ? 'F1F5F9' : '1E293B' }
        });
      });
    } else if (slide.layout === 'comparison') {
      pptxSlide.addText(slide.title, {
        x: 0.6,
        y: 0.5,
        w: 8.8,
        h: 0.6,
        fontSize: 20,
        bold: true,
        fontFace: 'Arial',
        color: colors.accent,
        align: 'center'
      });
      
      const leftText1 = (slide.bullets || [])[0] || "Entity A Core Statement";
      const leftText2 = (slide.bullets || [])[1] || "Supplementary parameter details...";
      pptxSlide.addText(`Category Left Panel\n\n${leftText1}\n\n${leftText2}`, {
        x: 0.6,
        y: 1.4,
        w: 4.1,
        h: 3.6,
        fontSize: 13,
        fontFace: 'Arial',
        color: colors.text,
        fill: { color: colors.bg === 'FFFFFF' || colors.bg === 'FFFDF9' ? 'EEF2FF' : '172554' }
      });
      
      const rightText1 = (slide.paragraphs || [])[0] || "Entity B Core Statement";
      const rightText2 = (slide.paragraphs || [])[1] || "Supplementary comparative parameters...";
      pptxSlide.addText(`Category Right Panel\n\n${rightText1}\n\n${rightText2}`, {
        x: 5.1,
        y: 1.4,
        w: 4.1,
        h: 3.6,
        fontSize: 13,
        fontFace: 'Arial',
        color: colors.text,
        fill: { color: colors.bg === 'FFFFFF' || colors.bg === 'FFFDF9' ? 'ECFDF5' : '022C22' }
      });
    } else if (slide.layout === 'timeline') {
      pptxSlide.addText(slide.title, {
        x: 0.6,
        y: 0.5,
        w: 8.8,
        h: 0.6,
        fontSize: 20,
        bold: true,
        fontFace: 'Arial',
        color: colors.accent
      });
      [0, 1, 2, 3].map((stepIdx) => {
        const stepText = (slide.bullets || [])[stepIdx] || (slide.paragraphs || [])[stepIdx - (slide.bullets || []).length] || `Milestone ${stepIdx + 1}`;
        const xPos = 0.6 + stepIdx * 2.2;
        pptxSlide.addText(`Step ${stepIdx + 1}\n\n${stepText}`, {
          x: xPos,
          y: 1.6,
          w: 2.0,
          h: 3.2,
          fontSize: 11,
          fontFace: 'Arial',
          color: colors.text,
          align: 'center',
          fill: { color: colors.bg === 'FFFFFF' || colors.bg === 'FFFDF9' ? 'F8FAFC' : '0F172A' }
        });
      });
    } else if (slide.layout === 'hero') {
      pptxSlide.addText('Highlight Focal Point', {
        x: 1.0,
        y: 1.2,
        w: 8.0,
        h: 0.4,
        fontSize: 11,
        bold: true,
        fontFace: 'Arial',
        color: colors.accent,
        align: 'center'
      });
      pptxSlide.addText(slide.title, {
        x: 1.0,
        y: 1.8,
        w: 8.0,
        h: 1.8,
        fontSize: 24,
        bold: true,
        fontFace: 'Arial',
        color: colors.text,
        align: 'center'
      });
      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: 1.0,
          y: 3.8,
          w: 8.0,
          h: 1.0,
          fontSize: 13,
          fontFace: 'Arial',
          color: colors.secondary,
          align: 'center'
        });
      }
    } else {
      // Standard layout: Content slide with header and sequential bullets/paragraphs
      pptxSlide.addText(slide.title, {
        x: 0.6,
        y: 0.5,
        w: 8.8,
        h: 0.6,
        fontSize: 20,
        bold: true,
        fontFace: 'Arial',
        color: colors.accent
      });

      if (slide.subtitle) {
        pptxSlide.addText(slide.subtitle, {
          x: 0.6,
          y: 1.0,
          w: 8.8,
          h: 0.4,
          fontSize: 12,
          italic: true,
          fontFace: 'Arial',
          color: colors.secondary
        });
      }

      if (slide.bullets && slide.bullets.length > 0) {
        const bulletLines = slide.bullets.map(b => ({ text: b, options: { bullet: true, color: colors.text } }));
        pptxSlide.addText(bulletLines, {
          x: 0.6,
          y: 1.5,
          w: 8.8,
          h: 3.7,
          fontSize: 14,
          fontFace: 'Arial',
          color: colors.text
        });
      } else if (slide.paragraphs && slide.paragraphs.length > 0) {
        const paragraphText = slide.paragraphs.join('\n\n');
        pptxSlide.addText(paragraphText, {
          x: 0.6,
          y: 1.5,
          w: 8.8,
          h: 3.7,
          fontSize: 13,
          fontFace: 'Arial',
          color: colors.text
        });
      }
    }
  });

  const rawTitle = presentation.title || "AI_Presentation";
  const sanitizedTitle = rawTitle.replace(/[\/\\:\*\?"<>\|]/g, "_");
  pptx.writeFile({ fileName: `Presentation_${sanitizedTitle}.pptx` });
}
