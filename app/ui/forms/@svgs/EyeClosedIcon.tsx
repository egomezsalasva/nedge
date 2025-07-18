const EyeClosedIcon = ({
  className,
  testId,
}: {
  className?: string;
  testId?: string;
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-testid={testId}
    >
      <rect width="20" height="20" fill="white" />
      <rect
        x="2.2218"
        y="3.63605"
        width="1"
        height="20"
        transform="rotate(-45 2.2218 3.63605)"
        fill="black"
      />
      <path
        d="M6.7832 6.7832C5.44487 7.46065 4.24612 8.55853 3.31152 10C4.9519 12.53 7.40688 14 10 14C11.1155 14 12.2045 13.7263 13.2148 13.2148L14.6875 14.6875C13.274 15.5265 11.6836 16 10 16C6.20331 16 2.87499 13.6024 1 10C2.04347 7.99519 3.53759 6.36444 5.31152 5.31152L6.7832 6.7832ZM10 4C13.7967 4 17.125 6.39759 19 10C18.1278 11.6758 16.9402 13.0897 15.5381 14.124L14.1045 12.6904C15.0848 12.0224 15.9651 11.114 16.6875 10C15.0471 7.47023 12.593 6 10 6C9.24266 6 8.49719 6.12565 7.78027 6.36621L6.23926 4.8252C7.408 4.29219 8.67541 4.00001 10 4Z"
        fill="black"
      />
      <path
        d="M9.29297 9.29297C9.112 9.47393 9 9.72386 9 10C9 10.5523 9.44772 11 10 11C10.2761 11 10.5261 10.888 10.707 10.707L12.1211 12.1211C11.5782 12.664 10.8284 13 10 13C8.34315 13 7 11.6569 7 10C7 9.17157 7.33601 8.4218 7.87891 7.87891L9.29297 9.29297ZM10 7C11.6569 7 13 8.34315 13 10C13 10.4626 12.8911 10.8988 12.7041 11.29L8.70898 7.29492C9.10038 7.10779 9.53723 7 10 7Z"
        fill="black"
      />
    </svg>
  );
};

export default EyeClosedIcon;
