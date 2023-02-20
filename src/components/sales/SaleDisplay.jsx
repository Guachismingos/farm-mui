import {
  Check,
  HelpOutlineOutlined,
  PaidOutlined,
  PersonOutlined,
  ReceiptLongOutlined,
  ShoppingBasketOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Receip from "../Receip";
import SaleDisplayTable from "./SaleDisplayTable";

const SaleDisplay = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { getSaleById, setSaleDone } = useAuth();
  const [sale, setSale] = useState({ products: {} });
  const [loading, setLoading] = useState(true);
  const [setError] = useState();
  const [receipShow, setReceipShow] = useState(false);

  const handleLoadSale = useCallback(async () => {
    try {
      setLoading(true);
      const saleDoc = await getSaleById(id);
      if (saleDoc.data()) {
        setSale({ ...saleDoc.data(), id: saleDoc.id });
      } else {
        navigate("/sales", { replace: true });
      }
      setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [setError, getSaleById, id, navigate]);

  useEffect(() => {
    if (id) {
      handleLoadSale();
    }
  }, [handleLoadSale, id]);

  const getType = (type) => {
    switch (type) {
      case 1:
        return "Efectivo";
      case 2:
        return "Sinpe movíl";
      case 3:
        return "Transferencia bancaria";
      default:
        return "Hubo un error";
    }
  };

  const handleSetSaleDone = async () => {
    setLoading(true);
    try {
      await setSaleDone(id, true);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
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
        maxWidth="md"
        sx={{ textAlign: "center", pb: 25 }}
      >
        <Typography variant="h4" sx={{ mb: "40px" }}>
          Información de la Venta
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Stack gap={2} sx={{ p: 1, textAlign: "left" }}>
            <Grid container spacing={2} padding={1}>
              <Grid item xs={12} display="flex">
                <Paper
                  sx={{
                    p: 2,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box flexGrow={1}>
                    <Typography
                      variant="h6"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <ShoppingCartOutlined fontSize="small" /> Venta{" "}
                      <Chip
                        size="small"
                        variant="filled"
                        color={sale?.credit ? "warning" : "success"}
                        label={sale?.credit ? "Crédito" : "Contado"}
                      />
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      <b>Código:</b> {id}
                      <br />
                      <b>Fecha:</b>{" "}
                      {new Date(sale?.date).toLocaleDateString("es-CR")}
                      <br />
                      <b>Total de venta:</b>{" "}
                      <NumberFormat
                        value={sale?.total}
                        displayType="text"
                        thousandSeparator={true}
                        prefix="₡ "
                        decimalScale={2}
                      />
                      <br />
                      {sale?.total - sale?.payAmount > 0 ? (
                        <Fragment>
                          <b>Total abonado: </b>
                          <NumberFormat
                            value={sale?.payAmount}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₡ "
                            decimalScale={2}
                          />
                          <br />
                          <b>Saldo pendiente: </b>
                          <NumberFormat
                            value={sale?.total - sale?.payAmount}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₡ "
                            decimalScale={2}
                          />
                        </Fragment>
                      ) : (
                        <b>CANCELADO</b>
                      )}
                    </Typography>
                  </Box>
                  {!sale?.done && (
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleSetSaleDone()}
                    >
                      <Check fontSize="small" sx={{ pr: 1 }} />
                      Entregado
                    </Button>
                  )}
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => setReceipShow(true)}
                    sx={{ mt: 2 }}
                  >
                    <ReceiptLongOutlined fontSize="small" sx={{ pr: 1 }} />
                    Generar factura
                  </Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={5} display="flex">
                <Paper sx={{ p: 2, flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <PersonOutlined fontSize="small" /> Cliente{" "}
                    <Chip
                      size="small"
                      variant="filled"
                      color={
                        sale?.clientData?.type === 1 ? "success" : "warning"
                      }
                      label={
                        sale?.clientData?.type === 1 ? "Físico" : "Jurídico"
                      }
                    />
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <b>Nombre:</b> {sale?.clientData?.name}
                    <br />
                    <b>Teléfono:</b> {sale?.clientData?.phone}
                    <br />
                    <b>Dirección:</b> {sale?.clientData?.address}
                    <br />
                  </Typography>
                  <Box pt={2} display="grid">
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() =>
                        navigate(`/clients/${sale?.clientData?.phone}`)
                      }
                    >
                      <HelpOutlineOutlined fontSize="small" sx={{ pr: 1 }} />
                      Información
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={7} display="flex">
                <Paper sx={{ p: 2, flexGrow: 1, display: "grid" }}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    {" "}
                    <ShoppingBasketOutlined fontSize="small" /> Productos
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <SaleDisplayTable
                    products={sale.products}
                    total={sale.total}
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} display="flex">
                <Paper sx={{ p: 2, flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    {" "}
                    <PaidOutlined fontSize="small" /> Pagos
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box>
                    {sale?.payArray.length > 0 ? (
                      <List dense sx={{ maxHeight: "250px", overflow: "auto" }}>
                        {sale?.payArray.map(
                          ({ date, payAmount, type }, idx) => (
                            <Fragment key={idx}>
                              <ListItem>
                                <ListItemText
                                  primary={getType(type)}
                                  secondary={`Fecha: ${new Date(
                                    date
                                  ).toLocaleDateString("es-CR")}`}
                                />
                                <Typography variant="caption">
                                  {`Cantidad: ₡${payAmount}`}
                                </Typography>
                              </ListItem>
                              <Divider component="li" />
                            </Fragment>
                          )
                        )}
                      </List>
                    ) : (
                      <Alert variant="filled" severity="info">
                        Sin depósitos
                      </Alert>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        )}
      </Container>
      <Receip
        sale={sale}
        id={id}
        open={receipShow}
        onClose={() => setReceipShow(false)}
      />
    </Container>
  );
};

export default SaleDisplay;
