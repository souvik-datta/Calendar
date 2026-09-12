import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600&family=Noto+Sans+Kannada:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&display=swap');`;

const COLORS = {
  ink: "#20233A",
  paper: "#FAF6EE",
  panel: "#FFFFFF",
  saffron: "#E19A2E",
  maroon: "#AE3B45",
  teal: "#2C6E63",
  line: "#E7DFCF",
  muted: "#8A8270",
};

// ---- Language data ---------------------------------------------------
const LANGS = {
  en: { label: "English", self: "English", font: "Inter" },
  hi: { label: "Hindi", self: "हिन्दी", font: "'Noto Sans Devanagari'" },
  kn: { label: "Kannada", self: "ಕನ್ನಡ", font: "'Noto Sans Kannada'" },
  ta: { label: "Tamil", self: "தமிழ்", font: "'Noto Sans Tamil'" },
};

const WEEK_SHORT = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  hi: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
  kn: ["ಭಾನು", "ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ"],
  ta: ["ஞா", "தி", "செ", "பு", "வி", "வெ", "ச"],
};

const WEEK_FULL = {
  en: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
  hi: ["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"],
  kn: ["ಭಾನುವಾರ","ಸೋಮವಾರ","ಮಂಗಳವಾರ","ಬುಧವಾರ","ಗುರುವಾರ","ಶುಕ್ರವಾರ","ಶನಿವಾರ"],
  ta: ["ஞாயிற்றுக்கிழமை","திங்கட்கிழமை","செவ்வாய்க்கிழமை","புதன்கிழமை","வியாழக்கிழமை","வெள்ளிக்கிழமை","சனிக்கிழமை"],
};

const MONTHS = {
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  hi: ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"],
  kn: ["ಜನವರಿ","ಫೆಬ್ರವರಿ","ಮಾರ್ಚ್","ಏಪ್ರಿಲ್","ಮೇ","ಜೂನ್","ಜುಲೈ","ಆಗಸ್ಟ್","ಸೆಪ್ಟೆಂಬರ್","ಅಕ್ಟೋಬರ್","ನವೆಂಬರ್","ಡಿಸೆಂಬರ್"],
  ta: ["ஜனவரி","பிப்ரவரி","மார்ச்","ஏப்ரல்","மே","ஜூன்","ஜூலை","ஆகஸ்ட்","செப்டம்பர்","அக்டோபர்","நவம்பர்","டிசம்பர்"],
};

// Traditional / regional calendar month names, mapped by predominant
// Gregorian month. These are approximate — real transitions fall mid-month
// and shift slightly year to year with the lunar cycle.
const NATIVE_MONTHS = {
  hi: ["पौष","माघ","फाल्गुन","चैत्र","वैशाख","ज्येष्ठ","आषाढ़","श्रावण","भाद्रपद","आश्विन","कार्तिक","मार्गशीर्ष"],
  kn: ["ಪುಷ್ಯ","ಮಾಘ","ಫಾಲ್ಗುಣ","ಚೈತ್ರ","ವೈಶಾಖ","ಜ್ಯೇಷ್ಠ","ಆಷಾಢ","ಶ್ರಾವಣ","ಭಾದ್ರಪದ","ಆಶ್ವಯುಜ","ಕಾರ್ತಿಕ","ಮಾರ್ಗಶಿರ"],
  ta: ["மார்கழி","தை","மாசி","பங்குனி","சித்திரை","வைகாசி","ஆனி","ஆடி","ஆவணி","புரட்டாசி","ஐப்பசி","கார்த்திகை"],
};
const NATIVE_SYSTEM_LABEL = {
  hi: "विक्रम संवत् मास",
  kn: "ಶಾಲಿವಾಹನ ಶಕ ಮಾಸ",
  ta: "தமிழ் மாதம்",
};

const DIGITS = {
  en: "0123456789",
  hi: "०१२३४५६७८९",
  kn: "೦೧೨೩೪೫೬೭೮೯",
  ta: "௦௧௨௩௪௫௬௭௮௯",
};

