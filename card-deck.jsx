// card-deck.jsx
// Tarot card data + Card component for the "Card of the Day" interactive section.
// 22 Major Arcana cards with Hebrew names, keywords, and short readings.

const TAROT_DECK = [
  { num: '0',    name: 'השוטה',         keywords: 'התחלות · תמימות · קפיצת אמונה',
    reading: 'הדרך פתוחה לפנייך. צעדי בלי לדעת את הסוף — הסוד הוא לבטוח שהיקום אוחז אותך.' },
  { num: 'I',    name: 'הקוסם',         keywords: 'מימוש · יצירה · רצון',
    reading: 'כל הכלים נמצאים בידייך. זה הרגע לפעול ולתרגם את הרעיון למציאות מוחשית.' },
  { num: 'II',   name: 'הכוהנת הגדולה', keywords: 'אינטואיציה · סוד · ירח',
    reading: 'הקולות השקטים מדברים אלייך. הקשיבי לבטן, לא רק לראש — שם נמצאת התשובה.' },
  { num: 'III',  name: 'הקיסרית',       keywords: 'שפע · נשיות · יצירתיות',
    reading: 'תקופה של פריחה ופוריות, פנימית או חיצונית. טפחי את מה שצומח בתוכך.' },
  { num: 'IV',   name: 'הקיסר',         keywords: 'יציבות · מבנה · גבולות',
    reading: 'הגיע הזמן לבסס. שרטטי את הגבולות, בני את היסודות — מהם תצמח חירות אמיתית.' },
  { num: 'V',    name: 'הכוהן',         keywords: 'מסורת · מורה · אמונה',
    reading: 'מורה או חוכמה עתיקה צפויים לחצות את דרכך. הקשיבי בלב פתוח.' },
  { num: 'VI',   name: 'האוהבים',       keywords: 'בחירה · אהבה · איחוד',
    reading: 'עומדת בפנייך בחירה של לב. שתי הדרכים יפות — חשוב לבחור מתוך אמת ולא מתוך פחד.' },
  { num: 'VII',  name: 'המרכבה',        keywords: 'התקדמות · ניצחון · שליטה',
    reading: 'הכוחות הפנימיים שלך מתאחדים. החזיקי במושכות, כווני קדימה — הניצחון קרוב.' },
  { num: 'VIII', name: 'הכוח',          keywords: 'אומץ · עדינות · ריסון',
    reading: 'הכוח האמיתי הוא רך. כשאת מאלפת את הלביאה הפנימית באהבה — הכול נפתח.' },
  { num: 'IX',   name: 'הנזיר',         keywords: 'התבוננות · אור פנימי · שתיקה',
    reading: 'הגיעה עת ההתבודדות. רק בשקט תמצאי את הנר שיאיר את הדרך הבאה.' },
  { num: 'X',    name: 'גלגל המזל',     keywords: 'גורל · מחזורים · שינוי',
    reading: 'הגלגל מסתובב לטובתך. שחררי שליטה — היקום עובד עבורך, גם אם לא תמיד גלוי לעין.' },
  { num: 'XI',   name: 'הצדק',          keywords: 'איזון · אמת · בהירות',
    reading: 'האמת תצא לאור. פעלי מתוך יושרה, והשפה תמיד תיטה לכיוונך.' },
  { num: 'XII',  name: 'התלוי',         keywords: 'נקודת מבט · ויתור · המתנה',
    reading: 'הפכי את התמונה. מה שנראה תקוע יפתח כשתסכימי להסתכל מזווית שונה לגמרי.' },
  { num: 'XIII', name: 'המוות',         keywords: 'סיום · התחדשות · שינוי',
    reading: 'משהו חייב להסתיים כדי שמשהו חדש ייוולד. אל תפחדי — זו לידה, לא קץ.' },
  { num: 'XIV',  name: 'המתינות',       keywords: 'מיזוג · אלכימיה · סבלנות',
    reading: 'התקופה דורשת מזיגה עדינה. אל תמהרי — הניסים מתבשלים בקצב שלהם.' },
  { num: 'XV',   name: 'השטן',          keywords: 'כבלים · התמכרות · צל',
    reading: 'הביטי במה שכובל אותך באמת. הכבלים פתוחים — נשאר רק להחליט לקום וללכת.' },
  { num: 'XVI',  name: 'המגדל',         keywords: 'התפרצות · אמת · שחרור',
    reading: 'ההריסה היא טהרה. מה שייפול היה ממילא רעוע — מקומך עכשיו על אדמה אמיתית.' },
  { num: 'XVII', name: 'הכוכב',         keywords: 'תקווה · השראה · שמיים פתוחים',
    reading: 'אור עדין חוזר. הקלף הזה מבטיח: התפילות שלך נשמעו, התשובה כבר בדרך.' },
  { num: 'XVIII',name: 'הירח',          keywords: 'חלום · אינטואיציה · מסתורין',
    reading: 'לא הכול ברור — וזה בסדר. סמכי על האינטואיציה, גם כשהשכל מתעקש לדעת.' },
  { num: 'XIX',  name: 'השמש',          keywords: 'שמחה · בהירות · חיוּת',
    reading: 'הקלף הזוהר ביותר. תקופה של חיוך, אהבה והצלחה — הרשי לעצמך להיות מאושרת.' },
  { num: 'XX',   name: 'המשפט',         keywords: 'התעוררות · קריאה · חידוש',
    reading: 'קריאה גדולה מהדהדת בלבך. הקשיבי — הנשמה שלך זוכרת למה היא כאן.' },
  { num: 'XXI',  name: 'העולם',         keywords: 'סיום · שלמות · גמר',
    reading: 'מעגל נסגר בשלום. גאי במסע — ומיד בעקבותיו מעגל חדש ורחב יותר ייפתח.' },
];

