import {
  CloseOutlined,
  Delete,
  DriveFileRenameOutlineOutlined,
  KeyboardReturnOutlined,
  LockOutlined,
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
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import NumberFormatCustom from "../custom/NumberFormatCustom";

const ProductDisplay = () => {
  const { id } = useParams();
  const [{ description, price }, handleInputChange, setValues] = useForm({
    description: "",
    price: "",
  });
  //Use state variables
  const [error, setError] = useState({ error: null, type: "info" });
  const [loading, setLoading] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [showSnack, setShowSnack] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  //Context variables and functions
  const { getProductbyId, saveProductById, deleteProductById } = useAuth();

  const navigate = useNavigate();

  const handleLoadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const clientDoc = await getProductbyId(id);
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
  }, [getProductbyId, id, setValues, navigate, error]);

  useEffect(() => {
    if (id) {
      handleLoadProduct();
    }
  }, [handleLoadProduct, id]);

  const handleSaveProduct = async (event) => {
    setError({ error: null, type: "info" });
    event.preventDefault();
    try {
      setLoading(true);
      await deleteProductById(id).then(
        await saveProductById(id, description, price)
      );
      setReadOnly(!readOnly);
      setShowSnack(true);
    } catch (err) {
      setError({ error: "Error al editar el producto", type: "error" });
    }
    setLoading(false);
  };

  const handleOnDelete = async (id) => {
    await deleteProductById(id).then(navigate(-1));
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
          Información del Producto
        </Typography>
        <Stack gap={0} sx={{ pt: 1, textAlign: "left" }}>
          <Box component="form" onSubmit={handleSaveProduct}>
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
                  name="id"
                  label="Id:"
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    readOnly: readOnly,
                  }}
                  value={id}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  name="description"
                  label="Descripción:"
                  disabled={loading}
                  inputProps={{ readOnly: readOnly }}
                  value={description}
                  fullWidth
                  required
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="price"
                  label="Precio:"
                  disabled={loading}
                  inputProps={{ readOnly: readOnly }}
                  value={price}
                  fullWidth
                  required
                  onChange={handleInputChange}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
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
                          : handleLoadProduct() && setReadOnly(!readOnly);
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

export default ProductDisplay;
