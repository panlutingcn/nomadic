import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/svg+xml'

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="6" fill="#1d9e75" />
        <path
          d="M16 8L20 14H12L16 8Z M16 24L12 18H20L16 24Z"
          fill="white"
        />
      </svg>
    ),
    {
      ...size,
    }
  )
}
