import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  MoveUpRight,
  Plus,
  Star,
  X,
  Home,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
  type FormEvent,
  type TouchEvent,
} from 'react';

import { gym, type Modality } from '@/data/gym';
import { useHeroAnimation } from '@/hooks/useHeroAnimation';

const ease = [0.22, 1, 0.36, 1] as const;

/* =========================================================
   DEMO / PLACEHOLDERS
   ---------------------------------------------------------
   Troque estes valores quando apresentar o projeto para
   uma academia real.

   A ideia é que o dono veja a estrutura como algo criado
   para ele, e não como um site de outra academia.
========================================================= */

const DEMO = {
  brand: 'NOME DA ACADEMIA',
  shortBrand: 'ACADEMIA',
  city: 'CIDADE · UF',
  neighborhood: 'BAIRRO · CIDADE',
  instagram: '@INSTAGRAM_DA_ACADEMIA',
  address: 'ENDEREÇO DA ACADEMIA',
  hours: 'Seg–Sáb · 06h–22h',
};

const navLinks = [
  ['Experiência', '#experiencia'],
  ['Modalidades', '#modalidades'],
  ['Planos', '#planos'],
  ['Visite', '#localizacao'],
] as const;

/* =========================================================
   HELPERS
========================================================= */

function whatsappUrl(
  message = `Olá! Quero conhecer a ${DEMO.brand} e agendar uma aula.`,
) {
  return `https://wa.me/${gym.whatsapp}?text=${encodeURIComponent(message)}`;
}

function safeArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/* =========================================================
   REVEAL CINEMÁTICO
========================================================= */

function Reveal({
  children,
  className = '',
  delay = 0,
  amount = 0.2,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  direction?: 'up' | 'left' | 'right' | 'down';
}) {
  const reduced = useReducedMotion();

  const initial =
    direction === 'left'
      ? {
          opacity: 0,
          x: reduced ? 0 : -90,
          clipPath: 'inset(0 12% 0 0)',
        }
      : direction === 'right'
        ? {
            opacity: 0,
            x: reduced ? 0 : 90,
            clipPath: 'inset(0 0 0 12%)',
          }
        : direction === 'down'
          ? {
              opacity: 0,
              y: reduced ? 0 : -80,
              clipPath: 'inset(0 0 14% 0)',
            }
          : {
              opacity: 0,
              y: reduced ? 0 : 90,
              clipPath: 'inset(14% 0 0 0)',
            };

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        clipPath: 'inset(0 0 0 0)',
      }}
      viewport={{
        once: true,
        amount,
      }}
      transition={{
        duration: reduced ? 0.01 : 1.05,
        delay: reduced ? 0 : delay,
        ease,
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   IMAGEM CINEMÁTICA
========================================================= */

function CinematicImage({
  src,
  alt,
  className,
  caption,
  priority = false,
  direction = 'up',
}: {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
  priority?: boolean;
  direction?: 'up' | 'left' | 'right';
}) {
  const reduced = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imageYRange: [number, number, number] = reduced
    ? [0, 0, 0]
    : [55, 0, -55];

  const imageScaleRange: [number, number, number] = reduced
    ? [1, 1, 1]
    : [1.12, 1, 1.08];

  const imageY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    imageYRange,
  );

  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    imageScaleRange,
  );

  const clipInitial =
    direction === 'left'
      ? 'inset(0 14% 0 0)'
      : direction === 'right'
        ? 'inset(0 0 0 14%)'
        : 'inset(14% 0 0 0)';

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        clipPath: clipInitial,
      }}
      whileInView={{
        opacity: 1,
        clipPath: 'inset(0 0 0 0)',
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: reduced ? 0.01 : 1.15,
        ease,
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={{
          y: imageY,
          scale: imageScale,
        }}
      />

      {caption && (
        <div className="image-caption">
          {caption}
        </div>
      )}
    </motion.div>
  );
}

/* =========================================================
   BOTÃO
========================================================= */

function WhatsAppButton({
  children,
  message,
  className = '',
  dark = false,
}: {
  children: ReactNode;
  message?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <motion.a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noreferrer"
      className={`button ${dark ? 'button-dark' : ''} ${className}`}
      whileHover={{
        y: -5,
        scale: 1.025,
      }}
      whileTap={{
        scale: 0.96,
      }}
      transition={{
        duration: 0.3,
        ease,
      }}
    >
      {children}
      <ArrowRight size={16} />
    </motion.a>
  );
}

/* =========================================================
   COUNTER
========================================================= */

function parseStat(value: string | number) {
  const raw = String(value);
  const match = raw.match(/^([\d.,]+)(.*)$/);

  if (!match) {
    return {
      number: 0,
      suffix: raw,
      decimal: false,
    };
  }

  const numeric = match[1]
    .replace(/\./g, '')
    .replace(',', '.');

  return {
    number: Number(numeric) || 0,
    suffix: match[2] ?? '',
    decimal: numeric.includes('.'),
  };
}

