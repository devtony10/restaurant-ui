import OrderWidget from "./ui/order-widget";
import ActionPad from "./ui/action-pad";
import ControlPad from "./ui/control-pad";
import NumPad from "./ui/numpad";

const Order = () => {
  return (
    <div className="w-full h-full flex flex-col small:w-[30%] min-w-64 small:border-r">
      <OrderWidget />
      <Pads />
    </div>
  );
};

const Pads = () => {
  return (
    <div className="w-full flex flex-col items-start pt-1 border-t">
      <ControlPad />
      <SubPads />
    </div>
  );
};

const SubPads = () => {
  return (
    <div className="w-full flex">
      <ActionPad />
      <NumPad />
    </div>
  );
};

export default Order;