import { extendTheme } from "@chakra-ui/react"
import { StyleFunctionProps } from '@chakra-ui/theme-tools'

const solidDisabled = {
  pointerEvents: "none",
  cursor: "not-allowed",
  opacity: 0.6,
}

const theme = extendTheme({
  components: {
    Input: {
      field: {

      }
    },

    Button: {
      variants: {
        solid: {
          backgroundColor: "blue.100",
          color: "white.200",
          _hover: { 
            opacity: 0.9,
            backgroundColor: "blue.100",
            color: "white.200",
            _disabled: {
              ...solidDisabled
            }
          },

          _active: {
            backgroundColor: "blue.100",
            color: "white.200",
          },

          _disabled: {
            ...solidDisabled,
          }

        },

        outline: {
          borderColor: "blue.100",
          borderSize: "1px",
          color: "blue.100",
          _hover: { 
            backgroundColor: "transparent",
            opacity: 0.9
          },
          _active: {
            backgroundColor: "transparent",
          }
        }

      }
    }
  },

  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Montserrat', sans-serif`,
  },
  colors: {
    blue: {
      100: "#2a29e8",
      200: "#140a44",
      300: "#00dcff",
      400: "#968de6"
    },
    gray: {
      100: "#9ca3af",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
    },

    white: {
      100: "#fefefe",
      200: "#faf7ef"
    },
    yellow: {
      100: "#f8e38e"
    },
    rose: {
      100: "#f8a68d"
    },
  },

  styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          color: 'default',
          bg: '#faf7ef',
        },
      }),
    },
})

export default theme;
