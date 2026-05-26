import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Presentation as PresentationIcon, 
  Download, 
  Trash2, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Monitor, 
  Layers, 
  Heading, 
  List, 
  Hash, 
  Quote as QuoteIcon, 
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  FileText,
  MousePointer,
  HelpCircle,
  Copy,
  PlusCircle,
  CheckCircle2,
  XCircle,
  Settings,
  User,
  CreditCard,
  LogOut,
  LogIn,
  Palette
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  type Slide, 
  type Presentation, 
  type PresentationTheme, 
  SlideLayout, 
  THEMES 
} from "./types";
import { exportToPPTX } from "./utils/pptxExport";
import { parseContentToSlides } from "./utils/instantParser";

// Elite rich default presentation to make the application immediately beautiful
const DEFAULT_PRESENTATION: Presentation = {
  id: "kepler-transit",
  title: "Kepler & Transit Photometry",
  themeId: "geometric",
  slides: [
    {
      id: "slide_1",
      title: "Kepler: Searching for Earths",
      subtitle: "Discovering Exoplanets via Transit Photometry",
      layout: "title"
    },
    {
      id: "slide_2",
      title: "How Transit Photometry Works",
      subtitle: "Detecting minuscule periodic dips in distant stellar luminosity",
      layout: "content",
      bullets: [
        "Monitors the brightness of over 150,000 target stars simultaneously.",
        "Detects minuscule periodic drops in light as planets cross the stellar disk.",
        "Accurately measures planet diameter based on depth of the light dip."
      ]
    },
    {
      id: "slide_3",
      title: "High-Precision Instrumentation",
      subtitle: "Optimized for continuous, ultra-fine photometer readings",
      layout: "split",
      bullets: [
        "0.95-meter telescope aperture with wide-field Schmidt corrector lens.",
        "Equipped with a solid-state camera housing 42 high-sensitivity CCD sensors."
      ],
      paragraphs: [
        "Positioned in an Earth-trailing heliocentric orbit, shielding the photometer from terrestrial light pollution and continuous orbital shifts."
      ]
    },
    {
      id: "slide_4",
      title: "Kepler's Historic Impact",
      layout: "numeric",
      statNumber: "2,709",
      statLabel: "Confirmed exoplanets discovered during Kepler's operation, proving planets are scientifically ubiquitous."
    },
    {
      id: "slide_5",
      title: "Science as a Gift",
      layout: "quote",
      quoteText: "Science is a beautiful gift to humanity; we should not distort it. It is through continuous observations that we reveal the true cosmos.",
      quoteAuthor: "A. P. J. Abdul Kalam, Aerospace Pioneer"
    }
  ]
};

