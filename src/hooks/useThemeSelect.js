import {
  grey,
  lightBlue,
  lightGreen,
  orange,
  purple,
  teal,
} from "@mui/material/colors";
import { createTheme, experimental_sx as sx } from "@mui/material/styles";
import { useState } from "react";

const useThemeSelect = () => {
  const [
    {
      textColor,
      backGroundColor,
      primaryColor,
      secondaryColor,
      successColor,
      warningColor,
      infoColor,
      containerColor,
    },
  ] = useState({
    textColor: {
      light: grey[900],
      dark: grey[300],
    },
    backGroundColor: {
      light: grey[200],
      dark: grey[900],
    },
    primaryColor: {
      light: teal[300],
      dark: teal[900],
    },
    secondaryColor: {
      light: purple[300],
      dark: purple[900],
    },
    successColor: {
      light: lightGreen[300],
      dark: lightGreen[900],
    },
    warningColor: {
      light: orange[300],
      dark: orange[900],
    },
    infoColor: {
      light: lightBlue[300],
      dark: lightBlue[900],
    },
    containerColor: {
      light: grey[300],
      dark: grey[800],
    },
  });

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      primary: { main: primaryColor.light },
      secondary: { main: secondaryColor.light },
      success: { main: successColor.light },
      warning: { main: warningColor.light },
      info: { main: infoColor.light },
      background: {
        paper: backGroundColor.light,
        default: textColor.light,
      },
      text: {
        primary: textColor.light,
        secondary: grey[800],
      },
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.light,
          }),
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: sx({
            background: primaryColor.light,
          }),
        },
      },
      MuiStack: {
        styleOverrides: {
          root: sx({
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            backgroundColor: containerColor.light,
            borderRadius: 1.5,
            p: 2,
            py: 8,
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.light,
            borderRadius: "5px",
          }),
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.light,
            borderRadius: "5px",
          }),
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.light,
          }),
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.light,
          }),
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.light,
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: sx({
            backgroundColor: containerColor.light,
          }),
        },
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: { main: primaryColor.dark },
      secondary: { main: secondaryColor.dark },
      warning: { main: warningColor.dark },
      success: { main: successColor.dark },
      info: { main: infoColor.dark },
      background: {
        paper: backGroundColor.dark,
        default: textColor.dark,
      },
      text: {
        primary: textColor.dark,
        secondary: textColor.dark,
      },
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: sx({
            background: backGroundColor.dark,
            color: textColor.dark,
          }),
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: sx({
            background: primaryColor.dark,
          }),
        },
      },
      MuiStack: {
        styleOverrides: {
          root: sx({
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            backgroundColor: containerColor.dark,
            borderRadius: 1.5,
            p: 2,
            py: 8,
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: sx({
            backgroundColor: containerColor.dark,
            borderRadius: "5px",
          }),
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: sx({
            backgroundColor: containerColor.dark,
            borderRadius: "5px",
          }),
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.dark,
          }),
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.dark,
          }),
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.dark,
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: sx({
            backgroundColor: backGroundColor.dark,
          }),
        },
      },
    },
  });
  return [lightTheme, darkTheme];
};

export default useThemeSelect;
