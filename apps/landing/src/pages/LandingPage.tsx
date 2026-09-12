import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Check, ArrowRight, Star, Sparkles, Pencil } from 'lucide-react';

type ThemeKey = 'light' | 'dark';
const THEMES: Record<ThemeKey, Record<string, string>> = {
  light: {
    bg: '#FAFAF8',
    bgAlt: '#FFFFFF',
    bgDeep: '#F2F3EF',
    ink: '#101418',
    inkSoft: '#565D66',
    inkFaint: '#8B929A',
    accent: '#1F6F4A',
    accentBright: '#2E8B5F',
    accentInk: '#FFFFFF',
    accentSoft: '#E8F2EC',
    gold: '#B8791F',
    border: '#E4E4DE',
    borderStrong: '#D2D3CC',
    navBg: 'rgba(250,250,248,0.85)',
    ctaBg: '#101418',
    ctaInk: '#FAFAF8',
    shadow: '0 1px 2px rgba(16,20,24,0.04), 0 8px 24px -12px rgba(16,20,24,0.12)',
    shadowLift: '0 2px 4px rgba(16,20,24,0.05), 0 18px 40px -18px rgba(16,20,24,0.2)',
  },
  dark: {
    bg: '#0C0F0E',
    bgAlt: '#131716',
    bgDeep: '#090C0B',
    ink: '#F0F2EF',
    inkSoft: '#9AA29B',
    inkFaint: '#69706A',
    accent: '#3DA57C',
    accentBright: '#4FBF92',
    accentInk: '#06100B',
    accentSoft: '#16281F',
    gold: '#D9A44A',
    border: '#222826',
    borderStrong: '#333A37',
    navBg: 'rgba(12,15,14,0.85)',
    ctaBg: '#F0F2EF',
    ctaInk: '#0C0F0E',
    shadow: '0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -12px rgba(0,0,0,0.6)',
    shadowLift: '0 2px 4px rgba(0,0,0,0.4), 0 18px 40px -18px rgba(0,0,0,0.8)',
  },
};

const TRADES = [
  'Restaurant',
  'Coiffeur',
  'Garage',
  'Boulangerie',
  'Fleuriste',
  'Institut de beauté',
  'Cabinet dentaire',
  'Boucherie',
  'Opticien',
  'Pizzeria',
  'Pressing',
  'Caviste',
];

const REVIEWS = [
  {
    id: 1,
    name: 'Nadia B.',
    initial: 'N',
    stars: 5,
    time: 'il y a 8 min',
    text: "Super accueil et cuisine délicieuse, on s'est régalés. Je recommande vraiment !",
    reply:
      "Merci beaucoup Nadia, ça nous touche vraiment ! Toute l'équipe en cuisine sera ravie de lire ça. On vous attend avec plaisir pour une prochaine table.",
  },
  {
    id: 2,
    name: 'Karim D.',
    initial: 'K',
    stars: 3,
    time: 'il y a 22 min',
    text: "Les plats étaient bons mais on a attendu 40 minutes avant d'être servis un vendredi soir.",
    reply:
      "Merci Karim pour votre franchise, et désolé pour cette attente. Les vendredis soir nous débordent parfois, on renforce l'équipe en salle sur ces créneaux. On espère vous revoir dans de meilleures conditions.",
  },
  {
    id: 3,
    name: 'Léa P.',
    initial: 'L',
    stars: 1,
    time: 'il y a 1 h',
    text: 'Serveur désagréable et plat froid. Très déçue, je ne reviendrai pas.',
    reply:
      "Léa, je suis vraiment navré de lire ça, ce n'est pas du tout ce qu'on veut offrir. J'aimerais comprendre ce qui s'est passé ce soir-là : écrivez-nous, on aimerait pouvoir se rattraper.",
  },
];

const PROBLEMS = [
  {
    title: 'Dix minutes par avis, en moyenne',
    text: "Trouver le bon ton, formuler poliment, ne pas se répéter d'un avis à l'autre : ça prend du temps que vous n'avez pas entre deux clients.",
  },
  {
    title: 'Des avis sans réponse pendant des semaines',
    text: "Sans notification fiable, les avis s'accumulent et finissent oubliés — ce que voient tous vos futurs clients avant de pousser la porte.",
  },
  {
    title: 'Des outils pensés pour les groupes, pas pour vous',
    text: 'Les solutions existantes ciblent des agences qui gèrent 50 établissements. Vous en gérez un, et leurs tableaux de bord ne vous parlent pas.',
  },
];

