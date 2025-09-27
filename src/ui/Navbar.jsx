import { useRef, useEffect } from "react";
import gsap from "gsap";
import SocialButton from "./SocialButton";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(SplitText);

export default function Navbar({ isPreloaderDone }) {
  const facebookRef = useRef(null);
  const instaRef = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {}, [isPreloaderDone]);
  return (
    <>
      <header
        className="w-screen h-fit p-5 flex justify-between items-center text-neutral-50 fixed top-0 mix-blend-difference z-40"
        data-speed="0"
      >
        <div className="nav-container flex items-baseline gap-2 overflow-hidden">
          <div
            className="text-container uppercase font-bold text-base"
            style={{ lineHeight: 0.85 }}
          >
            reach out/
          </div>
          <nav className="flex flex-col gap-1.5">
            <SocialButton
              Text="Facebook"
              Link="https://www.facebook.com/ddoo.td"
              ref={facebookRef}
            />
            <SocialButton
              Text="Instagram"
              Link="https://www.instagram.com/_ddoo.ng/"
              ref={instaRef}
            />
          </nav>
        </div>
        <div
          className="text-wrapper text-base font-bold text-right uppercase leading-4"
          ref={paragraphRef}
        >
          Open for
          <br /> collaboration
        </div>
      </header>
    </>
  );
}
