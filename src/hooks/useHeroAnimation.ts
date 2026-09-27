import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  initSmoothScroll,
  destroySmoothScroll,
} from '@/animations/smoothScroll';

import {
  playHeroEntry,
  createMouseInteraction,
  type HeroAnimationRefs,
} from '@/animations/heroAnimation';

import {
  initHeroScroll,
  type HeroScrollRefs,
} from '@/animations/heroScroll';

gsap.registerPlugin(ScrollTrigger);

export function useHeroAnimation() {
  const heroRef = useRef<HTMLElement>(null);
  const photoWrapRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLElement>(null);
  const toplineRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLElement>(null);

  const titleRefs = useRef<HTMLElement[]>([]);

  const heroBottomRef = useRef<HTMLElement>(null);
  const heroBottomPRef = useRef<HTMLElement>(null);
  const heroButtonRef = useRef<HTMLElement>(null);
  const sideNoteRef = useRef<HTMLElement>(null);
  const floatingCardRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const nextSectionRef = useRef<HTMLElement>(null);

  const addTitleRef = (
    el: HTMLElement | null,
  ) => {
    if (
      el &&
      !titleRefs.current.includes(el)
    ) {
      titleRefs.current.push(el);
    }
  };

  useEffect(() => {
    const hero = heroRef.current;
    const photoWrap = photoWrapRef.current;
    const photo = photoRef.current;
    const nextSection = nextSectionRef.current;

    if (
      !hero ||
      !photoWrap ||
      !photo ||
      !nextSection
    ) {
      return;
    }

    /*
     * LENIS
     */

    const lenis = initSmoothScroll();

    lenis.on(
      'scroll',
      ScrollTrigger.update,
    );

    gsap.ticker.lagSmoothing(0);

    /*
     * ENTRADA
     */

    const entryRefs: HeroAnimationRefs = {
      hero,
      photoWrap,
      photo,

      overlay: overlayRef.current!,
      topline: toplineRef.current!,
      eyebrow: eyebrowRef.current!,

      titleLines: titleRefs.current,

      heroBottom: heroBottomRef.current!,
      heroBottomP: heroBottomPRef.current!,
      heroButton: heroButtonRef.current!,

      sideNote: sideNoteRef.current!,
      floatingCard: floatingCardRef.current!,
      scroll: scrollRef.current!,
    };

    const tl = playHeroEntry(
      entryRefs,
    );

    /*
     * MOUSE
     *
     * Somente desktop com ponteiro preciso.
     */

    const isDesktop =
      window.matchMedia(
        '(min-width: 768px) and (pointer: fine)',
      ).matches;

    let mouse:
      | ReturnType<typeof createMouseInteraction>
      | null = null;

    if (isDesktop) {
      mouse = createMouseInteraction(
        photo,
        titleRefs.current,
        [
          floatingCardRef.current!,
          scrollRef.current!,
          sideNoteRef.current!,
        ],
      );

      window.addEventListener(
        'mousemove',
        mouse.onMove,
      );

      window.addEventListener(
        'mouseleave',
        mouse.onLeave,
      );
    }

    /*
     * SCROLL
     */

    const scrollRefs: HeroScrollRefs = {
      hero,
      photoWrap,
      photo,

      titleLines: titleRefs.current,

      heroBottom:
        heroBottomRef.current!,

      floatingCard:
        floatingCardRef.current!,

      scroll:
        scrollRef.current!,

      nextSection,
    };

    const cleanupScroll =
      initHeroScroll(scrollRefs);

    ScrollTrigger.refresh();

    /*
     * CLEANUP
     */

    return () => {
      tl.kill();

      cleanupScroll();

      if (mouse) {
        window.removeEventListener(
          'mousemove',
          mouse.onMove,
        );

        window.removeEventListener(
          'mouseleave',
          mouse.onLeave,
        );

        mouse.cleanup();
      }

      ScrollTrigger
        .getAll()
        .forEach((trigger) => {
          trigger.kill();
        });

      destroySmoothScroll();
    };
  }, []);

  return {
    heroRef,

    photoWrapRef,
    photoRef,

    overlayRef,
    toplineRef,
    eyebrowRef,

    addTitleRef,

    heroBottomRef,
    heroBottomPRef,
    heroButtonRef,

    sideNoteRef,
    floatingCardRef,
    scrollRef,

    nextSectionRef,
  };
}