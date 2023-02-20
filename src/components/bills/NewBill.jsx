import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  Alert,
  Avatar,
  Box,
  Button,
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
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useForm from "../../hooks/useForm";
import {
  Close,
  CloseOutlined,
  MoneyOffCsredOutlined,
} from "@mui/icons-material";
import NumberFormatCustom from "../custom/NumberFormatCustom";

const NewBill = (props) => {
  const [
    { description, total, credit, payAmount },
    handleInputChange,
    setValues,
  ] = useForm({
    description: "",
    total: "",
    credit: 1,
    payAmount: 0,
  });

  const [error, setError] = useState({ error: null, type: "info" });
  const [loading, setLoading] = useState(false);
  const [cred, setCred] = useState(false);

  const { saveBill } = useAuth();

  const handleNewBill = async (event) => {
    event.preventDefault();
    try {
      setError({ ...error, error: null });
      setLoading(true);
      const today = new Date();
      await saveBill(
        description,
        parseFloat(total),
        credit === 1 ? false : true,
        credit === 1 ? true : false,
        credit === 2 ? parseInt(payAmount) : parseInt(total),
        parseInt(payAmount) === 0 && credit === 2
          ? []
          : [
              {
                payAmount: credit === 2 ? parseInt(payAmount) : parseInt(total),
                date: today.toDateString(),
                month: today.getMonth(),
                year: today.getFullYear(),
              },
            ],
        today.toDateString(),
        today.getMonth(),
        today.getFullYear()
      );
      props.showSnack(true);
      props.onClose();
    } catch (err) {
      setError({
        error: "Ocurrio algo inesperado!",
        type: "error",
      });
    }
    setLoading(false);
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Container maxWidth="sm" sx={{ background: "transparent" }}>
        <Stack gap={0} sx={{ pt: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "end", p: 0 }}>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => {
                props.onClose();
                setValues({
                  description: "",
                  total: "",
                  credit: 1,
                  payAmount: 0,
                });
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <Typography display="flex" alignItems="center" gap={1} variant="h5">
            <Avatar variant="rounded">
              <MoneyOffCsredOutlined />
            </Avatar>{" "}
            Nuevo Gasto
          </Typography>
          <Box component="form" onSubmit={handleNewBill}>
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
                  name="total"
                  label="Total:"
                  disabled={loading}
                  value={total}
                  fullWidth
                  required
                  onChange={handleInputChange}
                  InputProps={{
                    inputComponent: NumberFormatCustom,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipo:</InputLabel>
                  <Select
                    name="credit"
                    label="Tipo:"
                    disabled={loading}
                    defaultValue={1}
                    onChange={handleInputChange}
                  >
                    <MenuItem
                      value={1}
                      onClick={() => {
                        setCred(false);
                      }}
                    >
                      Débito
                    </MenuItem>
                    <MenuItem
                      value={2}
                      onClick={() => {
                        setCred(true);
                      }}
                    >
                      Crédito
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="payAmount"
                  label="Abono:"
                  disabled={loading || !cred}
                  value={payAmount}
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
                    "Guardar"
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
export default NewBill;
