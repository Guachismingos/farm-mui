import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import useForm from "../../hooks/useForm";
import {
  Close,
  CloseOutlined,
  PersonAddAlt1Outlined,
} from "@mui/icons-material";

const NewClient = (props) => {
  const [{ name, type, phone, address }, handleInputChange] = useForm({
    name: "",
    type: 1,
    phone: "",
    address: "",
  });

  const [error, setError] = useState({ error: null, type: "info" });
  const [loading, setLoading] = useState(false);

  const { saveClient } = useAuth();

  const handleNewClient = async (event) => {
    event.preventDefault();
    try {
      setError({ ...error, error: null });
      setLoading(true);
      await saveClient(name, type, phone, address);
      props.showSnack(true);
      props.onClose();
    } catch (err) {
      setError({
        error: "Ya existe un usuario con el numero registrado!",
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onCLose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Container maxWidth="sm" sx={{ background: "transparent" }}>
        <Stack gap={0} sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "end", p: 0 }}>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => props.onClose()}
            >
              <Close />
            </IconButton>
          </Box>
          <Typography display="flex" alignItems="center" gap={1} variant="h5">
            <Avatar variant="rounded">
              <PersonAddAlt1Outlined />
            </Avatar>{" "}
            Nuevo Cliente
          </Typography>
          <Box component="form" onSubmit={handleNewClient}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Collapse in={!!error.error} sx={{ width: "100%" }}>
                  <Alert
                    variant="filled"
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
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  name="name"
                  label="Nombre:"
                  disabled={loading}
                  fullWidth
                  required
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo:</InputLabel>
                  <Select
                    name="type"
                    label="Tipo:"
                    disabled={loading}
                    defaultValue={1}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={1}>Físico</MenuItem>
                    <MenuItem value={2}>Jurídico</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="tel"
                  name="phone"
                  label="Teléfono:"
                  disabled={loading}
                  inputProps={{ pattern: "[0-9]{4,}" }}
                  fullWidth
                  required
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    type="text"
                    name="address"
                    label="Dirección:"
                    disabled={loading}
                    inputProps={{ maxLength: 120 }}
                    multiline
                    rows={3}
                    required
                    onChange={handleInputChange}
                  />
                  <FormHelperText>Máximo 120 caracteres.</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled={loading}
                  type="submit"
                  size="large"
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ py: 2 }}
                >
                  {!loading ? (
                    "Guargar"
                  ) : (
                    <CircularProgress size="26px" color="inherit" />
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Modal>
  );
};

export default NewClient;
