export function createUserPin(): HTMLElement {
  const element = document.createElement("div");

  element.style.width = "30px";
  element.style.height = "42px";

  element.style.filter = "drop-shadow(0 0 3px rgba(217, 119, 6, 0.25))";

  element.innerHTML = `
    <svg
      width="30"
      height="42"
      viewBox="0 0 44 62"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="user-pin-amber"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stop-color="#d97706" />
          <stop offset="100%" stop-color="#b45309" />
        </linearGradient>
      </defs>

      <path
        d="M22 2 C11 2 3 10 3 21
           C3 35 22 58 22 58
           S41 35 41 21
           C41 10 33 2 22 2Z"
        fill="url(#user-pin-amber)"
        stroke="#06b6d4"
        stroke-width="1.5"
      />

      <circle
        cx="22"
        cy="21"
        r="11"
        fill="#082032"
      />

      <circle
        cx="22"
        cy="21"
        r="8"
        fill="#0891b2"
        stroke="#22d3ee"
        stroke-width="1"
      />
    </svg>
  `;

  return element;
}
