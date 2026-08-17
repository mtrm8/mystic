// app.jsx — Mystical Tarot landing page
// Hebrew RTL, full single-page site. Sections: Hero, About, Services,
// Card of the Day (interactive), Testimonials, Contact, Footer.

const { useState, useEffect, useMemo, useRef } = React;

// ── Tweak defaults (persisted by the host on disk) ───────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#0d0a1a", "#d4af6f", "#f0e6d2"],
  "displayFont": "Frank Ruhl Libre",
  "starDensity": 70,
  "showMoon": true,
  "animatedStars": true,
  "heroLayout": "centered"
}/*EDITMODE-END*/;

// Palette options — first is bg, second is gold accent, third is ink
const PALETTES = [
  ["#0d0a1a", "#d4af6f", "#f0e6d2"], // Cosmic night (default)
  ["#1a0d1f", "#c89aa8", "#f5e6ec"], // Twilight rose
  ["#0a1420", "#b8c7d9", "#e8eef5"], // Moonlit silver
  ["#1b1208", "#e0b566", "#f3e7d0"], // Amber dusk
];

const DISPLAY_FONTS = [
  { value: "Frank Ruhl Libre", label: "Frank Ruhl" },
  { value: "Cormorant Garamond", label: "Cormorant" },
  { value: "Assistant",         label: "Assistant" },
];

// ── Decorative SVG glyphs ────────────────────────────────────────────────────
function Divider({ width = 220 }) {
  return (
    <svg viewBox="0 0 220 18" width={width} height={18} aria-hidden="true"
         style={{ display: 'block', margin: '0 auto', opacity: 0.85 }}>
      <line x1="0"   y1="9" x2="92" y2="9" stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.5" />
      <line x1="128" y1="9" x2="220" y2="9" stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.5" />
      <g transform="translate(110 9)" fill="none" stroke="var(--gold)" strokeWidth="0.7">
        <path d="M 0 -7 L 5 0 L 0 7 L -5 0 Z" />
        <circle r="1.6" fill="var(--gold)" />
      </g>
      <circle cx="100" cy="9" r="1" fill="var(--gold)" fillOpacity="0.6" />
      <circle cx="120" cy="9" r="1" fill="var(--gold)" fillOpacity="0.6" />
    </svg>
  );
}

function SmallStar({ size = 12, opacity = 0.7 }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} aria-hidden="true"
         style={{ opacity }}>
      <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z"
            fill="var(--gold)" />
    </svg>
  );
}

function Moon() {
  return (
    <svg viewBox="0 0 120 120" width="180" height="180" aria-hidden="true"
         style={{ filter: 'drop-shadow(0 0 40px rgba(212,175,111,0.25))' }}>
      <defs>
        <radialGradient id="moon-grad" cx="60%" cy="40%" r="55%">
          <stop offset="0%"  stopColor="#fff6e0" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#e8d2a0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#d4af6f" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="moon-halo" cx="50%" cy="50%" r="50%">
          <stop offset="40%" stopColor="rgba(212,175,111,0.18)" />
          <stop offset="100%" stopColor="rgba(212,175,111,0)" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#moon-halo)" />
      <path d="M 78 22 A 42 42 0 1 0 78 98 A 30 30 0 1 1 78 22 Z"
            fill="url(#moon-grad)" />
      {/* Subtle craters */}
      <circle cx="40" cy="50" r="3" fill="#000" fillOpacity="0.08" />
      <circle cx="48" cy="72" r="2" fill="#000" fillOpacity="0.06" />
      <circle cx="32" cy="65" r="1.5" fill="#000" fillOpacity="0.07" />
    </svg>
  );
}

// Eye-of-Horus-style glyph for section accents — abstract, original
function EyeGlyph() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true"
         style={{ opacity: 0.85 }}>
      <g fill="none" stroke="var(--gold)" strokeWidth="0.8">
        <circle cx="30" cy="30" r="22" strokeOpacity="0.4" />
        <circle cx="30" cy="30" r="14" strokeOpacity="0.6" />
        <circle cx="30" cy="30" r="6"  strokeOpacity="0.9" />
        <circle cx="30" cy="30" r="2"  fill="var(--gold)" stroke="none" />
        <path d="M 30 4 L 30 12 M 30 48 L 30 56 M 4 30 L 12 30 M 48 30 L 56 30"
              strokeOpacity="0.7" />
      </g>
    </svg>
  );
}

