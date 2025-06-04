const Bookmark = ({
  className,
  style,
  fill,
}: {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
}) => {
  return (
    <svg
      width="19"
      height="21"
      viewBox="0 0 19 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M16.6 2H3C2.44772 2 2 2.44772 2 3V17.9691C2 18.7988 2.95209 19.2676 3.60971 18.7618L9.19029 14.469C9.54974 14.1925 10.0503 14.1925 10.4097 14.469L15.9903 18.7618C16.6479 19.2676 17.6 18.7988 17.6 17.9691V3C17.6 2.44772 17.1523 2 16.6 2Z"
        stroke="currentColor"
        fill={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Bookmark;
