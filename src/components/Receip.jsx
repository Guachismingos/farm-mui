import { Close, SaveOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import jsPDF from "jspdf";
import { QRCodeCanvas } from "qrcode.react";
import { Fragment } from "react";
import NumberFormat from "react-number-format";
import SaleDisplayTable from "./sales/SaleDisplayTable";

const Receip = (props) => {
  const { sale, id } = props;

  const saveReceip = () => {
    const canvas = document.querySelector("#receip");
    const doc = new jsPDF("p", "pt", [
      canvas.clientWidth,
      canvas.clientHeight + 20,
      true,
    ]);
    doc.html(canvas, {
      callback: (pdf) => {
        pdf.save(`venta_${sale?.date}_${id}.pdf`);
      },
    });
  };

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      sx={{ overflow: "auto", pb: 6 }}
    >
      <Container maxWidth="xs" sx={{ background: "transparent", mt: 6 }}>
        <Stack gap={0} sx={{ pt: 1, width: "400px" }}>
          <Box sx={{ display: "flex", justifyContent: "end", p: 0 }}>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => props.onClose()}
            >
              <Close />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={saveReceip}
          >
            <SaveOutlined fontSize="small" sx={{ pr: 1 }} />
            Guardar
          </Button>
          <Paper
            id="receip"
            sx={{
              p: 1,
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              background: "white",
              color: "black",
            }}
          >
            <Grid container spacing={0.5} padding={1}>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <b>Cliente</b>
                </Typography>
                <Divider sx={{ mb: 0.5 }} />
                <Typography variant="body2">
                  <b>Nombre:</b> {sale?.clientData?.name}
                  <br />
                  <b>Teléfono:</b> {sale?.clientData?.phone}
                  <br />
                  <b>Dirección:</b> {sale?.clientData?.address}
                  <br />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <b>Venta</b>
                </Typography>
                <Divider sx={{ mb: 0.5 }} />
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
                    prefix="&cent; "
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
                        prefix="&cent; "
                        decimalScale={2}
                      />
                      <br />
                      <b>Saldo pendiente: </b>
                      <NumberFormat
                        value={sale?.total - sale?.payAmount}
                        displayType="text"
                        thousandSeparator={true}
                        prefix="&cent; "
                        decimalScale={2}
                      />
                    </Fragment>
                  ) : (
                    <b>CANCELADO</b>
                  )}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  <b>Productos</b>
                </Typography>
                <Divider sx={{ mb: 0.5 }} />
                <SaleDisplayTable
                  products={sale.products}
                  total={sale.total}
                  all={true}
                />
                <Box textAlign="end">
                  <Typography variant="caption">
                    -El iva está incluido en los precios.-
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Divider variant="middle" sx={{ my: 2, color: "black" }}>
                  <Typography variant="caption">
                    <i>FIN_DE_FACTURA</i>
                  </Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="center" pb={1}>
                <QRCodeCanvas size={70} value={id} />
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </Modal>
  );
};

export default Receip;