// ── Starfield background ─────────────────────────────────────────────────────
function StarField({ density, animated, showMoon }) {
  const stars = useMemo(() => {
    return Array.from({ length: density }, (_, i) => ({
      id: i,
      cx: Math.random() * 100,
      cy: Math.random() * 100,
      r: Math.random() * 1.1 + 0.3,
      opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 5,
    }));
  }, [density]);

  return (
    <div className="starfield" aria-hidden="true">
      <div className="cosmic-glow" />
      <svg className="stars-svg" preserveAspectRatio="none">
        {stars.map((s) => (
          <circle
            key={s.id}
            cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r}
            fill="var(--ink)"
            opacity={s.opacity}
            style={animated ? {
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`
            } : undefined}
          />
        ))}
      </svg>
      {showMoon && (
        <div className="moon-wrap" style={{ animation: 'float 9s ease-in-out infinite' }}>
          <Moon />
        </div>
      )}
      {/* Cosmic rings, very subtle */}
      <div className="ring ring-1" />
      <div className="ring ring-2" />
    </div>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ name }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const items = [
    { id: 'about',    label: 'אודות' },
    { id: 'services', label: 'שירותים' },
    { id: 'oracle',   label: 'קלף היום' },
    { id: 'voices',   label: 'מילות לקוחות' },
    { id: 'contact',  label: 'יצירת קשר' },
  ];
  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-brand display">
          <SmallStar size={14} opacity={0.85} />
          <span>{name}</span>
        </a>
        <ul className="nav-links">
          {items.map((it) => (
            <li key={it.id}><a href={`#${it.id}`}>{it.label}</a></li>
          ))}
        </ul>
        <a href="#contact" className="nav-cta">
          <span>תיאום קריאה</span>
        </a>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ name, tagline, layout }) {
  return (
    <header id="top" className={`hero hero-${layout}`}>
      <div className="hero-content">
        <div className="hero-eyebrow reveal">
          <SmallStar size={10} opacity={0.7} />
          <span className="latin">— Tarot &amp; Spiritual Guidance —</span>
          <SmallStar size={10} opacity={0.7} />
        </div>

        <h1 className="hero-title display reveal reveal-delay-1">
          <span className="hero-title-line">קריאה בקלפי</span>
          <span className="hero-title-emph">טארוט</span>
        </h1>

        <p className="hero-name display reveal reveal-delay-2">{name}</p>

        <div className="hero-divider reveal reveal-delay-2">
          <Divider />
        </div>

        <p className="hero-sub reveal reveal-delay-3">{tagline}</p>

        <div className="hero-cta reveal reveal-delay-4">
          <a href="#contact" className="btn btn-primary">
            <span>קביעת קריאה אישית</span>
            <svg viewBox="0 0 14 10" width="14" height="10" aria-hidden="true"
                 style={{ marginInlineStart: 8 }}>
              <path d="M 14 5 L 8 0 M 14 5 L 8 10 M 14 5 L 0 5" fill="none"
                    stroke="currentColor" strokeWidth="1" />
            </svg>
          </a>
          <a href="#oracle" className="btn btn-ghost">שליפת קלף היום</a>
        </div>

        <div className="hero-meta reveal reveal-delay-4">
          <span>מענה אישי</span>
          <i className="dot" />
          <span>דיסקרטיות מלאה</span>
          <i className="dot" />
          <span>14 שנות ניסיון</span>
        </div>
      </div>

      <a href="#about" className="scroll-hint" aria-label="גלילה">
        <span>גלגלי מטה</span>
        <svg viewBox="0 0 10 16" width="10" height="16">
          <path d="M5 0 L5 14 M1 10 L5 14 L9 10" fill="none"
                stroke="currentColor" strokeWidth="1" />
        </svg>
      </a>
    </header>
  );
}

// ── Mystic 3D Orb — rotating sacred geometry, floating particles ─────────────
function MysticOrb() {
  // Orbiting particles — fixed positions/angles, randomized once
  const particles = useMemo(() => Array.from({ length: 14 }, (_, i) => ({
    id: i,
    radius: 110 + Math.random() * 60,
    angle: (i * 360) / 14 + Math.random() * 20,
    size: 1.4 + Math.random() * 2.2,
    duration: 18 + Math.random() * 16,
    delay: -Math.random() * 30,
    direction: i % 2 === 0 ? 1 : -1,
  })), []);

  return (
    <div className="mystic-orb">
      {/* Outer aura */}
      <div className="orb-aura" />

      {/* Rotating sacred-geometry rings (3D tilted) */}
      <div className="orb-stage">
        <div className="orb-ring orb-ring-1">
          <svg viewBox="-100 -100 200 200" aria-hidden="true">
            <circle cx="0" cy="0" r="92" fill="none" stroke="var(--gold)"
                    strokeWidth="0.4" strokeOpacity="0.55"
                    strokeDasharray="2 6" />
            {/* Zodiac-like ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30) * Math.PI / 180;
              return (
                <line key={i}
                      x1={Math.cos(a) * 86}  y1={Math.sin(a) * 86}
                      x2={Math.cos(a) * 96}  y2={Math.sin(a) * 96}
                      stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.8" />
              );
            })}
            {/* Symbols at cardinals */}
            {[0, 90, 180, 270].map((deg) => {
              const a = deg * Math.PI / 180;
              return (
                <g key={deg} transform={`translate(${Math.cos(a) * 78} ${Math.sin(a) * 78})`}>
                  <circle r="2.4" fill="var(--gold)" fillOpacity="0.85" />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="orb-ring orb-ring-2">
          <svg viewBox="-100 -100 200 200" aria-hidden="true">
            <circle cx="0" cy="0" r="74" fill="none" stroke="var(--gold)"
                    strokeWidth="0.5" strokeOpacity="0.45" />
            {/* Six-petal flower of life fragment */}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const a = deg * Math.PI / 180;
              return (
                <circle key={deg}
                        cx={Math.cos(a) * 26} cy={Math.sin(a) * 26}
                        r="26" fill="none"
                        stroke="var(--gold)" strokeWidth="0.4"
                        strokeOpacity="0.45" />
              );
            })}
          </svg>
        </div>

        <div className="orb-ring orb-ring-3">
          <svg viewBox="-100 -100 200 200" aria-hidden="true">
            <circle cx="0" cy="0" r="58" fill="none" stroke="var(--gold)"
                    strokeWidth="0.5" strokeOpacity="0.7"
                    strokeDasharray="1 4" />
            {/* 8-pointed star */}
            <g stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.55" fill="none">
              {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((deg) => {
                const a = deg * Math.PI / 180;
                return <line key={deg}
                             x1={Math.cos(a) * -50} y1={Math.sin(a) * -50}
                             x2={Math.cos(a) * 50}  y2={Math.sin(a) * 50} />;
              })}
            </g>
          </svg>
        </div>

        {/* Central glowing sigil */}
        <div className="orb-core">
          <svg viewBox="-50 -50 100 100" aria-hidden="true">
            <defs>
              <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="#fff6e0" stopOpacity="0.95" />
                <stop offset="40%" stopColor="var(--gold)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="core-inner" cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="#fff" stopOpacity="1" />
                <stop offset="100%" stopColor="#fff6e0" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle r="44" fill="url(#core-grad)" />
            <circle r="18" fill="url(#core-inner)" />
            {/* Crescent moon */}
            <path d="M -8 -2 A 10 10 0 1 0 -8 -2.5 A 7 7 0 1 1 -8 -2 Z"
                  fill="var(--bg)" fillOpacity="0.35" />
            {/* Tiny inner star */}
            <g transform="translate(6 -2)">
              <path d="M0 -3 L0.8 -0.8 L3 0 L0.8 0.8 L0 3 L-0.8 0.8 L-3 0 L-0.8 -0.8 Z"
                    fill="var(--gold)" />
            </g>
          </svg>
        </div>
      </div>

      {/* Orbiting particles */}
      <div className="orb-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="orbit-track"
            style={{
              width: p.radius * 2,
              height: p.radius * 2,
              marginLeft: -p.radius,
              marginTop:  -p.radius,
              animation: `orbitSpin ${p.duration}s linear ${p.delay}s infinite ${p.direction < 0 ? 'reverse' : 'normal'}`,
              transform: `rotate(${p.angle}deg)`,
            }}
          >
            <span
              className="orbit-dot"
              style={{
                width: p.size, height: p.size,
                animation: `orbitPulse ${4 + (p.id % 4)}s ease-in-out infinite`,
                animationDelay: `${p.id * 0.3}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Mystical caption */}
      <div className="orb-caption latin">— Aperi Cor Tuum —</div>
    </div>
  );
}

// ── About ────────────────────────────────────────────────────────────────────
function About({ name }) {
  return (
    <section id="about" className="section section-about">
      <div className="section-head">
        <div className="section-eyebrow latin">— I —</div>
        <h2 className="section-title display">אודותיי</h2>
        <Divider />
      </div>
      <div className="about-grid">
        <div className="about-portrait">
          <div className="portrait-frame">
            <MysticOrb />
            <div className="portrait-glow" />
          </div>
          <div className="portrait-caption display">
            <span>{name}</span>
            <span className="latin caption-sub">— Tarot Reader —</span>
          </div>
        </div>
        <div className="about-text">
          <p className="lede">
            כבר 14 שנה אני מלווה אנשים במסע אל תוך עצמם —
            דרך מיסטיקה רוחנית, פתיחה במים קדושים, קלפי טארוט, קריאה בכף היד וקפה, והאזנה עמוקה ללב.
          </p>
          <p>
            אני מעניקה מענה מקיף הכולל פתיחת מזל, הגנה מעין הרע וכישופים, ברכה לפריון וילודה,
            טיפולי רייקי לאיזון אנרגטי, והכוונה וייעוץ מקצועי ורוחני לפתיחת עסק בגישה מחזקת ותומכת שמשיגה תוצאות.
          </p>
          <p>
            הייעוץ והקריאות מתקיימים במרחב בטוח ואינטימי — בפגישה אישית או בשיחה טלפונית.
            השירות ניתן בשפות: עברית, רוסית וקווקזית.
          </p>
          <ul className="credentials">
            <li>
              <span className="cred-num display">14</span>
              <span className="cred-lbl">שנות ניסיון והצלחה</span>
            </li>
            <li>
              <span className="cred-num display">3</span>
              <span className="cred-lbl">שפות: עברית, רוסית וקווקזית</span>
            </li>
            <li>
              <span className="cred-num display">∞</span>
              <span className="cred-lbl">גישה מחזקת ותומכת</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// ── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: 'mystic',
    tag: 'קריאה וראייה',
    title: 'מיסטיקה רוחנית',
    duration: 'פתיחה מלאה',
    subtitle: 'מים קדושים · טארוט · כף יד וקפה',
    price: '₪ —',
    desc: 'פתיחה במים קדושים, טארוט + קלפים + תמונה, קריאת בכף היד וקפה. חיבור מעמיק לקבלת בהירות, מענה לשאלות הלב והכוונה מדויקת.',
    features: [
      'פתיחה במים קדושים',
      'טארוט + קלפים + תמונה',
      'קריאת בכף היד וקפה',
      'ראייה אינטואיטיבית ומענה מעמיק',
    ],
  },
  {
    icon: 'hamsa',
    tag: 'הכי מבוקש',
    title: 'פתיחת מזל, הגנה ורייקי',
    duration: 'טיהור וברכה',
    subtitle: 'הסרת עין הרע · פריון · רייקי',
    price: '₪ —',
    desc: 'פתיחת מזל, הגנה מעין הרע וכישופים, ברכה וליווי לפריון וילודה, וטיפולי רייקי לשחרור חסימות ואיזון אנרגטי עמוק.',
    features: [
      'פתיחת מזל והסרת חסימות',
      'הגנה מעין הרע וכישופים',
      'ברכה וליווי לפריון וילודה',
      'טיפולי רייקי ואיזון אנרגטי',
    ],
    featured: true,
  },
  {
    icon: 'star',
    tag: '14 שנות ניסיון',
    title: 'הכוונה וייעוץ לפתיחת עסק',
    duration: 'ייעוץ ממוקד תוצאות',
    subtitle: 'עברית · רוסית · קווקזית',
    price: '₪ —',
    desc: 'שיחת ייעוץ מקצועית ורוחנית לפתיחת עסק בליווי 14 שנות ניסיון. גישה מחזקת, בונה ותומכת, שמשיגה תוצאות. שירות בעברית, רוסית וקווקזית.',
    features: [
      '14 שנות ניסיון בליווי עסקי והצלחה',
      'שיחת ייעוץ מקצועית ורוחנית',
      'גישה מחזקת, בונה ותומכת שמשיגה תוצאות',
      'דוברת עברית, רוסית וקווקזית',
    ],
  },
];

function ServiceIcon({ type }) {
  if (type === 'mystic' || type === 'crescent') return (
    <svg viewBox="0 0 60 60" width="48" height="48" aria-hidden="true">
      <path d="M 38 12 A 20 20 0 1 0 38 48 A 15 15 0 1 1 38 12 Z"
            fill="none" stroke="var(--gold)" strokeWidth="0.9" />
      <path d="M 27 23 C 27 23 22 29 22 33 A 5 5 0 0 0 32 33 C 32 29 27 23 27 23 Z"
            fill="var(--gold)" fillOpacity="0.35" stroke="var(--gold)" strokeWidth="0.8" />
      <circle cx="18" cy="20" r="1.3" fill="var(--gold)" />
      <circle cx="15" cy="38" r="1" fill="var(--gold)" fillOpacity="0.7" />
    </svg>
  );
  if (type === 'hamsa' || type === 'sun') return (
    <svg viewBox="0 0 60 60" width="48" height="48" aria-hidden="true">
      <circle cx="30" cy="30" r="23" fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="2 3" strokeOpacity="0.6" />
      <path d="M 23 44 C 19 44 18 38 18 33 C 18 29 16 27 17 24 C 18 21 21 22 22 25 C 22 19 24 16 26 16 C 28 16 29 19 29 23 C 29 19 30 16 32 16 C 34 16 36 19 36 25 C 37 22 40 21 41 24 C 42 27 40 29 40 33 C 40 38 39 44 35 44 Z"
            fill="none" stroke="var(--gold)" strokeWidth="0.9" />
      <path d="M 23 33 Q 29 27 35 33 Q 29 39 23 33 Z" fill="none" stroke="var(--gold)" strokeWidth="0.8" />
      <circle cx="29" cy="33" r="2.2" fill="var(--gold)" />
    </svg>
  );
  // star / business guidance
  return (
    <svg viewBox="0 0 60 60" width="48" height="48" aria-hidden="true">
      <g transform="translate(30 30)" fill="none" stroke="var(--gold)" strokeWidth="0.9">
        <circle r="22" strokeWidth="0.5" strokeDasharray="1 3" strokeOpacity="0.7" />
        <path d="M 0 -22 L 4.5 -4.5 L 22 0 L 4.5 4.5 L 0 22 L -4.5 4.5 L -22 0 L -4.5 -4.5 Z" fill="var(--gold)" fillOpacity="0.15" />
        <path d="M 0 -22 L 4.5 -4.5 L 22 0 L 4.5 4.5 L 0 22 L -4.5 4.5 L -22 0 L -4.5 -4.5 Z" />
        <circle r="3.2" fill="var(--gold)" fillOpacity="0.6" stroke="none" />
      </g>
    </svg>
  );
}

function Services() {
  return (
    <section id="services" className="section section-services">
      <div className="section-head">
        <div className="section-eyebrow latin">— II —</div>
        <h2 className="section-title display">השירותים שלי</h2>
        <Divider />
        <p className="section-sub">
          מגוון שירותים וקריאות רוחניות בהתאמה אישית — פתיחה במים, טארוט, פתיחת מזל, הגנה וייעוץ עסקי מבוסס 14 שנות ניסיון.
        </p>
      </div>
      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <article key={i} className={`service-card ${s.featured ? 'service-featured' : ''}`}>
            {s.tag && <div className="service-tag display">{s.tag}</div>}
            <div className="service-icon"><ServiceIcon type={s.icon} /></div>
            <h3 className="service-title display">{s.title}</h3>
            <div className="service-meta">
              <span>{s.duration}</span>
              {s.subtitle && (
                <>
                  <i className="dot" />
                  <span>{s.subtitle}</span>
                </>
              )}
            </div>
            <p className="service-desc">{s.desc}</p>
            <ul className="service-features">
              {s.features.map((f, j) => (
                <li key={j}>
                  <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
                    <path d="M 6 0 L 7 5 L 12 6 L 7 7 L 6 12 L 5 7 L 0 6 L 5 5 Z"
                          fill="var(--gold)" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a href="#contact" className="service-cta">לתיאום מפגש ←</a>
          </article>
        ))}
      </div>
      <p className="services-note">
        * ניתן לתאם פגישה אישית או שיחת ייעוץ טלפונית · השירות ניתן בעברית, רוסית וקווקזית
      </p>
    </section>
  );
}

// ── Oracle: Card of the Day ──────────────────────────────────────────────────
function Oracle() {
  // Three face-down cards; user picks one, it flips
  const [picked, setPicked]   = useState(null);  // index 0/1/2
  const [card, setCard]       = useState(null);  // TAROT_DECK entry
  const [flipping, setFlipping] = useState(false);

  const drawCard = (idx) => {
    if (picked !== null) return;
    const c = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];
    setPicked(idx);
    setFlipping(true);
    setCard(c);
    setTimeout(() => setFlipping(false), 900);
  };
  const reset = () => {
    setPicked(null);
    setCard(null);
  };

  return (
    <section id="oracle" className="section section-oracle">
      <div className="section-head">
        <div className="section-eyebrow latin">— III —</div>
        <h2 className="section-title display">קלף היום</h2>
        <Divider />
        <p className="section-sub">
          קחי רגע. נשמי עמוק. חשבי על שאלה אחת — ובחרי קלף.
        </p>
      </div>

      <div className="oracle-stage">
        <div className="cards-row">
          {[0, 1, 2].map((i) => {
            const isPicked = picked === i;
            const isFaded  = picked !== null && !isPicked;
            return (
              <button
                key={i}
                className={`tarot-card ${isPicked ? 'card-picked' : ''} ${isFaded ? 'card-faded' : ''} ${flipping && isPicked ? 'card-flipping' : ''}`}
                onClick={() => drawCard(i)}
                disabled={picked !== null}
                aria-label={`קלף ${i + 1}`}
              >
                <div className="card-inner">
                  <div className="card-face card-face-back">
                    <CardBackArt />
                  </div>
                  <div className="card-face card-face-front">
                    {isPicked && card && <CardFaceArt num={card.num} name={card.name} />}
                  </div>
                </div>
                {!isPicked && (
                  <div className="card-hint display">
                    <span>קלף {['ראשון', 'שני', 'שלישי'][i]}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {card && !flipping && (
          <div className="oracle-reveal reveal">
            <div className="reveal-eyebrow latin">— Today's Card —</div>
            <h3 className="reveal-title display">
              <span className="latin reveal-num">{card.num}</span>
              <span> · </span>
              <span>{card.name}</span>
            </h3>
            <div className="reveal-keys">{card.keywords}</div>
            <p className="reveal-text">{card.reading}</p>
            <button onClick={reset} className="btn btn-ghost btn-sm">
              שליפת קלף נוסף ↻
            </button>
          </div>
        )}

        {!card && (
          <div className="oracle-prompt">
            <EyeGlyph />
            <p>הקלפים מחכים. סמכי על הלב שלך — הוא יודע.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: 'הגעתי במצב לב סוער ויצאתי עם בהירות שכבר חודשים חיפשתי. הקריאה הייתה מדויקת, רכה, ובדיוק במקום הנכון. אני חוזרת.',
    name: 'דנה ק.',
    city: 'תל אביב',
  },
  {
    text: 'הרגשתי שמישהי באמת רואה אותי — לא מנחשת. הקלפים פתחו שיחה שלא ידעתי שאני צריכה. תודה גדולה.',
    name: 'מיכל ב.',
    city: 'חיפה',
  },
  {
    text: 'באתי סקפטי לחלוטין. יצאתי עם תחושת ביטחון שלא הייתה לי כבר שנים. מעבר לקלפים, יש פה אדם שמקשיב לעומק.',
    name: 'יואב ש.',
    city: 'רעננה',
  },
];

function Testimonials() {
  const [i, setI] = useState(0);
  const next = () => setI((p) => (p + 1) % TESTIMONIALS.length);
  const prev = () => setI((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const t = TESTIMONIALS[i];

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="voices" className="section section-voices">
      <div className="section-head">
        <div className="section-eyebrow latin">— IV —</div>
        <h2 className="section-title display">מילים שנשארות איתי</h2>
        <Divider />
      </div>
      <div className="voices-stage">
        <div className="quote-mark display" aria-hidden="true">״</div>
        <blockquote key={i} className="voice-quote reveal">
          <p className="voice-text">{t.text}</p>
          <footer className="voice-cite">
            <span className="voice-name display">{t.name}</span>
            <span className="voice-city">{t.city}</span>
          </footer>
        </blockquote>
        <div className="voice-controls">
          <button onClick={prev} className="voice-arrow" aria-label="קודם">‹</button>
          <div className="voice-dots">
            {TESTIMONIALS.map((_, k) => (
              <button key={k} className={`dot-btn ${k === i ? 'on' : ''}`}
                      onClick={() => setI(k)} aria-label={`עדות ${k + 1}`} />
            ))}
          </div>
          <button onClick={next} className="voice-arrow" aria-label="הבא">›</button>
        </div>
      </div>
    </section>
  );
}

// ── Contact ──────────────────────────────────────────────────────────────────
function Contact({ name, phone, email }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    topic: 'מיסטיקה רוחנית — מים קדושים, טארוט, כף יד וקפה',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };
  return (
    <section id="contact" className="section section-contact">
      <div className="section-head">
        <div className="section-eyebrow latin">— V —</div>
        <h2 className="section-title display">תיאום קריאה</h2>
        <Divider />
        <p className="section-sub">
          השאירי פרטים ואחזור אלייך בתוך 24 שעות. אם זה דחוף — אפשר גם בטלפון.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-card">
            <div className="contact-card-glow" />
            <div className="contact-row">
              <div className="contact-label latin">— Telephone —</div>
              {phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="contact-value display">
                  {phone}
                </a>
              ) : (
                <span className="contact-value display contact-pending">— יתעדכן בקרוב —</span>
              )}
              <div className="contact-hint">זמינה ימים א׳–ה׳ · 10:00–21:00</div>
            </div>
            <div className="contact-row">
              <div className="contact-label latin">— WhatsApp —</div>
              {phone ? (
                <a href={`https://wa.me/${phone.replace(/[^\d]/g, '').replace(/^0/, '972')}`}
                   target="_blank" rel="noopener"
                   className="contact-value display">{phone}</a>
              ) : (
                <span className="contact-value display contact-pending">— יתעדכן בקרוב —</span>
              )}
              <div className="contact-hint">להודעות בכל שעה — מענה במהלך היום</div>
            </div>
            <div className="contact-row">
              <div className="contact-label latin">— Email —</div>
              {email ? (
                <a href={`mailto:${email}`} className="contact-value display">{email}</a>
              ) : (
                <span className="contact-value display contact-pending">— יתעדכן בקרוב —</span>
              )}
            </div>
            {phone && (
              <a href={`https://wa.me/${phone.replace(/[^\d]/g, '').replace(/^0/, '972')}`}
                 target="_blank" rel="noopener"
                 className="whatsapp-cta"
                 aria-label="פתיחת צ'אט בוואטסאפ">
                <span className="whatsapp-icon" aria-hidden="true">
                  <svg viewBox="0 0 32 32" width="22" height="22">
                    <path fill="currentColor" d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-2c1.8 1 3.9 1.5 6.3 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-2 0-3.9-.5-5.5-1.5l-.4-.2-4.6 1.2 1.2-4.5-.3-.4C5.4 18 5 16.5 5 15c0-6.1 4.9-11 11-11s11 4.9 11 11-4.9 11-11 11zm6.1-8.2c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.5s1 2.9 1.1 3.1c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4 0-.1-.3-.2-.6-.4z" />
                  </svg>
                </span>
                <span className="whatsapp-text">
                  <span className="whatsapp-title display">שליחת הודעה בוואטסאפ</span>
                  <span className="whatsapp-sub">מענה מהיר · ישירות לצ'אט</span>
                </span>
                <span className="whatsapp-arrow" aria-hidden="true">←</span>
              </a>
            )}
          </div>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <label className="form-field">
            <span className="form-label">שם מלא</span>
            <input
              type="text" required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="שמך כאן" />
          </label>
          <label className="form-field">
            <span className="form-label">טלפון</span>
            <input
              type="tel" required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="053-964-6269" />
          </label>
          <label className="form-field">
            <span className="form-label">סוג השירות</span>
            <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
              <option>מיסטיקה רוחנית — מים קדושים, טארוט, כף יד וקפה</option>
              <option>פתיחת מזל, הגנה מעין הרע וכישופים, פריון ורייקי</option>
              <option>הכוונה וייעוץ לפתיחת עסק (14 שנות ניסיון)</option>
              <option>אחר — אסביר בהודעה</option>
            </select>
          </label>
          <label className="form-field">
            <span className="form-label">משהו שתרצי לשתף לפני הפגישה?</span>
            <textarea
              rows="4"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="שאלה ראשונית, העדפת שעות, או כל דבר שירגיש לך נכון..." />
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            {sent ? '✓ ההודעה נשלחה — אחזור אלייך בקרוב' : 'שליחה'}
          </button>
          <p className="form-fine">
            הפרטים שלך נשמרים בדיסקרטיות מלאה ולא מועברים לאף אחד.
          </p>
        </form>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer({ name }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand display">
          <SmallStar size={12} />
          <span>{name}</span>
          <SmallStar size={12} />
        </div>
        <p className="footer-tag">
          קריאה בקלפי טארוט · ליווי רוחני · שיחה מהלב
        </p>
        <Divider width={180} />
        <p className="footer-fine">
          © {new Date().getFullYear()} · כל הזכויות שמורות · נבנה באהבה בלילה כוכבים
        </p>
      </div>
    </footer>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Persistent placeholder content the user will fill — kept in tweaks so it
  // can be edited from the panel and survives reload
  const [details, setDetails] = useState({
    name: 'מרים',
    tagline: 'מסע של הקשבה אל הקלפים, הלב והעולם. מרחב רך לפגוש את עצמך במלוא הכבוד.',
    phone: '053-964-6269',
    email: '',
  });

  // Apply palette to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const [bg, gold, ink] = t.palette;
    root.style.setProperty('--bg', bg);
    root.style.setProperty('--bg-2', shade(bg, 0.08));
    root.style.setProperty('--ink', ink);
    root.style.setProperty('--ink-soft', hexA(ink, 0.72));
    root.style.setProperty('--ink-faint', hexA(ink, 0.45));
    root.style.setProperty('--gold', gold);
    root.style.setProperty('--gold-soft', hexA(gold, 0.4));
    root.style.setProperty('--gold-faint', hexA(gold, 0.15));
    root.style.setProperty('--line', hexA(gold, 0.22));
    root.style.setProperty('--display-font', `'${t.displayFont}', serif`);
  }, [t.palette, t.displayFont]);

  return (
    <div className="site">
      <StarField density={t.starDensity} animated={t.animatedStars} showMoon={t.showMoon} />
      <Nav name={details.name} />
      <Hero name={details.name} tagline={details.tagline} layout={t.heroLayout} />
      <About name={details.name} />
      <Services />
      <Oracle />
      <Testimonials />
      <Contact name={details.name} phone={details.phone}
               email={details.email} />
      <Footer name={details.name} />

      {details.phone && (
        <a
          href={`https://wa.me/${details.phone.replace(/[^\d]/g, '').replace(/^0/, '972')}`}
          target="_blank"
          rel="noopener"
          className="whatsapp-float"
          aria-label="פתיחת צ'אט בוואטסאפ"
          title="שליחת הודעה בוואטסאפ"
        >
          <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
            <path fill="currentColor" d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-2c1.8 1 3.9 1.5 6.3 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 22c-2 0-3.9-.5-5.5-1.5l-.4-.2-4.6 1.2 1.2-4.5-.3-.4C5.4 18 5 16.5 5 15c0-6.1 4.9-11 11-11s11 4.9 11 11-4.9 11-11 11zm6.1-8.2c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.5s1 2.9 1.1 3.1c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4 0-.1-.3-.2-.6-.4z" />
          </svg>
          <span className="whatsapp-float-pulse" aria-hidden="true" />
          <span className="whatsapp-float-label">צ'אט בוואטסאפ</span>
        </a>
      )}

      <TweaksPanel title="התאמה אישית">
        <TweakSection label="עיצוב">
          <TweakColor label="פלטה" value={t.palette} options={PALETTES}
                      onChange={(v) => setTweak('palette', v)} />
          <TweakRadio label="פונט כותרת" value={t.displayFont}
                      options={DISPLAY_FONTS}
                      onChange={(v) => setTweak('displayFont', v)} />
          <TweakRadio label="פריסת הירו" value={t.heroLayout}
                      options={[
                        { value: 'centered', label: 'מרכזית' },
                        { value: 'split',    label: 'מפוצלת' },
                      ]}
                      onChange={(v) => setTweak('heroLayout', v)} />
        </TweakSection>
        <TweakSection label="אווירה">
          <TweakSlider label="צפיפות כוכבים" value={t.starDensity}
                       min={20} max={160} step={5}
                       onChange={(v) => setTweak('starDensity', v)} />
          <TweakToggle label="ירח" value={t.showMoon}
                       onChange={(v) => setTweak('showMoon', v)} />
          <TweakToggle label="כוכבים נוצצים" value={t.animatedStars}
                       onChange={(v) => setTweak('animatedStars', v)} />
        </TweakSection>
        <TweakSection label="פרטי המקרא/ה">
          <TweakText label="שם" value={details.name}
                     onChange={(v) => setDetails({ ...details, name: v })} />
          <TweakText label="טלפון" value={details.phone}
                     onChange={(v) => setDetails({ ...details, phone: v })} />
          <TweakText label="אימייל" value={details.email}
                     onChange={(v) => setDetails({ ...details, email: v })} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// ── tiny color helpers ───────────────────────────────────────────────────────
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.split('').map(c => c+c).join('') : h;
  const r = parseInt(x.slice(0,2),16), g = parseInt(x.slice(2,4),16), b = parseInt(x.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}
function shade(hex, amount) { // lighten by amount (0..1)
  const h = hex.replace('#', '');
  const x = h.length === 3 ? h.split('').map(c => c+c).join('') : h;
  const r = parseInt(x.slice(0,2),16), g = parseInt(x.slice(2,4),16), b = parseInt(x.slice(4,6),16);
  const ch = (n) => Math.round(n + (255 - n) * amount);
  const hex2 = (n) => n.toString(16).padStart(2, '0');
  return `#${hex2(ch(r))}${hex2(ch(g))}${hex2(ch(b))}`;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
