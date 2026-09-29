import { AnimatePresence, animate, motion, useDragControls, useInView, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, Crosshair, Instagram, MapPin, Menu, MessageCircle, Navigation, Plus, Star, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { gym, type Modality } from '@/data/gym';
import { useHeroAnimation } from '@/hooks/useHeroAnimation';

const ease = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  ['Experiência', '#experiencia'],
  ['Modalidades', '#modalidades'],
  ['Planos', '#planos'],
  ['Visite', '#localizacao'],
] as const;

/* ---------- Utilidades ---------- */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/* Imagens leves no celular: pede à CDN (Pexels) a largura certa em vez de sempre 2000px */
function sized(url: string, width: number) {
  if (!url.includes('images.pexels.com')) return url;
  const u = new URL(url);
  u.searchParams.delete('h');
  u.searchParams.set('w', String(width));
  return u.toString();
}
function srcSetOf(url: string, widths: number[] = [480, 800, 1200]) {
  if (!url.includes('images.pexels.com')) return undefined;
  return widths.map((w) => `${sized(url, w)} ${w}w`).join(', ');
}
const halfWidth = '(max-width: 767px) 100vw, 50vw';

/* ---------- WhatsApp ---------- */
function whatsappUrl(message: string) {
  return `https://wa.me/${gym.whatsapp}?text=${encodeURIComponent(message)}`;
}

function WhatsAppButton({ label = 'Agendar aula experimental', dark = false, message = 'Olá! Vim pelo site e gostaria de agendar uma aula experimental.' }: { label?: string; dark?: boolean; message?: string }) {
  return <a className={`button ${dark ? 'button-dark' : ''}`} href={whatsappUrl(message)} target="_blank" rel="noreferrer">{label}</a>;
}

/* ---------- Animação de entrada ao rolar ---------- */
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  const small = typeof window !== 'undefined' && window.innerWidth < 768;
  return <motion.div className={className} initial={{ opacity: 0, y: small ? 24 : 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: small ? '-40px' : '-80px' }} transition={{ duration: small ? 0.7 : 0.9, delay: small ? Math.min(delay, 0.15) : delay, ease }}>{children}</motion.div>;
}

/* ---------- Números que contam ao aparecer ---------- */
type ParsedStat = { prefix: string; suffix: string; target: number; decimals: number; pad: number; grouped: boolean };

