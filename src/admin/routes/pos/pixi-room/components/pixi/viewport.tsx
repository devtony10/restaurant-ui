import React from "react";
import { IViewportOptions } from "pixi-viewport";
import { Viewport as PixiViewport } from "./models/viewport";
import { PixiComponent, useApp } from "@pixi/react";
import { Application } from "@pixi/app";
import { EventSystem } from "@pixi/events";
import { DisplayObject } from "pixi.js";

export interface ViewportProps {
  children?: React.ReactNode;
  app?: Application;
}

const ViewportComponent = PixiComponent("Viewport", {
  create: (props: ViewportProps) => {
    const { app, ...viewportProps } = props;

    const events = new EventSystem(app.renderer);
    events.domElement = app.renderer.view as any;

    const viewportSettings: IViewportOptions = {
      screenWidth: app.stage.width,
      screenHeight: app.stage.height,
      worldWidth: 50 * 100,
      worldHeight: 50 * 100,
      events,
      // ticker: app.ticker,
    };

    const viewport = new PixiViewport({
      ...viewportSettings,
      ...viewportProps,
    });

    viewport.eventMode = "static";

    return viewport as DisplayObject;
  },
  didMount: () => {
    console.log("viewport mounted");
  },
});

const Viewport = (props: ViewportProps) => {
  const app = useApp();
  return <ViewportComponent app={app} {...props} />;
};

export default Viewport;