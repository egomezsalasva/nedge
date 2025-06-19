const ClosedIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="20" height="20" fill="white" />
      <path
        d="M10 5C13.1887 5 16.0852 6.92149 17.8584 10C16.0852 13.0785 13.1886 15 10 15C6.8112 15 3.91381 13.0787 2.14062 10C3.85571 7.02213 6.62249 5.12684 9.6875 5.00586L10 5Z"
        stroke="black"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 7C11.6569 7 13 8.34315 13 10C13 11.6569 11.6569 13 10 13C8.34315 13 7 11.6569 7 10C7 8.34315 8.34315 7 10 7ZM10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9Z"
        fill="black"
      />
    </svg>
  );
};

export default ClosedIcon;
