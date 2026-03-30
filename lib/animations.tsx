import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)




export const stackScroll = (selector: string) => {
  const sections = gsap.utils.toArray<HTMLElement>(selector);

  sections.forEach((section, i) => {
    if (i === sections.length - 1) return;

    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: false,
        scrub: true,
      },
    });
  });
  ScrollTrigger.refresh();
};



export const fadeUp = (selector: string) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector)

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true
        }
      }
    )
  })
}

export const imageAnimation = (selector: string) => {
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
        duration: 2,
        ease: "expo.inOut",
      }
    )
  })

}

export const imageAnimationLeft = (selector: string) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: elements[0], // start when first appears
      start: "top 50%",
      once: true,
    },
  });

  tl.fromTo(
    elements,
    {
      clipPath: "inset(0 100% 0 0)",
      autoAlpha: 0,
    },
    {
      clipPath: "inset(0 0% 0 0)",
      autoAlpha: 1,
      duration: 1.5,
      ease: "expo.out",
      stagger: 0.4,
    }
  );
};

export const buttonAnimation = (selector: string) => {

  const buttons = gsap.utils.toArray<HTMLElement>(selector)

  buttons.forEach((btn) => {

    const arrow = btn.querySelector(".btn-arrow")
    const text = btn.querySelector(".btn-text")

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: btn,
        start: "top 80%",
        once: true,
      }
    })

    tl.fromTo(
      btn,
      { width: "4rem" },
      { width: "11rem", duration: 1, ease: "power3.out" }
    )

    if (arrow) {
      tl.fromTo(
        arrow,
        { x: -20 },
        { x: 90, duration: 1, ease: "power3.out" },
        0
      )
    }


    if (text) {
      tl.fromTo(
        text,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5 },
        "-=0.5"
      )
    }

  })
}


export const zoomInItems = (selector: string) => {

  const items = gsap.utils.toArray<HTMLElement>(selector)

  gsap.fromTo(
    items,
    {
      scale: 0.5,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.2,
      scrollTrigger: {
        trigger: items[0],
        start: "top 60%",
      }
    }
  )
}


export const recipyButtonAnimation = (selector: string) => {
  const wrappers = gsap.utils.toArray<HTMLElement>(selector);

  wrappers.forEach((wrap) => {
    const detailBtn = wrap.querySelector<HTMLElement>(".detail-btn");
    const arrowBtn = wrap.querySelector<HTMLElement>(".arrow-btn");

    if (!detailBtn || !arrowBtn) return;

    gsap.set(wrap, { gap: "0rem" });
    gsap.set(detailBtn, { width: "4rem", opacity: 1 });
    gsap.set(arrowBtn, { x: -64, opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 100%",
        once: true,
      },
    });

    tl.to(
      detailBtn,
      {
        width: "12rem",
        duration: 1,
        ease: "power3.out",
      },
      0
    )
      .to(
        arrowBtn,
        {
          x: 0,
          duration: 1,
          ease: "power3.out",
        },
        0
      )
      .to(
        wrap,
        {
          gap: "1.5rem",
          duration: 1,
          ease: "power3.out",
        },
        0
      );
  });
};



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
        duration: 1,
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


export const zoomDeepAnimation = (selector: string) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector)

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true
        }
      }
    )
  })
}


export const borderDraw = (selector: string) => {
  const elements = gsap.utils.toArray<HTMLElement>(selector)

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      {
        clipPath: "inset(0 100% 0 0)"
      },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true
        }
      }
    )
  })
}


// ---------------------


// box line animation
export const dashBorderAnimation = (container: HTMLElement) => {
  const top = container.querySelector(".border-top");
  const right = container.querySelector(".border-right");
  const bottom = container.querySelector(".border-bottom");
  const left = container.querySelector(".border-left");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top bottom", // 👈 starts when component enters from bottom
      toggleActions: "play none none none", // play once
    },
    defaults: {
      duration: 1.2, // slow animation
      ease: "power2.out",
    },
  });

  tl.fromTo(
    top,
    { scaleX: 0 },
    { scaleX: 1, transformOrigin: "left" }
  )
    .fromTo(
      right,
      { scaleY: 0 },
      { scaleY: 1, transformOrigin: "top" }
    )
    .fromTo(
      bottom,
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: "right" }
    )
    .fromTo(
      left,
      { scaleY: 0 },
      { scaleY: 1, transformOrigin: "bottom" }
    );
};
// -------------------------------------------------------------





gsap.registerPlugin(ScrollTrigger);