const UI_TEXT = {
  appName: { en: "Calendar", hi: "कैलेंडर", kn: "ಕ್ಯಾಲೆಂಡರ್", ta: "காலண்டர்" },
  today: { en: "Today", hi: "आज", kn: "ಇಂದು", ta: "இன்று" },
  nativeToggle: { en: "Native calendar", hi: "देशी कैलेंडर", kn: "ಸ್ಥಳೀಯ ಕ್ಯಾಲೆಂಡರ್", ta: "பாரம்பரிய நாட்காட்டி" },
  approxNote: {
    en: "Traditional month is approximate; exact transitions vary each year.",
    hi: "देशी माह अनुमानित है; सटीक तिथि हर वर्ष थोड़ी बदलती है।",
    kn: "ಸ್ಥಳೀಯ ಮಾಸ ಅಂದಾಜು; ನಿಖರ ದಿನಾಂಕ ಪ್ರತಿ ವರ್ಷ ಸ್ವಲ್ಪ ಬದಲಾಗುತ್ತದೆ.",
    ta: "பாரம்பரிய மாதம் தோராயமானது; சரியான தேதி ஆண்டுதோறும் சற்று மாறும்.",
  },
};

function toNativeDigits(num, lang) {
  const map = DIGITS[lang] || DIGITS.en;
  return String(num).split("").map((d) => (/\d/.test(d) ? map[+d] : d)).join("");
}

// A few illustrative festival markers (sample dates, not exhaustive)
const SAMPLE_MARKERS = {
  "2026-1-1": { en: "New Year", hi: "नववर्ष", kn: "ಹೊಸ ವರ್ಷ", ta: "புத்தாண்டு" },
  "2026-10-20": { en: "Diwali (sample)", hi: "दीवाली (नमूना)", kn: "ದೀಪಾವಳಿ (ಮಾದರಿ)", ta: "தீபாவளி (மாதிரி)" },
};

