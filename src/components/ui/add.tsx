const AddIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <div className="group relative w-10 h-10 hover:cursor-pointer">
      <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-green-500 transition-all duration-300 hover:bg-green-500">
        <svg
          className="w-6 h-6 text-green-500 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path
            d="M12 5v14M5 12h14"
            stroke="#25C55E"
            strokeWidth={2}
            className="group-hover:stroke-white"
          />
          <path
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default AddIcon;
