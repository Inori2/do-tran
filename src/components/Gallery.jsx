import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import Projects from "../ui/Projects";

export default function Gallery() {
  return (
    <>
      <section className="gallery w-screen h-screen fixed z-30 bg-neutral-200">
        <div className="project-container"></div>
      </section>
    </>
  );
}
