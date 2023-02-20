import {
  Close,
  CloseOutlined,
  InfoOutlined,
  MoneyOffCsredOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { useAuth } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import NumberFormatCustom from "../custom/NumberFormatCustom";

const PayBill = (props) => {
  const { getBillById, updateBill } = useAuth();

  const [{ payAmount }, handleInputChange, setValues] = useForm({
    id: "",
    payAmount: null,
  });

  const [refBill, setRefBill] = useState({});

  const [error, setError] = useState({ error: null, type: "info" });

  const [loading, setLoading] = useState(true);

  const handleLoadBill = useCallback(async () => {
    try {
      setLoading(true);
      const clientDoc = await getBillById(props.selectedId);
      if (clientDoc.data()) {
        setRefBill({ ...clientDoc.data(), id: clientDoc.id });
      } else {
        props.onClose();
      }
      setLoading(false);
    } catch (err) {
      setError({ error: `Error al Cargar el gasto!! (${err})`, type: "error" });
    }
  }, [getBillById, props]);

  useEffect(() => {
    if (props.selectedId) {
      handleLoadBill();
    }
  }, [handleLoadBill, props.selectedId]);

  const resetData = () => {
    setRefBill({});
    setValues({
      id: "",
      payAmount: null,
      payWith: 1,
      payArray: [],
    });
  };

  const handleSaveDeposit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      setError({ ...error, error: null });
      setLoading(true);
      const today = new Date();
      const tempPayAmount = parseInt(payAmount);
      await updateBill(
        refBill?.id,
        refBill?.payAmount + parseInt(tempPayAmount),
        [
          ...refBill?.payArray,
          {
            payAmount: tempPayAmount,
            date: today.toDateString(),
            month: today.getMonth(),
            year: today.getFullYear(),
          },
        ],
        refBill?.payAmount + parseInt(tempPayAmount) >= refBill?.total
          ? true
          : false
      );
      resetData();
      props.onClose();
    } catch (err) {
      setError({
        error: "Hubo un error al generar el Deposito!!",
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Modal
      open={props.open}
      onClose={() => {
        resetData();
        props.onClose();
      }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Container maxWidth="sm" sx={{ background: "transparent" }}>
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack
            gap={0}
            sx={{ pt: 1 }}
            className="animate__animated animate__zoomIn animate__faster"
          >
            <Box sx={{ display: "flex", justifyContent: "end", p: 0 }}>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => {
                  resetData();
                  props.onClose();
                }}
              >
                <Close />
              </IconButton>
            </Box>
            <Typography display="flex" alignItems="center" gap={1} variant="h5">
              <Avatar variant="rounded">
                <MoneyOffCsredOutlined />
              </Avatar>{" "}
              Nuevo Depósito
            </Typography>
            <Box component="form" onSubmit={handleSaveDeposit}>
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
                  <Divider>
                    <Chip
                      label={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <InfoOutlined sx={{ pr: 0.3 }} />
                          Información del gasto
                        </Box>
                      }
                    />
                  </Divider>
                </Grid>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box flexGrow={1}>
                      <Typography variant="body2">
                        <b>Código:</b> {refBill?.id}
                        <br />
                        <b>Descripción:</b> {refBill?.description}
                        <br />
                        <b>Fecha:</b>{" "}
                        {new Date(refBill?.date).toLocaleDateString("es-CR")}
                        <br />
                        <b>Total de venta:</b>{" "}
                        <NumberFormat
                          value={refBill?.total}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₡ "
                          decimalScale={2}
                        />
                        <br />
                        <b>Total abonado:</b>{" "}
                        <NumberFormat
                          value={refBill?.payAmount}
                          displayType="text"
                          thousandSeparator={true}
                          prefix="₡ "
                          decimalScale={2}
                        />
                        <br />
                        <b>Saldo Pendiente:</b>{" "}
                        {refBill?.total > refBill?.payAmount ? (
                          <NumberFormat
                            value={refBill?.total - refBill?.payAmount}
                            displayType="text"
                            thousandSeparator={true}
                            prefix="₡ "
                            decimalScale={2}
                          />
                        ) : (
                          "CANCELADO"
                        )}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                {refBill?.total > refBill?.payAmount && (
                  <Fragment>
                    <Grid item xs={12}>
                      <TextField
                        name="payAmount"
                        label="Cantidad a depositar:"
                        disabled={loading}
                        value={payAmount}
                        fullWidth
                        required
                        onChange={(event) => {
                          if (
                            parseFloat(event.target.value) >
                            refBill?.total - refBill?.payAmount
                          ) {
                            setValues((prevValues) => ({
                              ...prevValues,
                              payAmount: refBill?.total - refBill?.payAmount,
                            }));
                          } else {
                            handleInputChange(event);
                          }
                        }}
                        InputProps={{
                          inputComponent: NumberFormatCustom,
                        }}
                      />
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
                          "Generar Deposito"
                        ) : (
                          <CircularProgress size="26px" color="inherit" />
                        )}
                      </Button>
                    </Grid>
                  </Fragment>
                )}
              </Grid>
            </Box>
          </Stack>
        )}
      </Container>
    </Modal>
  );
};

export default PayBill;
