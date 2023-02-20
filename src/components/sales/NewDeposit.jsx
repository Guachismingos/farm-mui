import {
  Close,
  CloseOutlined,
  InfoOutlined,
  ReceiptLongOutlined,
  RestartAlt,
  Search,
} from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useCallback, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useForm from "../../hooks/useForm";
import NumberFormatCustom from "../custom/NumberFormatCustom";
import QrScanner from "./QrScanner";

const NewDeposit = (props) => {
  const navigate = useNavigate();

  const [{ payAmount, payWith }, handleInputChange, setValues] = useForm({
    id: "",
    payAmount: null,
    payWith: 1,
  });

  const [refSale, setRefSale] = useState(null);

  const [searchValue, setSearchValue] = useState("");

  const [creditData, setCreditData] = useState([]);
  const [error, setError] = useState({ error: null, type: "info" });
  const [loading, setLoading] = useState(false);

  const { getPaidOrNotQuery, updateSale, saveRecovery } = useAuth();

  const handleLoadData = useCallback(async (setData, getQuery) => {
    try {
      setLoading(true);
      const querySnapshot = await getQuery(false);
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setData(docs);
    } catch (err) {
      setError({ error: err, type: "error" });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    handleLoadData(setCreditData, getPaidOrNotQuery);
  }, [getPaidOrNotQuery, handleLoadData]);

  useEffect(() => {
    setLoading(true);
    if (searchValue) {
      const findValue = creditData.find(({ id }) => id === searchValue);
      if (findValue) {
        setRefSale(creditData.find(({ id }) => id === searchValue));
      } else {
        setError({
          error: "No Existe un credito abierto a esta factura!!",
          type: "error",
        });
        setSearchValue(null);
      }
    } else {
      setRefSale(null);
      setRefSale(null);
      setValues({
        id: "",
        payAmount: null,
        payWith: 1,
      });
    }
    setLoading(false);
  }, [creditData, searchValue, setValues]);

  const handleSaveDeposit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      setError({ ...error, error: null });
      setLoading(true);
      const today = new Date();
      const tempPayAmount = parseInt(payAmount);
      await updateSale(
        refSale?.id,
        refSale?.payAmount + parseInt(tempPayAmount),
        [
          ...refSale?.payArray,
          {
            type: payWith,
            payAmount: tempPayAmount,
            date: today.toDateString(),
            month: today.getMonth(),
            year: today.getFullYear(),
          },
        ],
        refSale?.payAmount + parseInt(tempPayAmount) >= refSale?.total
          ? true
          : false
      );
      await saveRecovery(
        refSale?.id,
        refSale?.clientData.name,
        tempPayAmount,
        today.toDateString(),
        today.getMonth(),
        today.getFullYear(),
        payWith
      );
      !!refSale?.id && navigate(`/sales/${refSale?.id}`);
      props.showSnack(true);
      setSearchValue(null);
      setRefSale(null);
      setValues({
        id: "",
        payAmount: null,
        payWith: 1,
        payArray: [],
      });
      handleLoadData(setCreditData, getPaidOrNotQuery);
      props.onClose();
    } catch (err) {
      setError({
        error: `Hubo un error al generar el deposito!!, ${err}`,
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Modal
      open={props.open}
      onClose={() => {
        setValues({
          id: "",
          payAmount: null,
          payWith: 1,
        });
        setSearchValue(null);
        setRefSale(null);
        props.onClose();
      }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Container maxWidth="sm" sx={{ background: "transparent" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Stack gap={0} sx={{ pt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "end", p: 0 }}>
              <IconButton
                color="inherit"
                edge="end"
                onClick={() => {
                  setSearchValue(null);
                  setRefSale(null);
                  setValues({
                    id: "",
                    payAmount: null,
                    payWith: 1,
                    payArray: [],
                  });
                  props.onClose();
                }}
              >
                <Close />
              </IconButton>
            </Box>
            <Typography display="flex" alignItems="center" gap={1} variant="h5">
              <Avatar variant="rounded">
                <ReceiptLongOutlined />
              </Avatar>{" "}
              Nuevo Depósito
            </Typography>
            {creditData?.length > 0 ? (
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
                            <Search />
                            Búsqueda
                          </Box>
                        }
                      />
                    </Divider>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs>
                        <Autocomplete
                          options={creditData}
                          onChange={(_, newValue) => {
                            if (newValue) {
                              setSearchValue(newValue?.id);
                            } else {
                              setSearchValue(null);
                            }
                          }}
                          noOptionsText="No se encuentra la venta..."
                          getOptionLabel={({id, clientData: { name }, total }) =>
                            `${name}, ₡${total}, ${id}`
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Seleccione una venta..."
                            />
                          )}
                        />
                      </Grid>
                      <Grid item>
                        <QrScanner setSearchValue={setSearchValue} />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider>
                      <Chip
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <InfoOutlined sx={{ pr: 0.3 }} />
                            Información de la venta
                          </Box>
                        }
                      />
                    </Divider>
                  </Grid>
                  {!loading ? (
                    !!refSale ? (
                      <Fragment>
                        <Grid item xs={12}>
                          <Paper
                            sx={{
                              p: 2,
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Grid container>
                              <Grid item xs>
                                <Box flexGrow={1}>
                                  <Typography variant="body2">
                                    <b>Código:</b> {refSale?.id}
                                    <br />
                                    <b>Cliente:</b> {refSale?.clientData?.name}
                                    <br />
                                    <b>Fecha:</b>{" "}
                                    {new Date(refSale?.date).toLocaleDateString(
                                      "es-CR"
                                    )}
                                    <br />
                                    <b>Total de venta:</b>{" "}
                                    <NumberFormat
                                      value={refSale?.total}
                                      displayType="text"
                                      thousandSeparator={true}
                                      prefix="₡ "
                                      decimalScale={2}
                                    />
                                    <br />
                                    <b>Total abonado:</b>{" "}
                                    <NumberFormat
                                      value={refSale?.payAmount}
                                      displayType="text"
                                      thousandSeparator={true}
                                      prefix="₡ "
                                      decimalScale={2}
                                    />
                                    <br />
                                    <b>Saldo Pendiente:</b>{" "}
                                    <NumberFormat
                                      value={
                                        refSale?.total - refSale?.payAmount
                                      }
                                      displayType="text"
                                      thousandSeparator={true}
                                      prefix="₡ "
                                      decimalScale={2}
                                    />
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item>
                                <IconButton
                                  size="large"
                                  onClick={() => setSearchValue(null)}
                                >
                                  <RestartAlt fontSize="inherit" />
                                </IconButton>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <InputLabel>Método de Pago</InputLabel>
                            <Select
                              name="payWith"
                              defaultValue={1}
                              label="Método de Pago"
                              onChange={handleInputChange}
                            >
                              <MenuItem value={1}>Efectivo</MenuItem>
                              <MenuItem value={2}>Sinpe movíl</MenuItem>
                              <MenuItem value={3}>
                                Transferencia bancaria
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs>
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
                                refSale?.total - refSale?.payAmount
                              ) {
                                setValues((prevValues) => ({
                                  ...prevValues,
                                  payAmount:
                                    refSale?.total - refSale?.payAmount,
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
                            disabled={loading}
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
                    ) : (
                      <Grid item xs={12}>
                        <Alert variant="filled" severity="info">
                          Seleccione un crédito.
                        </Alert>
                      </Grid>
                    )
                  ) : (
                    <Grid item xs={12}>
                      <CircularProgress />
                    </Grid>
                  )}
                </Grid>
              </Box>
            ) : (
              <Alert variant="filled" severity="warning" sx={{ mt: 3 }}>
                Aun no hay creditos pendientes.
              </Alert>
            )}
          </Stack>
        )}
      </Container>
    </Modal>
  );
};

export default NewDeposit;
