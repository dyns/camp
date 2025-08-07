import { Link } from "react-router";

export function GitHubLogo() {
  return (
    <a
      href="https://github.com/dyns/camp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        height="32"
        aria-hidden="true"
        viewBox="0 0 24 24"
        version="1.1"
        width="32"
        data-view-component="true"
      >
        <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
      </svg>
    </a>
  );
}

// maybe make this link to a landing page, like how trello has, with screeenshoots and animations
export function CampLogo() {
  return (
    <Link to={"/trips"}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-label="Camp Home"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Campfire logs */}
        <rect
          x="8"
          y="25"
          width="16"
          height="3"
          rx="1.5"
          fill="#A0522D"
          transform="rotate(-15 8 25)"
        />
        <rect
          x="8"
          y="25"
          width="16"
          height="3"
          rx="1.5"
          fill="#8B4513"
          transform="rotate(15 16 26.5)"
        />
        {/* Fire flames */}
        <ellipse cx="16" cy="20" rx="4" ry="6" fill="#FFD580" />
        <ellipse cx="16" cy="19" rx="2.2" ry="3.5" fill="#FF8C42" />
        <ellipse cx="16" cy="18.5" rx="1.1" ry="2" fill="#FF3C00" />
        {/* Marshmallow on stick (left) */}
        <rect
          x="6"
          y="12"
          width="2"
          height="10"
          rx="1"
          fill="#8B5E3C"
          transform="rotate(-20 6 12)"
        />
        <rect
          x="4.5"
          y="10"
          width="3"
          height="3"
          rx="1"
          fill="#FFF8F0"
          stroke="#E0C9A6"
          strokeWidth="0.5"
        />
        {/* Marshmallow on stick (right) */}
        <rect
          x="24"
          y="12"
          width="2"
          height="10"
          rx="1"
          fill="#8B5E3C"
          transform="rotate(20 24 12)"
        />
        <rect
          x="24.5"
          y="10"
          width="3"
          height="3"
          rx="1"
          fill="#FFF8F0"
          stroke="#E0C9A6"
          strokeWidth="0.5"
        />
        {/* Smore (bottom right) */}
        <rect
          x="21"
          y="27"
          width="6"
          height="3"
          rx="1"
          fill="#FFF8F0"
          stroke="#E0C9A6"
          strokeWidth="0.5"
        />
        <rect x="21" y="29" width="6" height="1.2" rx="0.5" fill="#8B4513" />
        <rect x="21" y="30.2" width="6" height="1.2" rx="0.5" fill="#D2B48C" />
        {/* Smiling face on fire */}
        <ellipse cx="16" cy="21.5" rx="1.1" ry="0.5" fill="#000" />
        <circle cx="15" cy="20.5" r="0.25" fill="#000" />
        <circle cx="17" cy="20.5" r="0.25" fill="#000" />
      </svg>
    </Link>
  );
}
