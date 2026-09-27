import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Check, Clock3, Crosshair, Instagram, MapPin, Menu, MessageCircle, MoveUpRight, Navigation, Plus, Star, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gym, type Modality } from '@/data/gym';
import { useHeroAnimation } from '@/hooks/useHeroAnimation';

const ease = [0.22, 1, 0.36, 1] as const;

function WhatsAppButton({ label = 'Agendar aula experimental', dark = false, message = 'Olá! Vim pelo site e gostaria de agendar uma aula experimental.' }: { label?: string; dark?: boolean; message?: string }) {
  const href = `https://wa.me/${gym.whatsapp}?text=${encodeURIComponent(message)}`;
  return <a className={`button ${dark ? 'button-dark' : ''}`} href={href} target="_blank" rel="noreferrer">{label}<MoveUpRight size={16} strokeWidth={1.8} /></a>;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.8, delay, ease }}>{children}</motion.div>;
}

function Counter({ value, label }: { value: string; label: string }) {
  return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModality, setActiveModality] = useState<Modality>(gym.modalities[0]);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const anim = useHeroAnimation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <a className="wordmark" href="#top" aria-label="Áurea início"><span className="mark">A</span><span>Áurea</span></a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#experiencia">Experiência</a><a href="#modalidades">Modalidades</a><a href="#planos">Planos</a><a href="#localizacao">Visite</a>
        </nav>
        <div className="header-actions"><span className="header-city">SP / PINHEIROS</span><button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button><WhatsAppButton label="Começar" /></div>
        <AnimatePresence>{menuOpen && <motion.div className="mobile-nav" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><a href="#experiencia" onClick={() => setMenuOpen(false)}>Experiência</a><a href="#modalidades" onClick={() => setMenuOpen(false)}>Modalidades</a><a href="#planos" onClick={() => setMenuOpen(false)}>Planos</a><a href="#localizacao" onClick={() => setMenuOpen(false)}>Visite</a></motion.div>}</AnimatePresence>
      </header>

      <main id="top">
        <section className="hero" ref={anim.heroRef as React.RefObject<HTMLElement>}>
          <div className="hero-photo-wrap" ref={anim.photoWrapRef as React.RefObject<HTMLDivElement>}>
            <img ref={anim.photoRef as React.RefObject<HTMLImageElement>} src={gym.images.hero} alt="Pessoa correndo com sensação de movimento" className="hero-photo" />
          </div>
          <div className="hero-overlay" ref={anim.overlayRef as React.RefObject<HTMLDivElement>} />
          <div className="hero-topline" ref={anim.toplineRef as React.RefObject<HTMLDivElement>}>
            <span>EST. 2018</span><span className="hero-line" /><span>TREINO / PINHEIROS</span>
          </div>
          <div className="hero-content">
            <p className="eyebrow light" ref={anim.eyebrowRef as React.RefObject<HTMLParagraphElement>}>TREINO DE VERDADE</p>
            <h1>
              <span className="title-line" ref={anim.addTitleRef}>MOVA</span>
              <span className="title-line" ref={anim.addTitleRef}><em>O SEU</em></span>
              <span className="title-line" ref={anim.addTitleRef}>MUNDO<span className="accent-dot">.</span></span>
            </h1>
            <div className="hero-bottom" ref={anim.heroBottomRef as React.RefObject<HTMLDivElement>}>
              <p ref={anim.heroBottomPRef as React.RefObject<HTMLParagraphElement>}>Treino bem feito, espaço bom e acompanhamento de perto.</p>
              <div ref={anim.heroButtonRef as React.RefObject<HTMLDivElement>}>
                <WhatsAppButton label="AGENDAR AULA" />
              </div>
            </div>
          </div>
          <div className="hero-side-note" ref={anim.sideNoteRef as React.RefObject<HTMLDivElement>}>
            <span>01</span><span className="vertical-line" /><span>ROLE PARA VER</span>
          </div>
          <div className="hero-floating-card" ref={anim.floatingCardRef as React.RefObject<HTMLDivElement>}>
            <span className="card-label">AGORA</span><strong>06:42</strong><span>academia aberta</span>
            <div className="pulse-line"><i /><i /><i /><i /><i /><i /><i /></div>
          </div>
          <div className="hero-scroll" ref={anim.scrollRef as React.RefObject<HTMLDivElement>}>
            <ArrowDownRight size={18} /><span>VER MAIS</span>
          </div>
        </section>

        <section className="manifesto section-pad" ref={anim.nextSectionRef as React.RefObject<HTMLElement>}>
          <Reveal className="manifesto-head"><p className="eyebrow">01 / A proposta</p><span className="section-index">[ A ]</span></Reveal>
          <Reveal delay={.1} className="manifesto-title"><h2>Seu corpo<br /><span>pede</span><br />presença<span className="accent-dot">.</span></h2><div className="manifesto-aside"><p>Não é sobre fazer mais. É sobre fazer melhor. Na Áurea, cada detalhe foi pensado para transformar movimento em uma prática possível, prazerosa e consistente.</p><a className="text-link" href="#experiencia">Conheça nossa abordagem <ArrowRight size={16} /></a></div></Reveal>
          <div className="stat-row">{gym.stats.map((stat, index) => <Reveal key={stat.label} delay={index * .1}><Counter {...stat} /></Reveal>)}</div>
        </section>

        <section className="intro-grid section-pad" id="experiencia">
          <Reveal className="intro-copy"><p className="eyebrow">02 / O espaço</p><h2>Um lugar que<br /><span>te coloca</span><br />em movimento.</h2><p className="body-copy">Luz natural, equipamentos de alta performance e uma equipe que conhece seu nome. Tudo para você treinar com foco — e sair se sentindo mais presente do que entrou.</p><a className="round-link" href="#estrutura" aria-label="Ver estrutura"><ArrowDownRight size={22} /></a></Reveal>
          <Reveal delay={.15} className="intro-image image-frame"><img src={gym.images.interior} alt="Interior amplo da academia Áurea" loading="lazy" /><span className="image-caption">01 — ÁREA DE TREINO / PINHEIROS</span></Reveal>
        </section>

        <section className="beginner section-pad" id="estrutura">
          <div className="beginner-word">COMECE</div>
          <Reveal className="beginner-image image-frame"><img src={gym.images.training} alt="Mulher treinando com halteres" loading="lazy" /><span className="image-caption">Acompanhamento desde o primeiro dia</span></Reveal>
          <Reveal delay={.12} className="beginner-copy"><p className="eyebrow">03 / Sem pressão</p><h2>Você não precisa saber treinar para <span>começar.</span></h2><p className="body-copy">Seu primeiro treino tem um roteiro simples: entender você, ajustar o movimento e encontrar uma intensidade que faça sentido. O resto é construção.</p><ul className="check-list"><li><Check size={15} /> Avaliação e objetivo</li><li><Check size={15} /> Professor por perto</li><li><Check size={15} /> Evolução acompanhada</li></ul><button className="text-link button-reset" onClick={() => setShowBooking(true)}>Quero conhecer a academia <ArrowRight size={16} /></button></Reveal>
        </section>

        <section className="modalities section-pad" id="modalidades">
          <Reveal className="section-heading"><div><p className="eyebrow">04 / Práticas</p><h2>Escolha seu<br /><span>ritmo.</span></h2></div><p className="heading-note">Deslize, escolha<br />e comece a mover.</p></Reveal>
          <div className="modality-stage"><div className="modality-visual image-frame"><AnimatePresence mode="wait"><motion.img key={activeModality.name} src={activeModality.image} alt={activeModality.name} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .98 }} transition={{ duration: .55, ease }} /></AnimatePresence><span className="image-caption">ÁUREA / {activeModality.number}</span></div><div className="modality-list">{gym.modalities.map((modality) => <button key={modality.name} className={`modality-item ${activeModality.name === modality.name ? 'active' : ''}`} onMouseEnter={() => setActiveModality(modality)} onFocus={() => setActiveModality(modality)} onClick={() => setActiveModality(modality)}><span>{modality.number}</span><strong>{modality.name}</strong><MoveUpRight size={20} /></button>)}<AnimatePresence mode="wait"><motion.p key={activeModality.name} className="modality-description" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{activeModality.description}</motion.p></AnimatePresence></div></div>
        </section>

        <section className="quote-break"><div className="quote-mark">“</div><Reveal><blockquote>Consistência é uma forma<br />de <span>cuidado.</span></blockquote><p>— manifesto Áurea</p></Reveal><div className="quote-number">04</div></section>

        <section className="plans section-pad" id="planos">
          <Reveal className="section-heading"><div><p className="eyebrow">05 / Escolha seu plano</p><h2>Comece pelo<br /><span>agora.</span></h2></div><p className="heading-note">Sem taxa de adesão.<br />Sem letras miúdas.</p></Reveal>
          <div className="plans-layout"><div className="plans-intro"><p className="body-copy">O plano certo é aquele que cabe na sua rotina. Todos incluem acesso à nossa estrutura e uma equipe pronta para fazer você avançar.</p><a className="text-link" href="#faq">Dúvidas frequentes <ArrowRight size={16} /></a></div><div className="plan-list">{gym.plans.map((plan, index) => <Reveal key={plan.name} delay={index * .08}><article className={`plan ${plan.featured ? 'featured' : ''}`}><div className="plan-top"><span className="plan-number">0{index + 1}</span>{plan.featured && <span className="plan-tag">Mais escolhido</span>}</div><h3>{plan.name}</h3><p className="plan-detail">{plan.detail}</p><div className="price">{plan.price}<small>{plan.period}</small></div><ul>{plan.features.map((feature) => <li key={feature}><Check size={14} />{feature}</li>)}</ul><WhatsAppButton label="Quero começar" dark={plan.featured} message={`Olá! Quero saber mais sobre o plano ${plan.name} da Áurea.`} /></article></Reveal>)}</div></div>
        </section>

        <section className="social-proof section-pad"><Reveal className="social-header"><p className="eyebrow">06 / Quem vive</p><div className="google-score"><span><Star size={17} fill="currentColor" /> 4,9</span><small>Google Reviews / 286 avaliações</small></div></Reveal><div className="testimonial-layout"><Reveal className="testimonial-feature"><div className="quote-mark small">“</div><AnimatePresence mode="wait"><motion.blockquote key={activeTestimonial}>{gym.testimonials[activeTestimonial].quote}</motion.blockquote></AnimatePresence><div className="testimonial-author"><strong>{gym.testimonials[activeTestimonial].name}</strong><span>{gym.testimonials[activeTestimonial].detail}</span></div><div className="testimonial-controls"><button onClick={() => setActiveTestimonial((activeTestimonial + gym.testimonials.length - 1) % gym.testimonials.length)} aria-label="Depoimento anterior">←</button><span>0{activeTestimonial + 1} / 0{gym.testimonials.length}</span><button onClick={() => setActiveTestimonial((activeTestimonial + 1) % gym.testimonials.length)} aria-label="Próximo depoimento">→</button></div></Reveal><Reveal delay={.14} className="coach-image image-frame"><img src={gym.images.coach} alt="Atleta treinando com cordas" loading="lazy" /><span className="image-caption">Cada corpo tem uma história</span></Reveal></div></section>

        <section className="trial section-pad"><div className="trial-shape" /><Reveal className="trial-content"><p className="eyebrow light">07 / O primeiro passo</p><h2>Conheça<br /><em>antes</em> de<br />decidir<span className="accent-dot">.</span></h2><p>Venha sentir o espaço, conversar com um professor e fazer uma aula que respeita o seu momento.</p><WhatsAppButton label="Agendar aula experimental" /></Reveal><div className="trial-image"><img src={gym.images.boxing} alt="Treino de boxe com movimento" loading="lazy" /><span>START<br />HERE</span></div><div className="steps"><div><b>01</b><span>Escolha seu horário</span></div><div><b>02</b><span>Conheça a academia</span></div><div><b>03</b><span>Faça sua aula</span></div><div><b>04</b><span>Comece sua jornada</span></div></div></section>

        <section className="faq section-pad" id="faq"><Reveal className="section-heading"><div><p className="eyebrow">08 / Perguntas</p><h2>Ficou<br /><span>curioso?</span></h2></div><p className="heading-note">As respostas que você<br />queria encontrar.</p></Reveal><div className="faq-list">{gym.faqs.map(([question, answer], index) => <div className={`faq-item ${activeFaq === index ? 'open' : ''}`} key={question}><button onClick={() => setActiveFaq(activeFaq === index ? null : index)}><span>{question}</span>{activeFaq === index ? <X size={18} /> : <Plus size={18} />}</button><AnimatePresence>{activeFaq === index && <motion.div className="faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{answer}</p></motion.div>}</AnimatePresence></div>)}</div></section>

        <section className="location section-pad" id="localizacao"><Reveal className="location-top"><p className="eyebrow">09 / Encontre a gente</p><span className="location-giant">SP</span></Reveal><div className="location-layout"><Reveal className="location-copy"><h2>Seu próximo<br /><span>movimento</span><br />começa aqui.</h2><div className="location-details"><div><MapPin size={18} /><p>Rua dos Pinheiros, 846<br />Pinheiros — São Paulo, SP</p></div><div><Clock3 size={18} /><p>Seg a sex / 06 — 23h<br />Sáb / 08 — 14h</p></div><div><Navigation size={18} /><p>Estacionamento conveniado<br />na rua ao lado</p></div></div><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Rua+dos+Pinheiros+846+São+Paulo" target="_blank" rel="noreferrer">Abrir no mapa <MoveUpRight size={16} /></a></Reveal><Reveal delay={.14} className="map-art"><div className="map-grid" /><div className="map-route"><span /><span /><span /></div><div className="map-pin"><Crosshair size={18} /></div><span className="map-label">ÁUREA<br /><small>PINHEIROS</small></span></Reveal></div></section>
      </main>

      <footer className="footer"><div className="footer-top"><a className="wordmark" href="#top"><span className="mark">A</span><span>Áurea</span></a><p>Treine com intenção.<br />Viva com presença.</p><WhatsAppButton label="Falar com a gente" /></div><div className="footer-bottom"><span>© 2024 Áurea. Todos os movimentos reservados.</span><a href="#top">Voltar ao topo ↑</a><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram</a></div></footer>
      <a className="whatsapp-float" href={`https://wa.me/${gym.whatsapp}?text=${encodeURIComponent('Olá! Vim pelo site e gostaria de agendar uma aula experimental.')}`} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp"><MessageCircle size={24} /></a>

      <AnimatePresence>{showBooking && <motion.div className="booking-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBooking(false)}><motion.div className="booking-modal" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowBooking(false)} aria-label="Fechar"><X size={20} /></button><p className="eyebrow">Seu primeiro passo</p><h2>Vamos encontrar<br /><span>seu horário.</span></h2><p>Chame nosso time e conte um pouco sobre o que você procura. A gente responde rápido.</p><WhatsAppButton label="Abrir WhatsApp" /></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}

export default App;
