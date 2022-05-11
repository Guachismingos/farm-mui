import { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import useThemeSelect from "../hooks/useThemeSelect";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const useThemeContext = () => {
  return useContext(ColorModeContext);
};

const ToggleColorMode = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");
  const [lightTheme, darkTheme] = useThemeSelect();

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        mode === "light"
          ? localStorage.setItem("theme", "dark")
          : localStorage.setItem("theme", "light");
      },
    }),
    [mode]
  );

  const theme = useMemo(() => {
    return mode === "light" ? lightTheme : darkTheme;
  }, [darkTheme, lightTheme, mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ToggleColorMode;
