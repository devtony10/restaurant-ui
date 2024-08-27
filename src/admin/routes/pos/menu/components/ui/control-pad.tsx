const ControlPad = () => {
  const actions = [
    "Pricelist",
    "Customer Note",
    "Internal Note",
    "Bill",
    "Split",
    "Guests",
    "Transfer/Merge",
    "Refund",
    "Chibueze Ogbuji",
    "Save",
  ];

  return (
    <div className="w-full h-auto grid grid-cols-3 justify-between border-b">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`w-auto h-auto flex items-center justify-center line-clamp-2 whitespace-nowrap overflow-ellipsis px-2 py-2 ${
            index === actions.length - 1 ? "col-span-3" : "col-span-1"
          }`}
        >
          <span className="text-xsmall leading-xsmall font-bold me-1">{action}</span>
        </button>
      ))}
    </div>
  );
};

export default ControlPad;
