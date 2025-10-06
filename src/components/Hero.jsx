import { useRef, useEffect } from "react";
import gsap from "gsap";
import SocialButton from "../ui/SocialButton";

export default function Hero({ Text = "Do Tran", isPreloaderDone = false }) {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const infoRef = useRef([]);
  const socialRef = useRef(null);

  useEffect(() => {
    if (isPreloaderDone && heroRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // make sure everything starts hidden
      gsap.set([headingRef.current, infoRef.current, socialRef.current], {
        yPercent: 100,
        opacity: 0,
      });

      // stagger in sequence
      tl.to(headingRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
      })
        .to(
          infoRef.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.2,
          },
          "-=0.6" // overlap with heading animation slightly
        )
        .to(
          socialRef.current,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
          },
          "-=0.5"
        );
    }
  }, [isPreloaderDone]);

  return (
    <div
      ref={heroRef}
      className="fixed bottom-0 py-5 pr-5 mix-blend-difference z-10 w-full overflow-hidden"
    >
      <div className="grid grid-cols-2 w-full items-end">
        <div
          ref={headingRef}
          className="heading font-secondary text-8xl lg:text-9xl text-neutral-50 select-none leading-20 col-span-1 mr-auto"
        >
          {Text}
        </div>

        <div className="infor-wrapper w-full grid grid-cols-3 gap-20 col-span-1 items-center">
          {["PHOTOGRAPHER", "FOLIO ©2025"].map((text, i) => (
            <div
              key={i}
              ref={(el) => (infoRef.current[i] = el)}
              className="hidden md:block items col-span-1 w-full text-neutral-50 text-center"
            >
              {text}
            </div>
          ))}

          <div
            ref={socialRef}
            className="item col-span-1 w-full place-items-center"
          >
            <SocialButton Text="Made by Sang" />
          </div>
        </div>
      </div>
    </div>
  );
}