export default function App() {
  // Navigation / App State
  const [presentation, setPresentation] = useState<Presentation>(DEFAULT_PRESENTATION);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [selectedThemeId, setSelectedThemeId] = useState<string>("geometric");
  
  // App navigation state: first starts with heavy landing welcome screen
  const [currentScreen, setCurrentScreen] = useState<"intro" | "workspace">("intro");
  const [introStep, setIntroStep] = useState<"welcome" | "input">("welcome");

  // Custom Color Override States (Hex values style injection)
  const [customBgColor, setCustomBgColor] = useState<string>("");
  const [customTextColor, setCustomTextColor] = useState<string>("");
  const [customAccentColor, setCustomAccentColor] = useState<string>("");

  // Settings, Accounts & Subscription Simulation
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authEmailInput, setAuthEmailInput] = useState<string>("");
  const [user, setUser] = useState<{ email: string; isPro: boolean; joinDate: string } | null>({
    email: "ananthus1221@gmail.com",
    isPro: true,
    joinDate: "May 2026"
  });
  const [checkoutStep, setCheckoutStep] = useState<"none" | "paying" | "success">("none");
  const [tempCardNumber, setTempCardNumber] = useState<string>("");
  
  // Custom Generation States
  const [inputMode, setInputMode] = useState<"topic" | "raw">("topic");
  const [topic, setTopic] = useState<string>("");
  const [rawContent, setRawContent] = useState<string>("");
  const [tone, setTone] = useState<string>("Professional & modern");
  const [slideCount, setSlideCount] = useState<number>(6);
  
  // System states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPreviewingFullscreen, setIsPreviewingFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Active theme configuration
  const theme = THEMES[selectedThemeId] || THEMES.cosmic;
  const currentSlide = presentation.slides[activeSlideIndex] || presentation.slides[0] || null;

  // Sync presentation theme
  useEffect(() => {
    setPresentation((prev) => ({
      ...prev,
      themeId: selectedThemeId
    }));
  }, [selectedThemeId]);

  // Unified Simulated Global Overlay Modals (Pricing Checkout, Account Auth & Settings Panels)
  const renderGlobalModals = () => {
    const [settingsTab, setSettingsTab] = useState<"about" | "price" | "regional">("about");

    return (
      <AnimatePresence>
        {/* simulated authentication system modal */}
        {isAuthOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0b0e22] border border-indigo-950 rounded-2xl p-6 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setIsAuthOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-950 flex items-center justify-center mb-4 border border-indigo-900">
                  <User className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Simulated Account Sign In</h3>
                <p className="text-xs text-slate-400 mb-6 font-sans leading-relaxed">
                  Register or login with a demo profile to back up presentation drafts securely.
                </p>

                <div className="w-full space-y-3.5 mb-6 text-left">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 align-left">Email Address</label>
                    <input 
                      type="email"
                      value={authEmailInput}
                      onChange={(e) => setAuthEmailInput(e.target.value)}
                      placeholder="e.g. ananthus1221@gmail.com"
                      className="w-full bg-[#070a1a] border border-indigo-900/40 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-550"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 w-full">
                  <button 
                    onClick={() => {
                      if (!authEmailInput.trim()) {
                        alert("Please specify a valid email address first.");
                        return;
                      }
                      setUser({
                        email: authEmailInput,
                        isPro: authEmailInput.includes("ananthus") || authEmailInput.includes("pro"),
                        joinDate: "May 2026"
                      });
                      setIsAuthOpen(false);
                    }}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-750 rounded-lg text-xs font-bold text-white hover:shadow-indigo-500/10 transition border border-indigo-500"
                  >
                    Login / Sign In
                  </button>
                  <button 
                    onClick={() => {
                      setAuthEmailInput("ananthus1221@gmail.com");
                    }}
                    className="p-2 px-3 bg-slate-900 hover:bg-slate-800 text-slate-350 border border-slate-800 rounded-lg text-[10px] uppercase font-bold"
                  >
                    Fill Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Pricing Pro Upgrade checkout modal */}
        {isPricingOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0b0e24] border border-indigo-900 rounded-2xl p-6 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setIsPricingOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                <XCircle className="w-5 h-5" />
              </button>

              {checkoutStep === "none" && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="p-1 px-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono text-[9px] font-black uppercase">Professional Tier Upgrade</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Activate DeckGen Pro Support</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed mb-6 font-sans">
                    Enable lifetime slide count expansion, custom palette pickers, and priority export. Just ₹49 INR (approx $0.60 USD).
                  </p>

                  <div className="space-y-3 mb-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Card Number</label>
                      <input 
                        type="text" 
                        value={tempCardNumber} 
                        onChange={(e) => setTempCardNumber(e.target.value)} 
                        placeholder="4111 2222 3333 4444" 
                        className="w-full bg-[#070a1a] border border-indigo-900/40 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="12/28" 
                          className="w-full bg-[#070a1a] border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Security CVV</label>
                        <input 
                          type="password" 
                          placeholder="***" 
                          maxLength={3} 
                          className="w-full bg-[#070a1a] border border-indigo-900/40 rounded-xl px-3 py-2 text-xs text-slate-100" 
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => setTempCardNumber("4111 5050 9000 1200")} 
                      className="text-[9px] font-bold text-indigo-400 hover:underline hover:text-indigo-300 block text-right mt-1"
                    >
                      Prefill Test Card Sandbox Credentials
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      setCheckoutStep("paying");
                      // Mimic high end safe banking sequence
                      setTimeout(() => {
                        setCheckoutStep("success");
                        setUser(prev => prev ? { ...prev, isPro: true } : { email: "ananthus1221@gmail.com", isPro: true, joinDate: "May 2026" });
                      }, 2500);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-650 hover:to-amber-500 text-slate-950 rounded-xl font-extrabold text-xs tracking-wider transition uppercase shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 shrink-0" /> Pay ₹49 INR Securely
                  </button>
                </div>
              )}

              {checkoutStep === "paying" && (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-950 border-t-amber-400 animate-spin" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">Routing Safe Gateway Connection</h3>
                  <p className="text-[11px] text-slate-400 animate-pulse font-mono">Verifying ₹49 simulated processing pipeline...</p>
                </div>
              )}

              {checkoutStep === "success" && (
                <div className="py-6 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Simulated Checkout Success!</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm mb-6">
                    Payment receipt issued successfully. Your user account <strong className="text-white">{(user && user.email) || "ananthus1221@gmail.com"}</strong> has been upgraded permanently to PRO rank!
                  </p>
                  <button 
                    onClick={() => setIsPricingOpen(false)}
                    className="px-6 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-xs font-bold font-sans transition"
                  >
                    Proceed with Pro Slides
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}

        {/* System Settings & Parameter Customizer Modal */}
        {isSettingsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0b0e24] border border-indigo-900 rounded-2xl p-6 max-w-lg w-full relative"
            >
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4 border-b border-indigo-950 pb-2.5">
                <Settings className="w-4 h-4 text-indigo-400" /> DeckGen Pro Configuration
              </h2>

              {/* Tab Selector controls */}
              <div className="flex bg-[#07091c] p-1 border border-indigo-900/30 rounded-xl mb-4 text-xs font-medium">
                <button 
                  onClick={() => setSettingsTab("about")}
                  className={`flex-1 py-1.5 rounded-lg font-bold uppercase text-[10px] tracking-wider transition ${settingsTab === "about" ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  About Version
                </button>
                <button 
                  onClick={() => setSettingsTab("price")}
                  className={`flex-1 py-1.5 rounded-lg font-bold uppercase text-[10px] tracking-wider transition ${settingsTab === "price" ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Price features (₹49)
                </button>
                <button 
                  onClick={() => setSettingsTab("regional")}
                  className={`flex-1 py-1.5 rounded-lg font-bold uppercase text-[10px] tracking-wider transition ${settingsTab === "regional" ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-white"}`}
                >
                  Regional parser
                </button>
              </div>

              {/* Tab content renderer */}
              <div className="text-left py-2 font-sans text-xs">
                {settingsTab === "about" && (
                  <div className="space-y-3.5">
                    <div className="bg-[#070a1a] p-4 border border-indigo-950 rounded-xl">
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-1.5 font-bold">Release Metadata</div>
                      <div className="grid grid-cols-2 gap-y-2 text-white">
                        <div>App Version:</div>
                        <div className="font-mono text-cyan-400">v2.5.4 (Enterprise Target)</div>
                        <div>Render Environment:</div>
                        <div className="font-mono text-cyan-400">Vite React SPA Sandboxed</div>
                        <div>Target Presentation Standard:</div>
                        <div className="font-mono text-cyan-400">Microsoft PowerPoint (.pptx)</div>
                        <div>Local Persistent Database:</div>
                        <div className="font-yellow-400">Online & Verified</div>
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
                      This presentation builder implements high fidelity dual-column structures, statistical layouts, timeline processing components, and grid layouts on the client-side for zero latency design transitions.
                    </p>
                  </div>
                )}

                {settingsTab === "price" && (
                  <div className="space-y-4">
                    <div className="bg-[#070a1a] p-4 border border-indigo-950 rounded-xl relative overflow-hidden">
                      <div className="absolute top-2 right-2 flex items-center justify-center bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Premium Plan Active
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">One Month Support tier</h4>
                      <p className="text-xs text-slate-400 mb-4 text-[11px] leading-relaxed">
                        A dynamic flat pricing model supporting localized indie development and low latency slide exports.
                      </p>
                      <div className="text-lg font-black text-white flex items-baseline gap-1.5">
                        <span>₹49 INR</span>
                        <span className="text-xs text-slate-500 font-normal">/ month subscription tier</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 items-center justify-between border-t border-indigo-950 pt-3">
                      <div>
                        {user?.isPro ? (
                          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" /> Pro member privileges enabled!
                          </div>
                        ) : (
                          <div className="text-xs text-[#ef4444] font-bold">
                            Free tier limits (Limit 3 basic styles)
                          </div>
                        )}
                      </div>
                      {!user?.isPro && (
                        <button 
                          onClick={() => {
                            setIsPricingOpen(true);
                            setIsSettingsOpen(false);
                            setCheckoutStep("none");
                          }}
                          className="p-2 px-4 bg-amber-500 hover:bg-amber-600 rounded-lg text-slate-950 font-bold font-sans text-xs shadow-md transition"
                        >
                          Upgrade to Pro (₹49)
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {settingsTab === "regional" && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-white">Unicode Direct Malayalam Conversions</h4>
                    <p className="text-slate-450 leading-relaxed text-[11px] text-slate-400">
                      Our custom inline parser strictly bypasses third-party translation models when using the exact raw input mode. Paste Malayalam outline lists directly, and the generator maps them slide-for-slide to beautiful pre-templated text structures ensuring 100% letter preservation.
                    </p>
                    <div className="bg-slate-900/30 p-2 border border-slate-800 rounded font-mono text-[10px] text-zinc-350">
                      മലയാളം ഭാഷാ പിന്തുണ പൂർണ്ണമായും സുരക്ഷിതമാണ്.
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Handle Fullscreen Presenter Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPreviewingFullscreen) return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        goToPrevSlide();
      } else if (e.key === "Escape") {
        setIsPreviewingFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewingFullscreen, activeSlideIndex, presentation.slides.length]);

  const goToNextSlide = () => {
    setActiveSlideIndex((prev) => Math.min(prev + 1, presentation.slides.length - 1));
  };

  const goToPrevSlide = () => {
    setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  // PowerPoint export
  const handleExport = () => {
    try {
      exportToPPTX(presentation, selectedThemeId, customBgColor, customTextColor);
    } catch (err: any) {
      console.error(err);
      alert("Failed to export. Please check the slide data.");
    }
  };

  // AI presentation content generators
  const triggerAIGenerator = async () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage("Connecting to server-side Gemini intelligence...");

    // Stagger loading messages for nice mood and look
    const statusSteps = [
      "Analyzing provided guidelines and tone parameters...",
      "Defining dynamic visual layouts... ('Split', 'Numeric', 'Quote')",
      "Drafting elegant titles and summarizing dense paragraphs...",
      "Formatting clean slide lists and finalizing structural elements..."
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < statusSteps.length) {
        setStatusMessage(statusSteps[currentStepIndex]);
        currentStepIndex++;
      }
    }, 1800);

    try {
      // Automatically detect Malayalam script and enforce strict script fidelity
      const textToScan = inputMode === "topic" ? topic : rawContent;
      const containsMalayalam = /[\u0D00-\u0D7F]/.test(textToScan || "");
      const finalTone = containsMalayalam 
        ? "Strict Direct Malayalam (മലയാളം) - Exact Copy-Paste with no translation or summarization" 
        : tone;

      const response = await fetch("/api/generate-ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: inputMode === "topic" ? topic : "",
          rawContent: inputMode === "raw" ? rawContent : "",
          tone: finalTone,
          slideCount
        }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "The server returned a compilation issue.");
      }

      const generatedData = await response.json();
      
      // Map generated schema to presentation state, injecting unique ID hashes
      const structuredPresentation: Presentation = {
        id: `ppt_${Date.now()}`,
        title: generatedData.title || (inputMode === "topic" ? topic : "Custom Output Deck"),
        themeId: selectedThemeId,
        slides: (generatedData.slides || []).map((s: any, idx: number) => ({
          id: `slide_${Date.now()}_${idx}`,
          title: s.title || "Untitled Slide",
          subtitle: s.subtitle || "",
          layout: s.layout || "content",
          bullets: s.bullets || [],
          paragraphs: s.paragraphs || [],
          statNumber: s.statNumber || "",
          statLabel: s.statLabel || "",
          quoteText: s.quoteText || "",
          quoteAuthor: s.quoteAuthor || ""
        }))
      };

      if (structuredPresentation.slides.length === 0) {
        throw new Error("No slides returned. Please write a clearer topic prompt.");
      }

      setPresentation(structuredPresentation);
      setActiveSlideIndex(0);
      setStatusMessage("");
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setError(err.message || "An unexpected network breakdown occurred. Please verify your GEMINI_API_KEY settings.");
    } finally {
      setIsLoading(false);
    }
  };

  // Instant local parser - completely client-side (no AI, offline safe, preserves user's exact content)
  const triggerInstantConverter = () => {
    setIsLoading(true);
    setError(null);
    setStatusMessage("Instantly converting raw text to slide structures...");

    setTimeout(() => {
      try {
        const textToParse = inputMode === "topic" ? topic : rawContent;
        if (!textToParse.trim()) {
          throw new Error("No text has been entered to translate. Please paste or enter text first.");
        }

        const parsedSlides = parseContentToSlides(textToParse, slideCount);
        
        if (parsedSlides.length === 0) {
          throw new Error("No structured slides could be converted. Try adding multiple lines of text.");
        }

        const structuredPresentation: Presentation = {
          id: `ppt_local_${Date.now()}`,
          title: parsedSlides[0]?.title || (inputMode === "topic" ? topic : "Uploaded Presentation"),
          themeId: selectedThemeId,
          slides: parsedSlides
        };

        setPresentation(structuredPresentation);
        setActiveSlideIndex(0);
        setStatusMessage("");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Could not complete content conversion. Please check your text structure.");
      } finally {
        setIsLoading(false);
      }
    }, 450);
  };

  // manual slide controls
  const handleAddNewSlide = () => {
    const newSlide: Slide = {
      id: `slide_custom_${Date.now()}`,
      title: "New Custom Slide",
      subtitle: "Add details here",
      layout: "content",
      bullets: ["Enter bullet detail number 1", "Enter bullet detail number 2"],
      paragraphs: ["Add optional wider paragraph texts."]
    };
    
    setPresentation((prev) => {
      const updatedSlides = [...prev.slides];
      // Insert after current index
      updatedSlides.splice(activeSlideIndex + 1, 0, newSlide);
      return { ...prev, slides: updatedSlides };
    });
    setActiveSlideIndex((prev) => prev + 1);
  };

  const handleDeleteSlide = (indexToDelete: number) => {
    if (presentation.slides.length <= 1) {
      alert("A presentation deck must have at least one slide.");
      return;
    }
    
    setPresentation((prev) => {
      const updated = prev.slides.filter((_, idx) => idx !== indexToDelete);
      return { ...prev, slides: updated };
    });

    if (activeSlideIndex >= indexToDelete) {
      setActiveSlideIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleDuplicateSlide = (idx: number) => {
    const slideToCopy = presentation.slides[idx];
    const duplicated: Slide = {
      ...slideToCopy,
      id: `slide_dup_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: `${slideToCopy.title} (Copy)`
    };

    setPresentation((prev) => {
      const updated = [...prev.slides];
      updated.splice(idx + 1, 0, duplicated);
      return { ...prev, slides: updated };
    });
    setActiveSlideIndex(idx + 1);
  };

  const handleMoveSlide = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= presentation.slides.length) return;

    setPresentation((prev) => {
      const updated = [...prev.slides];
      const temp = updated[fromIndex];
      updated[fromIndex] = updated[toIndex];
      updated[toIndex] = temp;
      return { ...prev, slides: updated };
    });
    setActiveSlideIndex(toIndex);
  };

  // edit slide fields
  const handleEditField = (field: keyof Slide, value: any) => {
    setPresentation((prev) => {
      const updated = [...prev.slides];
      updated[activeSlideIndex] = {
        ...updated[activeSlideIndex],
        [field]: value
      };
      return { ...prev, slides: updated };
    });
  };

  const handleEditBullet = (bulletIdx: number, val: string) => {
    if (!currentSlide) return;
    const bullets = [...(currentSlide.bullets || [])];
    bullets[bulletIdx] = val;
    handleEditField("bullets", bullets);
  };

  const handleAddBulletItem = () => {
    if (!currentSlide) return;
    const bullets = [...(currentSlide.bullets || []), "New slide bullet point"];
    handleEditField("bullets", bullets);
  };

  const handleRemoveBulletItem = (bulletIdx: number) => {
    if (!currentSlide) return;
    const bullets = (currentSlide.bullets || []).filter((_, idx) => idx !== bulletIdx);
    handleEditField("bullets", bullets);
  };

  const handleEditParagraph = (paraIdx: number, val: string) => {
    if (!currentSlide) return;
    const paragraphs = [...(currentSlide.paragraphs || [])];
    paragraphs[paraIdx] = val;
    handleEditField("paragraphs", paragraphs);
  };

  const handleAddParagraphItem = () => {
    if (!currentSlide) return;
    const paragraphs = [...(currentSlide.paragraphs || []), "New slide descriptive paragraph text."];
    handleEditField("paragraphs", paragraphs);
  };

  const handleRemoveParagraphItem = (paraIdx: number) => {
    if (!currentSlide) return;
    const paragraphs = (currentSlide.paragraphs || []).filter((_, idx) => idx !== paraIdx);
    handleEditField("paragraphs", paragraphs);
  };

  // High fidelity conditional screen router
  if (currentScreen === "intro") {
    return (
      <div className="min-h-screen bg-[#050814] text-slate-200 flex flex-col font-sans antialiased relative overflow-x-hidden">
        {/* Intricate glowing mesh background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-300px] left-[-300px] w-[800px] h-[800px] rounded-full bg-indigo-950/20 blur-[160px] animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-[-300px] right-[-300px] w-[850px] h-[850px] rounded-full bg-cyan-950/20 blur-[170px] animate-pulse" style={{ animationDuration: '14s' }} />
        </div>

        {/* Dynamic global grid line decoration */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]" 
          style={{ 
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", 
            backgroundSize: "24px 24px" 
          }} 
        />

        {/* Top Minimalist Navigation Header */}
        <header className="relative z-20 border-b border-slate-900/40 bg-[#070b1e]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-650 via-indigo-600 to-cyan-550 rounded flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                DeckGen <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">AI Enterprise</span>
                <span className="text-[9px] font-mono tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-900/60 font-black">
                  PRO v2.5.4
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Subscription pricing indicator */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="hidden sm:flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition"
            >
              <CreditCard className="w-3 h-3 text-amber-400" /> ₹49 Pro Plan Lifetime Status
            </button>

            {/* Profile trigger */}
            {user ? (
              <div className="flex items-center gap-2 bg-[#0d1532] border border-indigo-900/40 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-350">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="max-w-[130px] truncate">{user.email}</span>
                {user.isPro && <span className="text-[9px] bg-amber-400 text-amber-950 px-1 py-0.2 rounded font-black font-mono">PRO</span>}
                <button onClick={() => setUser(null)} className="ml-1 text-red-400 hover:text-red-300 transition" title="Sign Out">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#0d1532] hover:bg-indigo-950/60 text-cyan-400 rounded-lg border border-indigo-900/40 transition shadow"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </button>
            )}

            {/* Config modal button */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-1 px-2.5 text-xs font-semibold bg-[#0d1532] hover:bg-indigo-950/60 text-slate-300 rounded-lg border border-indigo-900/40 transition text-center flex items-center justify-center"
              title="System parameters setup"
            >
              <Settings className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>
        </header>

        {/* Cinematic Welcome Landing Page Body */}
        <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 py-12 flex flex-col justify-center items-center">
          
          <AnimatePresence mode="wait">
            {introStep === "welcome" ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center text-center"
              >
                {/* Visual Pill Tagline */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-900/40 shadow-inner mb-6">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-cyan-300 font-bold tracking-widest uppercase">
                    Revolutionary Pre-templated PPTX Engine
                  </span>
                </div>

                {/* Heavy display header */}
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-6 max-w-4xl text-center">
                  Transform Outlines & Raw Outlines into{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-450 via-cyan-400 to-indigo-400 font-extrabold">
                    Beautiful Slide Decks
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
                  Compile professional, dual-axis and single-column structures instantly. Complete native Malayalam script conversion, multiple designer-preset themes, and downloadable Microsoft PowerPoint documents.
                </p>

                {/* Primary Call to Action Button */}
                <button
                  onClick={() => setIntroStep("input")}
                  className="group px-8 py-4 text-base font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-550 border border-indigo-500 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all text-white flex items-center gap-3 relative overflow-hidden"
                >
                  <span className="relative z-10">Setup Presentation Content Outline</span>
                  <ArrowRight className="w-5 h-5 text-white relative z-10 group-hover:translate-x-1.5 transition" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300" />
                </button>

                {/* Interactive pricing tier feature callout card */}
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
                  
                  {/* Pro purchase details */}
                  <div className="bg-[#0c1024] border border-indigo-950/80 p-6 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                      Best Support
                    </div>
                    <div>
                      <CreditCard className="w-8 h-8 text-amber-400 mb-4" />
                      <h3 className="text-sm font-bold text-white mb-2">PRO Lifetime Billing</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        Get massive slide capacity, executive layouts, custom color override pickers.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between">
                      <span className="text-xl font-black text-white">₹49 <span className="text-xs font-normal text-slate-500">/ lifetime</span></span>
                      <button 
                        onClick={() => {
                          setIsPricingOpen(true);
                          setCheckoutStep("none");
                        }} 
                        className="text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-400 hover:underline"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>

                  {/* Malayalam & unicode details */}
                  <div className="bg-[#0c1024] border border-[#1e1435]/10 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
                    <div>
                      <FileText className="w-8 h-8 text-[#10b981] mb-4" />
                      <h3 className="text-sm font-bold text-white mb-2">Malayalam Inline Support</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        Parse direct unicode (മലയാളം) paragraphs instantly on the client side. Exact literal representations with no artificial summarizations.
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Checked & Standard Verified
                    </div>
                  </div>

                  {/* Layout layouts list */}
                  <div className="bg-[#0c1024] border border-indigo-950/80 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
                    <div>
                      <SlidersHorizontal className="w-8 h-8 text-cyan-400 mb-4" />
                      <h3 className="text-sm font-bold text-white mb-2">9+ Premium Slide Templates</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        Mix-and-match Bento grid, Split column, Comparative side-by-sides, Timelines, Big Metric stat callouts, Cover headers, and Quotes.
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      No cloud API key dependency required!
                    </span>
                  </div>

                </div>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl bg-[#0c1026] border border-indigo-950 rounded-2xl p-6 sm:p-8 shadow-2xl relative"
              >
                
                {/* Back button */}
                <button
                  onClick={() => setIntroStep("welcome")}
                  className="absolute top-6 left-6 text-xs text-slate-500 hover:text-white transition flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <div className="text-center mb-6 pt-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Paste Title prompt / Outlines</h2>
                  <p className="text-xs text-slate-400 mt-1">Specify parameters to populate the interactive PowerPoint kit</p>
                </div>

                {/* Mode Selector Toggle */}
                <div className="flex bg-[#070b1c] p-1 rounded-xl border border-indigo-900/20 max-w-md mx-auto mb-6">
                  <button
                    onClick={() => setInputMode("topic")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                      inputMode === "topic" 
                        ? "bg-indigo-650 text-white shadow-md font-extrabold" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Short Topic Prompt
                  </button>
                  <button
                    onClick={() => setInputMode("raw")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                      inputMode === "raw" 
                        ? "bg-indigo-650 text-white shadow-md font-extrabold" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Raw Document Outline
                  </button>
                </div>

                {/* Input Fields Wells */}
                <div className="space-y-4 mb-6">
                  {inputMode === "topic" ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Your Presentation Title / core subject</label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. 'Impact of Quantum Computing' or 'Kerala Tourism Plan'"
                        className="w-full bg-[#070a1a] border border-indigo-900/40 focus:border-cyan-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none transition font-semibold"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Paste Malayalam (മലയാളം) script or plain document lines</label>
                      <textarea
                        value={rawContent}
                        onChange={(e) => setRawContent(e.target.value)}
                        rows={5}
                        placeholder="Paste Malayalam paragraphs or document lists. Type '---' between lines or double linebreaks to separate layouts. Slides are extracted instantly word for word without losing any regional letters."
                        className="w-full bg-[#070a1a] border border-indigo-900/40 focus:border-cyan-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none transition resize-none font-semibold"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Tone Profile Preferences</label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full bg-[#070a1a] border border-indigo-900/40 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-white focus:outline-none font-semibold cursor-pointer"
                      >
                        <option value="Professional, precise, executive">Executive / Corporate</option>
                        <option value="Strict Direct Malayalam (മലയാളം) - Exact Copy-Paste with no translation or summarization">Direct Malayalam (Exact Copy)</option>
                        <option value="Exact Copy-Paste of original non-English script with absolutely no translation or modifications">Strict Copy-Paste (Original)</option>
                        <option value="Academic, heavy research, educational">Educational Research</option>
                        <option value="Minimalist, modern, sleek and simple">Minimalist / Aesthetic</option>
                        <option value="Highly exciting, futuristic, and techy">Futuristic / Cyber</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5">Slide Target Capacity</label>
                      <div className="flex items-center justify-between bg-[#070a1a] border border-indigo-900/40 rounded-xl px-3 py-2">
                        <button 
                          onClick={() => setSlideCount(prev => Math.max(3, prev - 1))}
                          className="text-slate-400 hover:text-white px-2 text-sm font-black transition"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-white font-mono">{slideCount} Slides</span>
                        <button 
                          onClick={() => setSlideCount(prev => Math.min(100, prev + 1))}
                          className="text-slate-400 hover:text-white px-2 text-sm font-black transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-xs text-red-300 p-3 rounded-lg mb-4 flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Instant generation action panel */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={async () => {
                      await triggerInstantConverter();
                      setCurrentScreen("workspace");
                    }}
                    disabled={isLoading || (inputMode === "topic" ? !topic.trim() : !rawContent.trim())}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-650 to-indigo-600 hover:from-indigo-700 hover:to-indigo-650 text-white rounded-xl font-extrabold text-xs transition border border-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>Build & Open Designer Workspace</span>
                  </button>

                  <button
                    onClick={async () => {
                      await triggerAIGenerator();
                      setCurrentScreen("workspace");
                    }}
                    disabled={isLoading || (inputMode === "topic" ? !topic.trim() : !rawContent.trim())}
                    className="w-full py-2 bg-[#0d1332] text-slate-350 hover:bg-slate-900/40 border border-indigo-950 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                    <span>AI Cloud Generator (Requires key)</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* Global Floating Modals / Account simulation widgets */}
        {renderGlobalModals()}

        <footer className="border-t border-slate-950 bg-[#020510] py-4 text-center text-[10px] text-slate-500 font-mono">
          DeckGen AI Presentation Kit Pro. Connected. Safe Sandbox client-side execution active.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased relative">
      {/* Absolute background grid pattern matching Geometric Balance */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-100" 
        style={{ 
          backgroundImage: "radial-gradient(#CBD5E1 1.2px, transparent 1.2px)", 
          backgroundSize: "20px 20px" 
        }} 
      />

      {/* Global Modals for Workspace Screen */}
      {renderGlobalModals()}

      {/* Primary Top Balanced Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-600/10">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
              DeckGen <span className="text-indigo-650">AI</span>
              <span className="text-[10px] font-mono tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/60 font-semibold">
                PRO v1.2
              </span>
            </h1>
            <p className="text-xs text-slate-500">Generate structured exoplanets or document outline slides with clean PPTX exports</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Landing Cover Page Return shortcut */}
          <button 
            onClick={() => setCurrentScreen("intro")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition shadow-sm"
            title="Navigate back to introductory cinematic view"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Landing UI</span>
          </button>

          {/* Quick theme selectors */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 gap-1">
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedThemeId(t.id)}
                className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                  selectedThemeId === t.id
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50 font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title={t.name}
              >
                {t.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsPreviewingFullscreen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition shadow-sm"
            title="Launch interactive fullscreen view"
          >
            <PresentationIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Present</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-md hover:shadow-indigo-500/10 active:scale-95"
            title="Download actual PowerPoint .pptx file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to PPTX</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-200" />

          {/* User Section simulation */}
          {user ? (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="max-w-[120px] truncate">{user.email}</span>
              {user.isPro && <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-1 py-0.2 rounded font-bold font-mono">PRO</span>}
              <button onClick={() => setUser(null)} className="ml-1 text-slate-400 hover:text-red-500 transition" title="Sign Out">
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-indigo-600 rounded-lg border border-indigo-200/40"
            >
              Sign In
            </button>
          )}

          {/* Core settings configuration trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg transition shadow-sm"
            title="Open version setting parameter panels"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Grid Panels Container */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-6 relative z-10 max-w-[1700px] w-full mx-auto">
        
        {/* Left Side: Creation Panel & Raw Content / Topic Input (Col range: 1 to 4) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Tool configuration block */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold tracking-wide uppercase text-slate-700">AI Slide Planner</h2>
              </div>
              <div className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setInputMode("topic")}
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded transition-all ${
                    inputMode === "topic" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Topic
                </button>
                <button
                  onClick={() => setInputMode("raw")}
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded transition-all ${
                    inputMode === "raw" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Document
                </button>
              </div>
            </div>

            {inputMode === "topic" ? (
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  Presentation Topic / Idea
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quantum Computing fundamentals explained simply, history of Mars expeditions, or business marketing Q3 results..."
                  className="w-full h-24 bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition resize-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1">
                  Paste Content (മലയാളം supported) <span className="text-[10px] text-indigo-600 font-semibold font-mono bg-indigo-50 px-1.5 py-0.5 border border-indigo-200 rounded">Exact Copy</span>
                </label>
                <textarea
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  placeholder="Paste Malayalam (മലയാളം) text or any content. Use double line breaks or '---' to separate slides if desired. Click 'Convert Text Instantly' for direct pre-templated output!"
                  className="w-full h-24 bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-lg p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition resize-none"
                />
              </div>
            )}

            {/* Core parameters block */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Tone Preference / Language Model</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Professional, precise, executive">Executive / Corp</option>
                  <option value="Strict Direct Malayalam (മലയാളം) - Exact Copy-Paste with no translation or summarization">Direct Malayalam (Strict Copy-Paste)</option>
                  <option value="Exact Copy-Paste of original non-English script with absolutely no translation or modifications">Exact Copy-Paste (No translation)</option>
                  <option value="Academic, heavy research, educational">Educational</option>
                  <option value="Minimalist, modern, sleek and simple">Minimalist</option>
                  <option value="Highly exciting, futuristic, and techy">Futuristic / Cyber</option>
                  <option value="Sincere, warm storytelling style">Sincere / Story</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Slide Target Count</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 justify-between shadow-inner">
                  <button 
                    onClick={() => setSlideCount(prev => Math.max(3, prev - 1))}
                    className="text-slate-500 hover:text-slate-950 px-1 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-900 font-mono">{slideCount}</span>
                  <button 
                    onClick={() => setSlideCount(prev => Math.min(100, prev + 1))}
                    className="text-slate-500 hover:text-slate-950 px-1 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
                {/* Preset shortcuts */}
                <div className="flex gap-1 mt-1 justify-between">
                  {[5, 10, 25, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setSlideCount(num)}
                      className={`text-[9px] font-mono font-bold px-1 py-0.5 rounded transition border shrink-0 ${
                        slideCount === num
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                      }`}
                      title={`${num} Slides Preset`}
                    >
                      {num}P
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 text-xs text-red-800">
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-2.5">
              <button
                onClick={triggerInstantConverter}
                disabled={isLoading || (inputMode === "topic" ? !topic.trim() : !rawContent.trim())}
                className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all border shadow-md active:scale-95 ${
                  isLoading 
                    ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 font-extrabold"
                }`}
                title="Convert text directly into copy-pasted PPT layouts instantly without AI"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>{isLoading ? "Converting Text..." : "Convert Text Instantly (Safe & Pre-templated)"}</span>
              </button>

              <button
                onClick={triggerAIGenerator}
                disabled={isLoading || (inputMode === "topic" ? !topic.trim() : !rawContent.trim())}
                className={`w-full py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-[10.5px] font-semibold transition-all border ${
                  isLoading 
                    ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 active:scale-95"
                }`}
                title="Draft slides using AI (Requires active workspace key)"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse shrink-0" />
                <span>AI Assisted Generation (Cloud)</span>
              </button>
            </div>
          </div>

          {/* Quick overview slide tree panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-md flex-1 max-h-[450px] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold tracking-wide uppercase text-slate-700">Deck Structure</h3>
              </div>
              <span className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-mono font-medium">
                {presentation.slides.length} slides
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {presentation.slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`group relative flex items-center justify-between p-2 rounded-lg cursor-pointer transition border text-left ${
                    activeSlideIndex === idx
                      ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm font-semibold active-slide"
                      : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0 w-3 text-right">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold truncate py-0.5">
                      {slide.title || "(Untitled)"}
                    </span>
                  </div>

                  {/* Actions shortcut overlay */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition absolute right-1.5 bg-white border border-slate-200 py-0.5 pl-1.5 rounded shadow-sm text-slate-600">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSlide(idx, "up");
                      }}
                      disabled={idx === 0}
                      className="p-1 hover:text-indigo-600 text-slate-400 disabled:opacity-20"
                      title="Move slide up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSlide(idx, "down");
                      }}
                      disabled={idx === presentation.slides.length - 1}
                      className="p-1 hover:text-indigo-600 text-slate-400 disabled:opacity-20"
                      title="Move slide down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateSlide(idx);
                      }}
                      className="p-1 hover:text-indigo-600 text-slate-400"
                      title="Duplicate slide"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(idx);
                      }}
                      className="p-1 hover:text-red-600 text-slate-400"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddNewSlide}
              className="mt-2 py-2 border border-dashed border-slate-200 hover:border-indigo-300 text-slate-400 hover:text-indigo-600 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-500" />
              <span>Insert Empty Slide</span>
            </button>
          </div>

          {/* Dynamic Color Palette Customizer */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3.5 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold tracking-wide uppercase text-slate-700">Slide Color Customizer</h3>
              </div>
              {(customBgColor || customTextColor) && (
                <button
                  onClick={() => {
                    setCustomBgColor("");
                    setCustomTextColor("");
                  }}
                  className="text-[10px] text-indigo-600 hover:text-indigo-805 hover:underline font-semibold"
                >
                  Reset Theme Defaults
                </button>
              )}
            </div>

            {/* Quick preset luxury theme chips */}
            <div>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Pre-templated Palette Presets</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: "Executive Slate", bg: "#1e293b", text: "#f8fafc" },
                  { name: "Midnight Navy", bg: "#0f172a", text: "#e2e8f0" },
                  { name: "Neon Tech", bg: "#020617", text: "#22d3ee" },
                  { name: "Forest Suede", bg: "#022c22", text: "#a7f3d0" },
                  { name: "Royal Indigo", bg: "#1e1b4b", text: "#e0f2fe" },
                  { name: "Warm Linen", bg: "#faf7f2", text: "#2c2520" }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setCustomBgColor(preset.bg);
                      setCustomTextColor(preset.text);
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition ${
                      customBgColor === preset.bg
                        ? "border-indigo-600 bg-indigo-50/55 shadow-sm font-semibold"
                        : "border-slate-150 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex shrink-0 -space-x-1.5">
                      <div className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: preset.bg }} />
                      <div className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" style={{ backgroundColor: preset.text }} />
                    </div>
                    <span className="text-[10px] text-slate-700 font-medium truncate leading-none">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Color Hex Picker Wells */}
            <div className="grid grid-cols-2 gap-3 pt-1.5 border-t border-slate-100">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Background color</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="color"
                    value={customBgColor || "#ffffff"}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    className="w-6 h-6 rounded border border-slate-200 cursor-pointer overflow-hidden p-0 block shrink-0"
                  />
                  <input
                    type="text"
                    value={customBgColor}
                    onChange={(e) => setCustomBgColor(e.target.value)}
                    placeholder="Auto Theme"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded px-2 py-1 text-[11px] font-mono font-bold focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Text Color details</label>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="color"
                    value={customTextColor || "#0d0d0d"}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    className="w-6 h-6 rounded border border-slate-200 cursor-pointer overflow-hidden p-0 block shrink-0"
                  />
                  <input
                    type="text"
                    value={customTextColor}
                    onChange={(e) => setCustomTextColor(e.target.value)}
                    placeholder="Auto Theme"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded px-2 py-1 text-[11px] font-mono font-bold focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Center/Right Panel: Interactive Slide Display Canvas Stage (Col range: 5 to 12) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          {/* Deck Metadata Name banner */}
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex-1 min-w-[200px]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block font-bold">Deck Title</span>
              <input
                type="text"
                value={presentation.title}
                onChange={(e) => setPresentation(prev => ({ ...prev, title: e.target.value }))}
                className="bg-transparent border-b border-transparent hover:border-slate-250 focus:border-indigo-500 text-sm font-bold text-slate-800 focus:outline-none w-full py-0.5 transition"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">Layout mode:</span>
              <span className="text-xs font-bold bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded text-indigo-600 font-mono capitalize shadow-sm">
                {currentSlide?.layout ?? "None"}
              </span>
            </div>
          </div>

          {/* AI Loader overlay */}
          {isLoading ? (
            <div className="aspect-[16/9] bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/10 via-white/50 to-white/90 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center max-w-md">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                  <Sparkles className="w-6 h-6 text-indigo-600 absolute inset-0 m-auto animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Drafting AI Slide Outline</h3>
                <p className="text-xs text-indigo-600 bg-indigo-50 px-4 py-1.5 border border-indigo-100 rounded-full font-mono mb-4 animate-pulse">
                  {statusMessage || "Structuring your deck..."}
                </p>
                <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden border border-slate-150">
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full w-2/3 animate-pulse rounded-full" />
                </div>
                <p className="text-[10px] text-slate-400 mt-3 italic">This normally completes within 5-10 seconds using Gemini 3.5 Flash</p>
              </div>
            </div>
          ) : currentSlide ? (
            /* Live Slide Visual Stage */
            <div className="relative group">
              
              {/* Aspect Ratio 16/9 Presentation Frame */}
              <div 
                className={`aspect-[16/9] w-full border ${customBgColor ? "border-slate-800" : theme.cardBg} rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-2xl ${customTextColor ? "custom-color-override" : ""}`}
                style={{ backgroundColor: customBgColor || undefined }}
              >
                {/* Dynamically injected stylesheet to guarantee all inner text structures obey custom colors */}
                {customTextColor && (
                  <style dangerouslySetInnerHTML={{ __html: `
                    .custom-color-override input, 
                    .custom-color-override textarea,
                    .custom-color-override p,
                    .custom-color-override span,
                    .custom-color-override h2,
                    .custom-color-override h3,
                    .custom-color-override h4,
                    .custom-color-override div,
                    .custom-color-override font {
                      color: ${customTextColor} !important;
                      -webkit-text-fill-color: ${customTextColor} !important;
                      border-color: ${customTextColor}40 !important;
                    }
                    .custom-color-override .text-transparent {
                      background: none !important;
                      -webkit-text-fill-color: ${customTextColor} !important;
                    }
                  `}} />
                )}
                
                {/* Visual Cornerstone Accents from Geometric Balance */}
                <div className={`absolute top-0 left-0 w-10 h-10 md:w-14 md:h-14 border-t-4 border-l-4 ${theme.cornerBorder} -m-1 pointer-events-none z-20 transition-all duration-300`} />
                <div className={`absolute bottom-0 right-0 w-10 h-10 md:w-14 md:h-14 border-b-4 border-r-4 ${theme.cornerBorder} -m-1 pointer-events-none z-20 transition-all duration-300`} />

                {/* Visual Background Theme Enhancers based on Theme Selection */}
                {selectedThemeId === "cosmic" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-800/10 blur-3xl" />
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-900/10 blur-3xl" />
                  </div>
                )}
                {selectedThemeId === "cyberpunk" && (
                  <div className="absolute inset-0 pointer-events-none border border-yellow-400/10">
                    <div className="absolute top-0 left-0 right-0 h-[10px] bg-gradient-to-b from-yellow-400/5 to-transparent" />
                    <div className="absolute bottom-4 right-4 text-[9px] font-mono text-yellow-400/30">DECK_ID_{presentation.id.toUpperCase()}</div>
                  </div>
                )}
                {selectedThemeId === "forest" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 right-12 w-80 h-80 rounded-full bg-teal-800/15 blur-3xl" />
                  </div>
                )}

                {/* SLIDE RENDER ENGINE BY CURRENT LAYOUT DESIGN */}
                <div className="flex-1 flex flex-col justify-center select-none relative z-10 text-left">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide.id + "_" + currentSlide.layout}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex flex-col justify-between"
                    >
                      {currentSlide.layout === "title" ? (
                        /* TITLE LAYOUT */
                        <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
                          <input
                            type="text"
                            value={currentSlide.title || ""}
                            onChange={(e) => handleEditField("title", e.target.value)}
                            placeholder="Specify Slide Title"
                            className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1.5 rounded transition text-3xl md:text-5xl font-display font-extrabold text-center leading-tight mb-4 ${theme.text} ${theme.headingFont}`}
                          />
                          <input
                            type="text"
                            value={currentSlide.subtitle || ""}
                            onChange={(e) => handleEditField("subtitle", e.target.value)}
                            placeholder="Subtitle or detail context (optional)"
                            className={`w-full text-center bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-sm md:text-lg opacity-85 font-medium max-w-2xl text-slate-300 font-sans`}
                          />
                          <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mt-6 rounded-full" />
                        </div>
                      ) : currentSlide.layout === "numeric" ? (
                        /* NUMERIC STAT LAYOUT */
                        <div className="flex-1 flex flex-col justify-center">
                          <input
                            type="text"
                            value={currentSlide.title || ""}
                            onChange={(e) => handleEditField("title", e.target.value)}
                            className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-xs uppercase tracking-widest font-mono block mb-3 font-semibold ${theme.text} opacity-50`}
                            placeholder="Key Metrics Title"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-8 justify-center flex flex-col">
                              <textarea
                                value={currentSlide.statLabel || ""}
                                onChange={(e) => handleEditField("statLabel", e.target.value)}
                                rows={2}
                                className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-base md:text-xl font-normal leading-relaxed opacity-90 resize-none ${theme.text}`}
                                placeholder="Core explanatory comment or stat label statement..."
                              />
                              <input
                                type="text"
                                value={currentSlide.subtitle || ""}
                                onChange={(e) => handleEditField("subtitle", e.target.value)}
                                className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-xs text-slate-400 mt-2`}
                                placeholder="Supplementary substantiative remark"
                              />
                            </div>
                            <div className="md:col-span-4 text-center flex flex-col items-center">
                              <input
                                type="text"
                                value={currentSlide.statNumber || ""}
                                onChange={(e) => handleEditField("statNumber", e.target.value)}
                                className="w-full text-5xl md:text-7xl font-black tracking-tighter text-center bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-mono"
                                placeholder="100%"
                              />
                            </div>
                          </div>
                        </div>
                      ) : currentSlide.layout === "quote" ? (
                        /* QUOTE LAYOUT */
                        <div className="flex-1 flex flex-col justify-center items-center text-center px-8 relative">
                          <QuoteIcon className="w-12 h-12 text-cyan-500/20 absolute -top-4 -left-2 rotate-180" />
                          <textarea
                            value={currentSlide.quoteText || ""}
                            onChange={(e) => handleEditField("quoteText", e.target.value)}
                            rows={3}
                            className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1.5 rounded transition text-base md:text-xl font-serif italic text-center leading-relaxed max-w-2xl resize-none ${theme.text}`}
                            placeholder="Dramatic insight quote stat..."
                          />
                          <div className="flex items-center gap-1.5 mt-2 justify-center">
                            <span className="text-xs text-cyan-400">—</span>
                            <input
                              type="text"
                              value={currentSlide.quoteAuthor || ""}
                              onChange={(e) => handleEditField("quoteAuthor", e.target.value)}
                              className="text-xs md:text-sm font-semibold tracking-wider uppercase opacity-75 bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-cyan-400 text-center"
                              placeholder="Quoted Speaker / Institution"
                            />
                          </div>
                        </div>
                      ) : currentSlide.layout === "split" ? (
                        /* SPLIT TWO COLUMN LAYOUT */
                        <div className="flex-grow flex flex-col justify-center">
                          <input
                            type="text"
                            value={currentSlide.title || ""}
                            onChange={(e) => handleEditField("title", e.target.value)}
                            className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-xl md:text-2xl font-semibold mb-3 ${theme.text} ${theme.headingFont}`}
                            placeholder="Slide Title Block"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column bullets */}
                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                              {currentSlide.bullets && currentSlide.bullets.length > 0 ? (
                                currentSlide.bullets.map((b, bIdx) => (
                                  <div key={bIdx} className="flex gap-2 text-xs md:text-sm items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-0.5" />
                                    <input
                                      type="text"
                                      value={b}
                                      onChange={(e) => handleEditBullet(bIdx, e.target.value)}
                                      className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-0.5 rounded transition text-xs md:text-sm ${theme.text}`}
                                      placeholder="List parameter"
                                    />
                                  </div>
                                ))
                              ) : (
                                <p className="text-[10px] text-slate-500 italic">No bullets. Click + Add Point below.</p>
                              )}
                              <button
                                onClick={handleAddBulletItem}
                                className="text-[9px] text-cyan-400 hover:underline font-mono bg-slate-950/40 border border-slate-800 px-1.5 py-0.5 rounded scale-90 origin-left"
                              >
                                + Bullet Point
                              </button>
                            </div>
                            {/* Right Column body paragraphs */}
                            <div className="space-y-1.5 bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40 justify-center flex flex-col max-h-[140px] overflow-y-auto">
                              {currentSlide.paragraphs && currentSlide.paragraphs.length > 0 ? (
                                currentSlide.paragraphs.map((p, pIdx) => (
                                  <textarea
                                    key={pIdx}
                                    value={p}
                                    onChange={(e) => handleEditParagraph(pIdx, e.target.value)}
                                    rows={2}
                                    className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-xs leading-relaxed font-light resize-none ${theme.text} opacity-85`}
                                    placeholder="Click to edit paragraph details..."
                                  />
                                ))
                              ) : (
                                <p className="text-[10px] text-slate-500 italic">No paragraphs. Click + Block below.</p>
                              )}
                              <button
                                onClick={handleAddParagraphItem}
                                className="text-[9px] text-indigo-400 hover:underline font-mono bg-slate-950/40 border border-slate-800 px-1.5 py-0.5 rounded scale-90 origin-left self-start"
                              >
                                + Paragraph Block
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : currentSlide.layout === "grid" ? (
                        /* GRID BENTO LAYOUT */
                        <div className="flex-grow flex flex-col justify-center">
                          <input
                            type="text"
                            value={currentSlide.title || ""}
                            onChange={(e) => handleEditField("title", e.target.value)}
                            className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-lg md:text-2xl font-bold mb-3 ${theme.text} ${theme.headingFont}`}
                            placeholder="Bento Highlight Grid"
                          />
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[0, 1, 2, 3].map((gridIdx) => {
                              const itemVal = (currentSlide.bullets || [])[gridIdx] || (currentSlide.paragraphs || [])[gridIdx - (currentSlide.bullets || []).length] || `Topic Element ${gridIdx + 1}`;
                              return (
                                <div key={gridIdx} className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/40 flex flex-col justify-between hover:border-slate-700 transition">
                                  <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900/60 w-fit mb-2">CARD 0{gridIdx+1}</span>
                                  <textarea
                                    value={itemVal}
                                    onChange={(e) => {
                                      const bCount = (currentSlide.bullets || []).length;
                                      if (gridIdx < bCount) {
                                        handleEditBullet(gridIdx, e.target.value);
                                      } else {
                                        handleEditParagraph(gridIdx - bCount, e.target.value);
                                      }
                                    }}
                                    rows={2}
                                    className={`text-[11px] bg-transparent border-b border-transparent focus:border-indigo-500/25 focus:outline-none p-0.5 rounded transition w-full resize-none leading-relaxed ${theme.text} opacity-90`}
                                    placeholder={`Detail info ${gridIdx+1}`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : currentSlide.layout === "comparison" ? (
                        /* COMPARATIVE ANALYSIS EDITING PANEL */
                        <div className="flex-grow flex flex-col justify-center">
                          <input
                            type="text"
                            value={currentSlide.title || ""}
                            onChange={(e) => handleEditField("title", e.target.value)}
                            className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-lg md:text-2xl font-bold mb-2 text-center ${theme.text} ${theme.headingFont}`}
                            placeholder="Comparative Analysis Title"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {/* Left Box */}
                            <div className="bg-indigo-950/20 border border-indigo-900/35 p-3 rounded-xl">
                              <div className="text-[9px] uppercase font-mono tracking-widest text-indigo-450 mb-1.5 border-b border-indigo-900/30 pb-0.5 font-bold">Category Left Panel</div>
                              <textarea
                                value={(currentSlide.bullets || [])[0] || "Entity A Core Statement"}
                                onChange={(e) => handleEditBullet(0, e.target.value)}
                                className={`text-[11px] bg-transparent border-b border-transparent focus:border-indigo-500/25 focus:outline-none p-0.5 rounded transition w-full h-8 resize-none font-medium ${theme.text}`}
                              />
                              <textarea
                                value={(currentSlide.bullets || [])[1] || "Supplementary parameter details..."}
                                onChange={(e) => handleEditBullet(1, e.target.value)}
                                className={`text-[10px] opacity-75 bg-transparent border-b border-transparent focus:border-indigo-500/25 focus:outline-none p-0.5 rounded transition w-full h-10 resize-none mt-1 ${theme.text}`}
                              />
                            </div>
                            {/* Right Box */}
                            <div className="bg-emerald-950/20 border border-emerald-900/35 p-3 rounded-xl">
                              <div className="text-[9px] uppercase font-mono tracking-widest text-[#10B981] mb-1.5 border-b border-emerald-900/30 pb-0.5 font-bold">Category Right Panel</div>
                              <textarea
                                value={(currentSlide.paragraphs || [])[0] || "Entity B Core Statement"}
                                onChange={(e) => handleEditParagraph(0, e.target.value)}
                                className={`text-[11px] bg-transparent border-b border-transparent focus:border-emerald-500/25 focus:outline-none p-0.5 rounded transition w-full h-8 resize-none font-medium ${theme.text}`}
                              />
                              <textarea
                                value={(currentSlide.paragraphs || [])[1] || "Supplementary comparative parameters..."}
                                onChange={(e) => handleEditParagraph(1, e.target.value)}
                                className={`text-[10px] opacity-75 bg-transparent border-b border-transparent focus:border-emerald-500/25 focus:outline-none p-0.5 rounded transition w-full h-10 resize-none mt-1 ${theme.text}`}
                              />
                            </div>
                          </div>
                        </div>
                      ) : currentSlide.layout === "timeline" ? (
                        /* SEQUENTIAL PROCESS TIMELINE RENDER */
                        <div className="flex-grow flex flex-col justify-center">
                          <input
                            type="text"
                            value={currentSlide.title || ""}
                            onChange={(e) => handleEditField("title", e.target.value)}
                            className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-lg md:text-2xl font-bold mb-3 ${theme.text} ${theme.headingFont}`}
                            placeholder="Linear Sequence Timeline"
                          />
                          <div className="relative flex items-center justify-between gap-1 py-1 max-h-[150px] overflow-y-auto">
                            {[0, 1, 2, 3].map((stepIdx) => {
                              const stepText = (currentSlide.bullets || [])[stepIdx] || (currentSlide.paragraphs || [])[stepIdx - (currentSlide.bullets || []).length] || `Milestone ${stepIdx + 1}`;
                              return (
                                <div key={stepIdx} className="bg-slate-900/30 border border-slate-800 p-2 rounded-xl flex-1 flex flex-col items-center text-center relative z-10 shrink-0">
                                  <div className="w-6 h-6 rounded-full bg-indigo-650 text-white flex items-center justify-center font-bold text-[10px] mb-1.5 shadow">
                                    {stepIdx + 1}
                                  </div>
                                  <textarea
                                    value={stepText}
                                    onChange={(e) => {
                                      const bCount = (currentSlide.bullets || []).length;
                                      if (stepIdx < bCount) {
                                        handleEditBullet(stepIdx, e.target.value);
                                      } else {
                                        handleEditParagraph(stepIdx - bCount, e.target.value);
                                      }
                                    }}
                                    rows={2}
                                    className={`text-[10px] bg-transparent border-b border-transparent focus:border-indigo-500/25 focus:outline-none text-center p-0.5 rounded transition w-full resize-none font-medium leading-normal ${theme.text}`}
                                    placeholder="Step summary"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : currentSlide.layout === "hero" ? (
                        /* IMPACT HERO HEADLINE COVER DESIGNS */
                        <div className="flex-grow flex flex-col justify-center items-center text-center px-10">
                          <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/60 border border-indigo-900 px-3 py-0.5 rounded-full mb-2 shadow">Highlight Focus Focal</span>
                          <textarea
                            value={currentSlide.title || ""}
                            onChange={(e) => handleEditField("title", e.target.value)}
                            rows={2}
                            className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-2xl md:text-3xl font-extrabold text-center leading-snug resize-none ${theme.text} ${theme.headingFont}`}
                            placeholder="Massive Focus Headline Statement"
                          />
                          <input
                            type="text"
                            value={currentSlide.subtitle || ""}
                            onChange={(e) => handleEditField("subtitle", e.target.value)}
                            className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-xs md:text-sm text-slate-400 text-center max-w-xl mt-2`}
                            placeholder="Detail context summarizing the main factor of value..."
                          />
                        </div>
                      ) : (
                        /* STANDARD CONTENT LAYOUT */
                        <div className="flex-grow flex flex-col justify-center">
                          <div className="mb-2">
                            <input
                              type="text"
                              value={currentSlide.title || ""}
                              onChange={(e) => handleEditField("title", e.target.value)}
                              className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-xl md:text-2xl mb-1 ${theme.text} ${theme.headingFont}`}
                              placeholder="Slide Title / Concept"
                            />
                            {currentSlide.subtitle && (
                              <input
                                type="text"
                                value={currentSlide.subtitle || ""}
                                onChange={(e) => handleEditField("subtitle", e.target.value)}
                                className={`w-full bg-transparent border-b border-transparent focus:border-indigo-400 p-0.5 rounded text-xs text-slate-400 italic`}
                                placeholder="Subtitle detail notes (optional)"
                              />
                            )}
                          </div>
                          
                          <div className="space-y-1.5 max-w-3xl mt-1.5 max-h-[140px] overflow-y-auto">
                            {currentSlide.bullets && currentSlide.bullets.length > 0 ? (
                              currentSlide.bullets.map((b, bIdx) => (
                                <div key={bIdx} className="flex gap-2.5 text-xs md:text-sm items-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-400 shrink-0 mt-0.5" />
                                  <input
                                    type="text"
                                    value={b}
                                    onChange={(e) => handleEditBullet(bIdx, e.target.value)}
                                    className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-0.5 rounded transition ${theme.text}`}
                                    placeholder="Click to edit list point description..."
                                  />
                                </div>
                              ))
                            ) : currentSlide.paragraphs && currentSlide.paragraphs.length > 0 ? (
                              currentSlide.paragraphs.map((p, pIdx) => (
                                <textarea
                                  key={pIdx}
                                  value={p}
                                  onChange={(e) => handleEditParagraph(pIdx, e.target.value)}
                                  rows={2}
                                  className={`w-full bg-transparent border-b border-transparent focus:border-indigo-500/25 hover:bg-slate-500/10 focus:outline-none p-1 rounded transition text-xs md:text-sm leading-relaxed ${theme.text} opacity-90 resize-none`}
                                  placeholder="Click to edit narrative block details..."
                                />
                              ))
                            ) : (
                              <p className="text-xs text-slate-500 italic">No bullets or paragraphs. Click + Point or + Block in the editor below.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Subdued presentation base slide numbering */}
                <div className="pt-4 border-t border-slate-800/10 flex items-center justify-between z-10 select-none">
                  <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                    {presentation.title || "Presentation Deck"}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    {activeSlideIndex + 1} / {presentation.slides.length}
                  </span>
                </div>

              </div>

              {/* Float navigation arrows */}
              <div className="absolute inset-y-0 left-3 flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button
                  onClick={goToPrevSlide}
                  disabled={activeSlideIndex === 0}
                  className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-lg transition"
                >
                  <ArrowLeft className="w-4 h-4 cursor-pointer" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-3 flex items-center opacity-0 group-hover:opacity-100 transition duration-300">
                <button
                  onClick={goToNextSlide}
                  disabled={activeSlideIndex === presentation.slides.length - 1}
                  className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-lg transition"
                >
                  <ArrowRight className="w-4 h-4 cursor-pointer" />
                </button>
              </div>
            </div>
          ) : (
            <div className="aspect-[16/9] bg-white border border-slate-200 text-slate-400 flex flex-col items-center justify-center rounded-2xl shadow-sm">
              <Sparkles className="w-12 h-12 text-slate-300 animate-pulse mb-3" />
              <p className="text-sm font-semibold">Please generate or add slides to begin modeling previews.</p>
            </div>
          )}

          {/* Tabular Slide Canvas Sandbox Editor Area (Customize Active Slide Content) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md text-slate-900">
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-4 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                Sandbox Editor
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Editing Slide {activeSlideIndex + 1}</span>
            </h3>

            {currentSlide ? (
              <div className="space-y-4">
                
                {/* Visual Layout Selectors & Standard details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5">Compose Layout</label>
                    <div className="flex flex-col gap-1.5">
                      <select
                        value={currentSlide.layout}
                        onChange={(e) => handleEditField("layout", e.target.value as SlideLayout)}
                        className="bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-lg p-2 text-xs text-slate-800 capitalize w-full"
                      >
                        <option value="title">Title Cover Slide</option>
                        <option value="content">Standard Bullet List</option>
                        <option value="split">Two-Column Grid</option>
                        <option value="numeric">Striking Stat Number</option>
                        <option value="quote">Bold Quote Overlay</option>
                        <option value="grid">Bento 4-Quadrant Grid</option>
                        <option value="comparison">Side-by-Side Comparison</option>
                        <option value="timeline">Linear Process Timeline</option>
                        <option value="hero">Impact Hero Headline</option>
                      </select>
                      <span className="text-[10px] text-slate-400 italic px-1">Altering layout converts text into new visual frame.</span>
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Slide Header Title</label>
                      <input
                        type="text"
                        value={currentSlide.title}
                        onChange={(e) => handleEditField("title", e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-lg p-2 text-xs text-slate-800 shadow-sm"
                        placeholder="Insert slide header title text..."
                      />
                    </div>
                    
                    {currentSlide.layout !== "quote" && currentSlide.layout !== "numeric" && (
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Slide Context Subtitle</label>
                        <input
                          type="text"
                          value={currentSlide.subtitle || ""}
                          onChange={(e) => handleEditField("subtitle", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-lg p-2 text-xs text-slate-800 shadow-sm"
                          placeholder="Subtitle or detail context (optional)"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* DYNAMIC FIELD EDITOR PANEL CORRESPONDING TO ACTIVE LAYOUT */}
                <div className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl mt-4">
                  {currentSlide.layout === "content" || currentSlide.layout === "split" ? (
                    <div className="space-y-4">
                      {/* Bullets Sub-editor */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1">
                            <List className="w-3.5 h-3.5 text-indigo-600" />
                            Core Slide Bullet Points
                          </label>
                          <button
                            onClick={handleAddBulletItem}
                            className="text-[10px] bg-white hover:bg-slate-50 border border-slate-200 text-indigo-600 px-2 py-1 rounded flex items-center gap-1 transition shadow-sm font-semibold"
                          >
                            <PlusCircle className="w-3 h-3" />
                            Add Point
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {(currentSlide.bullets || []).map((bullet, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <span className="text-[10px] font-mono text-slate-400 shrink-0 w-4 text-center">{idx+1}</span>
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => handleEditBullet(idx, e.target.value)}
                                className="flex-1 bg-white border border-slate-200 focus:border-indigo-550 focus:border-indigo-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-sm"
                                placeholder={`Bullet note ${idx+1}`}
                              />
                              <button
                                onClick={() => handleRemoveBulletItem(idx)}
                                className="p-1.5 hover:text-red-450 text-slate-400 transition"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          {(currentSlide.bullets || []).length === 0 && (
                            <p className="text-xs text-slate-400 italic py-2">No bullets in slide list structure.</p>
                          )}
                        </div>
                      </div>

                      {/* Split Column Paragraphs Sub-editor */}
                      {currentSlide.layout === "split" && (
                        <div>
                          <div className="flex items-center justify-between mb-2 border-t border-slate-100 pt-3">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-550 flex items-center gap-1 text-slate-500">
                              <FileText className="w-3.5 h-3.5 text-indigo-600" />
                              Column Two Paragraph Blocks
                            </label>
                            <button
                              onClick={handleAddParagraphItem}
                              className="text-[10px] bg-white hover:bg-slate-50 border border-slate-200 text-indigo-600 px-2 py-1 rounded flex items-center gap-1 transition shadow-sm font-semibold"
                            >
                              <PlusCircle className="w-3 h-3" />
                              Add block
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            {(currentSlide.paragraphs || []).map((para, idx) => (
                              <div key={idx} className="flex gap-2 items-start">
                                <span className="text-[10px] font-mono text-slate-400 shrink-0 w-4 text-center mt-2">{idx+1}</span>
                                <textarea
                                  value={para}
                                  onChange={(e) => handleEditParagraph(idx, e.target.value)}
                                  className="flex-1 h-14 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-lg px-2.5 py-1.5 text-xs text-slate-700 shadow-sm resize-none"
                                  placeholder={`Paragraph block ${idx+1}`}
                                />
                                <button
                                  onClick={() => handleRemoveParagraphItem(idx)}
                                  className="p-1.5 hover:text-red-450 text-slate-400 transition mt-1"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            {(currentSlide.paragraphs || []).length === 0 && (
                              <p className="text-xs text-slate-400 italic py-2">No custom body paragraphs added for column 2.</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : currentSlide.layout === "numeric" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Metric stat layout panel */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5 text-indigo-600 font-bold" />
                          Statistic callout number
                        </label>
                        <input
                          type="text"
                          value={currentSlide.statNumber || ""}
                          onChange={(e) => handleEditField("statNumber", e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold shadow-sm"
                          placeholder="e.g., '92%', '$1.2M', '10x', '#1'"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                          Explanation Label details
                        </label>
                        <textarea
                          value={currentSlide.statLabel || ""}
                          onChange={(e) => handleEditField("statLabel", e.target.value)}
                          className="w-full h-18 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-lg p-2 text-xs text-slate-800 resize-none shadow-sm"
                          placeholder="Brief paragraph text explaining scale, parameter, or source of metadata..."
                        />
                      </div>
                    </div>
                  ) : currentSlide.layout === "quote" ? (
                    <div className="space-y-3">
                      {/* Quote layout details */}
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                          <QuoteIcon className="w-3.5 h-3.5 text-indigo-600" />
                          Quote text statement
                        </label>
                        <textarea
                          value={currentSlide.quoteText || ""}
                          onChange={(e) => handleEditField("quoteText", e.target.value)}
                          className="w-full h-20 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-lg p-2 text-xs text-slate-800 resize-none font-serif italic shadow-sm"
                          placeholder="Paste historical quote or core summarizing take-away statement here"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold tracking-wider text-slate-500 mb-1">Speaker Source Citation</label>
                        <input
                          type="text"
                          value={currentSlide.quoteAuthor || ""}
                          onChange={(e) => handleEditField("quoteAuthor", e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-lg p-2 text-xs text-slate-800 shadow-sm"
                          placeholder="e.g. 'Nelson Mandela, 1994'"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                      This cover title layout does not require high-density bullets or statistics. Choose another layout to edit tabular text frames.
                    </div>
                  )}
                </div>

                {/* Additional Slide Utility controls */}
                <div className="flex flex-wrap items-center justify-between pt-4 mt-2 border-t border-slate-100 gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDuplicateSlide(activeSlideIndex)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-200 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Copy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Duplicate Slide</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSlide(activeSlideIndex)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-red-50 hover:text-red-650 border border-slate-200 text-slate-500 rounded-lg transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Slide</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMoveSlide(activeSlideIndex, "up")}
                      disabled={activeSlideIndex === 0}
                      className="p-1 px-2.5 text-xs font-semibold bg-white hover:bg-slate-50 disabled:opacity-25 text-slate-600 rounded-lg border border-slate-200 flex items-center gap-1 transition shadow-sm"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Move Up</span>
                    </button>
                    <button
                      onClick={() => handleMoveSlide(activeSlideIndex, "down")}
                      disabled={activeSlideIndex === presentation.slides.length - 1}
                      className="p-1 px-2.5 text-xs font-semibold bg-white hover:bg-slate-50 disabled:opacity-25 text-slate-600 rounded-lg border border-slate-200 flex items-center gap-1 transition shadow-sm"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>Move Down</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-6">No slides configured inside structure engine.</p>
            )}
          </div>

        </div>
      </main>

      {/* FULLSCREEN slideshow overlay mode */}
      <AnimatePresence>
        {isPreviewingFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col justify-between p-8"
          >
            {/* Top Toolbar overlay */}
            <div className="flex items-center justify-between text-slate-400 z-50 bg-black/40 backdrop-blur rounded-full px-6 py-2.5 max-w-xl mx-auto w-full border border-zinc-800">
              <span className="text-xs font-bold font-mono text-zinc-100 uppercase tracking-widest">{presentation.title || "Slideshow"}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-medium zinc-200">
                  Slide {activeSlideIndex + 1} of {presentation.slides.length}
                </span>
                <span className="text-[10px] text-slate-500 px-2.5 py-0.5 rounded border border-slate-800 flex items-center gap-1 font-semibold">
                  <SlidersHorizontal className="w-2.5 h-2.5 text-amber-500" /> Keyboards active: Left/Right / Esc
                </span>
              </div>
              <button
                onClick={() => setIsPreviewingFullscreen(false)}
                className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider pl-1 font-mono transition"
              >
                Exit
              </button>
            </div>

            {/* Huge View slides container */}
            <div className="flex-1 flex items-center justify-center max-w-6xl w-full mx-auto my-6 relative select-none">
              
              {/* Outer Presentation Slide Container */}
              <div 
                className={`aspect-[16/9] w-full border ${customBgColor ? "border-slate-800" : theme.cardBg} rounded-3xl p-12 relative overflow-hidden flex flex-col justify-between shadow-2xl ${customTextColor ? "custom-color-override" : ""}`}
                style={{ backgroundColor: customBgColor || undefined }}
              >
                {/* Dynamically injected stylesheet to guarantee all inner text structures obey custom colors in fullscreen present mode */}
                {customTextColor && (
                  <style dangerouslySetInnerHTML={{ __html: `
                    .custom-color-override input, 
                    .custom-color-override textarea,
                    .custom-color-override p,
                    .custom-color-override span,
                    .custom-color-override h2,
                    .custom-color-override h3,
                    .custom-color-override h4,
                    .custom-color-override div,
                    .custom-color-override font {
                      color: ${customTextColor} !important;
                      -webkit-text-fill-color: ${customTextColor} !important;
                      border-color: ${customTextColor}40 !important;
                    }
                    .custom-color-override .text-transparent {
                      background: none !important;
                      -webkit-text-fill-color: ${customTextColor} !important;
                    }
                  `}} />
                )}
                
                {/* Visual Cornerstone Accents from Geometric Balance */}
                <div className={`absolute top-0 left-0 w-12 h-12 md:w-16 md:h-16 border-t-4 border-l-4 ${theme.cornerBorder} -m-1 pointer-events-none z-20 transition-all duration-300`} />
                <div className={`absolute bottom-0 right-0 w-12 h-12 md:w-16 md:h-16 border-b-4 border-r-4 ${theme.cornerBorder} -m-1 pointer-events-none z-20 transition-all duration-300`} />
                
                {/* Embedded visuals based on active theme */}
                {selectedThemeId === "cosmic" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-cyan-700/5 blur-3xl" />
                    <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-indigo-900/5 blur-3xl animate-pulse-glow" />
                  </div>
                )}
                {selectedThemeId === "cyberpunk" && (
                  <div className="absolute inset-0 pointer-events-none border border-yellow-400/20">
                    <div className="absolute top-0 left-0 right-0 h-[12px] bg-gradient-to-b from-yellow-400/10 to-transparent" />
                    <div className="absolute bottom-6 right-6 text-[10px] font-mono text-yellow-400/40">PRESENTING_SYS_DECK_{presentation.id.toUpperCase()}</div>
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-center text-left relative z-10 p-6">
                  {currentSlide && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={"fs_" + currentSlide.id + "_" + currentSlide.layout}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="w-full h-full flex flex-col justify-between"
                      >
                        {currentSlide.layout === "title" ? (
                          <div className="flex-1 flex flex-col justify-center items-center text-center px-12">
                            <h2 className={`text-4xl md:text-6xl font-display font-extrabold mb-6 leading-tight ${theme.text}`}>
                              {currentSlide.title}
                            </h2>
                            {currentSlide.subtitle && (
                              <p className="text-lg md:text-2xl opacity-80 max-w-3xl font-light text-slate-300">
                                {currentSlide.subtitle}
                              </p>
                            )}
                            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-indigo-500 mt-8 rounded-full" />
                          </div>
                        ) : currentSlide.layout === "numeric" ? (
                          <div className="flex-grow flex flex-col justify-center">
                            <span className={`text-sm uppercase tracking-widest block mb-4 font-semibold opacity-40 font-mono ${theme.text}`}>
                              {currentSlide.title || "Key Metrics"}
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                              <div className="md:col-span-7 justify-center flex flex-col pr-6">
                                {currentSlide.statLabel && (
                                  <p className={`text-xl md:text-3xl font-normal leading-relaxed opacity-95 ${theme.text}`}>
                                    {currentSlide.statLabel}
                                  </p>
                                )}
                                {currentSlide.subtitle && (
                                  <p className="text-sm text-slate-400 mt-4">{currentSlide.subtitle}</p>
                                )}
                              </div>
                              <div className="md:col-span-5 text-center flex flex-col items-center">
                                <span className="text-8xl md:text-9xl font-black tracking-tighter block bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 drop-shadow-lg">
                                  {currentSlide.statNumber || "00"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : currentSlide.layout === "quote" ? (
                          <div className="flex-grow flex flex-col justify-center items-center text-center px-16 relative">
                            <QuoteIcon className="w-20 h-20 text-cyan-500/10 absolute -top-8 -left-4 rotate-180" />
                            <p className={`text-2xl md:text-4xl font-serif italic leading-relaxed max-w-3xl mb-8 ${theme.text}`}>
                              "{currentSlide.quoteText || "Insert dramatic quote here."}"
                            </p>
                            {currentSlide.quoteAuthor && (
                              <span className="text-sm md:text-base font-semibold tracking-wider uppercase opacity-75 text-cyan-400 block">
                                — {currentSlide.quoteAuthor}
                              </span>
                            )}
                          </div>
                        ) : currentSlide.layout === "split" ? (
                          <div className="flex-grow flex flex-col justify-center">
                            <h3 className={`text-2xl md:text-3xl mb-8 ${theme.text} ${theme.headingFont}`}>
                              {currentSlide.title}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-4">
                                {currentSlide.bullets && currentSlide.bullets.map((b, bIdx) => (
                                  <div key={bIdx} className="flex gap-3 text-sm md:text-base">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-2.5" />
                                    <p className={`opacity-90 leading-relaxed ${theme.text}`}>{b}</p>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-4 bg-slate-900/30 p-6 rounded-2xl border border-slate-800/40 justify-center flex flex-col">
                                {currentSlide.paragraphs && currentSlide.paragraphs.map((p, pIdx) => (
                                  <p key={pIdx} className={`text-sm md:text-base leading-relaxed ${theme.text} opacity-85 font-light`}>
                                    {p}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : currentSlide.layout === "grid" ? (
                          /* GRID / BENTO DECK TEMPLATE */
                          <div className="flex-grow flex flex-col justify-center animate-duration-300">
                            <h3 className={`text-2xl md:text-3xl mb-8 ${theme.text} ${theme.headingFont}`}>
                              {currentSlide.title || "Grid Highlight Summary"}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              {[0, 1, 2, 3].map((gridIdx) => {
                                const itemVal = (currentSlide.bullets || [])[gridIdx] || (currentSlide.paragraphs || [])[gridIdx - (currentSlide.bullets || []).length] || `Topic Element ${gridIdx + 1}`;
                                return (
                                  <div key={gridIdx} className="bg-slate-900/45 p-6 rounded-2xl border border-slate-800/40 flex flex-col justify-between shadow-xl">
                                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded border border-indigo-900/65 w-fit mb-4">0{gridIdx+1}</span>
                                    <p className={`text-sm md:text-base opacity-90 leading-relaxed font-light ${theme.text}`}>{itemVal}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : currentSlide.layout === "comparison" ? (
                          /* COMPARATIVE ANALYSIS TEMPLATE */
                          <div className="flex-grow flex flex-col justify-center">
                            <h3 className={`text-2xl md:text-4xl font-extrabold mb-8 text-center ${theme.text} ${theme.headingFont}`}>
                              {currentSlide.title || "Comparative Analysis"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="bg-indigo-950/20 border border-indigo-900/35 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
                                <div className="text-sm uppercase font-mono tracking-widest text-indigo-400 mb-4 border-b border-indigo-900/30 pb-2 font-bold">Category Left Panel</div>
                                <p className={`text-base md:text-lg font-semibold ${theme.text}`}>{(currentSlide.bullets || [])[0] || "Entity A Core Statement"}</p>
                                <p className={`text-xs md:text-sm mt-3 opacity-80 font-light leading-relaxed ${theme.text}`}>{(currentSlide.bullets || [])[1] || "Supplementary parameter details..."}</p>
                              </div>
                              <div className="bg-emerald-950/20 border border-emerald-900/35 p-6 rounded-3xl backdrop-blur-sm shadow-xl">
                                <div className="text-sm uppercase font-mono tracking-widest text-[#10B981] mb-4 border-b border-emerald-900/30 pb-2 font-bold">Category Right Panel</div>
                                <p className={`text-base md:text-lg font-semibold ${theme.text}`}>{(currentSlide.paragraphs || [])[0] || "Entity B Core Statement"}</p>
                                <p className={`text-xs md:text-sm mt-3 opacity-80 font-light leading-relaxed ${theme.text}`}>{(currentSlide.paragraphs || [])[1] || "Supplementary comparative parameters..."}</p>
                              </div>
                            </div>
                          </div>
                        ) : currentSlide.layout === "timeline" ? (
                          /* STEP TIMELINE AND PROCESS MAP */
                          <div className="flex-grow flex flex-col justify-center">
                            <h3 className={`text-2xl md:text-3xl mb-8 ${theme.text} ${theme.headingFont}`}>
                              {currentSlide.title || "Process Timeline"}
                            </h3>
                            <div className="relative flex items-center justify-between gap-4 py-4 max-w-5xl mx-auto w-full">
                              <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-slate-800/40 -translate-y-8 z-0 hidden md:block" />
                              {[0, 1, 2, 3].map((stepIdx) => {
                                const stepText = (currentSlide.bullets || [])[stepIdx] || (currentSlide.paragraphs || [])[stepIdx - (currentSlide.bullets || []).length] || `Milestone ${stepIdx + 1}`;
                                return (
                                  <div key={stepIdx} className="bg-slate-900/30 border border-slate-800 p-4 rounded-2xl flex-1 flex flex-col items-center text-center relative z-10 shadow-lg">
                                    <div className="w-10 h-10 rounded-full bg-indigo-650 text-white flex items-center justify-center font-bold text-sm ring-4 ring-slate-900 shadow-lg mb-3">
                                      {stepIdx + 1}
                                    </div>
                                    <p className={`text-xs md:text-sm leading-relaxed font-light ${theme.text}`}>{stepText}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : currentSlide.layout === "hero" ? (
                          /* MASSIVE FOCUS HIGHLIGHT HERO PANEL */
                          <div className="flex-grow flex flex-col justify-center items-center text-center px-12">
                            <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/60 border border-indigo-900 px-4 py-1.5 rounded-full mb-6 shadow-md animate-pulse">Highlight Focus Focal</span>
                            <h2 className={`text-3xl md:text-5xl font-extrabold max-w-4xl text-center leading-snug ${theme.text} ${theme.headingFont}`}>
                              {currentSlide.title || "High Impact Hero Focal Statement"}
                            </h2>
                            {currentSlide.subtitle && (
                              <p className="text-sm md:text-lg text-slate-300 max-w-2xl text-center mt-4 opacity-85 font-light leading-relaxed">
                                {currentSlide.subtitle}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex-grow flex flex-col justify-center">
                            <div className="mb-6">
                              <h3 className={`text-2xl md:text-4xl mb-2 ${theme.text} ${theme.headingFont}`}>
                                {currentSlide.title}
                              </h3>
                              {currentSlide.subtitle && (
                                <p className="text-sm text-slate-400 italic">
                                  {currentSlide.subtitle}
                                </p>
                              )}
                            </div>
                            <div className="space-y-4 max-w-4xl">
                              {currentSlide.bullets && currentSlide.bullets.map((b, bIdx) => (
                                <div key={bIdx} className="flex gap-4 text-sm md:text-lg">
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-400 shrink-0 mt-2.5" />
                                  <p className={`opacity-90 leading-relaxed ${theme.text}`}>{b}</p>
                                </div>
                              ))}
                              {(!currentSlide.bullets || currentSlide.bullets.length === 0) && currentSlide.paragraphs && currentSlide.paragraphs.map((p, pIdx) => (
                                <p key={pIdx} className={`text-sm md:text-lg leading-relaxed ${theme.text} opacity-90`}>
                                  {p}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>

                {/* Subdued presentation base slide numbering */}
                <div className="pt-6 border-t border-slate-800/20 flex items-center justify-between z-10 text-slate-400">
                  <span className="text-xs font-mono tracking-wider">
                    {presentation.title || "Untitled Presentation"}
                  </span>
                  <span className="text-xs font-mono">
                    Slide {activeSlideIndex + 1} of {presentation.slides.length}
                  </span>
                </div>

              </div>

            </div>

            {/* Bottom Actions Frame */}
            <div className="flex items-center justify-between max-w-md mx-auto w-full text-white z-50 pt-2 mb-4">
              <button
                onClick={goToPrevSlide}
                disabled={activeSlideIndex === 0}
                className="px-4 py-2 text-xs font-bold bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-20 flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-4 h-4 cursor-pointer" /> Previous
              </button>
              
              <div className="flex items-center gap-1 font-mono text-xs font-semibold text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800">
                <span>{activeSlideIndex + 1}</span>
                <span className="opacity-30">/</span>
                <span>{presentation.slides.length}</span>
              </div>

              <button
                onClick={goToNextSlide}
                disabled={activeSlideIndex === presentation.slides.length - 1}
                className="px-4 py-2 text-xs font-bold bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 disabled:opacity-20 flex items-center gap-1.5 transition"
              >
                Next <ArrowRight className="w-4 h-4 cursor-pointer" />
              </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant minimalist branding footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 select-none">
        <span className="text-xs text-slate-500 font-mono tracking-wide flex items-center gap-1">
          <MousePointer className="w-3 h-3 text-cyan-500" />
          Click visual layouts to customize content. All edits synchronize instantly.
        </span>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-505" /> Clean Local Storage Active
          </span>
          <span>|</span>
          <span>Double-click slide thumbnails to clone</span>
        </div>
      </footer>
    </div>
  );
}
