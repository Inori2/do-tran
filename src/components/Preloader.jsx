import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

export default function Preloader({ setIsPreloaderDone = () => {} }) {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const squareRef = useRef(null);
  const imgRef = useRef([]);
  const preloaderImg = [
    "/img/1.webp",
    "/img/2.webp",
    "/img/3.webp",
    "/img/4.webp",
    "/img/5.webp",
    "/img/6.webp",
    "/img/7.webp",
    "/img/8.webp",
    "/img/9.webp",
  ];
  const isBoxActivatedRef = useRef(false);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !squareRef.current) return;

    const split = new SplitText(containerRef.current.children, {
      type: "chars, words",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsPreloaderDone(true);
      },
    });

    tlRef.current = tl;

    tl.from(split.chars, {
      opacity: 1,
      yPercent: 100,
      duration: 1,
      ease: "expo.out",
    })
      .to(split.chars, {
        opacity: 0,
        duration: 1,
        ease: "power1.in",
        yoyo: true,
        repeat: 3,
        delay: 0.5,
      })
      .to(split.chars, {
        opacity: 1,
        yPercent: -100,
        duration: 1,
        ease: "expo.out",
      })
      .to(
        split.words,
        {
          yPercent: -130,
          duration: 1,
          ease: "expo.in",
          delay: 0.2,
          stagger: 0.1,
        },
        "-=0.6"
      )
      .to(
        squareRef.current,
        {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.3,
          ease: "power1.in",
        },
        "-=0.3"
      )
      .to(sectionRef.current, {
        autoAlpha: 0,
        duration: 0.8,
        ease: "power1.in",
      });

    gsap.set(squareRef.current, {
      clipPath: "inset(0% 0% 100% 0%)",
    });

    gsap.set(imgRef.current[0], {
      opacity: 1,
      zIndex: 2,
    });

    const animateImages = () => {
      const images = imgRef.current.slice(1);
      const reversed = [...images].reverse();

      gsap.set(imgRef.current[0], { zIndex: 0, opacity: 1, scale: 1 });
      gsap.set(reversed, { opacity: 1, scale: 1.2 });

      reversed.forEach((img, index) => {
        gsap.to(img, {
          scale: 1,
          duration: 0.8,
          ease: "power1.out",
          delay: index * 0.3,
          onStart: () => {
            gsap.set(img, { zIndex: 10 + index });
          },
        });
      });
    };

    const handleFirstMouseMove = (e) => {
      const { clientX, clientY } = e;

      if (!isBoxActivatedRef.current) {
        gsap.set(squareRef.current, {
          x: clientX + 20,
          y: clientY + 20,
          clipPath: "inset(0% 0% 100% 0%)",
        });

        gsap.to(squareRef.current, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.6,
          ease: "power2.out",
          onComplete: animateImages,
        });

        isBoxActivatedRef.current = true;
        window.removeEventListener("mousemove", handleFirstMouseMove);
      }
    };

    window.addEventListener("mousemove", handleFirstMouseMove);

    const handleMouseMove = (e) => {
      if (!isBoxActivatedRef.current) return;
      const { clientX, clientY } = e;

      gsap.to(squareRef.current, {
        x: clientX + 20,
        y: clientY + 20,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleFirstMouseMove);
      window.removeEventListener("mousemove", handleMouseMove);
      split.revert();
    };
  }, [setIsPreloaderDone]);

  return (
    <section
      className="preloader select-none fixed z-50 bg-neutral-50"
      ref={sectionRef}
    >
      <div className="relative w-screen h-screen flex justify-center items-center p-5">
        <div
          ref={squareRef}
          className="hidden lg:block h-20 w-20 bg-neutral-950 absolute top-0 left-0 pointer-events-none overflow-hidden"
        >
          <div className="img-container w-full h-full object-cover aspect-square relative">
            {preloaderImg.map((src, index) => (
              <img
                key={index}
                src={src}
                ref={(el) => (imgRef.current[index] = el)}
                alt={`preloader-img-${index}`}
                className="absolute inset-0 opacity-0"
              />
            ))}
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex flex-col items-center overflow-hidden h-[20px] gap-0"
        >
          <span className="text-l text-neutral-600 font-medium leading-5 flex items-center">
            LOADING...
          </span>
          <span className="text-l text-neutral-600 font-medium leading-5">
            FOLIO ©2025
          </span>
        </div>
      </div>
    </section>
  );
}
