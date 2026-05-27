// export const DEFAULT_BLUR_DATA_URL =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+Z+hHgAHfwJ364969wAAAABJRU5ErkJggg==";

export const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;base64," +
  Buffer.from(
    `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#7C2D12"/>
          <stop offset="100%" stop-color="#530A0A"/>
        </radialGradient>
      </defs>
      <rect width="40" height="40" fill="url(#g)"/>
    </svg>
  `,
  ).toString("base64");
