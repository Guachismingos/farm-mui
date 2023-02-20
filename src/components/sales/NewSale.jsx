import { useState } from "react";

import {
  Alert,
  Avatar,
  Button,
  ButtonGroup,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  AddCard,
  AddCircleOutlineOutlined,
  AddShoppingCartOutlined,
  Close,
  CloseOutlined,
  LocalShippingOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";
import SearchBarClients from "./SearchBarClients";
import NewClient from "../clients/NewClient";
import SearchBarProducts from "./SearchBarProducts";
import SelectedProductsTable from "./SelectedProductsTable";
import { useSale } from "../../context/saleContext";
import NumberFormatCustom from "../custom/NumberFormatCustom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NewSale = (props) => {
  const {
    setClient,
    client,
    selectedProducts,
    setSelectedProducts,
    payWith,
    setPayWith,
    payAmount,
    setPayAmount,
    setCredit,
    credit,
    setDone,
    done,
    total,
  } = useSale();

  const navigate = useNavigate();

  const { saveSale, saveRecovery } = useAuth();
  const [product, setProduct] = useState(null);

  const [error, setError] = useState({ error: null, type: "info" });
  const [loading, setLoading] = useState(false);
  const [addClientShow, setAddClientShow] = useState(false);
  const [showSnack, setShowSnack] = useState(false);

  const handleNewSale = async (event) => {
    event.preventDefault();
    if (Object.keys(selectedProducts).length <= 0) {
      setError({
        error: "Aun no ingresan productos!!",
        type: "warning",
      });
    } else {
      try {
        setError({ ...error, error: null });
        setLoading(true);
        const today = new Date();
        const refNewSale = await saveSale(
          client,
          selectedProducts,
          total,
          credit,
          done,
          !credit ? true : false,
          credit ? parseInt(payAmount) : total,
          today.toDateString(),
          today.getMonth(),
          today.getFullYear(),
          payWith > 0
            ? [
                {
                  type: payWith,
                  payAmount: credit ? parseInt(payAmount) : parseInt(total),
                  date: today.toDateString(),
                  month: today.getMonth(),
                  year: today.getFullYear(),
                },
              ]
            : []
        );
        
        if (credit) {
          await saveRecovery(
            refNewSale,
            client.name,
            parseInt(payAmount),
            today.toDateString(),
            today.getMonth(),
            today.getFullYear(),
            payWith
          );
        }

        props.showSnack(true);
        !!refNewSale && navigate(`/sales/${refNewSale}`);
        props.onClose();
      } catch (err) {
        setError({
          error: `Hubo un error al generar el pedido!!, ${err}`,
          type: "error",
        });
      }
    }
    setLoading(false);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
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
          <Box component="form" onSubmit={handleNewSale}>
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
                    sx={{ mt: 2 }}
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
                        setClient(value);
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
                    disabled={Object.keys(selectedProducts).length <= 0}
                    name="payWith"
                    defaultValue={1}
                    label="Método de Pago"
                    onChange={({ target }) => {
                      if (target.value === 0) {
                        setCredit(true);
                      }
                      setPayAmount(0);
                      setPayWith(target.value);
                    }}
                  >
                    <MenuItem value={0}>*Sin depósito*</MenuItem>
                    <MenuItem value={1}>Efectivo</MenuItem>
                    <MenuItem value={2}>Sinpe movíl</MenuItem>
                    <MenuItem value={3}>Transferencia bancaria</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <ButtonGroup fullWidth sx={{ gap: 2 }}>
                  <ToggleButton
                    disabled={Object.keys(selectedProducts).length <= 0}
                    value="credit"
                    color="standard"
                    selected={!!credit}
                    onChange={() => {
                      if (payWith !== 0) {
                        setCredit(!credit);
                      }
                      setPayAmount(0);
                    }}
                    sx={{ borderWidth: 2 }}
                  >
                    <AddCard sx={{ pr: 1 }} />
                    Crédito
                  </ToggleButton>
                  <TextField
                    label="Monto ₡"
                    variant="outlined"
                    disabled={!credit || payWith === 0}
                    required={!!credit}
                    value={payAmount}
                    onChange={({ target }) => {
                      if (parseInt(target.value) > total) {
                        setPayAmount(total);
                      } else {
                        setPayAmount(target.value);
                      }
                    }}
                    sx={{ flexGrow: 4 }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                </ButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <ToggleButton
                  fullWidth
                  disabled={Object.keys(selectedProducts).length <= 0}
                  value={done}
                  color="success"
                  selected={!!done}
                  onChange={() => setDone(!done)}
                  sx={{ borderWidth: 3 }}
                >
                  <LocalShippingOutlined sx={{ pr: 1 }} />
                  Entregado
                </ToggleButton>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  disabled={loading}
                  size="large"
                  variant="contained"
                  color="success"
                  type="submit"
                  sx={{ py: 2 }}
                >
                  {!loading ? (
                    "Generar Venta"
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
            variant="filled"
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
