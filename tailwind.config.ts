import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';
import themes from 'daisyui/src/theming/themes';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['"Inter"', ...defaultTheme.fontFamily.sans]
    },
    extend: {
      colors: {
        lotion: '#FBFBFB',
        charcoal: '#344054',
        'dark-charcoal': '#323335',
        'black-olive': '#3F3E3D',
        green: '#00D67C',
        'ghost-white': '#F7F9FB',
        'jordy-blue': '#95A4FC',
        'purple-taupe': '#464255',
        'soft-cream': '#FFFCF5',
        'hard-cream': '#F9DF98',
        'yellow-500': '#CDA027',
        red: {
          base: '#FF3E03',
          danger: {
            2: '#F99898'
          }
        },
        black: {
          base: '#000000',
          eerie: '#1C1C1C',
          neutral: {
            3: '#EDEDF2',
            4: '#D6D6D6'
          },
          100: '#E7E7E7'
        },
        blue: {
          400: '#4040E9',
          vista: '#8A8CD9',
          dark: {
            electric: '#546881',
            imperial: '#0A1481'
          }
        },
        orange: {
          base: '#D49A07'
        },
        primal: {
          base: '#281995',
          0: '#F6F5FF',
          300: '#7F70F2'
        },
        gray: {
          granite: '#676767'
        },
        caramel: '#F9DD98',
        silver: {
          american: '#CFCFCE'
        }
      },
      width: {
        max: '70%',
        min: '35%'
      },
      spacing: {
        small: '1.5rem',
        medium: '2.5rem',
        large: '3.5rem'
      },
      fontFamily: {
        poppins: ['"Poppins"', ...defaultTheme.fontFamily.sans]
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%'
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...themes['light'],
          primary: '#FCC01C',
          'primary-content': '#FFFFFF'
        }
      }
    ]
  }
} satisfies Config;
