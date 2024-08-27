"use client";

// import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import PixiStage from "./components/pixi/stage";

// const PixiStage = dynamic(() => import("./components/pixi/stage"), {
//   ssr: false
// });

const TableLayout = () => {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setStageSize({ width, height });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
    {/* <NavBar /> */}
      <div className="flex flex-col overflow-scroll w-full h-full">
        {/* <ToolBar /> */}
        <div ref={containerRef} className="flex w-full h-full border">
          <div>
            <PixiStage width={stageSize.width} height={stageSize.height} />
          </div>
        </div>
      </div>
    </>
  );
};

export default TableLayout;