export default function NativeCalendar() {
  const today = new Date();
  const [lang, setLang] = useState("en");
  const [showNative, setShowNative] = useState(true);
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(today);

  const fontFamily = LANGS[lang].font + ", Inter, sans-serif";

  const grid = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const changeMonth = (delta) => {
    let m = cursor.m + delta, y = cursor.y;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setCursor({ y, m });
  };

  const isToday = (d) =>
    d && cursor.y === today.getFullYear() && cursor.m === today.getMonth() && d === today.getDate();
  const isSelected = (d) =>
    d && cursor.y === selected.getFullYear() && cursor.m === selected.getMonth() && d === selected.getDate();

  const markerFor = (d) => {
    if (!d) return null;
    const key = `${cursor.y}-${cursor.m + 1}-${d}`;
    return SAMPLE_MARKERS[key] || null;
  };

  const nativeMonthName = showNative && lang !== "en" ? NATIVE_MONTHS[lang][cursor.m] : null;

  return (
    <div style={{ background: COLORS.paper, fontFamily, color: COLORS.ink, minHeight: "100%" }} className="w-full flex justify-center p-4 sm:p-6">
      <style>{FONT_IMPORT}</style>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }} className="text-2xl">
            {UI_TEXT.appName[lang]}
          </h1>
          <div className="flex items-center gap-1 rounded-full p-1" style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}` }}>
            <Globe size={14} style={{ color: COLORS.muted, marginLeft: 6 }} />
            {Object.keys(LANGS).map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                style={{
                  fontFamily: LANGS[code].font + ", Inter, sans-serif",
                  background: lang === code ? COLORS.ink : "transparent",
                  color: lang === code ? COLORS.paper : COLORS.ink,
                }}
                className="text-xs px-2.5 py-1 rounded-full transition-colors"
              >
                {LANGS[code].self}
              </button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}` }}>
          {/* Month nav */}
          <div className="flex items-center justify-between px-4 py-4" style={{ background: COLORS.ink, color: COLORS.paper }}>
            <button onClick={() => changeMonth(-1)} aria-label="Previous month" className="p-1 rounded-full hover:opacity-70">
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <div style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }} className="text-lg leading-tight">
                {MONTHS[lang][cursor.m]} {toNativeDigits(cursor.y, lang)}
              </div>
              {nativeMonthName && (
                <div className="text-xs mt-0.5" style={{ color: COLORS.saffron }}>
                  {nativeMonthName} &middot; {NATIVE_SYSTEM_LABEL[lang]}
                </div>
              )}
            </div>
            <button onClick={() => changeMonth(1)} aria-label="Next month" className="p-1 rounded-full hover:opacity-70">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Native calendar toggle */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: `1px solid ${COLORS.line}` }}>
            <span className="text-xs" style={{ color: COLORS.muted }}>{UI_TEXT.nativeToggle[lang]}</span>
            <button
              onClick={() => setShowNative((s) => !s)}
              className="w-9 h-5 rounded-full relative transition-colors"
              style={{ background: showNative ? COLORS.teal : COLORS.line }}
              aria-pressed={showNative}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                style={{ transform: showNative ? "translateX(18px)" : "translateX(2px)" }}
              />
            </button>
          </div>

          {/* Weekday row */}
          <div className="grid grid-cols-7 px-3 pt-3">
            {WEEK_SHORT[lang].map((w, i) => (
              <div key={i} className="text-center text-[11px] py-1" style={{ color: COLORS.muted }}>
                {w}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-1 px-3 pb-4">
            {grid.map((d, i) => {
              const marker = markerFor(d);
              return (
                <button
                  key={i}
                  disabled={!d}
                  onClick={() => d && setSelected(new Date(cursor.y, cursor.m, d))}
                  className="aspect-square flex flex-col items-center justify-center rounded-full text-sm relative"
                  style={{
                    background: isSelected(d) ? COLORS.ink : isToday(d) ? "#F1E4C7" : "transparent",
                    color: isSelected(d) ? COLORS.paper : COLORS.ink,
                    visibility: d ? "visible" : "hidden",
                  }}
                >
                  <span style={{ fontFamily: "Fraunces, serif" }}>{d ? toNativeDigits(d, lang) : ""}</span>
                  {marker && (
                    <span
                      className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
                      style={{ background: isSelected(d) ? COLORS.saffron : COLORS.maroon }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected date detail */}
        <div className="mt-4 rounded-2xl p-4" style={{ background: COLORS.panel, border: `1px solid ${COLORS.line}` }}>
          <div className="text-xs" style={{ color: COLORS.muted }}>
            {isToday(selected.getDate()) && selected.getMonth() === cursor.m ? UI_TEXT.today[lang] : "\u00A0"}
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontWeight: 500 }} className="text-xl mt-1">
            {WEEK_FULL[lang][selected.getDay()]}, {toNativeDigits(selected.getDate(), lang)} {MONTHS[lang][selected.getMonth()]} {toNativeDigits(selected.getFullYear(), lang)}
          </div>
          {showNative && lang !== "en" && (
            <div className="mt-2 text-sm" style={{ color: COLORS.teal }}>
              {NATIVE_MONTHS[lang][selected.getMonth()]} &middot; {NATIVE_SYSTEM_LABEL[lang]}
            </div>
          )}
          {markerFor(selected.getDate()) && (
            <div className="mt-2 text-sm px-2.5 py-1 rounded-full inline-block" style={{ background: "#F6E4D8", color: COLORS.maroon }}>
              {markerFor(selected.getDate())[lang]}
            </div>
          )}
          <div className="mt-3 text-[11px] leading-snug" style={{ color: COLORS.muted }}>
            {UI_TEXT.approxNote[lang]}
          </div>
        </div>
      </div>
    </div>
  );
}
