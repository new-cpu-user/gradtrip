import { useState, useRef, useEffect, useCallback } from "react";

/* ──────────────────────────────────────────────────────────────
 *  BROCHURE RACK — Sol de Ayer  
 *
 *  Image-map approach: the background photograph is the hero,
 *  and invisible hotspots sit precisely over each magazine.
 *  Clicking opens an embedded PDF viewer (no new tab).
 *
 *  SETUP:
 *  1. Place your rack photo at: /images/office_magazine_image_2.png
 *  2. Place PDFs in /pdfs/ and update each `pdf` path below
 *  3. Fine-tune hotspot coordinates if you swap the photo
 * ────────────────────────────────────────────────────────────── */

const MAGAZINES = [
  // ── Top Row ──────────────────────────────────────────────
  {
    id: "argentina",
    title: "Viaje de Graduación — Argentina",
    pdf: "/pdfs/argentina.pdf",
    // percentages relative to the image dimensions
    top: 2,
    left: 12.5,
    width: 21,
    height: 50,
  },
  {
    id: "buenos-aires",
    title: "Buenos Aires Eterna",
    pdf: "/pdfs/buenos-aires.pdf",
    top: 2,
    left: 34.5,
    width: 19.5,
    height: 50,
  },
  {
    id: "iguazu",
    title: "Cataratas del Iguazú",
    pdf: "/pdfs/iguazu.pdf",
    top: 2,
    left: 54.5,
    width: 20,
    height: 50,
  },
  // ── Bottom Row ───────────────────────────────────────────
  {
    id: "salta",
    title: "National Geographic — Salta",
    pdf: "/pdfs/salta.pdf",
    top: 57,
    left: 14,
    width: 18.5,
    height: 37,
  },
  {
    id: "gastronomia",
    title: "National Gastronomía",
    pdf: "/pdfs/gastronomia.pdf",
    top: 57,
    left: 35,
    width: 18,
    height: 37,
  },
  {
    id: "patagonica",
    title: "National Patagónica",
    pdf: "/pdfs/patagonica.pdf",
    top: 57,
    left: 55,
    width: 18.5,
    height: 37,
  },
];

/* ── Inline PDF Viewer (modal overlay) ──────────────────────── */
function PdfViewer({ magazine, onClose }) {
  const overlayRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close if clicking outside the viewer panel
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10, 10, 12, 0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        animation: "fadeInOverlay 0.25s ease-out",
      }}
    >
      {/* Viewer panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          height: "90vh",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          background: "#1a1a1e",
          display: "flex",
          flexDirection: "column",
          animation: "scaleUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: "linear-gradient(180deg, #2a2a2e 0%, #1e1e22 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: "#e0ddd5",
              letterSpacing: "0.01em",
            }}
          >
            {magazine.title}
          </span>

          <button
            onClick={onClose}
            aria-label="Close PDF viewer"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              width: 34,
              height: 34,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: 18,
              fontWeight: 300,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,80,80,0.15)";
              e.currentTarget.style.color = "#ff6b6b";
              e.currentTarget.style.borderColor = "rgba(255,80,80,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "#999";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            ✕
          </button>
        </div>

        {/* PDF iframe */}
        <iframe
          src={magazine.pdf}
          title={magazine.title}
          style={{
            flex: 1,
            width: "100%",
            border: "none",
            background: "#f5f5f0",
          }}
        />
      </div>
    </div>
  );
}

/* ── Magazine Hotspot (invisible clickable overlay) ─────────── */
function MagazineHotspot({ magazine, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => onClick(magazine)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Open ${magazine.title}`}
      style={{
        position: "absolute",
        top: `${magazine.top}%`,
        left: `${magazine.left}%`,
        width: `${magazine.width}%`,
        height: `${magazine.height}%`,
        border: "none",
        padding: 0,
        cursor: "pointer",
        background: hovered
          ? "rgba(255, 200, 100, 0.08)"
          : "transparent",
        borderRadius: 4,
        outline: "none",
        transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered
          ? "inset 0 0 0 2px rgba(255,200,100,0.25), 0 0 30px rgba(255,180,60,0.12)"
          : "none",
        zIndex: 2,
      }}
    >
      {/* Tooltip on hover */}
      <span
        style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: `translateX(-50%) translateY(${hovered ? 0 : 6}px)`,
          background: "rgba(20, 20, 24, 0.92)",
          backdropFilter: "blur(8px)",
          color: "#e8e4db",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 500,
          padding: "6px 12px",
          borderRadius: 6,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          letterSpacing: "0.01em",
        }}
      >
        {magazine.title}
        {/* Arrow */}
        <span
          style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            border: "5px solid transparent",
            borderTopColor: "rgba(20, 20, 24, 0.92)",
          }}
        />
      </span>
    </button>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
export default function BrochureRackSection() {
  const [activePdf, setActivePdf] = useState(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleOpen = useCallback((mag) => setActivePdf(mag), []);
  const handleClose = useCallback(() => setActivePdf(null), []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "80px 24px",
        background: "linear-gradient(180deg, #FAF8F3 0%, #F2EDE4 40%, #EBE6DB 100%)",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Keyframe animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.92) translateY(20px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes rackFadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Section header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 48,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease-out",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            color: "#A08B6A",
            marginBottom: 12,
          }}
        >
          Preguntas Frecuentes
        </p>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(30px, 5vw, 46px)",
            fontWeight: 700,
            color: "#1A2E4C",
            lineHeight: 1.1,
            marginBottom: 14,
            letterSpacing: "-0.02em",
          }}
        >
          Pick Up a Brochure
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            color: "#1A2E4C77",
            lineHeight: 1.6,
            maxWidth: 440,
            margin: "0 auto",
          }}
        >
          Everything you need to know — tap any magazine to read it.
        </p>
      </div>

      {/* ══ IMAGE MAP RACK ══════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          maxWidth: 960,
          width: "100%",
          margin: "0 auto",
          opacity: visible ? 1 : 0,
          animation: visible ? "rackFadeIn 0.8s ease-out 0.2s backwards" : "none",
        }}
      >
        {/* Background photograph */}
        <img
          src="/images/office_magazine_image_2.png"
          alt="Magazine display rack with six travel brochures"
          style={{
            width: "100%",
            display: "block",
            borderRadius: 8,
            boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)",
          }}
          draggable={false}
        />

        {/* Clickable hotspots over each magazine */}
        {MAGAZINES.map((mag) => (
          <MagazineHotspot
            key={mag.id}
            magazine={mag}
            onClick={handleOpen}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          textAlign: "center",
          marginTop: 40,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease-out 0.5s",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#1A2E4C55",
          }}
        >
          Still have questions?{" "}
          <a
            href="https://instagram.com/soldeayer"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#FF8C00",
              fontWeight: 600,
              textDecoration: "none",
              borderBottom: "1px solid #FF8C0044",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.borderColor = "#FF8C00")}
            onMouseLeave={(e) => (e.target.style.borderColor = "#FF8C0044")}
          >
            DM @soldeayer
          </a>
        </p>
      </div>

      {/* ══ PDF VIEWER MODAL ═══════════════════════════════════ */}
      {activePdf && (
        <PdfViewer magazine={activePdf} onClose={handleClose} />
      )}
    </section>
  );
}
