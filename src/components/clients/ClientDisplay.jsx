import {
  CloseOutlined,
  Delete,
  DriveFileRenameOutlineOutlined,
  KeyboardReturnOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";

const ClientDisplay = () => {
  const { id } = useParams();
  //custom hook to manage the client information
  const [{ name, type, phone, address }, handleInputChange, setValues] =
    useForm({
      name: "",
      type: "",
      phone: "",
      address: "",
    });
  //Use state variables
  const [error, setError] = useState({ error: null, type: "info" });
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [showSnack, setShowSnack] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  //Context variables and functions
  const { saveClient, deleteClientById, getClientbyId } = useAuth();

  const navigate = useNavigate();
  // Load client function
  const handleLoadCLient = useCallback(async () => {
    try {
      setLoading(true);
      const clientDoc = await getClientbyId(id);
      if (clientDoc.data()) {
        setValues({ ...clientDoc.data() });
      } else {
        navigate("/clients", { replace: true });
      }
      setLoading(false);
    } catch (err) {
      setError(err);
      console.log(error);
    }
  }, [getClientbyId, id, setValues, navigate, error]);

  useEffect(() => {
    if (id) {
      handleLoadCLient();
    }
  }, [handleLoadCLient, id]);
  // function to save the changes of the current client
  const handleSaveClient = async (event) => {
    setError({ error: null, type: "info" });
    event.preventDefault();
    try {
      setLoading(true);
      await deleteClientById(id).then(
        await saveClient(name, type, phone, address)
      );
      setReadOnly(!readOnly);
      setShowSnack(true);
    } catch (err) {
      setError({ error: "Error al editar el usuario", type: "error" });
    }
    setLoading(false);
  };
  // function to delete the current client by id
  const handleOnDelete = async (id) => {
    await deleteClientById(id).then(navigate(-1));
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        pt: "50px",
        px: 0,
        height: "100%",
        position: "fixed",
        overflow: "auto",
      }}
    >
      <Container
        className="animate__animated animate__zoomIn animate__faster"
        maxWidth="sm"
        sx={{ textAlign: "center", pb: 10 }}
      >
        <Typography variant="h4" sx={{ mb: "40px" }}>
          Información del Cliente
        </Typography>
        <Stack gap={0} sx={{ pt: 1, textAlign: "left" }}>
          <Box component="form" onSubmit={handleSaveClient}>
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
                <TextField
                  type="text"
                  name="name"
                  label="Nombre:"
                  disabled={loading}
                  inputProps={{ readOnly: readOnly }}
                  fullWidth
                  required
                  value={name}
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
                    inputProps={{ readOnly: readOnly }}
                    defaultValue={1}
                    value={type}
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
                  inputProps={{ readOnly: readOnly, pattern: "[0-9]{4,}" }}
                  fullWidth
                  required
                  value={phone}
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
                    inputProps={{ maxLength: 120, readOnly: readOnly }}
                    multiline
                    rows={3}
                    required
                    value={address}
                    onChange={handleInputChange}
                  />
                  <FormHelperText>Máximo 120 caracteres.</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color="error"
                      sx={{ flexGrow: 1 }}
                      onClick={() => setShowDialog(true)}
                    >
                      <Delete sx={{ pr: 1 }} /> Eliminar
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      size="large"
                      variant="contained"
                      color={`${readOnly ? "success" : "warning"}`}
                      sx={{ flexGrow: 1 }}
                      onClick={() => {
                        readOnly
                          ? setReadOnly(!readOnly)
                          : handleLoadCLient() && setReadOnly(!readOnly);
                      }}
                    >
                      {readOnly ? (
                        <>
                          <DriveFileRenameOutlineOutlined sx={{ pr: 1 }} />{" "}
                          Editar
                        </>
                      ) : (
                        <>
                          <KeyboardReturnOutlined sx={{ pr: 1 }} /> Cancelar
                        </>
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {!readOnly && (
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
                      "Guargar Cambios"
                    ) : (
                      <CircularProgress size="26px" color="inherit" />
                    )}
                  </Button>
                </Grid>
              )}
            </Grid>
          </Box>
        </Stack>
      </Container>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>Está seguro que desea continuar?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            No podra recuperar la información!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            color="success"
            onClick={() => setShowDialog(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleOnDelete(id)}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnack}
        autoHideDuration={4000}
        onClose={() => setShowSnack(false)}
      >
        <Alert
          variant="filled"
          severity="success"
          onClose={() => setShowSnack(false)}
          sx={{ width: "250px" }}
        >
          Se guardaron los cambios con exito!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ClientDisplay;
