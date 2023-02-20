import { useState } from "react";
import { useThemeContext } from "../context/ThemeContext";

import {
  ArrowBack,
  SettingsOutlined,
  Brightness6Outlined,
  DarkModeOutlined,
  ExitToAppOutlined,
} from "@mui/icons-material";
import {
  AppBar,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser, logOut } = useAuth();
  const [setError] = useState({ error: null, type: "info" });
  const [anchorEl, setAnchorEl] = useState(false);

  const navigate = useNavigate();

  const colorMode = useThemeContext();

  const theme = useTheme();

  const handleLogOut = async () => {
    setError({ error: null, type: "info" });
    try {
      await logOut();
    } catch (err) {
      setError({ error: err, type: "error" });
    }
  };

  const handleThemeChange = () => {
    handleCloseMenu();
    colorMode.toggleColorMode();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <Container>
      <AppBar position="fixed" enableColorOnDark>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            Granja Alfonso Chaves
          </Typography>
          <IconButton color="inherit" edge="end" onClick={handleOpenMenu}>
            <SettingsOutlined />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleThemeChange}>
              {theme.palette.mode === "light" ? (
                <>
                  <DarkModeOutlined fontSize="small" sx={{ marginRight: 1 }} />{" "}
                  Modo Noche
                </>
              ) : (
                <>
                  <Brightness6Outlined
                    fontSize="small"
                    sx={{ marginRight: 1 }}
                  />{" "}
                  Modo Día
                </>
              )}
            </MenuItem>
            {currentUser && (
              <MenuItem onClick={handleLogOut}>
                <ExitToAppOutlined fontSize="small" sx={{ marginRight: 1 }} />{" "}
                Cerrar sesión
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </Container>
  );
};

export default Header;
