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
  const [error, setError] = useState({ error: "", type: "" });
  const [anchorEl, setAnchorEl] = useState(false);

  const navigate = useNavigate();

  const colorMode = useThemeContext();

  const theme = useTheme();

  const handleLogOut = async () => {
    setError("");
    try {
      await logOut();
    } catch (err) {
      setError(err.code);
      console.log(error);
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
            Farm-Dev
          </Typography>
          <IconButton color="inherit" edge="end" onClick={handleOpenMenu}>
            <SettingsOutlined />
          </IconButton>
          <Menu
            id="menu-appbar"
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
                  Modo D??a
                </>
              )}
            </MenuItem>
            {currentUser && (
              <MenuItem onClick={handleLogOut}>
                <ExitToAppOutlined fontSize="small" sx={{ marginRight: 1 }} />{" "}
                Cerrar sesi??n
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
