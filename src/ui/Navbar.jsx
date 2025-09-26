import { useRef } from "react";
import SocialButton from "./SocialButton";

export default function Navbar() {
  const facebookRef = useRef(null);
  const instaRef = useRef(null);
  return (
    <>
      <header className="w-screen h-fit p-5 flex justify-between items-center text-neutral-50 fixed mix-blend-difference z-40">
        <div className="nav-container flex items-baseline gap-2">
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
        <div className="text-wrapper text-base font-bold text-right uppercase leading-4">
          Open for
          <br /> collaboration
        </div>
      </header>
    </>
  );
}
