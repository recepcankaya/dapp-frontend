export const RedBinIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <div className="group relative w-8 h-8">
      <svg
        className="relative w-full h-full text-red-500"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24">
        <path d="M9 3h6v2H9V3zm9 2V4h-4V2H8v2H4v1H2v2h2v15c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2V7h2V5h-2zM5 7h14v13H5V7z" />
      </svg>
      <svg
        className="absolute top-0 left-0 w-full h-full text-red-500 group-hover:rotate-45 transform transition-transform duration-300"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24">
        <rect x="8" y="2" width="8" height="2" />
      </svg>
    </div>
  );
};
