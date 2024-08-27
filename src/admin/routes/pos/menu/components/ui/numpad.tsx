const NumPad = () => {

  const buttons = [
    "1", "2", "3", "Qty",
    "4", "5", "6", "% Disc",
    "7", "8", "9", "Price",
    "+/-", "0", ".", "⌫"
  ];

  return <div className="w-full grid grid-cols-4 justify-between">
    {buttons.map((button, index) => (
      <button key={index} className="w-auto h-auto flex items-center justify-center">
        <span className="text-xsmall text-center justify-center leading-xsmall font-bold me-1 line-clamp-2 whitespace-nowrap">{button}</span>
      </button>
    ))}
  </div>;
};

export default NumPad;
