const Arrow = ({
  className,
  style,
  dataTestId,
}: {
  className?: string;
  style?: React.CSSProperties;
  dataTestId?: string;
}) => {
  return (
    <svg
      width="9"
      height="16"
      viewBox="0 0 9 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      data-testid={dataTestId}
    >
      <path
        d="M7.99997 1L1.70708 7.29289C1.31655 7.68342 1.31655 8.31658 1.70708 8.70711L7.99997 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Arrow;