// SVG glyph drawn on each card back — concentric mystical sigil
function CardBackArt() {
  return (
    <svg viewBox="0 0 100 160" className="card-back-art" aria-hidden="true">
      <defs>
        <linearGradient id="cb-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="var(--gold)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      {/* Outer frame */}
      <rect x="5" y="5" width="90" height="150" rx="3" fill="none"
            stroke="url(#cb-grad)" strokeWidth="0.6" />
      <rect x="8" y="8" width="84" height="144" rx="2" fill="none"
            stroke="var(--gold)" strokeOpacity="0.25" strokeWidth="0.3" />
      {/* Top decorative diamond */}
      <g transform="translate(50 28)" fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.7">
        <path d="M 0 -7 L 5 0 L 0 7 L -5 0 Z" />
        <circle r="1.5" fill="var(--gold)" fillOpacity="0.6" />
      </g>
      {/* Center mandala */}
      <g transform="translate(50 80)" fill="none" stroke="var(--gold)" strokeWidth="0.5">
        <circle r="22" strokeOpacity="0.5" />
        <circle r="16" strokeOpacity="0.7" />
        <circle r="10" strokeOpacity="0.5" />
        {/* 8-pointed star */}
        <g strokeOpacity="0.85">
          <path d="M0 -22 L0 22" />
          <path d="M-22 0 L22 0" />
          <path d="M-15.5 -15.5 L15.5 15.5" />
          <path d="M-15.5 15.5 L15.5 -15.5" />
        </g>
        {/* Center sun */}
        <circle r="3.5" fill="var(--gold)" fillOpacity="0.65" stroke="none" />
        <circle r="6" strokeOpacity="0.4" />
      </g>
      {/* Bottom decorative diamond */}
      <g transform="translate(50 132)" fill="none" stroke="var(--gold)" strokeWidth="0.5" strokeOpacity="0.7">
        <path d="M 0 -7 L 5 0 L 0 7 L -5 0 Z" />
        <circle r="1.5" fill="var(--gold)" fillOpacity="0.6" />
      </g>
      {/* Tiny corner stars */}
      {[[14,14],[86,14],[14,146],[86,146]].map(([cx,cy],i)=>(
        <g key={i} transform={`translate(${cx} ${cy})`} stroke="var(--gold)" strokeWidth="0.3" strokeOpacity="0.5">
          <path d="M-1.5 0 L1.5 0 M0 -1.5 L0 1.5" />
        </g>
      ))}
    </svg>
  );
}

// Card face — illustrated SVG glyph specific to each card, plus number & name
function CardFaceArt({ num, name }) {
  return (
    <svg viewBox="0 0 100 160" className="card-face-art" aria-hidden="true">
      <defs>
        <radialGradient id={`face-glow-${num}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="var(--gold)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="5" y="5" width="90" height="150" rx="3" fill="none"
            stroke="var(--gold)" strokeWidth="0.6" strokeOpacity="0.8" />
      <rect x="8" y="8" width="84" height="144" rx="2" fill="none"
            stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="0.3" />
      <circle cx="50" cy="80" r="36" fill={`url(#face-glow-${num})`} />
      {/* Generic mystical glyph — sun, moon, star arrangement */}
      <g transform="translate(50 70)" fill="none" stroke="var(--gold)" strokeWidth="0.6">
        {/* Crescent moon */}
        <path d="M -15 0 A 12 12 0 1 0 -15 -0.1 A 9 9 0 1 1 -15 0 Z"
              fill="var(--gold)" fillOpacity="0.5" stroke="none" />
        {/* Sun */}
        <g transform="translate(15 0)">
          <circle r="5" fill="var(--gold)" fillOpacity="0.55" stroke="none" />
          {[0,45,90,135,180,225,270,315].map(a=>(
            <line key={a} x1={Math.cos(a*Math.PI/180)*7} y1={Math.sin(a*Math.PI/180)*7}
                  x2={Math.cos(a*Math.PI/180)*10} y2={Math.sin(a*Math.PI/180)*10}
                  strokeOpacity="0.7" />
          ))}
        </g>
        {/* Top star */}
        <g transform="translate(0 -16)" strokeOpacity="0.8">
          <path d="M0 -4 L1 -1 L4 -1 L1.5 1 L2.5 4 L0 2 L-2.5 4 L-1.5 1 L-4 -1 L-1 -1 Z"
                fill="var(--gold)" fillOpacity="0.4" />
        </g>
      </g>
      {/* Wave / ground line */}
      <path d="M 15 110 Q 30 105, 50 110 T 85 110" fill="none"
            stroke="var(--gold)" strokeOpacity="0.55" strokeWidth="0.6" />
      <path d="M 15 116 Q 30 112, 50 116 T 85 116" fill="none"
            stroke="var(--gold)" strokeOpacity="0.3" strokeWidth="0.4" />
      {/* Number top */}
      <text x="50" y="22" textAnchor="middle" fontSize="6.5" letterSpacing="2"
            fill="var(--gold)" fillOpacity="0.85"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
        {num}
      </text>
      {/* Name bottom */}
      <text x="50" y="138" textAnchor="middle" fontSize="7" letterSpacing="1.5"
            fill="var(--gold)" fillOpacity="0.95"
            style={{ fontFamily: "'Frank Ruhl Libre', serif", fontWeight: 500 }}>
        {name}
      </text>
      <line x1="30" y1="143" x2="70" y2="143" stroke="var(--gold)" strokeOpacity="0.5" strokeWidth="0.3" />
    </svg>
  );
}

Object.assign(window, { TAROT_DECK, CardBackArt, CardFaceArt });
