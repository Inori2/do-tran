import { useRef, useEffect } from "react";
import SocialButton from "../ui/SocialButton";

export default function Hero({ Text = "Do Tran" }) {
  const SocialRef = useRef(null);

  useEffect(() => {}, []);

  return (
    <>
      <div className="fixed bottom-0 py-5 pr-5 mix-blend-difference z-10 w-full">
        <div className="grid grid-cols-2 w-full items-end">
          <div className="heading font-secondary text-8xl lg:text-9xl text-neutral-50 select-none leading-20 col-span-1 mr-auto">
            {Text}
          </div>
          <div className="infor-wrapper w-full grid grid-cols-3 gap-20 col-span-1 items-center">
            <div className="hidden md:block items col-span-1 w-full text-neutral-50 text-center">
              PHOTOGRAPHER
            </div>
            <div className="hidden md:block items col-span-1 w-full text-neutral-50 text-center">
              FOLIO ©2025
            </div>
            <div className="item col-span-1 w-full place-items-center">
              <SocialButton Text="Made by Sang" ref={SocialRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
