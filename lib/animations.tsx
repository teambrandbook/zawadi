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

export const imageAnimation=(selector: string)=>{
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
        start: "top 80%",
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
        start: "top 80%",
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



export const dashBorderAnimation = (container: HTMLElement) => {
  const top = container.querySelector(".border-top");
  const right = container.querySelector(".border-right");
  const bottom = container.querySelector(".border-bottom");
  const left = container.querySelector(".border-left");

  const tl = gsap.timeline();

  tl.fromTo(
    top,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 0.6,
      ease: "power2.out",
      transformOrigin: "left",
    }
  )
    .fromTo(
      right,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.6,
        ease: "power2.out",
        transformOrigin: "top",
      }
    )
    .fromTo(
      bottom,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.6,
        ease: "power2.out",
        transformOrigin: "right",
      }
    )
    .fromTo(
      left,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.6,
        ease: "power2.out",
        transformOrigin: "bottom",
      }
    );
};

// -------------------------------------------------------------



export const productScrollAnimation = (container: HTMLElement) => {
  const cards = container.querySelectorAll(".card");
  const descs = container.querySelectorAll(".card .desc"); // ✅ get desc

  if (!cards.length || !descs.length) return;

  const total = cards.length;

  // initial positions
  cards.forEach((card, i) => {
    if (i === 0) {
      gsap.set(card, { x: "0%", scale: 1, opacity: 1, zIndex: 20 });
      gsap.set(descs[i], { opacity: 1 }); // ✅ show first desc
    } else if (i === 1) {
      gsap.set(card, { x: "50%", scale: 0.7, opacity: 0.4, zIndex: 10 });
    } else {
      gsap.set(card, { x: "-50%", scale: 0.7, opacity: 0.4, zIndex: 10 });
    }
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top 10%",
      end: "+=1000",
      scrub: true,
      pin: true,
    },
  });

  // loop animation
  for (let i = 0; i < cards.length - 1; i++) {
    tl.to(cards, {
      x: (index: number) => {
        const pos = (index - i - 1 + total) % total;

        if (pos === 0) return "0%";     
        if (pos === 1) return "50%";    
        return "-50%";                  
      },
      scale: (index: number) => {
        const pos = (index - i - 1 + total) % total;
        return pos === 0 ? 1 : 0.7;
      },
      opacity: (index: number) => {
        const pos = (index - i - 1 + total) % total;
        return pos === 0 ? 1 : 0.4;
      },
      zIndex: (index: number) => {
        const pos = (index - i - 1 + total) % total;
        return pos === 0 ? 20 : 10;
      },
      duration: 1,
      ease: "power2.inOut",
    });

    // ✅ TEXT FADE (this is the only addition)
    tl.to(descs[i], { opacity: 0, duration: 0.3 }, "<");
    tl.to(descs[i + 1], { opacity: 1, duration: 0.3 }, "<");
  }
};