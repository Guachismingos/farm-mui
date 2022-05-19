import {
  HelpOutlineOutlined,
  PersonOutlined,
  ShoppingBasketOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SaleDisplayTable from "./SaleDisplayTable";

const SaleDisplay = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { getSaleById } = useAuth();
  const [sale, setSale] = useState({ products: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

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
      console.log(error);
    }
  }, [error, getSaleById, id, navigate]);

  useEffect(() => {
    if (id) {
      handleLoadSale();
    }
  }, [handleLoadSale, id]);

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
        sx={{ textAlign: "center", pb: 10 }}
      >
        <Typography variant="h4" sx={{ mb: "40px" }}>
          Información de la Venta
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <Stack gap={2} sx={{ p: 1, textAlign: "left" }}>
            <Grid container spacing={2} padding={1}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
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
                    <b>Fecha:</b> {sale?.date}
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
                      <Chip
                        size="small"
                        variant="filled"
                        color="success"
                        label="CANCELADO"
                      />
                    )}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} display="flex">
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
                  <Box pt={2} display="grid" gap={2}>
                    <Button variant="contained" color="info">
                      <HelpOutlineOutlined fontSize="small" sx={{ pr: 1 }} />
                      Información
                    </Button>
                    <Button variant="contained" color="primary">
                      <ShoppingCartOutlined fontSize="small" sx={{ pr: 1 }} />
                      Ventas
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={8} display="flex">
                <Paper sx={{ p: 2, flexGrow: 1 }}>
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
            </Grid>
          </Stack>
        )}
      </Container>
    </Container>
  );
};

export default SaleDisplay;
