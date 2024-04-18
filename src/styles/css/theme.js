import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import "@fortune-sheet/react/dist/index.css"

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;