export const storyScrollAnimation = (container: HTMLElement) => {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        sm: "(max-width: 767px)",
        md: "(min-width: 768px) and (max-width: 1023px)",
        lg: "(min-width: 1024px)",
      },
      (context) => {
        const { sm, md, lg } = context.conditions!;

        const cards = container.querySelectorAll(".story-card");
        const texts = container.querySelectorAll(".story-text");

        if (!cards.length || !texts.length) return;

        const total = cards.length;

        // Responsive values
        const spreadX = sm ? 65 : md ? 55 : 45;
        const rotationY = sm ? 75 : 60;
        const depthZ = sm ? -600 : -500;

        // Initial state
        cards.forEach((card, i) => {
          const text = texts[i];

          const xPercent = i === 0 ? 0 : i === 1 ? spreadX : -spreadX;
          const z = i === 0 ? 0 : depthZ;
          const rotateY = i === 0 ? 0 : i === 1 ? -rotationY : rotationY;
          const opacity = i === 0 ? 1 : 0.35;
          const scale = i === 0 ? 1 : 0.75;
          const zIndex = i === 0 ? 50 : 10;

          gsap.set(card, {
            xPercent,
            z,
            rotateY,
            opacity,
            scale,
            zIndex,
          });

          gsap.set(text, {
            opacity: i === 0 ? 1 : 0,
            y: i === 0 ? 0 : 20,
          });
        });

        // ScrollTrigger settings (FIXED like your code)
        let startValue = "top 20%";
        let endValue = "bottom+=300 75%"; // ✅ FIX

        if (sm) {
          startValue = "top 18%";
        } else if (md) {
          startValue = "top 25%";
        } else if (lg) {
          startValue = "top top";
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,

            start: startValue, // ✅ no early start
            end: "+=1500", // ✅ smooth scroll distance

            scrub: 1.2, // ✅ super smooth (key)
            pin: true,

            anticipatePin: 1,
            invalidateOnRefresh: true,

            fastScrollEnd: true, // ✅ fix fast scroll jump
            preventOverlaps: true, // ✅ avoid glitches
            pinSpacing: true, // ✅ fix layout jump

            refreshPriority: 1, // ✅ important for stability
          },
        });

        const step = 1;

        for (let i = 0; i < total - 1; i++) {
          tl.to(
            cards,
            {
              xPercent: (index: number) => {
                const pos = (index - i - 1 + total) % total;
                if (pos === 0) return 0;
                if (pos === 1) return spreadX;
                return -spreadX;
              },
              rotateY: (index: number) => {
                const pos = (index - i - 1 + total) % total;
                if (pos === 0) return 0;
                if (pos === 1) return -rotationY;
                return rotationY;
              },
              z: (index: number) => {
                const pos = (index - i - 1 + total) % total;
                return pos === 0 ? 0 : depthZ;
              },
              scale: (index: number) => {
                const pos = (index - i - 1 + total) % total;
                return pos === 0 ? 1 : 0.75;
              },
              opacity: (index: number) => {
                const pos = (index - i - 1 + total) % total;
                return pos === 0 ? 1 : 0.35;
              },
              zIndex: (index: number) => {
                const pos = (index - i - 1 + total) % total;
                return pos === 0 ? 50 : 10;
              },
              duration: step,
              ease: "power2.inOut",
            }
          );

          // Text animation
          tl.to(texts[i], { opacity: 0, y: -20, duration: 0.3 }, "<");
          tl.to(texts[i + 1], { opacity: 1, y: 0, duration: 0.3 }, "<");
        }
      }
    );
  }, container);

  return () => {
    ctx.revert();
    ScrollTrigger.refresh(); // ✅ important
  };
};





export const waveFillAnimation = (
  path: SVGPathElement,
  type: "top" | "bottom"
) => {
  const width = 1200;
  const height = 100;
  const segments = 30;
  const amplitude = 15;

  let frame = 0;

  const generatePath = () => {
  const baseY = type === "top" ? 85 : 15; // pushed harder to edges

  let d = `M-10 ${type === "top" ? -20 : height + 20}`; // deeper corner

  d += ` L -10 ${baseY}`;

  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const y = baseY + Math.sin(i * 0.5 + frame) * amplitude;
    d += ` L ${x} ${y}`;
  }

  d += ` L ${width + 10} ${baseY}`;
  d += ` L ${width + 10} ${type === "top" ? -20 : height + 20} Z`; // deeper corner

  return d;
};

  const update = () => {
    frame += 0.02;
    path.setAttribute("d", generatePath());
  };

  gsap.ticker.add(update);
  return () => gsap.ticker.remove(update);
};