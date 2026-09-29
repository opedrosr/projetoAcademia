import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crosshair,
  Home,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Plus,
  Star,
  X,
  Dumbbell,
  CalendarDays,
} from 'lucide-react';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';

import { gym, type Modality } from '@/data/gym';
import { useHeroAnimation } from '@/hooks/useHeroAnimation';

const ease = [0.22, 1, 0.36, 1] as const;

const navLinks = [
  ['Experiência', '#experiencia'],
  ['Modalidades', '#modalidades'],
  ['Planos', '#planos'],
  ['Visite', '#localizacao'],
] as const;

/* =========================================================
   WHATSAPP
========================================================= */

function whatsappUrl(message: string) {
  return `https://wa.me/${gym.whatsapp}?text=${encodeURIComponent(message)}`;
}

function WhatsAppButton({
  label = 'Agendar aula experimental',
  dark = false,
  message = 'Olá! Vim pelo site e gostaria de agendar uma aula experimental.',
}: {
  label?: string;
  dark?: boolean;
  message?: string;
}) {
  return (
    <a
      className={`button ${dark ? 'button-dark' : ''}`}
      href={whatsappUrl(message)}
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  );
}

/* =========================================================
   REVEAL
========================================================= */

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.9,
        delay,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   COUNTER
========================================================= */

type ParsedStat = {
  prefix: string;
  suffix: string;
  target: number;
  decimals: number;
  pad: number;
  grouped: boolean;
};

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
    : new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: p.decimals,
        maximumFractionDigits: p.decimals,
        useGrouping: p.grouped,
      }).format(n);

  return `${p.prefix}${body}${p.suffix}`;
}

