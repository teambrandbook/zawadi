import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const fadeIn = (selector: string) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector);

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0 }, // start
      {
        opacity: 1,   // end
        duration: 3.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
      }
    );
  });
};



// ----------------------------------


export const zoomInStagger = (selector: string) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector);

  if (elements.length === 0) return;

  gsap.fromTo(
    elements,
    {
      scale: 0.7,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 2,
      ease: "power3.out",
      stagger: 0.25,
      scrollTrigger: {
        trigger: elements[0], // first element triggers
        start: "top 80%",
        once: true,
      },
    }
  );
};

// -----------------------------------------------------


export const historySliderAnimation = (
  container: Element | null,
  direction: 1 | -1 = 1
) => {
  if (!container) return;

  const isMobile = window.matchMedia("(max-width: 1023px)").matches;
  const activeCard = container.querySelector<HTMLElement>(".active-card");
  const inactiveCards = container.querySelectorAll<HTMLElement>(".inactive-card");
  const activeText = container.querySelector<HTMLElement>(".active-text");
  const imageWrappers = container.querySelectorAll<HTMLElement>(".history-image");
  const dots = container.querySelectorAll<HTMLElement>(".timeline-dot");
  const activeDot = container.querySelector<HTMLElement>(".dot-active");

  gsap.killTweensOf([activeCard, activeText, activeDot, ...inactiveCards, ...imageWrappers, ...dots].filter(Boolean));

  gsap.set(dots, { scale: 1 });
  gsap.set(inactiveCards, isMobile ? { opacity: 0 } : { scale: 0.94, opacity: 1 });
  gsap.set(imageWrappers, { scale: 1 });

  if (activeCard) {
    gsap.fromTo(
      activeCard,
      isMobile
        ? {
          opacity: 0,
          x: direction > 0 ? 72 : -72,
        }
        : {
          scale: 0.975,
          opacity: 1,
          x: 24,
        },
      {
        scale: 1,
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: "power2.inOut",
        overwrite: "auto",
      }
    );
  }

  if (activeCard) {
    const activeImage = activeCard.querySelector<HTMLElement>(".history-image");

    if (activeImage) {
      gsap.fromTo(
        activeImage,
        {
          scale: 1.05,
        },
        {
          scale: 1,
          duration: 1,
          ease: "power2.inOut",
          overwrite: "auto",
        }
      );
    }
  }

  if (activeText) {
    gsap.fromTo(
      activeText,
      {
        y: 16,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.18,
        overwrite: "auto",
      }
    );
  }

  if (activeDot) {
    gsap.fromTo(
      activeDot,
      { scale: 1 },
      {
        scale: 1.14,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      }
    );
  }
};


// ----------------------------------------

export const imageAnimationtopdown = (selector: string) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector)

  elements.forEach((img) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: img,
        start: "top 80%",
        once: true
      }
    })

    tl.fromTo(
      img,
      {
        clipPath: "inset(0 0 100% 0)",
        autoAlpha: 0,
      },
      {
        clipPath: "inset(0 0 0% 0)",
        autoAlpha: 1,
        duration: 1,
        ease: "expo.inOut",
      }
    )
  })

}
// ---------------------------------------------------------

export const imageAnimationLeftToRight = (selector: string) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector)

  elements.forEach((img) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: img,
        start: "top 80%",
        once: true
      }
    })

    tl.fromTo(
      img,
      {
        clipPath: "inset(0 100% 0 0)", // hidden from left
        autoAlpha: 0,
      },
      {
        clipPath: "inset(0 0% 0 0)", // reveal to right
        autoAlpha: 1,
        duration: 1,
        ease: "expo.inOut",
      }
    )
  })
}


// -------------------------------------------------------




