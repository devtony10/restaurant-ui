import React from "react";
import data from "../../data/line-items.json";

const convertToDecimal = (amount: number) => {
  return Math.floor(amount) / 100;
};

const formatPrice = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(convertToDecimal(amount));
};

interface LineItem {
  title: string;
  quantity: number;
  sku: string;
  unit_price: number;
  tax_lines: Array<{
    rate: number;
    amount: number;
  }>;
}

const lineItems: LineItem[] = data["line-items"];

const OrderWidget = () => {
  return (
    <>
      <div className="w-full h-full overflow-y-auto flex flex-grow-1 flex-col items-start">
        {lineItems.map((line, id) => (
          <OrderLine key={id} {...line} />
        ))}
      </div>
      <div className="w-full flex flex-col px-3 py-2 items-end text-end font-bold leading-xsmall text-xsmall">
        {lineItems?.length > 0 ? (
          <>
            <span className="flex items-center">{`Total: ${formatPrice(
              lineItems.reduce(
                (total, item) => total + item.quantity * item.unit_price,
                0
              )
            )}`}</span>
            <div className="w-full flex flex-col items-end text-end font-bold leading-xsmall text-xsmall text-ui-fg-muted pb-1">
              <span>{`Taxes: ${formatPrice(
                lineItems.reduce((total, item) => {
                  return (
                    total +
                    item.tax_lines.reduce(
                      (taxTotal, tax) => taxTotal + tax.amount,
                      0
                    )
                  );
                }, 0)
              )}`}</span>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

interface LineItemProps {
  quantity: number;
  title: string;
  unit_price: number;
  sku: string;
}

const OrderLine: React.FC<LineItemProps> = ({
  quantity,
  title,
  unit_price,
  sku,
}) => {
  const formattedTotalPrice = formatPrice(quantity * unit_price);

  return (
    <li className="w-full flex flex-col px-2 py-2 cursor-pointer list-none text-xsmall leading-xsmall">
      <div className="flex justify-between gap-y-1">
        <div className="flex flex-grow-1 line-clamp-2 whitespace-nowrap overflow-ellipsis">
          <span className="flex font-bold text-start items-start">{title}</span>
        </div>
        <div className="flex font-bold text-end items-end">
          {formattedTotalPrice === "0" ? "Free" : formattedTotalPrice}
        </div>
      </div>
      <ul className="w-full flex flex-col items-start gap-y-1 ms-2">
        <li className="w-full flex items-start text-start pb-1">
          <p className="font-bold me-1">{`${quantity}`}</p>
          <p>
            {`${sku}(s) x ${formatPrice(unit_price)}/${sku}`}
            {/* add oldprice, discount attributes */}
          </p>
        </li>
        {/* add customer, internal note list item */}
      </ul>
    </li>
  );
};

export default OrderWidget;
