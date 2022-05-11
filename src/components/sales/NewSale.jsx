import { useState } from "react";

import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import useForm from "../../hooks/useForm";
import {
  AddCircleOutlineOutlined,
  AddShoppingCartOutlined,
  Close,
  CloseOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";
import SearchBarClients from "./SearchBarClients";
import NewClient from "../clients/NewClient";
import SearchBarProducts from "./SearchBarProducts";
import SelectedProductsTable from "./SelectedProductsTable";
import { useSale } from "../../context/saleContext";
import NumberFormatCustom from "../custom/NumberFormatCustom";

const NewSale = (props) => {
  const {
    setClient,
    selectedProducts,
    setSelectedProducts,
    payWith,
    setPayWith,
  } = useSale();
  const [product, setProduct] = useState(null);

  const [error, setError] = useState({ error: null, type: "info" });
  const [loading, setLoading] = useState(false);
  const [addClientShow, setAddClientShow] = useState(false);
  const [showSnack, setShowSnack] = useState(false);

  return (
    <Modal
      open={props.open}
      onClose={props.onCLose}
      sx={{ overflow: "auto", pb: 6 }}
    >
      <Container maxWidth="md" sx={{ background: "transparent", mt: 6 }}>
        <Stack gap={0} sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "end", p: 0 }}>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => {
                setSelectedProducts([]);
                setProduct(null);
                props.onClose();
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <Typography display="flex" alignItems="center" gap={1} variant="h5">
            <Avatar variant="rounded">
              <AddShoppingCartOutlined />
            </Avatar>{" "}
            Nueva Venta
          </Typography>
          <Box component="form" onSubmit={null}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <FormGroup
                  sx={{ display: "flex", flexDirection: "row", columnGap: 2 }}
                >
                  <SearchBarClients
                    onChange={(_, value) => {
                      if (value) {
                        setClient({ ...setClient, client: value.phone });
                      }
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => setAddClientShow(true)}
                  >
                    <PersonAddOutlined />{" "}
                  </Button>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <FormGroup
                  sx={{ display: "flex", flexDirection: "column", rowGap: 2 }}
                >
                  <SearchBarProducts
                    product={product}
                    setProduct={setProduct}
                  />
                  <Button
                    variant="contained"
                    sx={{ py: 2 }}
                    disabled={!!!product}
                    onClick={() => {
                      const tempUpdate = Object.values(selectedProducts).find(
                        (item) => item.id === product.id
                      );
                      if (!!!tempUpdate) {
                        setSelectedProducts({
                          ...selectedProducts,
                          [product.id]: product,
                        });
                      }
                      setProduct(null);
                    }}
                  >
                    <Typography
                      display="flex"
                      alignItems="center"
                      gap={1}
                      variant="subtitle2"
                    >
                      <AddCircleOutlineOutlined /> Añadir Producto
                    </Typography>
                  </Button>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <SelectedProductsTable />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    name="payWith"
                    defaultValue={payWith}
                    label="Método de Pago"
                    onChange={({ target }) => setPayWith(target.value)}
                  >
                    <MenuItem value={1}>Efectivo</MenuItem>
                    <MenuItem value={2}>Sinpe movíl</MenuItem>
                    <MenuItem value={3}>Transferencia bancaria</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormGroup
                  sx={{ display: "flex", flexDirection: "row", gap: 3 }}
                >
                  <FormControlLabel
                    value="end"
                    control={<Radio />}
                    label="Crédito"
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    label="Monto ₡"
                    variant="outlined"
                    sx={{ flexGrow: 2 }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="success"
                  type="submit"
                  sx={{ py: 2 }}
                >
                  {!loading ? (
                    "Guardar"
                  ) : (
                    <CircularProgress size="26px" color="inherit" />
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Stack>
        <NewClient
          open={addClientShow}
          onClose={() => setAddClientShow(false)}
          showSnack={setShowSnack}
        />
        <Snackbar
          open={showSnack}
          autoHideDuration={4000}
          onClose={() => setShowSnack(false)}
        >
          <Alert
            severity="success"
            onClose={() => setShowSnack(false)}
            sx={{ width: "250px" }}
          >
            Se guardo el cliente con exito!
          </Alert>
        </Snackbar>
      </Container>
    </Modal>
  );
};

export default NewSale;
