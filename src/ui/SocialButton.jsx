import { useEffect, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";

gsap.registerPlugin(SplitText);

export default function SocialButton(props) {
  const { Text = "Text Link", Link = "https://google.com", ref } = props;
  const [split, setSplit] = useState(null);

  useEffect(() => {
    if (ref?.current) {
      // Create SplitText once DOM is ready
      const splitInstance = new SplitText(ref.current.querySelectorAll("a"), {
        type: "chars, words",
      });
      setSplit(splitInstance);

      return () => {
        splitInstance.revert();
      };
    }
  }, [ref]);

  const handleMouseEnter = () => {
    if (!split) return;
    gsap.to(split.chars, {
      yPercent: -100,
      duration: 0.25,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    if (!split) return;
    gsap.to(split.chars, {
      yPercent: 0,
      duration: 0.25,
      ease: "power1.inOut",
    });
  };

  return (
    <div
      className="link-container overflow-hidden h-[0.8rem] w-fit"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="link relative" ref={ref}>
        {[...Array(2)].map((_, i) => (
          <a
            key={i}
            href={Link}
            target="_blank"
            className="text-base font-medium block uppercase text-neutral-400"
            style={{ lineHeight: 0.85 }}
          >
            {Text}
          </a>
        ))}
      </div>
    </div>
  );
}