const STEPS = [
  {
    title: 'Connectez votre fiche',
    text: "Reliez votre Google Business Profile en deux minutes. Pas de démo à réserver, pas d'onboarding commercial.",
  },
  {
    title: "L'IA écrit une réponse",
    text: 'Une réponse professionnelle et personnalisée à chaque avis, générée en un clic, dans le ton de votre commerce.',
  },
  {
    title: 'Vous validez et publiez',
    text: 'Vous relisez, modifiez si besoin, et publiez directement sur Google. Rien ne part sans votre accord.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Je répondais à mes avis une fois par mois, quand j'y pensais. Maintenant c'est fait le matin même, en deux minutes.",
    name: 'Sofiane M.',
    role: 'Restaurant, Lyon',
  },
  {
    quote:
      'Les réponses sont bien tournées et sonnent comme moi. Mes clients ne voient pas la différence, et moi je gagne un temps fou.',
    name: 'Céline R.',
    role: 'Salon de coiffure, Nantes',
  },
  {
    quote:
      "Enfin un outil simple. Pas de formation, pas de commercial au téléphone. Je me suis inscrit et c'était réglé.",
    name: 'Marc D.',
    role: 'Garage automobile, Rennes',
  },
];

const PLANS = [
  {
    name: 'Gratuit',
    price: '0 €',
    period: 'pour toujours',
    tagline: 'Pour tester sur votre fiche.',
    features: [
      '1 fiche Google',
      '10 réponses par mois',
      'Réponses générées par IA',
      'Publication en un clic',
    ],
    cta: 'Commencer',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '24 €',
    period: 'par mois',
    tagline: 'Pour ne plus jamais laisser un avis sans réponse.',
    features: [
      '1 fiche Google',
      'Réponses illimitées',
      'Notifications de nouvel avis',
      'Ton personnalisé',
      'Historique complet',
      'Support prioritaire',
    ],
    cta: 'Essayer gratuitement',
    highlight: true,
  },
];

const FAQ = [
  {
    q: 'Est-ce que je garde le contrôle sur ce qui est publié ?',
    a: "Oui. Wafizo rédige une proposition de réponse, mais rien n'est publié sur Google sans que vous l'ayez relue et validée. Vous pouvez modifier chaque réponse avant de publier.",
  },
  {
    q: 'Mes données sont-elles hébergées en France ?',
    a: "Oui, l'ensemble de vos données est hébergé sur des serveurs situés en France. Nous ne les revendons pas et ne les partageons avec aucun tiers.",
  },
  {
    q: 'Faut-il un engagement ou une carte bancaire ?',
    a: 'Non. Le plan gratuit ne demande aucune carte bancaire, et le plan Pro est sans engagement : vous pouvez arrêter quand vous voulez.',
  },
  {
    q: 'Combien de temps pour connecter ma fiche ?',
    a: "Environ deux minutes. Vous reliez votre Google Business Profile en vous connectant avec Google, et c'est prêt. Pas de démo à réserver.",
  },
  {
    q: 'Les réponses ressemblent-elles à des messages automatiques ?',
    a: "Non. Les réponses sont personnalisées à partir du contenu de chaque avis et du ton que vous choisissez. Vous pouvez ajuster ce ton pour qu'il colle à votre commerce.",
  },
];

const STATS = [
  { value: 30, suffix: ' s', label: 'pour répondre à un avis' },
  { value: 4.7, suffix: ' ★', label: 'note moyenne des réponses', decimals: 1 },
  { value: 100, suffix: ' %', label: 'hébergé en France' },
];

