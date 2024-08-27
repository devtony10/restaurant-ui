import { Stage, Container, Sprite, useTick } from "@pixi/react";
import Viewport from "./viewport";
import { useState } from "react";

const PixiStage = ({ width, height }) => {

  const RotatingBunny = () => {
    const [rotation, setRotation] = useState(0);
  
    useTick((delta) => delta && setRotation(rotation + 0.05 * delta));
  
    return (
      <Sprite
        image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
        anchor={0.5}
        scale={4}
        rotation={rotation}
      />
    );
  };
  
  return (
    <>
      <Stage
        width={width}
        height={height}
        onContextMenu={(e: { preventDefault: () => void; }) => {
          e.preventDefault();
        }}
        options={{
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
          backgroundColor: 0xebebeb,
          antialias: true,
        }}
      >
        <Viewport>
          <Container>
            <RotatingBunny />
          </Container>
        </Viewport>
      </Stage>
    </>
  );
};

export default PixiStage;
