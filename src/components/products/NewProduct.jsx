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
  Grid,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import useForm from "../../hooks/useForm";
import {
  Close,
  CloseOutlined,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import NumberFormatCustom from "../custom/NumberFormatCustom";

const NewProduct = (props) => {
  const [{ description, price }, handleInputChange, setValues] = useForm({
    description: "",
    price: "",
  });

  const [error, setError] = useState({ error: null, type: "info" });
  const [loading, setLoading] = useState(false);

  const { saveProduct } = useAuth();

  const handleNewProduct = async (event) => {
    event.preventDefault();
    try {
      setError({ ...error, error: null });
      setLoading(true);
      await saveProduct(description, parseFloat(price));
      props.showSnack(true);
      setValues({});
      props.onClose();
    } catch (err) {
      setError({
        error: "Ocurrio algo inesperado!",
        type: "error",
      });
      console.log(err);
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
              <MedicalServicesOutlined />
            </Avatar>{" "}
            Nuevo Producto
          </Typography>
          <Box component="form" onSubmit={handleNewProduct}>
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
                  name="description"
                  label="Descripción:"
                  disabled={loading}
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
export default NewProduct;