function Counter({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const inView = useInView(ref, {
    once: true,
    margin: '-80px',
  });

  const reduce = useReducedMotion();

  const parsed = useMemo(
    () => parseStat(value),
    [value]
  );

  const [text, setText] = useState(() =>
    parsed && !reduce ? formatStat(parsed, 0) : value
  );

  useEffect(() => {
    if (!parsed || reduce || !inView) return;

    const controls = animate(0, parsed.target, {
      duration: 1.8,
      ease,
      onUpdate: (v) => setText(formatStat(parsed, v)),
      onComplete: () => setText(value),
    });

    return () => controls.stop();
  }, [inView, parsed, reduce, value]);

  return (
    <div className="stat" ref={ref}>
      <strong>{text}</strong>
      <span>{label}</span>
    </div>
  );
}

/* =========================================================
   STATUS DA ACADEMIA
========================================================= */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DAY_LABEL: Record<string, string> = {
  Sun: 'domingo',
  Mon: 'segunda',
  Tue: 'terça',
  Wed: 'quarta',
  Thu: 'quinta',
  Fri: 'sexta',
  Sat: 'sábado',
};

const HOURS: Record<string, [number, number] | null> = {
  Mon: [6, 23],
  Tue: [6, 23],
  Wed: [6, 23],
  Thu: [6, 23],
  Fri: [6, 23],
  Sat: [8, 14],
  Sun: null,
};

function getGymStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const day = get('weekday');
  const hour = Number(get('hour')) % 24;
  const minute = Number(get('minute'));

  const minutes = hour * 60 + minute;

  const range = HOURS[day];

  const open =
    !!range &&
    minutes >= range[0] * 60 &&
    minutes < range[1] * 60;

  let note = '';

  if (open && range) {
    note = `Fecha às ${range[1]}h`;
  } else {
    const dayIdx = DAYS.indexOf(day);

    for (let i = 0; i < 8; i++) {
      const idx = (dayIdx + i) % 7;
      const r = HOURS[DAYS[idx]];

      if (!r || (i === 0 && minutes >= r[0] * 60)) {
        continue;
      }

      note =
        i === 0
          ? `Abre hoje às ${r[0]}h`
          : i === 1
            ? `Abre amanhã às ${r[0]}h`
            : `Abre ${DAY_LABEL[DAYS[idx]]} às ${r[0]}h`;

      break;
    }
  }

  return {
    time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(
      2,
      '0'
    )}`,
    open,
    note,
  };
}

function useGymStatus() {
  const [status, setStatus] = useState(() => getGymStatus());

  useEffect(() => {
    const id = window.setInterval(
      () => setStatus(getGymStatus()),
      30_000
    );

    return () => window.clearInterval(id);
  }, []);

  return status;
}

/* =========================================================
   BOOKING MOBILE BOTTOM SHEET
========================================================= */

const periods = {
  Manhã: 'no período da manhã',
  Tarde: 'no período da tarde',
  Noite: 'no período da noite',
} as const;

const goals = [
  'Emagrecer',
  'Ganhar massa',
  'Saúde e bem-estar',
  'Condicionamento',
];

function BookingModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [period, setPeriod] =
    useState<keyof typeof periods | null>(null);
  const [goal, setGoal] = useState<string | null>(null);

  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

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

    let message =
      `Olá! Me chamo ${name.trim()} e gostaria de agendar ` +
      `uma aula experimental na ${gym.name}`;

    if (period) {
      message += ` ${periods[period]}`;
    }

    message += '.';

    if (goal) {
      message += ` Meu objetivo é: ${goal.toLowerCase()}.`;
    }

    window.open(
      whatsappUrl(message),
      '_blank',
      'noopener'
    );

    onClose();
  };

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    startY.current = event.touches[0].clientY;
    currentY.current = startY.current;
  };

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ) => {
    currentY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (
      startY.current === null ||
      currentY.current === null
    ) {
      return;
    }

    const distance =
      currentY.current - startY.current;

    if (distance > 100) {
      onClose();
    }

    startY.current = null;
    currentY.current = null;
  };

  return (
    <motion.div
      className="booking-backdrop"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="booking-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        initial={{
          y: 60,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        exit={{
          y: 60,
          opacity: 0,
        }}
        transition={{
          duration: 0.45,
          ease,
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="booking-drag-handle">
          <span />
        </div>

        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar"
          type="button"
        >
          <X size={18} />
        </button>

        <p className="eyebrow">
          Seu primeiro passo
        </p>

        <h2 id="booking-title">
          Vamos encontrar <span>seu horário.</span>
        </h2>

        <p>
          Conte um pouco sobre você e a gente
          continua a conversa pelo WhatsApp.
        </p>

        <form onSubmit={submit}>
          <div className="field">
            <label
              className="field-label"
              htmlFor="booking-name"
            >
              Seu nome
            </label>

            <input
              id="booking-name"
              className="input"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Como podemos te chamar?"
              required
              autoComplete="given-name"
              autoFocus
            />
          </div>

          <fieldset className="field">
            <legend className="field-label">
              Melhor período
            </legend>

            <div className="chips">
              {(
                Object.keys(periods) as
                  (keyof typeof periods)[]
              ).map((p) => (
                <button
                  type="button"
                  key={p}
                  className="chip"
                  aria-pressed={period === p}
                  onClick={() =>
                    setPeriod(
                      period === p ? null : p
                    )
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="field">
            <legend className="field-label">
              Seu objetivo
            </legend>

            <div className="chips">
              {goals.map((g) => (
                <button
                  type="button"
                  key={g}
                  className="chip"
                  aria-pressed={goal === g}
                  onClick={() =>
                    setGoal(
                      goal === g ? null : g
                    )
                  }
                >
                  {g}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            className="button booking-submit"
            type="submit"
          >
            Continuar no WhatsApp
            <MessageCircle size={18} />
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   MOBILE BOTTOM NAV
========================================================= */

function MobileBottomNav({
  activeSection,
  onBooking,
}: {
  activeSection: string;
  onBooking: () => void;
}) {
  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Navegação rápida"
    >
      <a
        href="#top"
        className={
          activeSection === 'top'
            ? 'active'
            : ''
        }
      >
        <Home size={19} />
        <span>Início</span>
      </a>

      <a
        href="#experiencia"
        className={
          activeSection === 'experiencia'
            ? 'active'
            : ''
        }
      >
        <Dumbbell size={19} />
        <span>Experiência</span>
      </a>

      <a
        href="#modalidades"
        className={
          activeSection === 'modalidades'
            ? 'active'
            : ''
        }
      >
        <Navigation size={19} />
        <span>Treinos</span>
      </a>

      <a
        href="#planos"
        className={
          activeSection === 'planos'
            ? 'active'
            : ''
        }
      >
        <CalendarDays size={19} />
        <span>Planos</span>
      </a>

      <button
        type="button"
        className="bottom-booking"
        onClick={onBooking}
      >
        <MessageCircle size={19} />
        <span>Agendar</span>
      </button>
    </nav>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [activeModality, setActiveModality] =
    useState<Modality>(
      gym.modalities[0]
    );

  const [activeFaq, setActiveFaq] =
    useState<number | null>(0);

  const [activeTestimonial, setActiveTestimonial] =
    useState(0);

  const [showBooking, setShowBooking] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState('top');

  const closeBooking = useCallback(
    () => setShowBooking(false),
    []
  );

  const anim = useHeroAnimation();

  const status = useGymStatus();

  const testimonial =
    gym.testimonials[activeTestimonial];

  /* -----------------------------------------
     SCROLL / ACTIVE SECTION
  ----------------------------------------- */

  useEffect(() => {
    const sections = [
      'top',
      'experiencia',
      'modalidades',
      'planos',
      'localizacao',
    ];

    const update = () => {
      setScrolled(window.scrollY > 40);

      const scrollPosition =
        window.scrollY +
        window.innerHeight * 0.35;

      let current = 'top';

      for (const id of sections) {
        if (id === 'top') continue;

        const element =
          document.getElementById(id);

        if (
          element &&
          scrollPosition >= element.offsetTop
        ) {
          current = id;
        }
      }

      setActiveSection(current);
    };

    update();

    window.addEventListener(
      'scroll',
      update,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        'scroll',
        update
      );
  }, []);

  /* -----------------------------------------
     FECHA MENU AO ESCROLAR
  ----------------------------------------- */

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnScroll = () => {
      setMenuOpen(false);
    };

    window.addEventListener(
      'scroll',
      closeOnScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        'scroll',
        closeOnScroll
      );
  }, [menuOpen]);

  /* -----------------------------------------
     SWIPE MODALITIES
  ----------------------------------------- */

  const modalityStartX =
    useRef<number | null>(null);

  const handleModalityTouchStart = (
    event: React.TouchEvent
  ) => {
    modalityStartX.current =
      event.touches[0].clientX;
  };

  const handleModalityTouchEnd = (
    event: React.TouchEvent
  ) => {
    if (modalityStartX.current === null) {
      return;
    }

    const endX =
      event.changedTouches[0].clientX;

    const distance =
      endX - modalityStartX.current;

    if (Math.abs(distance) < 50) {
      modalityStartX.current = null;
      return;
    }

    const currentIndex =
      gym.modalities.findIndex(
        (item) =>
          item.name ===
          activeModality.name
      );

    if (distance < 0) {
      const next =
        (currentIndex + 1) %
        gym.modalities.length;

      setActiveModality(
        gym.modalities[next]
      );
    } else {
      const previous =
        (currentIndex -
          1 +
          gym.modalities.length) %
        gym.modalities.length;

      setActiveModality(
        gym.modalities[previous]
      );
    }

    modalityStartX.current = null;
  };

  return (
    <div className="site-shell">
      {/* =================================================
          HEADER
      ================================================= */}

      <header
        className={`site-header ${
          scrolled ? 'scrolled' : ''
        } ${
          menuOpen ? 'menu-open' : ''
        }`}
      >
        <a
          className="wordmark"
          href="#top"
          aria-label="Áurea início"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          <span className="mark">A</span>
          <span>Áurea</span>
        </a>

        <nav
          className="desktop-nav"
          aria-label="Navegação principal"
        >
          {navLinks.map(
            ([label, href]) => (
              <a
                key={href}
                href={href}
              >
                {label}
              </a>
            )
          )}
        </nav>

        <div className="header-actions">
          <button
            className="menu-toggle"
            onClick={() =>
              setMenuOpen(
                (open) => !open
              )
            }
            aria-label={
              menuOpen
                ? 'Fechar menu'
                : 'Abrir menu'
            }
            aria-expanded={menuOpen}
            type="button"
          >
            {menuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>

          <WhatsAppButton label="Começar" />
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-nav"
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: 'auto',
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.4,
                ease,
              }}
            >
              <div className="mobile-nav-header">
                <span>Navegação</span>
                <span>ÁUREA · 01</span>
              </div>

              {navLinks.map(
                ([label, href], index) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    <span>
                      0{index + 1}
                    </span>

                    <strong>
                      {label}
                    </strong>

                    <ChevronRight
                      size={22}
                    />
                  </a>
                )
              )}

              <div className="mobile-menu-cta">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowBooking(true);
                  }}
                >
                  <CalendarDays
                    size={19}
                  />
                  Agendar aula experimental
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main id="top">
        {/* HERO */}

        <section
          className="hero"
          ref={
            anim.heroRef as React.RefObject<HTMLElement>
          }
        >
          <div
            className="hero-photo-wrap"
            ref={
              anim.photoWrapRef as React.RefObject<HTMLDivElement>
            }
          >
            <img
              ref={
                anim.photoRef as React.RefObject<HTMLImageElement>
              }
              src={gym.images.hero}
              alt="Pessoa correndo com sensação de movimento"
              className="hero-photo"
            />
          </div>

          <div
            className="hero-overlay"
            ref={
              anim.overlayRef as React.RefObject<HTMLDivElement>
            }
          />

          <div
            className="hero-topline"
            ref={
              anim.toplineRef as React.RefObject<HTMLDivElement>
            }
          >
            <span>Desde 2018</span>
            <span className="hero-line" />
            <span>Pinheiros, São Paulo</span>
          </div>

          <div className="hero-content">
            <p
              className="eyebrow light"
              ref={
                anim.eyebrowRef as React.RefObject<HTMLParagraphElement>
              }
            >
              Treino de verdade
            </p>

            <h1>
              <span
                className="title-line"
                ref={anim.addTitleRef}
              >
                Mova
              </span>

              <span
                className="title-line"
                ref={anim.addTitleRef}
              >
                <em>o seu</em>
              </span>

              <span
                className="title-line"
                ref={anim.addTitleRef}
              >
                mundo
                <span className="accent-dot">
                  .
                </span>
              </span>
            </h1>

            <div
              className="hero-bottom"
              ref={
                anim.heroBottomRef as React.RefObject<HTMLDivElement>
              }
            >
              <p
                ref={
                  anim.heroBottomPRef as React.RefObject<HTMLParagraphElement>
                }
              >
                Treino bem feito, espaço bom
                e acompanhamento de perto.
              </p>

              <div
                ref={
                  anim.heroButtonRef as React.RefObject<HTMLDivElement>
                }
              >
                <WhatsAppButton label="Agendar aula" />
              </div>
            </div>
          </div>

          <div
            className="hero-side-note"
            ref={
              anim.sideNoteRef as React.RefObject<HTMLDivElement>
            }
          >
            <span>01</span>
            <span className="vertical-line" />
            <span>Role para ver</span>
          </div>

          <div
            className={`hero-floating-card ${
              status.open ? '' : 'is-closed'
            }`}
            ref={
              anim.floatingCardRef as React.RefObject<HTMLDivElement>
            }
          >
            <span className="card-label">
              {status.open
                ? 'Aberta agora'
                : 'Fechada agora'}
            </span>

            <strong>
              {status.time}
            </strong>

            <span>
              {status.note}
            </span>

            <div className="pulse-line">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>

          <div
            className="hero-scroll"
            ref={
              anim.scrollRef as React.RefObject<HTMLDivElement>
            }
          >
            <ChevronDown size={16} />
            <span>Role para ver mais</span>
          </div>

          {/* CTA MOBILE DO HERO */}

          <button
            type="button"
            className="hero-mobile-status"
            onClick={() =>
              setShowBooking(true)
            }
          >
            <span
              className={
                status.open
                  ? 'status-dot open'
                  : 'status-dot'
              }
            />

            <span>
              {status.open
                ? 'Aberta agora'
                : 'Fechada agora'}
            </span>

            <strong>
              {status.open
                ? 'Agendar'
                : 'Ver horários'}
            </strong>
          </button>
        </section>

        {/* MANIFESTO */}

        <section
          className="manifesto section-pad"
          ref={
            anim.nextSectionRef as React.RefObject<HTMLElement>
          }
        >
          <Reveal className="manifesto-head">
            <p className="eyebrow">
              A proposta
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="manifesto-title"
          >
            <h2>
              Seu corpo
              <br />
              <span>pede</span>
              <br />
              presença
              <span className="accent-dot">
                .
              </span>
            </h2>

            <div className="manifesto-aside">
              <p>
                Não é sobre fazer mais.
                É sobre fazer melhor. Na
                Áurea, cada detalhe foi
                pensado para transformar
                movimento em uma prática
                possível, prazerosa e
                consistente.
              </p>

              <a
                className="text-link"
                href="#experiencia"
              >
                Conheça nossa abordagem
                <ChevronRight size={18} />
              </a>
            </div>
          </Reveal>

          <div className="stat-row">
            {gym.stats.map(
              (stat, index) => (
                <Reveal
                  key={stat.label}
                  delay={index * 0.1}
                >
                  <Counter {...stat} />
                </Reveal>
              )
            )}
          </div>
        </section>

        {/* EXPERIÊNCIA */}

        <section
          className="intro-grid section-pad"
          id="experiencia"
        >
          <Reveal className="intro-copy">
            <p className="eyebrow">
              O espaço
            </p>

            <h2>
              Um lugar que
              <br />
              <span>te coloca</span>
              <br />
              em movimento.
            </h2>

            <p className="body-copy">
              Luz natural, equipamentos
              de alta performance e uma
              equipe que conhece seu
              nome. Tudo para você
              treinar com foco — e sair
              se sentindo mais presente
              do que entrou.
            </p>

            <a
              className="round-link"
              href="#estrutura"
              aria-label="Ver estrutura"
            >
              <ChevronDown size={22} />
            </a>
          </Reveal>

          <Reveal
            delay={0.15}
            className="intro-image image-frame"
          >
            <img
              src={gym.images.interior}
              alt="Interior amplo da academia Áurea"
              loading="lazy"
            />

            <span className="image-caption">
              Área de treino, Pinheiros
            </span>
          </Reveal>
        </section>

        {/* INICIANTES */}

        <section
          className="beginner section-pad"
          id="estrutura"
        >
          <Reveal className="beginner-image image-frame">
            <img
              src={gym.images.training}
              alt="Mulher treinando com halteres"
              loading="lazy"
            />

            <span className="image-caption">
              Acompanhamento desde o
              primeiro dia
            </span>
          </Reveal>

          <Reveal
            delay={0.12}
            className="beginner-copy"
          >
            <p className="eyebrow">
              Sem pressão
            </p>

            <h2>
              Você não precisa saber
              treinar para{' '}
              <span>começar.</span>
            </h2>

            <p className="body-copy">
              Seu primeiro treino tem um
              roteiro simples: entender
              você, ajustar o movimento e
              encontrar uma intensidade
              que faça sentido. O resto é
              construção.
            </p>

            <ul className="check-list">
              <li>
                <Check size={20} />
                Avaliação e objetivo
              </li>

              <li>
                <Check size={20} />
                Professor por perto
              </li>

              <li>
                <Check size={20} />
                Evolução acompanhada
              </li>
            </ul>

            <button
              className="text-link button-reset"
              onClick={() =>
                setShowBooking(true)
              }
              type="button"
            >
              Quero conhecer a academia
              <ChevronRight size={18} />
            </button>
          </Reveal>
        </section>

        {/* MODALIDADES */}

        <section
          className="modalities section-pad"
          id="modalidades"
        >
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">
                Práticas
              </p>

              <h2>
                Escolha seu
                <br />
                <span>ritmo.</span>
              </h2>
            </div>

            <p className="heading-note">
              Deslize, escolha
              <br />
              e comece a mover.
            </p>
          </Reveal>

          <div
            className="modality-stage"
            onTouchStart={
              handleModalityTouchStart
            }
            onTouchEnd={
              handleModalityTouchEnd
            }
          >
            <div className="modality-visual image-frame">
              <AnimatePresence mode="wait">
                <motion.img
                  key={
                    activeModality.name
                  }
                  src={
                    activeModality.image
                  }
                  alt={
                    activeModality.name
                  }
                  initial={{
                    opacity: 0,
                    scale: 1.06,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.55,
                    ease,
                  }}
                />
              </AnimatePresence>

              <span className="image-caption">
                Áurea ·{' '}
                {activeModality.name}
              </span>

              <div className="modality-mobile-hint">
                <ChevronLeft size={15} />
                Deslize
                <ChevronRight size={15} />
              </div>
            </div>

            <div className="modality-list">
              {gym.modalities.map(
                (modality) => (
                  <button
                    key={modality.name}
                    className={`modality-item ${
                      activeModality.name ===
                      modality.name
                        ? 'active'
                        : ''
                    }`}
                    onMouseEnter={() =>
                      setActiveModality(
                        modality
                      )
                    }
                    onFocus={() =>
                      setActiveModality(
                        modality
                      )
                    }
                    onClick={() =>
                      setActiveModality(
                        modality
                      )
                    }
                    type="button"
                  >
                    <span>
                      {modality.number}
                    </span>

                    <strong>
                      {modality.name}
                    </strong>

                    <ChevronRight
                      size={24}
                    />
                  </button>
                )
              )}

              <AnimatePresence mode="wait">
                <motion.p
                  key={
                    activeModality.name
                  }
                  className="modality-description"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                  }}
                >
                  {
                    activeModality.description
                  }
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* QUOTE */}

        <section className="quote-break">
          <Reveal>
            <blockquote>
              Consistência é uma forma
              <br />
              de <span>cuidado.</span>
            </blockquote>

            <p>
              Manifesto Áurea
            </p>
          </Reveal>
        </section>

        {/* PLANOS */}

        <section
          className="plans section-pad"
          id="planos"
        >
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">
                Escolha seu plano
              </p>

              <h2>
                Comece pelo
                <br />
                <span>agora.</span>
              </h2>
            </div>

            <p className="heading-note">
              Sem taxa de adesão.
              <br />
              Sem letras miúdas.
            </p>
          </Reveal>

          <div className="plans-layout">
            <div className="plans-intro">
              <p className="body-copy">
                O plano certo é aquele
                que cabe na sua rotina.
                Todos incluem acesso à
                nossa estrutura e uma
                equipe pronta para fazer
                você avançar.
              </p>

              <a
                className="text-link"
                href="#faq"
              >
                Dúvidas frequentes
                <ChevronRight size={18} />
              </a>
            </div>

            <div className="plan-list">
              {gym.plans.map(
                (plan, index) => (
                  <Reveal
                    key={plan.name}
                    delay={index * 0.08}
                  >
                    <article
                      className={`plan ${
                        plan.featured
                          ? 'featured'
                          : ''
                      }`}
                    >
                      <div className="plan-top">
                        <span className="plan-number">
                          0{index + 1}
                        </span>

                        {plan.featured && (
                          <span className="plan-tag">
                            Mais escolhido
                          </span>
                        )}
                      </div>

                      <h3>
                        {plan.name}
                      </h3>

                      <p className="plan-detail">
                        {plan.detail}
                      </p>

                      <div className="price">
                        {plan.price}
                        <small>
                          {plan.period}
                        </small>
                      </div>

                      <ul>
                        {plan.features.map(
                          (feature) => (
                            <li
                              key={feature}
                            >
                              <Check
                                size={16}
                              />
                              {feature}
                            </li>
                          )
                        )}
                      </ul>

                      <WhatsAppButton
                        label="Quero começar"
                        dark={
                          plan.featured
                        }
                        message={`Olá! Quero saber mais sobre o plano ${plan.name} da Áurea.`}
                      />
                    </article>
                  </Reveal>
                )
              )}
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}

        <section className="social-proof section-pad">
          <Reveal className="social-header">
            <p className="eyebrow">
              Quem vive
            </p>

            <div className="google-score">
              <span>
                <Star
                  size={24}
                  fill="currentColor"
                />
                4,9
              </span>

              <small>
                Google Reviews · 286
                avaliações
              </small>
            </div>
          </Reveal>

          <div className="testimonial-layout">
            <Reveal className="testimonial-feature">
              <div className="quote-mark small">
                “
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{
                    opacity: 0,
                    y: 14,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -14,
                  }}
                  transition={{
                    duration: 0.4,
                    ease,
                  }}
                >
                  <blockquote>
                    {
                      testimonial.quote
                    }
                  </blockquote>

                  <div className="testimonial-author">
                    <strong>
                      {testimonial.name}
                    </strong>

                    <span>
                      {testimonial.detail}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="testimonial-controls">
                <button
                  onClick={() =>
                    setActiveTestimonial(
                      (activeTestimonial +
                        gym.testimonials.length -
                        1) %
                        gym.testimonials
                          .length
                    )
                  }
                  aria-label="Depoimento anterior"
                  type="button"
                >
                  <ChevronLeft size={20} />
                </button>

                <span>
                  0
                  {activeTestimonial +
                    1}{' '}
                  / 0
                  {
                    gym.testimonials
                      .length
                  }
                </span>

                <button
                  onClick={() =>
                    setActiveTestimonial(
                      (activeTestimonial +
                        1) %
                        gym.testimonials
                          .length
                    )
                  }
                  aria-label="Próximo depoimento"
                  type="button"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </Reveal>

            <Reveal
              delay={0.14}
              className="coach-image image-frame"
            >
              <img
                src={gym.images.coach}
                alt="Atleta treinando com cordas"
                loading="lazy"
              />

              <span className="image-caption">
                Cada corpo tem uma história
              </span>
            </Reveal>
          </div>
        </section>

        {/* TRIAL */}

        <section className="trial section-pad">
          <div className="trial-shape" />

          <Reveal className="trial-content">
            <p className="eyebrow light">
              O primeiro passo
            </p>

            <h2>
              Conheça
              <br />
              <em>antes</em> de
              <br />
              decidir
              <span className="accent-dot">
                .
              </span>
            </h2>

            <p>
              Venha sentir o espaço,
              conversar com um professor
              e fazer uma aula que respeita
              o seu momento.
            </p>

            <button
              type="button"
              className="button"
              onClick={() =>
                setShowBooking(true)
              }
            >
              Agendar aula experimental
            </button>
          </Reveal>

          <div className="trial-image">
            <img
              src={gym.images.boxing}
              alt="Treino de boxe com movimento"
              loading="lazy"
            />

            <span>
              Comece
              <br />
              aqui.
            </span>
          </div>

          <div className="steps">
            <div>
              <b>01</b>
              <span>
                Escolha seu horário
              </span>
            </div>

            <div>
              <b>02</b>
              <span>
                Conheça a academia
              </span>
            </div>

            <div>
              <b>03</b>
              <span>
                Faça sua aula
              </span>
            </div>

            <div>
              <b>04</b>
              <span>
                Comece sua jornada
              </span>
            </div>
          </div>
        </section>

        {/* FAQ */}

        <section
          className="faq section-pad"
          id="faq"
        >
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">
                Perguntas
              </p>

              <h2>
                Ficou
                <br />
                <span>curioso?</span>
              </h2>
            </div>

            <p className="heading-note">
              As respostas que você
              <br />
              queria encontrar.
            </p>
          </Reveal>

          <div className="faq-list">
            {gym.faqs.map(
              ([question, answer], index) => (
                <div
                  className={`faq-item ${
                    activeFaq === index
                      ? 'open'
                      : ''
                  }`}
                  key={question}
                >
                  <button
                    onClick={() =>
                      setActiveFaq(
                        activeFaq === index
                          ? null
                          : index
                      )
                    }
                    aria-expanded={
                      activeFaq === index
                    }
                    type="button"
                  >
                    <span>
                      {question}
                    </span>

                    {activeFaq === index ? (
                      <X size={22} />
                    ) : (
                      <Plus size={22} />
                    )}
                  </button>

                  <AnimatePresence
                    initial={false}
                  >
                    {activeFaq ===
                      index && (
                      <motion.div
                        className="faq-answer"
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.4,
                          ease,
                        }}
                      >
                        <p>
                          {answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )}
          </div>
        </section>

        {/* LOCALIZAÇÃO */}

        <section
          className="location section-pad"
          id="localizacao"
        >
          <Reveal className="location-top">
            <p className="eyebrow">
              Encontre a gente
            </p>
          </Reveal>

          <div className="location-layout">
            <Reveal className="location-copy">
              <h2>
                Seu próximo
                <br />
                <span>movimento</span>
                <br />
                começa aqui.
              </h2>

              <div className="location-details">
                <div>
                  <MapPin size={22} />

                  <p>
                    Rua dos Pinheiros, 846
                    <br />
                    Pinheiros — São Paulo,
                    SP
                  </p>
                </div>

                <div>
                  <Clock3 size={22} />

                  <p>
                    Seg a sex · 06 — 23h
                    <br />
                    Sáb · 08 — 14h
                  </p>
                </div>

                <div>
                  <Navigation size={22} />

                  <p>
                    Estacionamento
                    conveniado
                    <br />
                    na rua ao lado
                  </p>
                </div>
              </div>

              <div className="location-actions">
                <a
                  className="text-link"
                  href="https://www.google.com/maps/search/?api=1&query=Rua+dos+Pinheiros+846+São+Paulo"
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir no mapa
                  <ChevronRight size={18} />
                </a>

                <button
                  className="location-mobile-cta"
                  type="button"
                  onClick={() =>
                    setShowBooking(true)
                  }
                >
                  <CalendarDays
                    size={18}
                  />
                  Agendar aula
                </button>
              </div>
            </Reveal>

            <Reveal
              delay={0.14}
              className="map-art"
            >
              <div className="map-grid" />

              <div className="map-route">
                <span />
                <span />
                <span />
              </div>

              <div className="map-pin">
                <Crosshair size={20} />
              </div>

              <span className="map-label">
                Áurea
                <br />
                <small>
                  Pinheiros
                </small>
              </span>
            </Reveal>
          </div>
        </section>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">
        <div className="footer-top">
          <a
            className="wordmark"
            href="#top"
          >
            <span className="mark">
              A
            </span>
            <span>Áurea</span>
          </a>

          <p>
            Treine com intenção.
            <br />
            Viva com presença.
          </p>

          <WhatsAppButton
            label="Falar com a gente"
          />
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()}{' '}
            Áurea. Todos os movimentos
            reservados.
          </span>

          <a href="#top">
            Voltar ao topo ↑
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={16} />
            Instagram
          </a>
        </div>
      </footer>

      {/* =================================================
          WHATSAPP FLUTUANTE
      ================================================= */}

      <a
        className="whatsapp-float"
        href={whatsappUrl(
          'Olá! Vim pelo site e gostaria de agendar uma aula experimental.'
        )}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle size={24} />

        <span>
          Agendar
        </span>
      </a>

      {/* =================================================
          MOBILE BOTTOM NAV
      ================================================= */}

      <MobileBottomNav
        activeSection={
          activeSection
        }
        onBooking={() =>
          setShowBooking(true)
        }
      />

      {/* =================================================
          BOOKING
      ================================================= */}

      <AnimatePresence>
        {showBooking && (
          <BookingModal
            onClose={closeBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;