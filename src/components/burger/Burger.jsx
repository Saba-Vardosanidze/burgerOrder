import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Burger = () => {
  const containerRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch("popCorn.svg");
        const svgText = await response.text();

        if (containerRef.current) {
          containerRef.current.innerHTML = svgText;

          const svgElement = containerRef.current.querySelector("svg");
          if (svgElement) {
            svgElement.setAttribute("preserveAspectRatio", "xMidYmid slice");
            requestAnimationFrame(() => setSvgLoaded(true));
          }
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    loadSvg();
  }, []);

  useGSAP(
    () => {
      if (!svgLoaded) return;

      const svg = containerRef.current.querySelector("svg");

      if (svg) {
        gsap.set(["#greenPopCorn", "#pinckPopCorn"], {
          opacity: 0,
        });
      }
      const runAnimation = gsap.timeline({ paused: true });

      runAnimation
        .addLabel("start")
        .add([
          gsap.to("#pinckPopCorn", {
            opacity: 1,
            duration: 1.5,
            ease: "power1.out",
          }),
        ])
        .addLabel("purplePop")
        .add([
          gsap.to("#greenPopCorn", {
            opacity: 1,
            duration: 1,
            ease: "power1.out",
          }),
        ])
        .addLabel("greenPop");

      animationRef.current = runAnimation;
      return () => {
        if (animationRef.current) {
          animationRef.current.kill();
        }
      };
    },
    { scope: containerRef, dependencies: [svgLoaded] }
  );

  const handlButtonClick = (label) => {
    if (animationRef.current) {
      animationRef.current.tweenTo(label);
    }
  };

  const resetToBase = () => {
    if (animationRef.current) {
      gsap.to(["#greenPopCorn", "#pinckPopCorn"], {
        opacity: 0,
        duration: 1.5,
        ease: "power1.out",
        onComplete: () => {
          animationRef.current.seek(0);
        },
      });
    }
  };

  return (
    <div title="test">
      <div
        ref={containerRef}
        className="bg-gray-100ma w-full [&>svg]:w-full max-w-[763px] h-screen [&>svg]:h-full min-h-[706px] [&>svg]:object-center overflow-hidden"
      ></div>
      {!svgLoaded && <div>Loading . . .</div>}
      <div className="top-20 left-6 z-50 flex flex-col gap-3">
        <button
          className="bg-red-400 p-5 rounded-[15px] cursor-pointer"
          onClick={() => handlButtonClick("purplePop")}
        >
          BurgerTop
        </button>
        <button
          className="bg-red-400 p-5 rounded-[15px] cursor-pointer"
          onClick={() => handlButtonClick("greenPop")}
        >
          green
        </button>
        <button
          className="bg-blue-400 p-5 rounded-[15px] cursor-pointer"
          onClick={resetToBase}
        >
          Reset to Base
        </button>
      </div>
    </div>
  );
};

export default Burger;
