import { useRef, useEffect } from "react";
import gsap from "gsap";
import SocialButton from "../ui/SocialButton";

export default function Hero({ Text = "Do Tran", isPreloaderDone = false }) {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const infoRef = useRef([]);
  const socialRef = useRef(null);

  useEffect(() => {
    gsap.set(heroRef.current, {
      autoAlpha: 0,
    });
    if (isPreloaderDone && heroRef.current) {
      gsap.to(heroRef.current, {
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out",
      });
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

          <div className="item col-span-1 w-full place-items-center">
            <SocialButton Text="Made by Sang" ref={socialRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