export const productCarouselAnimation = (
  container: HTMLElement,
  activeIndex: number,
  setAnimating: (val: boolean) => void
) => {
  const cards = container.querySelectorAll<HTMLElement>(".card");
  if (!cards.length) return;

  setAnimating(true);

  const total = cards.length;
  const isMobileScreen = window.matchMedia("(max-width: 639px)").matches;
  const isSmScreen = window.matchMedia(
    "(min-width: 640px) and (max-width: 1023px)"
  ).matches;
  const sideOffset = isMobileScreen ? 150 : isSmScreen ? 180 : 220;

  cards.forEach((card, i) => {
    let pos = i - activeIndex;

    if (pos > 1) pos -= total;
    if (pos < -1) pos += total;

    let x = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 10;

    // ✅ BIG CENTER CARD
    if (pos === 0) {
      x = 0;
      scale = 1.5;   // 🔥 bigger center
      opacity = 1;
      zIndex = 50;
    }

    // 👉 RIGHT CARD
    else if (pos === 1) {
      x = sideOffset;
      scale = 0.9;
      opacity = 0.6;
      zIndex = 20;
    }

    // 👉 LEFT CARD
      else if (pos === -1) {
        x = -sideOffset;
        scale = 0.9;
        opacity = 0.6;
        zIndex = 20;
      }

    // 👉 HIDDEN CARDS
    else {
      opacity = 0;
      scale = 0.7;
      zIndex = 0;
    }

    gsap.to(card, {
      x,
      scale,
      opacity,
      zIndex,
      duration: 0.95,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  });

  gsap.delayedCall(0.95, () => setAnimating(false));
};



// -----------------------------------------------------------

export const leftReveal = (selector: string) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector)

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      {
        x: -400,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    )
  })
}



// -------------------------------------------------------






/**
 * Renamed to animateSequence
 * selector: the class to target
 * delay: time in seconds to wait before starting
 */
export const animateSequence = (selector: string, delay: number = 0) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector);

  if (elements.length === 0) return;

  gsap.fromTo(
    elements,
    {
      scale: 0.7,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      delay: delay, // The key to sequencing
      ease: "power3.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: elements[0],
        start: "top 70%",
        once: true,
      },
    }
  );
};



// -----------------------------------------------------------


export const stackRecipeCards = (selector: string) => {
  const triggerIdPrefix = "recipe-stack-";
  const cards = gsap.utils.toArray<HTMLElement>(selector);
  const disableOnSmallScreen = window.matchMedia("(max-width: 639px)").matches;
  const topOffset = window.matchMedia("(max-width: 767px)").matches
    ? 70
    : window.matchMedia("(max-width: 1023px)").matches
      ? 96
      : 120;

  ScrollTrigger.getAll().forEach((trigger) => {
    if (
      typeof trigger.vars.id === "string" &&
      trigger.vars.id.startsWith(triggerIdPrefix)
    ) {
      trigger.kill();
    }
  });

  cards.forEach((card) => {
    const parentBackground =
      card.parentElement
        ? window.getComputedStyle(card.parentElement).backgroundColor
        : "";

    gsap.killTweensOf(card);
    gsap.set(card, {
      clearProps: "position,top,zIndex,opacity,visibility,willChange,transform",
      backgroundColor:
        parentBackground && parentBackground !== "rgba(0, 0, 0, 0)"
          ? parentBackground
          : "#ffffff",
    });
  });

  if (disableOnSmallScreen || cards.length < 2) {
    ScrollTrigger.refresh();
    return;
  }

  cards.forEach((card, i) => {
    const isLastCard = i === cards.length - 1;
    const nextCard = cards[i + 1];

    gsap.set(card, {
      position: isLastCard ? "relative" : "sticky",
      top: isLastCard ? "auto" : topOffset,
      zIndex: i + 1,
      willChange: "transform",
    });

    if (!isLastCard) {
      ScrollTrigger.create({
        id: `${triggerIdPrefix}${i}`,
        trigger: card,
        start: `top ${topOffset}px`,
        endTrigger: cards[cards.length - 1],
        end: "bottom bottom",
        invalidateOnRefresh: true,
      });
    }

    gsap.fromTo(
      card,
      {
        y: 32,
        scale: 0.985,
      },
      {
        y: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          id: `${triggerIdPrefix}-motion-${i}`,
          trigger: card,
          start: "top 88%",
          end: `top ${topOffset + 40}px`,
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      }
    );

    if (nextCard) {
      gsap.fromTo(
        card,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            id: `${triggerIdPrefix}-fade-${i}`,
            trigger: nextCard,
            start: "top 88%",
            end: "top 50%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }
  });

  ScrollTrigger.refresh();
};
