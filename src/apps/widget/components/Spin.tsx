const Spin = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-cy="reporter-running-icon"
    className="fa-spin"
  >
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="#E1E3ED"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon-light"
    ></circle>
    <path
      d="M14 8C14 4.68629 11.3137 2 8 2"
      stroke="#6470F3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon-dark"
    ></path>
  </svg>
);

export default Spin;
