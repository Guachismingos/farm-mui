//Components
import Header from "../components/Header";
import Login from "../pages/Login";
import PrivateRoute from "../router/PrivateRoute";
//routes file
import routes from "../router/routes";
import ToggleColorMode from "../context/ThemeContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";

const Layout = () => {
  return (
    <ToggleColorMode>
      <Box className="animate__animated animate__fadeIn animate__fast">
        <Header />
        <Routes>
          {routes.map(({ path, Component, name, childs }) =>
            !childs ? (
              <Route
                exact
                key={name}
                path={path}
                element={<PrivateRoute isPrivate />}
              >
                <Route exact path={path} element={<Component />} />
              </Route>
            ) : (
              <Route
                exact
                key={name}
                path={path}
                element={<PrivateRoute isPrivate />}
              >
                <Route exact path={path} element={<Component />}>
                  {childs.map(({ path, Component, name }) => (
                    <Route
                      exact
                      key={name}
                      path={path}
                      element={<Component />}
                    />
                  ))}
                </Route>
              </Route>
            )
          )}
          <Route exact path="/login" element={<PrivateRoute />}>
            <Route exact path="/login" element={<Login />} />
          </Route>
          <Route exact path="/*" element={<Navigate to="/panel" replace />} />
        </Routes>
      </Box>
    </ToggleColorMode>
  );
};

export default Layout;
