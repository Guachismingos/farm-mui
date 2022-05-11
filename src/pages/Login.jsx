import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { LockOutlined, CloseOutlined } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm";
import { useState } from "react";

const Login = () => {
  const [{ email, password }, handleInputChange] = useForm({
    email: "",
    password: "",
  });
  const { singIn } = useAuth();
  const [error, setError] = useState({ error: null, type: "info" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError({ ...error, error: null });
      setLoading(true);
      await singIn(email, password);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        switch (err.code) {
          case "auth/user-not-found":
            setError({ error: "El correo no es valido!.", type: "warning" });
            break;
          case "auth/too-many-requests":
            setError({
              error:
                "El acceso a esta cuenta ha sido temporalmente deshabilitado debido a varios intentos de inicio de sesión fallidos, solicite un cambio de contraseña o espere un momento antes de volver a intentar.",
              type: "error",
            });
            break;
          case "auth/wrong-password":
            setError({
              error: "La contraseña no es valida!.",
              type: "warning",
            });
            break;
          case "auth/unauthorized-domain":
            setError({
              error: "El dominio de donde intenta acceder no está registrado.",
              type: "error",
            });
            break;
          default:
            setError({
              error:
                "Algo salio mal, pongase en contacto con el administrador.",
              type: "info",
            });
            break;
        }
      }, 2100);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        pt: "85px",
        px: 0,
        height: "100%",
        position: "fixed",
        overflow: "auto",
      }}
    >
      <Container
        className="animate__animated animate__zoomIn animate__faster"
        fixed
        maxWidth="sm"
      >
        <Stack
          spacing={2}
          sx={{
            display: "flow",
            alignItems: "center",
          }}
        >
          <Avatar variant="rounded">
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Iniciar Sesión</Typography>
          <Collapse in={!!error.error} sx={{ width: "100%" }}>
            <Alert
              severity={error.type}
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => setError({ ...error, error: null })}
                >
                  <CloseOutlined fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              {error.error}
            </Alert>
          </Collapse>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  disabled={loading}
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  label="Correo Electronico:"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled={loading}
                  name="password"
                  type="password"
                  value={password}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  label="Contraseña:"
                />
              </Grid>
              <Grid item xs={12} mx={1}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={loading}
                  type="submit"
                  size="large"
                  fullWidth
                  variant="contained"
                  sx={{ py: 2 }}
                >
                  {!loading ? (
                    "Iniciar"
                  ) : (
                    <CircularProgress size="26px" color="inherit" />
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Container>
  );
};

export default Login;
