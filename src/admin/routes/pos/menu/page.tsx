import clsx from "clsx"
import { PropsWithChildren, useState } from "react";
import Order from "./components/order";
import Product from "./components/product";

const Menu = () => {
  return (
    <div className="rounded-rounded bg-ui-bg-base flex h-full w-full flex-col border border-ui-border-base min-h-[350px]">
      <Desktop>
        <Order />
        <Product />
      </Desktop>
      <Mobile />
    </div>
  );
};

const Desktop = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-full hidden small:flex">{children}</div>
  );
};

const Mobile = () => {

  const [view, setView] = useState("orders");

  const switchView = (widget: string) => {
    setView(widget);
  };

  return (
    <div className="w-full h-full flex small:hidden">
      {view === "products" ? <Product /> : <Order />}
    </div>
  );
};

export default Menu;
