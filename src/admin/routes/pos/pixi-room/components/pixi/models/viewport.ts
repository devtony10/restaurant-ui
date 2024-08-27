import {
  IViewportOptions,
  PluginManager,
  Viewport as PixiViewport,
} from "pixi-viewport";

export class Viewport extends PixiViewport {
 
  public static viewPortPluginManager: PluginManager;

  constructor(options: IViewportOptions) {
    super(options);

    this.setup();
  }

  private setup() {
    Viewport.viewPortPluginManager = this.plugins;

    this.drag({ mouseButtons: "right" })
      .clamp({ direction: "all" })
      .pinch()
      .wheel()
      .clampZoom({ minScale: 1.0, maxScale: 6.0 });
  }
}