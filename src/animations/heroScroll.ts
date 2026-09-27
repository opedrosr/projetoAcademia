import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface HeroScrollRefs {
  hero: HTMLElement;
  photoWrap: HTMLElement;
  photo: HTMLElement;
  titleLines: HTMLElement[];
  heroBottom: HTMLElement;
  floatingCard: HTMLElement;
  scroll: HTMLElement;
  nextSection: HTMLElement;
}

export function initHeroScroll(
  refs: HeroScrollRefs,
): () => void {
  const {
    hero,
    photoWrap,
    photo,
    titleLines,
    heroBottom,
    floatingCard,
    scroll,
    nextSection,
  } = refs;

  const reduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  if (reduced) {
    return () => {};
  }

  const triggers: ScrollTrigger[] = [];

  /*
   * HERO → PRÓXIMA SEÇÃO
   */

  const st1 = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8,

    onUpdate: (self) => {
      const p = self.progress;

      const eased = gsap.parseEase('power2.out')(p);

      /*
       * Pequena compressão do HERO
       */
      gsap.set(hero, {
        scale: 1 - eased * 0.018,
        transformOrigin: 'center top',
      });

      /*
       * Movimento de câmera sobre a fotografia
       */
      gsap.set(photoWrap, {
        scale: 1.02 + eased * 0.085,
        y: eased * 34,
      });

      /*
       * Motion trail / perda de definição
       */
      gsap.set(photo, {
        opacity: 1 - eased * 0.42,
        filter: `
          blur(${eased * 2.2}px)
          saturate(${1 - eased * 0.5})
        `,
      });

      /*
       * Tipografia sai em direção diferente da imagem
       */
      gsap.set(titleLines, {
        yPercent: -eased * 30,
        opacity: 1 - eased * 0.68,
      });

      /*
       * Texto inferior
       */
      gsap.set(heroBottom, {
        y: -eased * 42,
        opacity: 1 - eased * 1.15,
      });

      /*
       * Card flutuante
       */
      gsap.set(floatingCard, {
        x: eased * 48,
        y: -eased * 12,
        opacity: 1 - eased * 1.35,
      });

      /*
       * Indicador de scroll
       */
      gsap.set(scroll, {
        y: eased * 12,
        opacity: 1 - eased * 2,
      });
    },
  });

  triggers.push(st1);

  /*
   * ENTRADA DA PRÓXIMA SEÇÃO
   */

  const st2 = ScrollTrigger.create({
    trigger: nextSection,
    start: 'top 88%',
    end: 'top 30%',
    scrub: 0.8,

    onUpdate: (self) => {
      const p = self.progress;

      gsap.set(nextSection, {
        opacity: 0.2 + p * 0.8,
        y: (1 - p) * 42,
      });
    },
  });

  triggers.push(st2);

  return () => {
    triggers.forEach((trigger) => {
      trigger.kill();
    });
  };
}