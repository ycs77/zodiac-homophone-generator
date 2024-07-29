import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'
import Forms from '@tailwindcss/forms'

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', ...fontFamily.sans],
        serif: ['"Noto Serif TC"', ...fontFamily.serif],
      },
    },
  },
  plugins: [
    Forms(),
  ],
} satisfies Config
