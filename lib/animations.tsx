import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

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
                    duration: 1.2,
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