function parseStat(value: string): ParsedStat | null {
  const match = value.match(/^(\D*?)(\d[\d.,]*)(\D*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  return {
    prefix,
    suffix,
    target: parseFloat(num.replace(/\./g, '').replace(',', '.')),
    decimals: num.includes(',') ? num.split(',')[1].length : 0,
    pad: /^0\d+$/.test(num) ? num.length : 0,
    grouped: num.includes('.'),
  };
}

function formatStat(p: ParsedStat, n: number) {
  const body = p.pad
    ? String(Math.round(n)).padStart(p.pad, '0')
    : new Intl.NumberFormat('pt-BR', { minimumFractionDigits: p.decimals, maximumFractionDigits: p.decimals, useGrouping: p.grouped }).format(n);
  return `${p.prefix}${body}${p.suffix}`;
}

function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const parsed = useMemo(() => parseStat(value), [value]);
  const [text, setText] = useState(() => (parsed && !reduce ? formatStat(parsed, 0) : value));

  useEffect(() => {
    if (!parsed || reduce || !inView) return;
    const controls = animate(0, parsed.target, {
      duration: 1.6,
      ease,
      onUpdate: (v) => setText(formatStat(parsed, v)),
      onComplete: () => setText(value),
    });
    return () => controls.stop();
  }, [inView, parsed, reduce, value]);

  return <div className="stat" ref={ref}><strong>{text}</strong><span>{label}</span></div>;
}

/* ---------- Horário de funcionamento em tempo real ---------- */
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LABEL: Record<string, string> = { Sun: 'domingo', Mon: 'segunda', Tue: 'terça', Wed: 'quarta', Thu: 'quinta', Fri: 'sexta', Sat: 'sábado' };
const HOURS: Record<string, [number, number] | null> = {
  Mon: [6, 23], Tue: [6, 23], Wed: [6, 23], Thu: [6, 23], Fri: [6, 23], Sat: [8, 14], Sun: null,
};

function getGymStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = get('weekday');
  const hour = Number(get('hour')) % 24;
  const minute = Number(get('minute'));
  const minutes = hour * 60 + minute;
  const range = HOURS[day];
  const open = !!range && minutes >= range[0] * 60 && minutes < range[1] * 60;

  let note = '';
  if (open && range) {
    note = `Fecha às ${range[1]}h`;
  } else {
    const dayIdx = DAYS.indexOf(day);
    for (let i = 0; i < 8; i++) {
      const idx = (dayIdx + i) % 7;
      const r = HOURS[DAYS[idx]];
      if (!r || (i === 0 && minutes >= r[0] * 60)) continue;
      note = i === 0 ? `Abre hoje às ${r[0]}h` : i === 1 ? `Abre amanhã às ${r[0]}h` : `Abre ${DAY_LABEL[DAYS[idx]]} às ${r[0]}h`;
      break;
    }
  }
  return { time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`, open, note };
}

function useGymStatus() {
  const [status, setStatus] = useState(() => getGymStatus());
  useEffect(() => {
    const tick = () => { if (!document.hidden) setStatus(getGymStatus()); };
    const id = window.setInterval(tick, 30_000);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(id); document.removeEventListener('visibilitychange', tick); };
  }, []);
  return status;
}

/* ---------- Modalidades: carrossel com snap no celular ---------- */
function ModalityCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    if (!el || el.children.length < 2) return;
    const step = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft;
    setIndex(Math.min(gym.modalities.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  };

  const goTo = (i: number) => {
    const el = ref.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: 'smooth' });
  };

  return (
    <>
      <div className="modality-carousel" ref={ref} onScroll={onScroll} data-lenis-prevent-touch>
        {gym.modalities.map((m) => (
          <article className="modality-card" key={m.name}>
            <img src={sized(m.image, 800)} srcSet={srcSetOf(m.image, [480, 800])} sizes="80vw" alt={m.name} loading="lazy" decoding="async" />
            <div className="modality-card-body"><span>{m.number}</span><h3>{m.name}</h3><p>{m.description}</p></div>
          </article>
        ))}
      </div>
      <div className="carousel-dots" role="tablist" aria-label="Modalidades">
        {gym.modalities.map((m, i) => <button key={m.name} onClick={() => goTo(i)} aria-label={`Ver ${m.name}`} aria-current={index === i} />)}
      </div>
    </>
  );
}

/* ---------- Agendamento (formulário → WhatsApp) ---------- */
const periods = { Manhã: 'no período da manhã', Tarde: 'no período da tarde', Noite: 'no período da noite' } as const;
const goals = ['Emagrecer', 'Ganhar massa', 'Saúde e bem-estar', 'Condicionamento'];

function BookingModal({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const [name, setName] = useState('');
  const [period, setPeriod] = useState<keyof typeof periods | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    const previous = document.body.style.overflow;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    let message = `Olá! Me chamo ${name.trim()} e gostaria de agendar uma aula experimental na ${gym.name}`;
    if (period) message += ` ${periods[period]}`;
    message += '.';
    if (goal) message += ` Meu objetivo é: ${goal.toLowerCase()}.`;
    window.open(whatsappUrl(message), '_blank', 'noopener');
    onClose();
  };

  return (
    <motion.div className="booking-backdrop" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        initial={isMobile ? { y: '100%' } : { y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={isMobile ? { y: '100%' } : { y: 30, opacity: 0 }}
        transition={{ duration: 0.5, ease }}
        drag={isMobile ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 600) onClose(); }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-grip" onPointerDown={(event) => dragControls.start(event)} aria-hidden="true"><span /></div>
        <button className="modal-close" onClick={onClose} aria-label="Fechar"><span><X size={18} /></span></button>
        <p className="eyebrow">Seu primeiro passo</p>
        <h2 id="booking-title">Vamos encontrar <span>seu horário.</span></h2>
        <p>Conte um pouco sobre você e a gente continua a conversa pelo WhatsApp.</p>
        <form onSubmit={submit}>
          <div className="field">
            <label className="field-label" htmlFor="booking-name">Seu nome</label>
            <input id="booking-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos te chamar?" required autoComplete="given-name" enterKeyHint="done" autoFocus={!isMobile} />
          </div>
          <fieldset className="field">
            <legend className="field-label">Melhor período</legend>
            <div className="chips">
              {(Object.keys(periods) as (keyof typeof periods)[]).map((p) => (
                <button type="button" key={p} className="chip" aria-pressed={period === p} onClick={() => setPeriod(period === p ? null : p)}>{p}</button>
              ))}
            </div>
          </fieldset>
          <fieldset className="field">
            <legend className="field-label">Seu objetivo</legend>
            <div className="chips">
              {goals.map((g) => (
                <button type="button" key={g} className="chip" aria-pressed={goal === g} onClick={() => setGoal(goal === g ? null : g)}>{g}</button>
              ))}
            </div>
          </fieldset>
          <button className="button" type="submit">Continuar no WhatsApp</button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ---------- App ---------- */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModality, setActiveModality] = useState<Modality>(gym.modalities[0]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const closeBooking = useCallback(() => setShowBooking(false), []);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const anim = useHeroAnimation();
  const status = useGymStatus();
  const total = gym.testimonials.length;
  const testimonial = gym.testimonials[activeTestimonial];
  const nextTestimonial = () => setActiveTestimonial((i) => (i + 1) % total);
  const prevTestimonial = () => setActiveTestimonial((i) => (i + total - 1) % total);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setPastHero(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Menu do celular: trava a rolagem do fundo e fecha com Esc */
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

  const showBar = isMobile && pastHero && !showBooking && !menuOpen;

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <a className="wordmark" href="#top" aria-label="Áurea início" onClick={() => setMenuOpen(false)}><span className="mark">A</span><span>Áurea</span></a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="mobile-menu">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          <WhatsAppButton label="Começar" />
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div id="mobile-menu" className="mobile-nav" data-lenis-prevent initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <nav aria-label="Menu">
              {navLinks.map(([label, href], i) => (
                <motion.a key={href} href={href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease }}>{label}</motion.a>
              ))}
            </nav>
            <WhatsAppButton label="Agendar aula experimental" />
          </motion.div>
        )}
      </AnimatePresence>

      <main id="top">
        <section className="hero" ref={anim.heroRef as React.RefObject<HTMLElement>}>
          <div className="hero-photo-wrap" ref={anim.photoWrapRef as React.RefObject<HTMLDivElement>}>
            <img ref={anim.photoRef as React.RefObject<HTMLImageElement>} src={sized(gym.images.hero, 1600)} srcSet={srcSetOf(gym.images.hero, [640, 1000, 1600, 2000])} sizes="100vw" alt="Pessoa correndo com sensação de movimento" className="hero-photo" decoding="async" {...({ fetchpriority: 'high' } as Record<string, string>)} />
          </div>
          <div className="hero-overlay" ref={anim.overlayRef as React.RefObject<HTMLDivElement>} />
          <div className="hero-topline" ref={anim.toplineRef as React.RefObject<HTMLDivElement>}>
            <span>Desde 2018</span><span className="hero-line" /><span>Pinheiros, São Paulo</span>
          </div>
          <div className="hero-content">
            <p className="eyebrow light" ref={anim.eyebrowRef as React.RefObject<HTMLParagraphElement>}>Treino de verdade</p>
            <h1>
              <span className="title-line" ref={anim.addTitleRef}>Mova</span>
              <span className="title-line" ref={anim.addTitleRef}><em>o seu</em></span>
              <span className="title-line" ref={anim.addTitleRef}>mundo<span className="accent-dot">.</span></span>
            </h1>
            <div className="hero-bottom" ref={anim.heroBottomRef as React.RefObject<HTMLDivElement>}>
              <p ref={anim.heroBottomPRef as React.RefObject<HTMLParagraphElement>}>Treino bem feito, espaço bom e acompanhamento de perto.</p>
              <div ref={anim.heroButtonRef as React.RefObject<HTMLDivElement>}>
                <WhatsAppButton label="Agendar aula" />
              </div>
            </div>
          </div>
          <div className="hero-side-note" ref={anim.sideNoteRef as React.RefObject<HTMLDivElement>}>
            <span>01</span><span className="vertical-line" /><span>Role para ver</span>
          </div>
          <div className={`hero-floating-card ${status.open ? '' : 'is-closed'}`} ref={anim.floatingCardRef as React.RefObject<HTMLDivElement>}>
            <span className="card-label">{status.open ? 'Aberta agora' : 'Fechada agora'}</span><strong>{status.time}</strong><span>{status.note}</span>
            <div className="pulse-line"><i /><i /><i /><i /><i /><i /><i /></div>
          </div>
          <div className="hero-scroll" ref={anim.scrollRef as React.RefObject<HTMLDivElement>}>
            <ChevronDown size={16} /><span>Role para ver mais</span>
          </div>
        </section>

        <section className="manifesto section-pad" ref={anim.nextSectionRef as React.RefObject<HTMLElement>}>
          <Reveal className="manifesto-head"><p className="eyebrow">A proposta</p></Reveal>
          <Reveal delay={0.1} className="manifesto-title">
            <h2>Seu corpo<br /><span>pede</span><br />presença<span className="accent-dot">.</span></h2>
            <div className="manifesto-aside">
              <p>Não é sobre fazer mais. É sobre fazer melhor. Na Áurea, cada detalhe foi pensado para transformar movimento em uma prática possível, prazerosa e consistente.</p>
              <a className="text-link" href="#experiencia">Conheça nossa abordagem <ChevronRight size={18} /></a>
            </div>
          </Reveal>
          <div className="stat-row">{gym.stats.map((stat, index) => <Reveal key={stat.label} delay={index * 0.1}><Counter {...stat} /></Reveal>)}</div>
        </section>

        <section className="intro-grid section-pad" id="experiencia">
          <Reveal className="intro-copy">
            <p className="eyebrow">O espaço</p>
            <h2>Um lugar que<br /><span>te coloca</span><br />em movimento.</h2>
            <p className="body-copy">Luz natural, equipamentos de alta performance e uma equipe que conhece seu nome. Tudo para você treinar com foco — e sair se sentindo mais presente do que entrou.</p>
            <a className="round-link" href="#estrutura" aria-label="Ver estrutura"><ChevronDown size={22} /></a>
          </Reveal>
          <Reveal delay={0.15} className="intro-image image-frame"><img src={sized(gym.images.interior, 1200)} srcSet={srcSetOf(gym.images.interior, [640, 1000, 1400])} sizes="(max-width: 1180px) 100vw, 1180px" alt="Interior amplo da academia Áurea" loading="lazy" decoding="async" /><span className="image-caption">Área de treino, Pinheiros</span></Reveal>
        </section>

        <section className="beginner section-pad" id="estrutura">
          <Reveal className="beginner-image image-frame"><img src={sized(gym.images.training, 800)} srcSet={srcSetOf(gym.images.training, [480, 800])} sizes={halfWidth} alt="Mulher treinando com halteres" loading="lazy" decoding="async" /><span className="image-caption">Acompanhamento desde o primeiro dia</span></Reveal>
          <Reveal delay={0.12} className="beginner-copy">
            <p className="eyebrow">Sem pressão</p>
            <h2>Você não precisa saber treinar para <span>começar.</span></h2>
            <p className="body-copy">Seu primeiro treino tem um roteiro simples: entender você, ajustar o movimento e encontrar uma intensidade que faça sentido. O resto é construção.</p>
            <ul className="check-list"><li><Check size={20} /> Avaliação e objetivo</li><li><Check size={20} /> Professor por perto</li><li><Check size={20} /> Evolução acompanhada</li></ul>
            <button className="text-link button-reset" onClick={() => setShowBooking(true)}>Quero conhecer a academia <ChevronRight size={18} /></button>
          </Reveal>
        </section>

        <section className="modalities section-pad" id="modalidades">
          <Reveal className="section-heading"><div><p className="eyebrow">Práticas</p><h2>Escolha seu<br /><span>ritmo.</span></h2></div><p className="heading-note">{isMobile ? <>Deslize para o lado<br />e escolha o seu.</> : <>Deslize, escolha<br />e comece a mover.</>}</p></Reveal>
          {isMobile ? (
            <ModalityCarousel />
          ) : (
            <div className="modality-stage">
              <div className="modality-visual image-frame">
                <AnimatePresence mode="wait"><motion.img key={activeModality.name} src={sized(activeModality.image, 800)} srcSet={srcSetOf(activeModality.image, [480, 800])} sizes={halfWidth} alt={activeModality.name} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.55, ease }} /></AnimatePresence>
                <span className="image-caption">Áurea · {activeModality.name}</span>
              </div>
              <div className="modality-list">
                {gym.modalities.map((modality) => (
                  <button key={modality.name} className={`modality-item ${activeModality.name === modality.name ? 'active' : ''}`} onMouseEnter={() => setActiveModality(modality)} onFocus={() => setActiveModality(modality)} onClick={() => setActiveModality(modality)}><span>{modality.number}</span><strong>{modality.name}</strong><ChevronRight size={24} /></button>
                ))}
                <AnimatePresence mode="wait"><motion.p key={activeModality.name} className="modality-description" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{activeModality.description}</motion.p></AnimatePresence>
              </div>
            </div>
          )}
        </section>

        <section className="quote-break">
          <Reveal><blockquote>Consistência é uma forma<br />de <span>cuidado.</span></blockquote><p>Manifesto Áurea</p></Reveal>
        </section>

        <section className="plans section-pad" id="planos">
          <Reveal className="section-heading"><div><p className="eyebrow">Escolha seu plano</p><h2>Comece pelo<br /><span>agora.</span></h2></div><p className="heading-note">Sem taxa de adesão.<br />Sem letras miúdas.</p></Reveal>
          <div className="plans-layout">
            <div className="plans-intro"><p className="body-copy">O plano certo é aquele que cabe na sua rotina. Todos incluem acesso à nossa estrutura e uma equipe pronta para fazer você avançar.</p><a className="text-link" href="#faq">Dúvidas frequentes <ChevronRight size={18} /></a></div>
            <div className="plan-list">
              {gym.plans.map((plan, index) => (
                <Reveal key={plan.name} delay={index * 0.08}>
                  <article className={`plan ${plan.featured ? 'featured' : ''}`}>
                    <div className="plan-top"><span className="plan-number">0{index + 1}</span>{plan.featured && <span className="plan-tag">Mais escolhido</span>}</div>
                    <h3>{plan.name}</h3>
                    <p className="plan-detail">{plan.detail}</p>
                    <div className="price">{plan.price}<small>{plan.period}</small></div>
                    <ul>{plan.features.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
                    <WhatsAppButton label="Quero começar" dark={plan.featured} message={`Olá! Quero saber mais sobre o plano ${plan.name} da Áurea.`} />
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="social-proof section-pad">
          <Reveal className="social-header"><p className="eyebrow">Quem vive</p><div className="google-score"><span><Star size={24} fill="currentColor" /> 4,9</span><small>Google Reviews · 286 avaliações</small></div></Reveal>
          <div className="testimonial-layout">
            <Reveal className="testimonial-feature">
              <div className="quote-mark small">“</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  className="testimonial-swipe"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease }}
                  drag={isMobile ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.3}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50 || info.velocity.x < -400) nextTestimonial();
                    else if (info.offset.x > 50 || info.velocity.x > 400) prevTestimonial();
                  }}
                >
                  <blockquote>{testimonial.quote}</blockquote>
                  <div className="testimonial-author"><strong>{testimonial.name}</strong><span>{testimonial.detail}</span></div>
                </motion.div>
              </AnimatePresence>
              <div className="testimonial-controls">
                <button onClick={prevTestimonial} aria-label="Depoimento anterior"><ChevronLeft size={20} /></button>
                <span>0{activeTestimonial + 1} / 0{total}</span>
                <button onClick={nextTestimonial} aria-label="Próximo depoimento"><ChevronRight size={20} /></button>
              </div>
            </Reveal>
            <Reveal delay={0.14} className="coach-image image-frame"><img src={sized(gym.images.coach, 800)} srcSet={srcSetOf(gym.images.coach, [480, 700])} sizes={halfWidth} alt="Atleta treinando com cordas" loading="lazy" decoding="async" /><span className="image-caption">Cada corpo tem uma história</span></Reveal>
          </div>
        </section>

        <section className="trial section-pad">
          <div className="trial-shape" />
          <Reveal className="trial-content">
            <p className="eyebrow light">O primeiro passo</p>
            <h2>Conheça<br /><em>antes</em> de<br />decidir<span className="accent-dot">.</span></h2>
            <p>Venha sentir o espaço, conversar com um professor e fazer uma aula que respeita o seu momento.</p>
            <WhatsAppButton label="Agendar aula experimental" />
          </Reveal>
          <div className="trial-image"><img src={sized(gym.images.boxing, 700)} srcSet={srcSetOf(gym.images.boxing, [480, 700])} sizes={halfWidth} alt="Treino de boxe com movimento" loading="lazy" decoding="async" /><span>Comece<br />aqui.</span></div>
          <div className="steps"><div><b>01</b><span>Escolha seu horário</span></div><div><b>02</b><span>Conheça a academia</span></div><div><b>03</b><span>Faça sua aula</span></div><div><b>04</b><span>Comece sua jornada</span></div></div>
        </section>

        <section className="faq section-pad" id="faq">
          <Reveal className="section-heading"><div><p className="eyebrow">Perguntas</p><h2>Ficou<br /><span>curioso?</span></h2></div><p className="heading-note">As respostas que você<br />queria encontrar.</p></Reveal>
          <div className="faq-list">
            {gym.faqs.map(([question, answer], index) => (
              <div className={`faq-item ${activeFaq === index ? 'open' : ''}`} key={question}>
                <button onClick={() => setActiveFaq(activeFaq === index ? null : index)} aria-expanded={activeFaq === index}><span>{question}</span>{activeFaq === index ? <X size={22} /> : <Plus size={22} />}</button>
                <AnimatePresence initial={false}>{activeFaq === index && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }}><p>{answer}</p></motion.div>}</AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="location section-pad" id="localizacao">
          <Reveal className="location-top"><p className="eyebrow">Encontre a gente</p></Reveal>
          <div className="location-layout">
            <Reveal className="location-copy">
              <h2>Seu próximo<br /><span>movimento</span><br />começa aqui.</h2>
              <div className="location-details">
                <div><MapPin size={22} /><p>Rua dos Pinheiros, 846<br />Pinheiros — São Paulo, SP</p></div>
                <div><Clock3 size={22} /><p>Seg a sex · 06 — 23h<br />Sáb · 08 — 14h</p></div>
                <div><Navigation size={22} /><p>Estacionamento conveniado<br />na rua ao lado</p></div>
              </div>
              <a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Rua+dos+Pinheiros+846+São+Paulo" target="_blank" rel="noreferrer">Abrir no mapa <ChevronRight size={18} /></a>
            </Reveal>
            <Reveal delay={0.14} className="map-art"><div className="map-grid" /><div className="map-route"><span /><span /><span /></div><div className="map-pin"><Crosshair size={20} /></div><span className="map-label">Áurea<br /><small>Pinheiros</small></span></Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top"><a className="wordmark" href="#top"><span className="mark">A</span><span>Áurea</span></a><p>Treine com intenção.<br />Viva com presença.</p><WhatsAppButton label="Falar com a gente" /></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Áurea. Todos os movimentos reservados.</span><a href="#top">Voltar ao topo ↑</a><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram</a></div>
      </footer>

      <a className="whatsapp-float" href={whatsappUrl('Olá! Vim pelo site e gostaria de agendar uma aula experimental.')} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp"><MessageCircle size={24} /></a>

      {/* Barra fixa na zona do polegar (só celular) */}
      <AnimatePresence>
        {showBar && (
          <motion.div className="mobile-cta" initial={{ y: '160%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '160%', opacity: 0 }} transition={{ duration: 0.5, ease }}>
            <button className="button" onClick={() => setShowBooking(true)}>Agendar aula experimental</button>
            <a className="mobile-cta-wa" href={whatsappUrl('Olá! Vim pelo site e gostaria de agendar uma aula experimental.')} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp"><MessageCircle size={24} /></a>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showBooking && <BookingModal onClose={closeBooking} isMobile={isMobile} />}</AnimatePresence>
    </div>
  );
}

export default App;