function InboxDemo({
  t,
  font,
  visible,
}: {
  t: (typeof THEMES)['light'];
  font: { display: string; body: string };
  visible: boolean;
}) {
  const [activeId, setActiveId] = useState(1);
  const [published, setPublished] = useState<number[]>([]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const active = REVIEWS.find((r) => r.id === activeId) ?? REVIEWS[0];
  const isPublished = published.includes(activeId);

  const select = (id: number) => {
    setActiveId(id);
    setEditing(false);
    setDraft('');
  };

  const publish = () => {
    if (!published.includes(activeId)) setPublished([...published, activeId]);
    setEditing(false);
    const next = REVIEWS.find((r) => r.id !== activeId && !published.includes(r.id));
    if (next) setTimeout(() => select(next.id), 900);
  };

  const startEdit = () => {
    setDraft(draft || active.reply);
    setEditing(true);
  };

  const reset = () => {
    setPublished([]);
    setDraft('');
    setEditing(false);
    setActiveId(1);
  };

  const allDone = published.length === REVIEWS.length;

  return (
    <div
      style={{
        position: 'relative',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition:
          'opacity 0.75s cubic-bezier(0.16,1,0.3,1) 0.18s, transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.18s',
      }}
    >
      <div
        style={{
          background: t.bgAlt,
          border: `1px solid ${t.border}`,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: t.shadowLift,
        }}
      >
        {/* Barre de titre */}
        <div
          style={{
            padding: '12px 18px',
            borderBottom: `1px solid ${t.border}`,
            background: t.bgDeep,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 600, color: t.inkSoft }}>Vos avis</span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 600,
              color: allDone ? t.accent : t.gold,
              background: allDone ? t.accentSoft : 'transparent',
              borderRadius: 999,
              padding: allDone ? '3px 9px' : 0,
            }}
          >
            {allDone ? 'Tout est répondu' : `${REVIEWS.length - published.length} en attente`}
          </span>
        </div>

        {/* Liste d'avis */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}`, background: t.bg }}>
          {REVIEWS.map((r) => {
            const on = r.id === activeId;
            const done = published.includes(r.id);
            return (
              <button
                key={r.id}
                onClick={() => select(r.id)}
                className="wf-inbox-tab"
                style={{
                  flex: 1,
                  padding: '13px 10px',
                  background: on ? t.bgAlt : 'transparent',
                  border: 'none',
                  borderRight: r.id !== REVIEWS.length ? `1px solid ${t.border}` : 'none',
                  borderBottom: on ? `2px solid ${t.accent}` : '2px solid transparent',
                  cursor: 'pointer',
                  fontFamily: font.body,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'background 0.18s ease',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      background: done ? t.accent : t.accentSoft,
                      color: done ? t.accentInk : t.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10.5,
                      fontWeight: 600,
                      fontFamily: font.display,
                      transition: 'background 0.25s ease',
                    }}
                  >
                    {done ? <Check size={11} strokeWidth={3} /> : r.initial}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: on ? 600 : 400,
                      color: on ? t.ink : t.inkSoft,
                    }}
                  >
                    {r.name}
                  </span>
                </span>
                <span style={{ color: t.inkFaint, display: 'flex' }}>
                  <Stars count={r.stars} color={t.gold} size={9} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Détail */}
        <div style={{ padding: 22 }} key={activeId}>
          <div style={{ animation: 'wf-fadein 0.35s ease' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>{active.name}</span>
              <span style={{ fontSize: 11.5, color: t.inkFaint, whiteSpace: 'nowrap' }}>
                {active.time}
              </span>
            </div>
            <div style={{ marginTop: 5, color: t.inkFaint }}>
              <Stars count={active.stars} color={t.gold} />
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                marginTop: 10,
                marginBottom: 0,
                color: t.inkSoft,
              }}
            >
              {active.text}
            </p>

            <div style={{ height: 1, background: t.border, margin: '20px 0' }} />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12,
                fontWeight: 600,
                color: t.accent,
                marginBottom: 10,
              }}
            >
              <Sparkles size={12} /> Réponse déjà rédigée
            </div>

            {editing ? (
              <textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="wf-input"
                style={{
                  width: '100%',
                  minHeight: 96,
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: `1px solid ${t.accent}`,
                  background: t.bg,
                  color: t.ink,
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontFamily: font.body,
                  resize: 'vertical',
                }}
              />
            ) : (
              <p style={{ fontSize: 14, lineHeight: 1.65, margin: 0, minHeight: 68 }}>
                {draft || active.reply}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 18,
                flexWrap: 'wrap',
              }}
            >
              {isPublished ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '8px 14px',
                    borderRadius: 999,
                    background: t.accentSoft,
                    fontSize: 13,
                    color: t.accent,
                    fontWeight: 600,
                    animation: 'wf-fadein 0.35s ease',
                  }}
                >
                  <Check size={13} strokeWidth={3} /> Publiée sur Google
                </span>
              ) : (
                <>
                  <button
                    onClick={publish}
                    className="wf-btn"
                    style={{
                      background: t.accent,
                      color: t.accentInk,
                      border: 'none',
                      borderRadius: 9,
                      padding: '10px 18px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: font.body,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                    }}
                  >
                    <Check size={14} strokeWidth={3} /> Publier
                  </button>
                  <button
                    onClick={editing ? () => setEditing(false) : startEdit}
                    className="wf-btn"
                    style={{
                      background: 'transparent',
                      color: t.inkSoft,
                      border: `1px solid ${t.border}`,
                      borderRadius: 9,
                      padding: '10px 16px',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: font.body,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                    }}
                  >
                    <Pencil size={13} /> {editing ? 'Terminer' : 'Modifier'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: 12.5, color: t.inkFaint, textAlign: 'center', marginTop: 16 }}>
        {allDone ? (
          <>
            Trois avis traités.{' '}
            <button
              onClick={reset}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: t.accent,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: 12.5,
                fontFamily: font.body,
                textDecoration: 'underline',
              }}
            >
              Recommencer
            </button>
          </>
        ) : (
          'Essayez : publiez la réponse, ou modifiez-la avant'
        )}
      </p>
    </div>
  );
}

function Stars({ count, color, size = 13 }: { count: number; color: string; size?: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          fill={i < count ? color : 'currentColor'}
          style={{ opacity: i < count ? 1 : 0.2 }}
        />
      ))}
    </div>
  );
}

function AnimatedNumber({
  value,
  decimals = 0,
  suffix = '',
}: {
  value: number;
  decimals?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf: number;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          const dur = 1600;
          const tick = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            setDisplay(value * (1 - Math.pow(1 - p, 3)));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          obs.unobserve(el);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [theme, setTheme] = useState<ThemeKey>('light');
  const [scrolled, setScrolled] = useState(false);
  const [heroIn, setHeroIn] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const t = THEMES[theme];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => setHeroIn(true), 80);
    return () => clearTimeout(id);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const font = {
    display: "'Space Grotesk', 'Segoe UI', sans-serif",
    body: "'Inter', 'Segoe UI', sans-serif",
  };

  const section = { maxWidth: 1080, margin: '0 auto', padding: '96px 28px' };
  const h2 = {
    fontFamily: font.display,
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.18,
    margin: 0,
  };

  return (
    <div
      style={{
        background: t.bg,
        color: t.ink,
        fontFamily: font.body,
        minHeight: '100vh',
        transition: 'background 0.3s ease, color 0.3s ease',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;450;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .wf-link { transition: color 0.15s ease; }
        .wf-link:hover { color: ${t.ink}; }
        .wf-btn { transition: transform 0.18s cubic-bezier(0.16,1,0.3,1), box-shadow 0.18s ease, background 0.18s ease; }
        .wf-btn:hover { transform: translateY(-1.5px); }
        .wf-btn:active { transform: translateY(0); }
        .wf-input { transition: border-color 0.18s ease, box-shadow 0.18s ease; }
        .wf-input:focus { outline: none; border-color: ${t.accent}; box-shadow: 0 0 0 3px ${t.accentSoft}; }
        button:focus-visible, a:focus-visible { outline: 2px solid ${t.accent}; outline-offset: 3px; border-radius: 4px; }
        @keyframes wf-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes wf-dot { 0%, 80%, 100% { opacity: 0.2; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-2px); } }
        @keyframes wf-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes wf-ping { 0% { transform: scale(1); opacity: 0.6; } 75%, 100% { transform: scale(2.6); opacity: 0; } }
        @keyframes wf-drift1 { 0%, 100% { transform: translate(0,0) scale(1); } 33% { transform: translate(5%,-4%) scale(1.12); } 66% { transform: translate(-4%,4%) scale(0.94); } }
        @keyframes wf-drift2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-6%,5%) scale(1.14); } }
        @keyframes wf-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes wf-fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .wf-logo { cursor: pointer; background: none; border: none; padding: 0; transition: opacity 0.15s ease; display: flex; align-items: center; gap: 8px; }
        .wf-logo:hover { opacity: 0.65; }
        .wf-ping { position: absolute; inset: 0; border-radius: 999px; animation: wf-ping 2s cubic-bezier(0,0,0.2,1) infinite; }
        .wf-marquee-track { display: flex; width: max-content; animation: wf-marquee 44s linear infinite; }
        .wf-marquee:hover .wf-marquee-track { animation-play-state: paused; }
        .wf-card { transition: transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease, border-color 0.22s ease; }
        .wf-card:hover { transform: translateY(-4px); box-shadow: ${t.shadowLift}; border-color: ${t.borderStrong}; }
        .wf-acc:hover .wf-acc-q { color: ${t.accent}; }
        .wf-acc-q { transition: color 0.16s ease; }
        .wf-inbox-tab:hover { background: ${t.bgDeep} !important; }
        @media (prefers-reduced-motion: reduce) {
          *, .wf-marquee-track { animation: none !important; transition-duration: 0.01ms !important; }
        }
        @media (max-width: 880px) {
          .wf-hide-mobile { display: none !important; }
          .wf-stack { grid-template-columns: 1fr !important; gap: 40px !important; }
          .wf-h1 { font-size: 38px !important; }
          .wf-sec { padding: 64px 22px !important; }
          .wf-h2 { font-size: 26px !important; }
        }
      `}</style>

      {/* NAV */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: t.navBg,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${scrolled ? t.border : 'transparent'}`,
          transition: 'border-color 0.25s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: scrolled ? '13px 28px' : '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'padding 0.28s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <button onClick={scrollTop} className="wf-logo" aria-label="Revenir en haut">
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: t.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={14} color={t.accentInk} strokeWidth={2.5} />
            </span>
            <span
              style={{
                fontFamily: font.display,
                fontWeight: 700,
                fontSize: 19,
                letterSpacing: '-0.02em',
                color: t.ink,
              }}
            >
              Wafizo
            </span>
          </button>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <a
              href="#tarifs"
              className="wf-link wf-hide-mobile"
              style={{ fontSize: 14.5, color: t.inkSoft, textDecoration: 'none' }}
            >
              Tarifs
            </a>
            <a
              href="#faq"
              className="wf-link wf-hide-mobile"
              style={{ fontSize: 14.5, color: t.inkSoft, textDecoration: 'none' }}
            >
              Questions
            </a>
            <a
              href="#"
              className="wf-link wf-hide-mobile"
              style={{ fontSize: 14.5, color: t.inkSoft, textDecoration: 'none' }}
            >
              Se connecter
            </a>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Changer de thème"
              className="wf-btn"
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                border: `1px solid ${t.border}`,
                background: t.bgAlt,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: t.inkSoft,
              }}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button
              className="wf-btn"
              style={{
                background: t.accent,
                color: t.accentInk,
                border: 'none',
                borderRadius: 9,
                padding: '10px 18px',
                fontSize: 14.5,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: font.body,
                boxShadow: t.shadow,
              }}
            >
              Être prévenu
            </button>
          </nav>
        </div>
      </header>

      {/* BANDE DE COMMERCES — tout en haut */}
      <div
        className="wf-marquee"
        style={{
          borderBottom: `1px solid ${t.border}`,
          background: t.bgDeep,
          overflow: 'hidden',
          padding: '11px 0',
          maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <div className="wf-marquee-track">
          {[...TRADES, ...TRADES].map((trade, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 22,
                fontSize: 13,
                fontWeight: 450,
                color: t.inkFaint,
                paddingRight: 22,
                whiteSpace: 'nowrap',
                letterSpacing: '0.01em',
              }}
            >
              {trade}
              <span
                style={{ width: 3, height: 3, borderRadius: 999, background: t.borderStrong }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: -160,
            left: -100,
            width: 540,
            height: 540,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${t.accent} 0%, transparent 66%)`,
            opacity: theme === 'light' ? 0.13 : 0.22,
            filter: 'blur(70px)',
            animation: 'wf-drift1 24s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 20,
            right: -140,
            width: 460,
            height: 460,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${t.gold} 0%, transparent 66%)`,
            opacity: theme === 'light' ? 0.1 : 0.15,
            filter: 'blur(80px)',
            animation: 'wf-drift2 30s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        <div
          className="wf-sec"
          style={{
            position: 'relative',
            maxWidth: 1080,
            margin: '0 auto',
            padding: '88px 28px 84px',
          }}
        >
          <div
            className="wf-stack"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.05fr 0.95fr',
              gap: 64,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                opacity: heroIn ? 1 : 0,
                transform: heroIn ? 'translateY(0)' : 'translateY(18px)',
                transition:
                  'opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: `1px solid ${t.border}`,
                  background: t.bgAlt,
                  fontSize: 13,
                  color: t.inkSoft,
                  marginBottom: 30,
                  boxShadow: t.shadow,
                }}
              >
                <span style={{ position: 'relative', display: 'inline-flex', width: 6, height: 6 }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: t.accentBright,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                  <span className="wf-ping" style={{ background: t.accentBright }} />
                </span>
                Pensé pour un commerce, pas pour cinquante
              </div>

              <h1
                className="wf-h1"
                style={{
                  fontFamily: font.display,
                  fontSize: 58,
                  lineHeight: 1.04,
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  margin: 0,
                }}
              >
                Vos clients attendent une réponse.
                <br />
                Pas vous, une heure libre.
              </h1>

              <p
                style={{
                  fontSize: 17.5,
                  lineHeight: 1.62,
                  color: t.inkSoft,
                  marginTop: 24,
                  maxWidth: 470,
                }}
              >
                Wafizo rédige des réponses professionnelles à vos avis Google en un clic. Dix
                minutes de réflexion et de formulation par avis, ramenées à trente secondes.
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                style={{ display: 'flex', gap: 10, marginTop: 34, maxWidth: 430 }}
              >
                <input
                  className="wf-input"
                  type="email"
                  placeholder="vous@commerce.fr"
                  aria-label="Votre adresse email"
                  style={{
                    flex: 1,
                    padding: '13px 16px',
                    borderRadius: 10,
                    border: `1px solid ${t.borderStrong}`,
                    background: t.bgAlt,
                    color: t.ink,
                    fontSize: 14.5,
                    fontFamily: font.body,
                  }}
                />
                <button
                  className="wf-btn"
                  style={{
                    background: t.ink,
                    color: t.bg,
                    border: 'none',
                    borderRadius: 10,
                    padding: '13px 22px',
                    fontSize: 14.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    fontFamily: font.body,
                    boxShadow: t.shadow,
                  }}
                >
                  Être prévenu
                </button>
              </form>
              <p style={{ fontSize: 12.5, color: t.inkFaint, marginTop: 12 }}>
                Aucun spam. Un email au lancement, c'est tout.
              </p>
            </div>

            <InboxDemo t={t} font={font} visible={heroIn} />
          </div>
        </div>
      </section>

      {/* PROBLEME */}
      <section style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="wf-sec" style={section}>
          <Reveal>
            <h2 className="wf-h2" style={{ ...h2, maxWidth: 540 }}>
              Le problème n'est pas de savoir répondre. C'est de trouver le temps.
            </h2>
          </Reveal>

          <div style={{ marginTop: 52 }}>
            {PROBLEMS.map((item, i) => (
              <Reveal key={i} delay={i * 110}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr',
                    gap: 20,
                    padding: '30px 0',
                    borderTop: `1px solid ${t.border}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: font.display,
                      fontSize: 13,
                      fontWeight: 600,
                      color: t.accent,
                      paddingTop: 4,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3
                      style={{ fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 15.5,
                        color: t.inkSoft,
                        lineHeight: 1.65,
                        marginTop: 10,
                        marginBottom: 0,
                        maxWidth: 580,
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section style={{ borderTop: `1px solid ${t.border}`, background: t.bgAlt }}>
        <div className="wf-sec" style={section}>
          <Reveal>
            <h2 className="wf-h2" style={h2}>
              Comment ça marche
            </h2>
          </Reveal>

          <div
            className="wf-stack"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 36,
              marginTop: 56,
              position: 'relative',
            }}
          >
            <div
              className="wf-hide-mobile"
              aria-hidden
              style={{
                position: 'absolute',
                top: 17,
                left: '12%',
                right: '12%',
                height: 1,
                background: `linear-gradient(90deg, transparent, ${t.border} 15%, ${t.border} 85%, transparent)`,
              }}
            />
            {STEPS.map((step, i) => (
              <Reveal key={i} delay={i * 140}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    background: t.accent,
                    color: t.accentInk,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: font.display,
                    position: 'relative',
                    zIndex: 1,
                    boxShadow: t.shadow,
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    marginTop: 22,
                    marginBottom: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: t.inkSoft,
                    lineHeight: 1.65,
                    marginTop: 10,
                    marginBottom: 0,
                  }}
                >
                  {step.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POSITIONNEMENT */}
      <section style={{ borderTop: `1px solid ${t.border}` }}>
        <div
          className="wf-sec wf-stack"
          style={{
            ...section,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <Reveal>
            <h2 className="wf-h2" style={h2}>
              Fait pour vous, pas pour les franchises
            </h2>
            <p
              style={{
                fontSize: 16,
                color: t.inkSoft,
                lineHeight: 1.7,
                marginTop: 20,
                maxWidth: 450,
              }}
            >
              Les autres outils sont pensés pour des chaînes et des groupes multi-établissements.
              Wafizo est pensé pour un commerce, une fiche Google, une application simple à utiliser
              entre deux clients.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gap: 2 }}>
            {[
              'Données hébergées en France',
              'Un vrai plan gratuit',
              'Sans engagement',
              'Configuré en 2 minutes',
            ].map((label, i) => (
              <Reveal
                key={i}
                delay={i * 90}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 0',
                  borderBottom: i < 3 ? `1px solid ${t.border}` : 'none',
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 999,
                    background: t.accentSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={13} color={t.accent} strokeWidth={3} />
                </span>
                <span style={{ fontSize: 15.5 }}>{label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section style={{ borderTop: `1px solid ${t.border}`, background: t.bgAlt }}>
        <div className="wf-sec" style={section}>
          <Reveal>
            <h2 className="wf-h2" style={h2}>
              Ils répondent à leurs avis en deux minutes
            </h2>
          </Reveal>

          <div
            className="wf-stack"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              marginTop: 48,
            }}
          >
            {TESTIMONIALS.map((tm, i) => (
              <Reveal key={i} delay={i * 120} style={{ height: '100%' }}>
                <div
                  className="wf-card"
                  style={{
                    background: t.bg,
                    border: `1px solid ${t.border}`,
                    borderRadius: 16,
                    padding: 26,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ marginBottom: 16, color: t.inkFaint }}>
                    <Stars count={5} color={t.gold} size={14} />
                  </div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.65, margin: 0, flex: 1 }}>
                    « {tm.quote} »
                  </p>
                  <div
                    style={{
                      marginTop: 22,
                      paddingTop: 18,
                      borderTop: `1px solid ${t.border}`,
                      fontSize: 13.5,
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{tm.name}</div>
                    <div style={{ color: t.inkFaint, marginTop: 3 }}>{tm.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <p style={{ fontSize: 12, color: t.inkFaint, marginTop: 22, fontStyle: 'italic' }}>
            Témoignages illustratifs — à remplacer par de vrais retours avant mise en ligne.
          </p>
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="wf-sec" style={section}>
          <Reveal>
            <h2 className="wf-h2" style={h2}>
              Un tarif simple, sans surprise
            </h2>
            <p
              style={{
                fontSize: 16,
                color: t.inkSoft,
                marginTop: 18,
                maxWidth: 490,
                lineHeight: 1.65,
              }}
            >
              Commencez gratuitement. Passez au plan Pro le jour où vous ne voulez plus jamais
              laisser un avis sans réponse.
            </p>
          </Reveal>

          <div
            className="wf-stack"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 22,
              marginTop: 48,
              maxWidth: 760,
            }}
          >
            {PLANS.map((plan, i) => (
              <Reveal key={i} delay={i * 130} style={{ height: '100%' }}>
                <div
                  className="wf-card"
                  style={{
                    background: plan.highlight ? t.bgAlt : t.bg,
                    border: plan.highlight ? `1.5px solid ${t.accent}` : `1px solid ${t.border}`,
                    borderRadius: 18,
                    padding: 30,
                    height: '100%',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: plan.highlight ? t.shadowLift : 'none',
                  }}
                >
                  {plan.highlight && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -11,
                        left: 30,
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: t.accentInk,
                        background: t.accent,
                        borderRadius: 999,
                        padding: '4px 12px',
                      }}
                    >
                      Le plus choisi
                    </span>
                  )}

                  <div style={{ fontFamily: font.display, fontSize: 17, fontWeight: 600 }}>
                    {plan.name}
                  </div>
                  <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 7 }}>
                    <span
                      style={{
                        fontFamily: font.display,
                        fontSize: 42,
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {plan.price}
                    </span>
                    <span style={{ fontSize: 13.5, color: t.inkFaint }}>{plan.period}</span>
                  </div>
                  <p
                    style={{
                      fontSize: 14.5,
                      color: t.inkSoft,
                      marginTop: 12,
                      marginBottom: 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {plan.tagline}
                  </p>

                  <div style={{ height: 1, background: t.border, margin: '24px 0' }} />

                  <div style={{ display: 'grid', gap: 13, flex: 1 }}>
                    {plan.features.map((f, j) => (
                      <div
                        key={j}
                        style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14.5 }}
                      >
                        <Check
                          size={15}
                          color={t.accent}
                          strokeWidth={2.5}
                          style={{ flexShrink: 0 }}
                        />
                        {f}
                      </div>
                    ))}
                  </div>

                  <button
                    className="wf-btn"
                    style={{
                      marginTop: 28,
                      width: '100%',
                      background: plan.highlight ? t.accent : 'transparent',
                      color: plan.highlight ? t.accentInk : t.ink,
                      border: plan.highlight ? 'none' : `1px solid ${t.borderStrong}`,
                      borderRadius: 10,
                      padding: '13px',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: font.body,
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ borderTop: `1px solid ${t.border}`, background: t.bgAlt }}>
        <div className="wf-sec" style={{ ...section, maxWidth: 780 }}>
          <Reveal>
            <h2 className="wf-h2" style={h2}>
              Questions fréquentes
            </h2>
          </Reveal>

          <div style={{ marginTop: 44 }}>
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={i} style={{ borderTop: `1px solid ${t.border}` }}>
                  <button
                    className="wf-acc"
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    aria-expanded={open}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: '22px 0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 20,
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: t.ink,
                      fontFamily: font.body,
                    }}
                  >
                    <span
                      className="wf-acc-q"
                      style={{ fontSize: 16.5, fontWeight: 600, letterSpacing: '-0.01em' }}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      style={{
                        flexShrink: 0,
                        width: 26,
                        height: 26,
                        borderRadius: 999,
                        border: `1px solid ${open ? t.accent : t.border}`,
                        background: open ? t.accent : 'transparent',
                        color: open ? t.accentInk : t.inkSoft,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: open ? 'rotate(135deg)' : 'rotate(0deg)',
                        transition:
                          'transform 0.3s cubic-bezier(0.16,1,0.3,1), background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                        fontSize: 17,
                        lineHeight: 1,
                        paddingBottom: 1,
                      }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: open ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.32s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <p
                        style={{
                          fontSize: 15,
                          color: t.inkSoft,
                          lineHeight: 1.7,
                          margin: 0,
                          paddingBottom: 24,
                          maxWidth: 640,
                        }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS — déplacées en bas */}
      <section style={{ borderTop: `1px solid ${t.border}` }}>
        <div
          className="wf-sec wf-stack"
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '64px 28px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
          }}
        >
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 120} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: font.display,
                  fontSize: 50,
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  color: t.accent,
                  lineHeight: 1,
                }}
              >
                <AnimatedNumber value={s.value} decimals={s.decimals || 0} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 14.5, color: t.inkSoft, marginTop: 12 }}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: t.ctaBg, color: t.ctaInk }}>
        <div
          style={{ maxWidth: 1080, margin: '0 auto', padding: '96px 28px', textAlign: 'center' }}
        >
          <Reveal>
            <h2
              style={{
                fontFamily: font.display,
                fontSize: 40,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.12,
                margin: 0,
              }}
            >
              Vos avis méritent une réponse.
              <br />
              Maintenant.
            </h2>
            <p style={{ fontSize: 16.5, opacity: 0.68, marginTop: 18 }}>
              Essayez gratuitement, sans carte bancaire.
            </p>
            <button
              className="wf-btn"
              style={{
                marginTop: 34,
                background: t.accentBright,
                color: theme === 'light' ? '#FFFFFF' : '#06100B',
                border: 'none',
                borderRadius: 11,
                padding: '15px 30px',
                fontSize: 15.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                fontFamily: font.body,
              }}
            >
              Essayer gratuitement <ArrowRight size={16} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${t.border}`, background: t.bgDeep }}>
        <div
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: '32px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            fontSize: 13.5,
            color: t.inkFaint,
          }}
        >
          <span>© 2026 Wafizo</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#" className="wf-link" style={{ color: t.inkFaint, textDecoration: 'none' }}>
              Ouvrir l'app
            </a>
            <a href="#" className="wf-link" style={{ color: t.inkFaint, textDecoration: 'none' }}>
              Mentions légales
            </a>
            <a href="#" className="wf-link" style={{ color: t.inkFaint, textDecoration: 'none' }}>
              Confidentialité
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