function Counter({
  value,
  duration = 1.8,
}: {
  value: string | number;
  duration?: number;
}) {
  const reduced = useReducedMotion();

  const ref = useRef<HTMLSpanElement>(null);

  const inView = useInView(ref, {
    once: true,
    amount: 0.7,
  });

  const parsed = useMemo(
    () => parseStat(value),
    [value],
  );

  const [current, setCurrent] = useState(
    reduced ? parsed.number : 0,
  );

  useEffect(() => {
    if (!inView || reduced) {
      if (reduced) {
        setCurrent(parsed.number);
      }

      return;
    }

    let frame = 0;

    const start = performance.now();

    const tick = (time: number) => {
      const progress = Math.min(
        (time - start) / (duration * 1000),
        1,
      );

      const eased =
        1 - Math.pow(1 - progress, 4);

      setCurrent(parsed.number * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [
    duration,
    inView,
    parsed.number,
    reduced,
  ]);

  const formatted = parsed.decimal
    ? current.toFixed(1).replace('.', ',')
    : Math.round(current).toString();

  return (
    <span ref={ref}>
      {formatted}
      {parsed.suffix}
    </span>
  );
}

/* =========================================================
   STATUS DA ACADEMIA
========================================================= */

function getGymStatus() {
  const now = new Date();

  const day = now.getDay();

  const hour =
    now.getHours() +
    now.getMinutes() / 60;

  const weekday =
    day >= 1 && day <= 6;

  const open =
    weekday &&
    hour >= 6 &&
    hour < 22;

  return {
    open,
    label: open
      ? 'Aberta agora'
      : 'Fechada agora',
  };
}

function useGymStatus() {
  const [status, setStatus] =
    useState(getGymStatus());

  useEffect(() => {
    const update = () =>
      setStatus(getGymStatus());

    update();

    const interval =
      window.setInterval(
        update,
        60_000,
      );

    return () =>
      window.clearInterval(interval);
  }, []);

  return status;
}

/* =========================================================
   QUOTE SCENE
========================================================= */

function QuoteScene({
  children,
}: {
  children: ReactNode;
}) {
  const reduced = useReducedMotion();

  const ref =
    useRef<HTMLDivElement>(null);

  const { scrollYProgress } =
    useScroll({
      target: ref,
      offset: [
        'start end',
        'end start',
      ],
    });

  const quoteYRange: [number, number, number] =
    reduced
      ? [0, 0, 0]
      : [70, 0, -50];

  const quoteScaleRange: [number, number, number] =
    reduced
      ? [1, 1, 1]
      : [0.9, 1, 0.96];

  const quoteOpacityRange: [
    number,
    number,
    number,
    number,
  ] = reduced
    ? [1, 1, 1, 1]
    : [0.55, 1, 1, 0.6];

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    quoteYRange,
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    quoteScaleRange,
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.78, 1],
    quoteOpacityRange,
  );

  return (
    <motion.div
      ref={ref}
      className="quote-break"
      style={{
        y,
        scale,
        opacity,
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   BOOKING
========================================================= */

function BookingModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const reduced = useReducedMotion();

  const [name, setName] =
    useState('');

  const [period, setPeriod] =
    useState('Manhã');

  const [goal, setGoal] =
    useState(
      'Conhecer a academia',
    );

  const touchStart =
    useRef<number | null>(null);

  const submit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const message = [
      `Olá! Quero agendar uma aula na ${DEMO.brand}.`,
      name
        ? `Meu nome é ${name}.`
        : '',
      `Prefiro ${period.toLowerCase()}.`,
      `Objetivo: ${goal}.`,
    ]
      .filter(Boolean)
      .join(' ');

    window.open(
      whatsappUrl(message),
      '_blank',
      'noopener,noreferrer',
    );

    onClose();
  };

  return (
    <motion.div
      className="booking-backdrop"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: reduced ? 0.01 : 0.35,
      }}
      onClick={onClose}
    >
      <motion.div
        className="booking-modal"
        initial={{
          opacity: 0,
          y: reduced ? 0 : 100,
          scale: reduced ? 1 : 0.92,
          clipPath: reduced
            ? 'inset(0 0 0 0)'
            : 'inset(12% 0 0 0)',
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: 'inset(0 0 0 0)',
        }}
        exit={{
          opacity: 0,
          y: 50,
          scale: 0.96,
        }}
        transition={{
          duration: reduced ? 0.01 : 0.65,
          ease,
        }}
        onClick={(event) =>
          event.stopPropagation()
        }
        onTouchStart={(event) => {
          touchStart.current =
            event.touches[0]?.clientY ?? null;
        }}
        onTouchEnd={(event) => {
          if (
            touchStart.current === null
          ) {
            return;
          }

          const end =
            event.changedTouches[0]
              ?.clientY ??
            touchStart.current;

          const delta =
            end - touchStart.current;

          if (delta > 90) {
            onClose();
          }

          touchStart.current = null;
        }}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <span className="eyebrow">
          Primeiro passo
        </span>

        <h2>
          Conheça a <em>{DEMO.brand}.</em>
        </h2>

        <p>
          Preencha os dados abaixo. Você será
          direcionado para o WhatsApp para
          confirmar o melhor horário.
        </p>

        <form onSubmit={submit}>
          <label>
            Seu nome

            <input
              required
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Como podemos te chamar?"
            />
          </label>

          <label>
            Melhor período

            <select
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value)
              }
            >
              <option>Manhã</option>
              <option>Tarde</option>
              <option>Noite</option>
            </select>
          </label>

          <label>
            Seu objetivo

            <select
              value={goal}
              onChange={(event) =>
                setGoal(event.target.value)
              }
            >
              <option>
                Conhecer a academia
              </option>
              <option>
                Ganhar força
              </option>
              <option>
                Melhorar condicionamento
              </option>
              <option>
                Mudar composição corporal
              </option>
              <option>
                Voltar a treinar
              </option>
            </select>
          </label>

          <button
            type="submit"
            className="button"
          >
            Continuar no WhatsApp
            <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [
    activeModality,
    setActiveModality,
  ] = useState(0);

  const [activeFaq, setActiveFaq] =
    useState<number | null>(null);

  const [
    activeTestimonial,
    setActiveTestimonial,
  ] = useState(0);

  /* =======================================================
     CARROSSEL MOBILE DE PLANOS
  ======================================================= */

  const [activePlan, setActivePlan] =
    useState(0);

  const [showBooking, setShowBooking] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState('experiencia');

  const reduced = useReducedMotion();

  const anim = useHeroAnimation();

  const status = useGymStatus();

  const { scrollYProgress } =
    useScroll();

  const progress = useSpring(
    scrollYProgress,
    {
      stiffness: 90,
      damping: 28,
      mass: 0.2,
    },
  );

  /* -------------------------------------------------------
     HERO
  ------------------------------------------------------- */

  const heroScroll =
    useScroll({
      target: anim.heroRef,
      offset: [
        'start start',
        'end start',
      ],
    }).scrollYProgress;

  const heroContentYRange: [number, number] =
    reduced
      ? [0, 0]
      : [0, -150];

  const heroContentOpacityRange: [
    number,
    number,
    number,
  ] = reduced
    ? [1, 1, 1]
    : [1, 0.9, 0];

  const heroImageScaleRange: [
    number,
    number,
  ] = reduced
    ? [1, 1]
    : [1.02, 1.18];

  const heroImageYRange: [
    string,
    string,
  ] = reduced
    ? ['0%', '0%']
    : ['0%', '10%'];

  const heroContentY =
    useTransform(
      heroScroll,
      [0, 1],
      heroContentYRange,
    );

  const heroContentOpacity =
    useTransform(
      heroScroll,
      [0, 0.65, 1],
      heroContentOpacityRange,
    );

  const heroImageScale =
    useTransform(
      heroScroll,
      [0, 1],
      heroImageScaleRange,
    );

  const heroImageY =
    useTransform(
      heroScroll,
      [0, 1],
      heroImageYRange,
    );

  /* -------------------------------------------------------
     SCROLL
  ------------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 30,
      );
    };

    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      },
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll,
      );
  }, []);

  /* -------------------------------------------------------
     ACTIVE SECTION
  ------------------------------------------------------- */

  useEffect(() => {
    const ids = [
      'experiencia',
      'modalidades',
      'planos',
      'localizacao',
    ];

    const sections = ids
      .map((id) =>
        document.getElementById(id),
      )
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter(
              (entry) =>
                entry.isIntersecting,
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio,
            );

          if (
            visible[0]?.target?.id
          ) {
            setActiveSection(
              visible[0].target.id,
            );
          }
        },
        {
          rootMargin:
            '-25% 0px -55% 0px',
          threshold: [
            0.1,
            0.25,
            0.5,
          ],
        },
      );

    sections.forEach(
      (section) =>
        observer.observe(section),
    );

    return () =>
      observer.disconnect();
  }, []);

  /* -------------------------------------------------------
     MENU
  ------------------------------------------------------- */

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previous =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    const handleKey = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    window.addEventListener(
      'keydown',
      handleKey,
    );

    return () => {
      document.body.style.overflow =
        previous;

      window.removeEventListener(
        'keydown',
        handleKey,
      );
    };
  }, [menuOpen]);

  /* -------------------------------------------------------
     DATA
  ------------------------------------------------------- */

  const modalities =
    safeArray<Modality>(
      gym.modalities,
    );

  const plans = safeArray<any>(
    gym.plans,
  );

  const testimonials =
    safeArray<any>(
      gym.testimonials,
    );

  const fallbackModalities: Modality[] =
    [
      {
        number: '01',
        name: 'Musculação',
        description:
          'Treino de força com acompanhamento próximo.',
        image:
          gym.images.training,
      },
      {
        number: '02',
        name: 'Funcional',
        description:
          'Movimento, condicionamento e performance.',
        image:
          gym.images.interior,
      },
      {
        number: '03',
        name: 'Boxe',
        description:
          'Técnica, intensidade e condicionamento.',
        image:
          gym.images.boxing,
      },
    ];

  const visibleModalities =
    modalities.length > 0
      ? modalities
      : fallbackModalities;

  const activeModalityData =
    visibleModalities[
      Math.min(
        activeModality,
        visibleModalities.length - 1,
      )
    ];

  const fallbackPlans = [
    {
      name: 'Essencial',
      price: 'R$ 000',
      period: '/mês',
      description:
        'Para começar a criar consistência.',
      features: [
        'Acesso à musculação',
        'Área funcional',
        'Avaliação inicial',
      ],
    },
    {
      name: 'Performance',
      price: 'R$ 000',
      period: '/mês',
      description:
        'Para quem quer evoluir com mais estrutura.',
      featured: true,
      features: [
        'Acesso completo',
        'Avaliação periódica',
        'Orientação de treino',
      ],
    },
    {
      name: 'Premium',
      price: 'R$ 000',
      period: '/mês',
      description:
        'Uma experiência completa de treinamento.',
      features: [
        'Acesso completo',
        'Acompanhamento',
        'Benefícios exclusivos',
      ],
    },
  ];

  const visiblePlans =
    plans.length > 0
      ? plans
      : fallbackPlans;

  /* -------------------------------------------------------
     GARANTE QUE ACTIVE PLAN NUNCA FIQUE INVÁLIDO
  ------------------------------------------------------- */

  useEffect(() => {
    if (
      activePlan >= visiblePlans.length &&
      visiblePlans.length > 0
    ) {
      setActivePlan(
        visiblePlans.length - 1,
      );
    }
  }, [
    activePlan,
    visiblePlans.length,
  ]);

  const fallbackTestimonials = [
    {
      name: 'NOME DA ALUNA',
      role: 'Aluna',
      text:
        'Um espaço em que treinar realmente virou parte da minha rotina.',
    },
    {
      name: 'NOME DO ALUNO',
      role: 'Aluno',
      text:
        'A estrutura e o ambiente fizeram muita diferença para eu voltar a treinar.',
    },
    {
      name: 'NOME DA ALUNA',
      role: 'Aluna',
      text:
        'O atendimento é próximo e a experiência é muito diferente de uma academia comum.',
    },
  ];

  const visibleTestimonials =
    testimonials.length > 0
      ? testimonials
      : fallbackTestimonials;

  const faqs = [
    [
      'Preciso já saber treinar?',
      'Não. A academia foi pensada também para quem está começando ou voltando depois de um período parado.',
    ],
    [
      'Posso fazer uma aula antes de contratar?',
      'Sim. Você pode conhecer o espaço e entender se a experiência faz sentido para você antes de decidir.',
    ],
    [
      'A academia fica aberta em quais horários?',
      'O horário pode variar conforme o dia. Entre em contato pelo WhatsApp para confirmar o funcionamento e encontrar o melhor momento.',
    ],
    [
      'Preciso levar alguma coisa para a primeira aula?',
      'Venha com roupa confortável, tênis adequado e disposição para começar. O restante a gente explica no espaço.',
    ],
  ];

  /* -------------------------------------------------------
     MODALITY SWIPE
  ------------------------------------------------------- */

  const modalityTouchStart =
    useRef<number | null>(null);

  const changeModality = (
    direction: number,
  ) => {
    setActiveModality(
      (current) => {
        const next =
          current + direction;

        if (next < 0) {
          return (
            visibleModalities.length - 1
          );
        }

        if (
          next >=
          visibleModalities.length
        ) {
          return 0;
        }

        return next;
      },
    );
  };

  /* -------------------------------------------------------
     PLAN SWIPE — MOBILE
  ------------------------------------------------------- */

  const planTouchStartX =
    useRef<number | null>(null);

  const planTouchStartY =
    useRef<number | null>(null);

  const changePlan = (
    direction: number,
  ) => {
    if (!visiblePlans.length) {
      return;
    }

    setActivePlan(
      (current) => {
        const next =
          current + direction;

        if (next < 0) {
          return (
            visiblePlans.length - 1
          );
        }

        if (
          next >=
          visiblePlans.length
        ) {
          return 0;
        }

        return next;
      },
    );
  };

  const handlePlanTouchStart = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    planTouchStartX.current =
      event.touches[0]?.clientX ?? null;

    planTouchStartY.current =
      event.touches[0]?.clientY ?? null;
  };

  const handlePlanTouchEnd = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    if (
      planTouchStartX.current === null ||
      planTouchStartY.current === null
    ) {
      return;
    }

    const endX =
      event.changedTouches[0]?.clientX ??
      planTouchStartX.current;

    const endY =
      event.changedTouches[0]?.clientY ??
      planTouchStartY.current;

    const deltaX =
      endX - planTouchStartX.current;

    const deltaY =
      endY - planTouchStartY.current;

    planTouchStartX.current = null;
    planTouchStartY.current = null;

    /*
      Movimento predominantemente vertical:
      deixa o scroll da página funcionar normalmente.
    */
    if (
      Math.abs(deltaX) <
      Math.abs(deltaY)
    ) {
      return;
    }

    /*
      Distância mínima para evitar troca acidental
      durante um simples toque.
    */
    if (Math.abs(deltaX) < 45) {
      return;
    }

    changePlan(
      deltaX < 0 ? 1 : -1,
    );
  };

  /* -------------------------------------------------------
     TESTIMONIAL
  ------------------------------------------------------- */

  const changeTestimonial = (
    direction: number,
  ) => {
    setActiveTestimonial(
      (current) => {
        const next =
          current + direction;

        if (next < 0) {
          return (
            visibleTestimonials.length - 1
          );
        }

        if (
          next >=
          visibleTestimonials.length
        ) {
          return 0;
        }

        return next;
      },
    );
  };

  const closeMenu = () =>
    setMenuOpen(false);

  const mapsUrl =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${DEMO.neighborhood}, ${DEMO.city}`,
    )}`;

  const currentPlan =
    visiblePlans[activePlan];

  return (
    <div className="site-shell">

      {/* =====================================================
          READING PROGRESS
      ===================================================== */}

      <motion.div
        className="reading-progress"
        style={{
          scaleX: progress,
          transformOrigin: '0% 50%',
        }}
      />

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className={`site-header ${
          scrolled ? 'scrolled' : ''
        }`}
      >
        <a
          href="#inicio"
          className="wordmark"
          onClick={closeMenu}
        >
          <span className="mark">
            A
          </span>

          <span>
            {DEMO.shortBrand}
          </span>
        </a>

        <nav className="desktop-nav">
          {navLinks.map(
            ([label, href]) => (
              <a
                href={href}
                key={href}
                className={
                  activeSection ===
                  href.slice(1)
                    ? 'active'
                    : ''
                }
              >
                {label}
              </a>
            ),
          )}
        </nav>

        <div className="header-actions">
          <span className="header-city">
            {DEMO.city}
          </span>

          <WhatsAppButton
            message={`Olá! Quero conhecer a ${DEMO.brand} e agendar uma aula.`}
          >
            Começar
          </WhatsAppButton>

          <motion.button
            type="button"
            className="menu-toggle"
            onClick={() =>
              setMenuOpen(
                (value) => !value,
              )
            }
            aria-label={
              menuOpen
                ? 'Fechar menu'
                : 'Abrir menu'
            }
            aria-expanded={menuOpen}
            whileTap={{
              scale: 0.9,
            }}
          >
            {menuOpen ? (
              <X size={18} />
            ) : (
              <Menu size={18} />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className="mobile-nav"
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
                duration: reduced
                  ? 0.01
                  : 0.55,
                ease,
              }}
            >
              {navLinks.map(
                (
                  [label, href],
                  index,
                ) => (
                  <motion.a
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    initial={{
                      opacity: 0,
                      x: reduced
                        ? 0
                        : -30,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: reduced
                        ? 0
                        : index * 0.06,
                      duration: reduced
                        ? 0.01
                        : 0.5,
                      ease,
                    }}
                  >
                    {label}

                    <ArrowRight size={18} />
                  </motion.a>
                ),
              )}

              <motion.a
                href="#agendar"
                onClick={closeMenu}
                initial={{
                  opacity: 0,
                  x: reduced
                    ? 0
                    : -30,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: reduced
                    ? 0
                    : 0.25,
                  duration: reduced
                    ? 0.01
                    : 0.5,
                  ease,
                }}
              >
                Começar

                <ArrowRight size={18} />
              </motion.a>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        ref={
          anim.heroRef as Ref<HTMLElement>
        }
        id="inicio"
        className="hero"
      >
        <motion.div
          ref={
            anim.photoWrapRef as Ref<HTMLDivElement>
          }
          className="hero-photo-wrap"
          style={{
            scale: heroImageScale,
            y: heroImageY,
          }}
        >
          <img
            ref={
              anim.photoRef as Ref<HTMLImageElement>
            }
            className="hero-photo"
            src={gym.images.hero}
            alt={`Interior da ${DEMO.brand}`}
            fetchPriority="high"
          />
        </motion.div>

        <motion.div
          ref={
            anim.overlayRef as Ref<HTMLDivElement>
          }
          className="hero-overlay"
        />

        <div
          ref={
            anim.toplineRef as Ref<HTMLDivElement>
          }
          className="hero-topline"
        >
          <span>
            {DEMO.brand}
          </span>

          <span className="hero-line" />

          <span>
            {DEMO.city}
          </span>
        </div>

        <motion.div
          ref={
            anim.addTitleRef as Ref<HTMLDivElement>
          }
          className="hero-content"
          style={{
            y: heroContentY,
            opacity: heroContentOpacity,
          }}
        >
          <motion.span
            ref={
              anim.eyebrowRef as Ref<HTMLSpanElement>
            }
            className="eyebrow light"
            initial={{
              opacity: 0,
              y: reduced ? 0 : 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: reduced
                ? 0.01
                : 0.8,
              delay: reduced
                ? 0
                : 0.15,
              ease,
            }}
          >
            Treinamento · Presença ·
            Consistência
          </motion.span>

          <h1>
            <motion.span
              className="title-line"
              initial={{
                y: reduced
                  ? 0
                  : '110%',
              }}
              animate={{
                y: 0,
              }}
              transition={{
                duration: reduced
                  ? 0.01
                  : 1.1,
                delay: reduced
                  ? 0
                  : 0.25,
                ease,
              }}
            >
              Mova
            </motion.span>

            <motion.span
              className="title-line"
              initial={{
                y: reduced
                  ? 0
                  : '110%',
              }}
              animate={{
                y: 0,
              }}
              transition={{
                duration: reduced
                  ? 0.01
                  : 1.1,
                delay: reduced
                  ? 0
                  : 0.34,
                ease,
              }}
            >
              o seu
            </motion.span>

            <motion.span
              className="title-line"
              initial={{
                y: reduced
                  ? 0
                  : '110%',
              }}
              animate={{
                y: 0,
              }}
              transition={{
                duration: reduced
                  ? 0.01
                  : 1.15,
                delay: reduced
                  ? 0
                  : 0.43,
                ease,
              }}
            >
              mundo.
            </motion.span>
          </h1>

          <motion.div
            ref={
              anim.heroBottomRef as Ref<HTMLDivElement>
            }
            className="hero-bottom"
            initial={{
              opacity: 0,
              y: reduced ? 0 : 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: reduced
                ? 0.01
                : 0.8,
              delay: reduced
                ? 0
                : 0.7,
              ease,
            }}
          >
            <motion.p
              ref={
                anim.heroBottomPRef as Ref<HTMLParagraphElement>
              }
            >
              Uma academia para quem quer
              treinar com intenção,
              estrutura e constância.
            </motion.p>

            <WhatsAppButton
              message={`Olá! Quero conhecer a ${DEMO.brand} e agendar uma aula.`}
            >
              Agendar aula
            </WhatsAppButton>
          </motion.div>
        </motion.div>

        <motion.div
          ref={
            anim.sideNoteRef as Ref<HTMLDivElement>
          }
          className="hero-side-note"
          style={{
            opacity: heroContentOpacity,
          }}
        >
          <span>
            Treine com presença
          </span>

          <span className="vertical-line" />

          <span>
            {DEMO.shortBrand} · 01
          </span>
        </motion.div>

        <motion.div
          ref={
            anim.floatingCardRef as Ref<HTMLDivElement>
          }
          className="hero-floating-card"
          initial={{
            opacity: 0,
            x: reduced ? 0 : 60,
            y: reduced ? 0 : -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: -30,
          }}
          transition={{
            duration: reduced
              ? 0.01
              : 0.9,
            delay: reduced
              ? 0
              : 0.8,
            ease,
          }}
          whileHover={{
            y: -40,
          }}
        >
          <span className="card-label">
            Agora
          </span>

          <strong>
            {status.open
              ? 'Aberta'
              : 'Fechada'}
          </strong>

          <span>
            {status.open
              ? 'Pronta para receber você'
              : 'Consulte nossos horários'}
          </span>

          <div className="pulse-line">
            {Array.from({
              length: 7,
            }).map(
              (_, index) => (
                <i key={index} />
              ),
            )}
          </div>
        </motion.div>

        <motion.div
          ref={
            anim.scrollRef as Ref<HTMLDivElement>
          }
          className="hero-scroll"
          animate={
            reduced
              ? {}
              : {
                  y: [0, 8, 0],
                  opacity: [
                    0.4,
                    0.9,
                    0.4,
                  ],
                }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span>
            Scroll
          </span>

          <ArrowDownRight size={14} />
        </motion.div>
      </section>

      {/* =====================================================
          MANIFESTO
      ===================================================== */}

      <section
        id="experiencia"
        ref={
          anim.nextSectionRef as Ref<HTMLElement>
        }
        className="manifesto section-pad"
      >
        <div className="manifesto-head">
          <span className="section-index">
            01 / A proposta
          </span>
        </div>

        <div className="manifesto-title">
          <Reveal>
            <h2>
              Seu corpo
              <br />
              pede <em>presença.</em>
            </h2>
          </Reveal>

          <Reveal
            delay={0.12}
            direction="right"
            className="manifesto-aside"
          >
            <p>
              A {DEMO.brand} foi criada para tirar o
              treino do automático. Um espaço em
              que ambiente, método e movimento
              trabalham juntos.
            </p>

            <a
              href="#modalidades"
              className="text-link"
            >
              Explorar modalidades
              <ArrowRight size={15} />
            </a>
          </Reveal>
        </div>

        <div className="stat-row">
          {[
            ['10+', 'anos de experiência'],
            ['4.9', 'avaliação média'],
            ['286+', 'avaliações'],
          ].map(
            ([value, label], index) => (
              <Reveal
                key={label}
                delay={index * 0.1}
                amount={0.6}
              >
                <motion.div
                  className="stat"
                  whileHover={{
                    y: -8,
                  }}
                  transition={{
                    duration: 0.35,
                    ease,
                  }}
                >
                  <strong>
                    <Counter
                      value={value}
                    />
                  </strong>

                  <span>
                    {label}
                  </span>
                </motion.div>
              </Reveal>
            ),
          )}
        </div>
      </section>

      {/* =====================================================
          EXPERIENCE
      ===================================================== */}

      <section
        className="intro-grid section-pad"
        style={{
          background:
            'var(--bg-alt)',
        }}
      >
        <Reveal direction="left">
          <div className="intro-copy">
            <span className="eyebrow">
              02 / O espaço
            </span>

            <h2>
              Um lugar que te coloca em{' '}
              <em>movimento.</em>
            </h2>

            <p className="body-copy">
              Equipamentos, circulação,
              iluminação e atmosfera pensados
              para que você queira permanecer,
              treinar e voltar.
            </p>

            <a
              href="#agendar"
              className="text-link"
            >
              Conhecer a {DEMO.brand}
              <ArrowRight size={15} />
            </a>
          </div>
        </Reveal>

        <CinematicImage
          className="image-frame intro-image"
          src={
            gym.images.interior ??
            gym.images.hero
          }
          alt={`Espaço interno da ${DEMO.brand}`}
          caption={`O espaço · ${DEMO.neighborhood}`}
          direction="right"
        />
      </section>

      {/* =====================================================
          BEGINNER
      ===================================================== */}

      <section className="beginner section-pad">
        <div className="beginner-word">
          COMEÇO
        </div>

        <CinematicImage
          className="image-frame beginner-image"
          src={
            gym.images.training ??
            gym.images.hero
          }
          alt={`Pessoa treinando na ${DEMO.brand}`}
          caption="Sem pressão"
          direction="left"
        />

        <Reveal
          direction="right"
          className="beginner-copy"
        >
          <span className="eyebrow">
            03 / Sem pressão
          </span>

          <h2>
            Você não precisa saber treinar
            para <em>começar.</em>
          </h2>

          <p className="body-copy">
            O ponto de partida não precisa ser
            perfeito. Precisa apenas existir.
          </p>

          <ul className="check-list">
            {[
              'Orientação para começar',
              'Ambiente sem julgamento',
              'Treino adaptado ao seu momento',
            ].map(
              (item, index) => (
                <motion.li
                  key={item}
                  initial={{
                    opacity: 0,
                    x: reduced ? 0 : -20,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.6,
                  }}
                  transition={{
                    delay: reduced
                      ? 0
                      : index * 0.09,
                    duration: reduced
                      ? 0.01
                      : 0.55,
                    ease,
                  }}
                >
                  <Check size={16} />
                  {item}
                </motion.li>
              ),
            )}
          </ul>

          <WhatsAppButton
            message={`Olá! Estou começando/voltando a treinar e gostaria de conhecer a ${DEMO.brand}.`}
          >
            Quero começar
          </WhatsAppButton>
        </Reveal>
      </section>

      {/* =====================================================
          MODALIDADES
      ===================================================== */}

      <section
        id="modalidades"
        className="section-pad"
      >
        <div className="section-heading">
          <Reveal>
            <div>
              <span className="eyebrow">
                04 / Práticas
              </span>

              <h2>
                Escolha seu{' '}
                <em>ritmo.</em>
              </h2>
            </div>
          </Reveal>

          <Reveal
            direction="right"
            delay={0.12}
          >
            <p className="heading-note">
              Diferentes formas de treinar.
              <br />
              A mesma intenção: evoluir.
            </p>
          </Reveal>
        </div>

        <div className="modality-stage">
          <motion.div
            className="image-frame modality-visual"
            onTouchStart={(event) => {
              modalityTouchStart.current =
                event.touches[0]
                  ?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (
                modalityTouchStart.current ===
                null
              ) {
                return;
              }

              const end =
                event.changedTouches[0]
                  ?.clientX ??
                modalityTouchStart.current;

              const delta =
                end -
                modalityTouchStart.current;

              if (
                Math.abs(delta) > 50
              ) {
                changeModality(
                  delta > 0 ? -1 : 1,
                );
              }

              modalityTouchStart.current =
                null;
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={
                  (activeModalityData as any)
                    ?.id ??
                  activeModality
                }
                src={
                  (activeModalityData as any)
                    ?.image ??
                  gym.images.hero
                }
                alt={
                  (activeModalityData as any)
                    ?.name ??
                  'Modalidade'
                }
                initial={{
                  opacity: 0,
                  scale: reduced
                    ? 1
                    : 1.14,
                  x: reduced
                    ? 0
                    : 45,
                  clipPath: reduced
                    ? 'inset(0)'
                    : 'inset(0 0 0 12%)',
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  clipPath: 'inset(0)',
                }}
                exit={{
                  opacity: 0,
                  scale: reduced
                    ? 1
                    : 1.06,
                  x: reduced
                    ? 0
                    : -35,
                }}
                transition={{
                  duration: reduced
                    ? 0.01
                    : 0.75,
                  ease,
                }}
              />
            </AnimatePresence>

            <motion.div
              className="image-caption"
              key={
                (activeModalityData as any)
                  ?.name ??
                activeModality
              }
              initial={{
                opacity: 0,
                y: reduced ? 0 : 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: reduced
                  ? 0
                  : 0.25,
                duration: reduced
                  ? 0.01
                  : 0.45,
                ease,
              }}
            >
              {(activeModalityData as any)
                ?.name ??
                'Treino'}
            </motion.div>
          </motion.div>

          <div className="modality-list">
            {visibleModalities.map(
              (
                modality: any,
                index,
              ) => {
                const active =
                  activeModality ===
                  index;

                return (
                  <motion.button
                    type="button"
                    key={
                      modality.id ??
                      modality.name ??
                      index
                    }
                    className={`modality-item ${
                      active
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      setActiveModality(
                        index,
                      )
                    }
                    initial={{
                      opacity: 0,
                      x: reduced
                        ? 0
                        : 45,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.5,
                    }}
                    transition={{
                      delay: reduced
                        ? 0
                        : index * 0.08,
                      duration: reduced
                        ? 0.01
                        : 0.65,
                      ease,
                    }}
                    whileHover={{
                      x: 10,
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                  >
                    <span>
                      {String(
                        index + 1,
                      ).padStart(2, '0')}
                    </span>

                    <strong>
                      {modality.name ??
                        modality.title ??
                        `Modalidade ${
                          index + 1
                        }`}
                    </strong>

                    {active ? (
                      <ChevronRight
                        size={20}
                      />
                    ) : (
                      <ArrowDownRight
                        size={19}
                      />
                    )}

                    <AnimatePresence>
                      {active && (
                        <motion.div
                          className="modality-description"
                          initial={{
                            opacity: 0,
                            height: 0,
                            y: -10,
                          }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            y: -10,
                          }}
                          transition={{
                            duration: reduced
                              ? 0.01
                              : 0.5,
                            ease,
                          }}
                        >
                          {modality.description ??
                            modality.text ??
                            'Uma experiência de treino pensada para diferentes objetivos.'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              },
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                marginTop: '1rem',
              }}
            >
              <motion.button
                type="button"
                className="round-link"
                onClick={() =>
                  changeModality(-1)
                }
                aria-label="Modalidade anterior"
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.9,
                }}
              >
                <ChevronLeft size={18} />
              </motion.button>

              <motion.button
                type="button"
                className="round-link"
                onClick={() =>
                  changeModality(1)
                }
                aria-label="Próxima modalidade"
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.9,
                }}
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUOTE
      ===================================================== */}

      <QuoteScene>
        <span className="quote-mark">
          “
        </span>

        <blockquote>
          Consistência é uma forma de{' '}
          <span>cuidado.</span>
        </blockquote>

        <p>
          O treino não precisa dominar sua
          rotina. Precisa encontrar um lugar
          nela.
        </p>

        <span className="quote-number">
          05
        </span>
      </QuoteScene>

      {/* =====================================================
          PLANOS
      ===================================================== */}

      <section
        id="planos"
        className="section-pad"
      >
        <div className="plans-layout">
          <Reveal direction="left">
            <div className="plans-intro">
              <span className="eyebrow">
                05 / Escolha seu plano
              </span>

              <h2
                style={{
                  fontSize:
                    'clamp(2.75rem, 8vw, 5.5rem)',
                  margin:
                    '1rem 0 1.5rem',
                }}
              >
                Comece pelo{' '}
                <em>agora.</em>
              </h2>

              <p className="body-copy">
                Não precisa descobrir o
                plano perfeito antes de
                começar. Encontre o que
                faz sentido para o seu
                momento.
              </p>
            </div>
          </Reveal>

          {/* =================================================
              DESKTOP
          ================================================= */}

          <div className="plan-list">
            {visiblePlans.map(
              (
                plan: any,
                index,
              ) => (
                <motion.article
                  key={
                    plan.id ??
                    plan.name ??
                    index
                  }
                  className={`plan ${
                    plan.featured ||
                    plan.highlighted
                      ? 'featured'
                      : ''
                  }`}
                  initial={{
                    opacity: 0,
                    y: reduced ? 0 : 90,
                    rotateX:
                      reduced ? 0 : 8,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    delay: reduced
                      ? 0
                      : index * 0.12,
                    duration: reduced
                      ? 0.01
                      : 0.8,
                    ease,
                  }}
                  whileHover={
                    reduced
                      ? undefined
                      : {
                          y: -10,
                          scale: 1.015,
                        }
                  }
                >
                  <div className="plan-top">
                    <span className="plan-number">
                      {String(
                        index + 1,
                      ).padStart(2, '0')}
                    </span>

                    {plan.tag && (
                      <span className="plan-tag">
                        {plan.tag}
                      </span>
                    )}

                    {!plan.tag &&
                      (plan.featured ||
                        plan.highlighted) && (
                        <span className="plan-tag">
                          Mais escolhido
                        </span>
                      )}
                  </div>

                  <h3>
                    {plan.name ??
                      plan.title ??
                      `Plano ${
                        index + 1
                      }`}
                  </h3>

                  <p className="plan-detail">
                    {plan.description ??
                      plan.detail ??
                      'Para manter sua rotina de treino em movimento.'}
                  </p>

                  <div className="price">
                    {plan.price ??
                      plan.value ??
                      'Consulte'}

                    {plan.period && (
                      <small>
                        {plan.period}
                      </small>
                    )}
                  </div>

                  <ul>
                    {safeArray<string>(
                      plan.features ??
                        plan.benefits,
                    ).map(
                      (feature) => (
                        <li key={feature}>
                          <Check size={15} />
                          {feature}
                        </li>
                      ),
                    )}

                    {!safeArray<string>(
                      plan.features ??
                        plan.benefits,
                    ).length && (
                      <>
                        <li>
                          <Check size={15} />
                          Acesso à estrutura
                        </li>

                        <li>
                          <Check size={15} />
                          Ambiente completo
                        </li>

                        <li>
                          <Check size={15} />
                          Treino com consistência
                        </li>
                      </>
                    )}
                  </ul>

                  <WhatsAppButton
                    dark={Boolean(
                      plan.featured ||
                        plan.highlighted,
                    )}
                    message={`Olá! Quero conhecer o ${
                      plan.name ??
                      'plano da academia'
                    }.`}
                  >
                    Escolher este plano
                  </WhatsAppButton>
                </motion.article>
              ),
            )}
          </div>

          {/* =================================================
              MOBILE — CARROSSEL
          ================================================= */}

          <div
            className="plans-mobile-carousel"
            aria-label="Planos da academia"
            onTouchStart={
              handlePlanTouchStart
            }
            onTouchEnd={
              handlePlanTouchEnd
            }
          >
            <div className="plans-mobile-topline">
              <span>
                PLANO{' '}
                {String(
                  activePlan + 1,
                ).padStart(2, '0')}
              </span>

              <span>
                {String(
                  visiblePlans.length,
                ).padStart(2, '0')}
              </span>
            </div>

            <div className="plans-mobile-viewport">
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.article
                  key={planKey(
                    currentPlan,
                    activePlan,
                  )}
                  className={`plan plan-mobile ${
                    currentPlan?.featured ||
                    currentPlan?.highlighted
                      ? 'featured'
                      : ''
                  }`}
                  initial={{
                    opacity: 0,
                    x: reduced
                      ? 0
                      : 55,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: reduced
                      ? 0
                      : -45,
                  }}
                  transition={{
                    duration: reduced
                      ? 0.01
                      : 0.5,
                    ease,
                  }}
                >
                  <div className="plan-top">
                    <span className="plan-number">
                      {String(
                        activePlan + 1,
                      ).padStart(2, '0')}
                    </span>

                    {currentPlan?.tag && (
                      <span className="plan-tag">
                        {currentPlan.tag}
                      </span>
                    )}

                    {!currentPlan?.tag &&
                      (currentPlan?.featured ||
                        currentPlan?.highlighted) && (
                        <span className="plan-tag">
                          Mais escolhido
                        </span>
                      )}
                  </div>

                  <h3>
                    {currentPlan?.name ??
                      currentPlan?.title ??
                      `Plano ${
                        activePlan + 1
                      }`}
                  </h3>

                  <p className="plan-detail">
                    {currentPlan?.description ??
                      currentPlan?.detail ??
                      'Para manter sua rotina de treino em movimento.'}
                  </p>

                  <div className="price">
                    {currentPlan?.price ??
                      currentPlan?.value ??
                      'Consulte'}

                    {currentPlan?.period && (
                      <small>
                        {currentPlan.period}
                      </small>
                    )}
                  </div>

                  <ul>
                    {safeArray<string>(
                      currentPlan?.features ??
                        currentPlan?.benefits,
                    ).map(
                      (feature) => (
                        <li key={feature}>
                          <Check size={15} />
                          {feature}
                        </li>
                      ),
                    )}

                    {!safeArray<string>(
                      currentPlan?.features ??
                        currentPlan?.benefits,
                    ).length && (
                      <>
                        <li>
                          <Check size={15} />
                          Acesso à estrutura
                        </li>

                        <li>
                          <Check size={15} />
                          Ambiente completo
                        </li>

                        <li>
                          <Check size={15} />
                          Treino com consistência
                        </li>
                      </>
                    )}
                  </ul>

                  <WhatsAppButton
                    dark={Boolean(
                      currentPlan?.featured ||
                        currentPlan?.highlighted,
                    )}
                    message={`Olá! Quero conhecer o ${
                      currentPlan?.name ??
                      'plano da academia'
                    }.`}
                  >
                    Escolher este plano
                  </WhatsAppButton>
                </motion.article>
              </AnimatePresence>
            </div>

            <div
              className="plans-mobile-controls"
              aria-label="Navegação entre planos"
            >
              <button
                type="button"
                className="round-link"
                onClick={() =>
                  changePlan(-1)
                }
                aria-label="Plano anterior"
              >
                <ChevronLeft size={18} />
              </button>

              <div
                className="plan-dots"
                role="tablist"
                aria-label="Selecionar plano"
              >
                {visiblePlans.map(
                  (
                    plan: any,
                    index,
                  ) => (
                    <button
                      key={
                        plan.id ??
                        plan.name ??
                        index
                      }
                      type="button"
                      role="tab"
                      aria-selected={
                        activePlan === index
                      }
                      aria-label={`Ver plano ${
                        index + 1
                      }${
                        plan.name
                          ? `: ${plan.name}`
                          : ''
                      }`}
                      className={`plan-dot ${
                        activePlan ===
                        index
                          ? 'active'
                          : ''
                      }`}
                      onClick={() =>
                        setActivePlan(
                          index,
                        )
                      }
                    />
                  ),
                )}
              </div>

              <button
                type="button"
                className="round-link"
                onClick={() =>
                  changePlan(1)
                }
                aria-label="Próximo plano"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="plan-swipe-hint">
              <span>
                Deslize para ver os outros planos
              </span>

              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SOCIAL PROOF
      ===================================================== */}

      <section className="social-proof section-pad">
        <div className="social-header">
          <Reveal>
            <div>
              <span className="eyebrow">
                06 / Quem vive
              </span>

              <h2
                style={{
                  fontSize:
                    'clamp(2.5rem, 8vw, 5.5rem)',
                  marginTop: '1rem',
                }}
              >
                Quem vive a{' '}
                <em>{DEMO.brand}.</em>
              </h2>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="google-score">
              <span>
                <Star
                  size={18}
                  fill="currentColor"
                />
                4,9
              </span>

              <small>
                286 avaliações
              </small>
            </div>
          </Reveal>
        </div>

        <div className="testimonial-layout">
          <Reveal direction="left">
            <div className="testimonial-feature">
              <span className="eyebrow">
                Depoimento
              </span>

              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeTestimonial}
                  initial={{
                    opacity: 0,
                    x: reduced ? 0 : 70,
                    clipPath: reduced
                      ? 'inset(0)'
                      : 'inset(0 0 0 12%)',
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    clipPath: 'inset(0)',
                  }}
                  exit={{
                    opacity: 0,
                    x: reduced ? 0 : -50,
                  }}
                  transition={{
                    duration: reduced
                      ? 0.01
                      : 0.7,
                    ease,
                  }}
                >
                  “
                  {visibleTestimonials[
                    activeTestimonial
                  ]?.text ??
                    'Treinar aqui mudou completamente minha relação com exercício.'}
                  ”
                </motion.blockquote>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`author-${activeTestimonial}`}
                  className="testimonial-author"
                  initial={{
                    opacity: 0,
                    y: reduced ? 0 : 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -15,
                  }}
                  transition={{
                    duration: reduced
                      ? 0.01
                      : 0.45,
                  }}
                >
                  <strong>
                    {
                      visibleTestimonials[
                        activeTestimonial
                      ]?.name ??
                      'Aluno da academia'
                    }
                  </strong>

                  <span>
                    {
                      visibleTestimonials[
                        activeTestimonial
                      ]?.role ??
                      'Aluno'
                    }
                  </span>
                </motion.div>
              </AnimatePresence>

              <div className="testimonial-controls">
                <motion.button
                  type="button"
                  onClick={() =>
                    changeTestimonial(-1)
                  }
                  aria-label="Depoimento anterior"
                  whileHover={{
                    scale: 1.08,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  <ChevronLeft size={18} />
                </motion.button>

                <span>
                  {String(
                    activeTestimonial + 1,
                  ).padStart(2, '0')}{' '}
                  /{' '}
                  {String(
                    visibleTestimonials.length,
                  ).padStart(2, '0')}
                </span>

                <motion.button
                  type="button"
                  onClick={() =>
                    changeTestimonial(1)
                  }
                  aria-label="Próximo depoimento"
                  whileHover={{
                    scale: 1.08,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>
          </Reveal>

          <CinematicImage
            className="image-frame coach-image"
            src={
              gym.images.coach ??
              gym.images.hero
            }
            alt={`Coach da ${DEMO.brand}`}
            caption="Treino com presença"
            direction="right"
          />
        </div>
      </section>

      {/* =====================================================
          TRIAL
      ===================================================== */}

      <section
        id="agendar"
        className="trial section-pad"
      >
        <div className="trial-shape" />

        <Reveal className="trial-content">
          <span className="eyebrow light">
            07 / O primeiro passo
          </span>

          <h2>
            Conheça antes de{' '}
            <em>decidir.</em>
          </h2>

          <p>
            Uma primeira experiência é
            suficiente para entender o espaço,
            sentir o ambiente e descobrir se a
            {` ${DEMO.brand}`} faz sentido para você.
          </p>

          <WhatsAppButton
            dark
            message={`Olá! Quero conhecer a ${DEMO.brand} antes de decidir e gostaria de agendar uma aula.`}
          >
            Agendar uma aula
          </WhatsAppButton>
        </Reveal>

        <CinematicImage
          className="trial-image"
          src={
            gym.images.boxing ??
            gym.images.hero
          }
          alt={`Pessoa treinando na ${DEMO.brand}`}
          caption="Seu primeiro passo"
          direction="right"
        />

        <div className="steps">
          {[
            ['01', 'Conheça'],
            ['02', 'Experimente'],
            ['03', 'Escolha'],
            ['04', 'Evolua'],
          ].map(
            ([number, text], index) => (
              <motion.div
                key={number}
                initial={{
                  opacity: 0,
                  y: reduced ? 0 : 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.5,
                }}
                transition={{
                  delay: reduced
                    ? 0
                    : index * 0.1,
                  duration: reduced
                    ? 0.01
                    : 0.6,
                  ease,
                }}
              >
                <b>{number}</b>
                <span>{text}</span>
              </motion.div>
            ),
          )}
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="section-pad">
        <div className="section-heading">
          <Reveal>
            <div>
              <span className="eyebrow">
                08 / Perguntas
              </span>

              <h2>
                Antes de{' '}
                <em>começar.</em>
              </h2>
            </div>
          </Reveal>

          <Reveal direction="right">
            <p className="heading-note">
              As dúvidas mais comuns antes
              da primeira visita.
            </p>
          </Reveal>
        </div>

        <div className="faq-list">
          {faqs.map(
            (
              [question, answer],
              index,
            ) => {
              const open =
                activeFaq === index;

              return (
                <motion.div
                  key={question}
                  className={`faq-item ${
                    open ? 'open' : ''
                  }`}
                  initial={{
                    opacity: 0,
                    y: reduced ? 0 : 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.5,
                  }}
                  transition={{
                    delay: reduced
                      ? 0
                      : index * 0.05,
                    duration: reduced
                      ? 0.01
                      : 0.55,
                    ease,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFaq(
                        open ? null : index,
                      )
                    }
                    aria-expanded={open}
                  >
                    <span>
                      {question}
                    </span>

                    <motion.span
                      animate={{
                        rotate: open ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.3,
                        ease,
                      }}
                    >
                      <Plus size={18} />
                    </motion.span>
                  </button>

                  <AnimatePresence
                    initial={false}
                  >
                    {open && (
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
                          duration: reduced
                            ? 0.01
                            : 0.5,
                          ease,
                        }}
                      >
                        <p>
                          {answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            },
          )}
        </div>
      </section>

      {/* =====================================================
          LOCATION
      ===================================================== */}

      <section
        id="localizacao"
        className="location section-pad"
      >
        <div className="location-top">
          <Reveal>
            <div>
              <span className="eyebrow">
                09 / Encontre a gente
              </span>

              <h2
                style={{
                  fontSize:
                    'clamp(2.75rem, 8vw, 5.5rem)',
                  marginTop: '1rem',
                }}
              >
                Venha para a{' '}
                <em>{DEMO.shortBrand}.</em>
              </h2>
            </div>
          </Reveal>

          <motion.div
            className="location-giant"
            initial={{
              opacity: 0,
              x: reduced ? 0 : 100,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.5,
            }}
            transition={{
              duration: reduced
                ? 0.01
                : 1,
              ease,
            }}
          >
            {DEMO.city.split('·')[0].trim()}
          </motion.div>
        </div>

        <div className="location-layout">
          <Reveal direction="left">
            <div className="location-copy">
              <span className="eyebrow">
                {DEMO.neighborhood}
              </span>

              <h2>
                Um espaço para treinar
                perto da sua
                <em> rotina.</em>
              </h2>

              <div className="location-details">
                <div>
                  <MapPin size={19} />

                  <p>
                    {DEMO.address}
                  </p>
                </div>

                <div>
                  <Clock3 size={19} />

                  <p>
                    {DEMO.hours}
                  </p>
                </div>

                <div>
                  <Dumbbell size={19} />

                  <p>
                    Estrutura completa
                    para treinamento.
                  </p>
                </div>
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                Abrir no Google Maps

                <MoveUpRight size={15} />
              </a>
            </div>
          </Reveal>

          <motion.div
            className="map-art"
            initial={{
              opacity: 0,
              scale: reduced ? 1 : 0.92,
              y: reduced ? 0 : 70,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: reduced
                ? 0.01
                : 1,
              ease,
            }}
          >
            <motion.div
              className="map-grid"
              animate={
                reduced
                  ? {}
                  : {
                      backgroundPosition: [
                        '0px 0px',
                        '36px 36px',
                      ],
                    }
              }
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="map-route">
              <span />
              <span />
              <span />
            </div>

            <motion.div
              className="map-pin"
              animate={
                reduced
                  ? {}
                  : {
                      scale: [
                        1,
                        1.08,
                        1,
                      ],
                    }
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <MapPin size={20} />
            </motion.div>

            <div className="map-label">
              {DEMO.neighborhood}
              <br />

              <small>
                {DEMO.city}
              </small>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">
        <div className="footer-top">
          <motion.a
            href="#inicio"
            className="wordmark"
            whileHover={{
              y: -4,
            }}
          >
            <span className="mark">
              A
            </span>

            <span>
              {DEMO.shortBrand}
            </span>
          </motion.a>

          <Reveal direction="right">
            <p>
              Mova o seu
              <br />
              mundo.
            </p>
          </Reveal>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()}{' '}
            {DEMO.brand}
          </span>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={14} />
            {DEMO.instagram}
          </a>

          <a href="#inicio">
            Voltar ao topo
            <ArrowRight size={14} />
          </a>
        </div>
      </footer>

      {/* =====================================================
          FLOATING WHATSAPP
      ===================================================== */}

      <motion.a
        href={whatsappUrl()}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        aria-label="Falar pelo WhatsApp"
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          delay: reduced ? 0 : 1.4,
          duration: reduced ? 0.01 : 0.6,
          ease,
        }}
        whileHover={{
          scale: 1.1,
        }}
        whileTap={{
          scale: 0.92,
        }}
      >
        <MessageCircle size={23} />
      </motion.a>

      {/* =====================================================
          BOOKING MODAL
      ===================================================== */}

      <AnimatePresence>
        {showBooking && (
          <BookingModal
            onClose={() =>
              setShowBooking(false)
            }
          />
        )}
      </AnimatePresence>

      {/* =====================================================
          MOBILE BOTTOM NAV
      ===================================================== */}

      <nav className="mobile-bottom-nav">
        {[
          [
            'Experiência',
            '#experiencia',
            Home,
          ],
          [
            'Treinos',
            '#modalidades',
            Dumbbell,
          ],
          [
            'Planos',
            '#planos',
            Star,
          ],
          [
            'Visite',
            '#localizacao',
            MapPin,
          ],
        ].map(
          ([
            label,
            href,
            Icon,
          ]) => {
            const Component =
              Icon as typeof Home;

            return (
              <a
                key={href as string}
                href={href as string}
                className={
                  activeSection ===
                  (
                    href as string
                  ).slice(1)
                    ? 'active'
                    : ''
                }
              >
                <Component size={17} />

                <span>
                  {label as string}
                </span>
              </a>
            );
          },
        )}
      </nav>
    </div>
  );
}

/* =========================================================
   PLAN KEY
========================================================= */

function planKey(
  plan: any,
  index: number,
) {
  return (
    plan?.id ??
    plan?.name ??
    `plan-${index}`
  );
}