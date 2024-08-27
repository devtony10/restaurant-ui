import { ArrowRightMini } from "@medusajs/icons";


const ActionPad = () => {
  return (
    <div className="flex flex-col flex-grow-1 w-auto h-full p-0 border-r">
      <button className="flex items-center align-middle text-center font-medium leading-xsmall px-8 py-1 border-b m-0 text-xsmall">
        Payment
      </button>
      <button className="flex flex-auto flex-col h-full items-center align-middle text-center justify-center font-bold text-xsmall leading-xsmall px-4">
        <ArrowRightMini className="flex" />
        Order
        <div className="w-full text-small font-normal overflow-hidden border line-clamp-2" />
        <div className="flex w-auto justify-start my-1 gap-0 text-xsmall leading-xsmall font-normal">
          <label className="text-truncate ps-0 overflow-hidden whitespace-nowrap text-ellipsis pl-0">
            Drinks
          </label>
        </div>
        <div className="flex w-auto justify-start my-1 text-xsmall leading-xsmall font-normal">
          <label className="text-truncate ps-0 overflow-hidden whitespace-nowrap text-ellipsis pl-0">
            Food
          </label>
        </div>
      </button>
    </div>
  );
};

export default ActionPad;
