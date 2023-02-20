import {
  AddShoppingCartOutlined,
  ReceiptLongOutlined,
  Search,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import NewDeposit from "../components/sales/NewDeposit";
import NewSale from "../components/sales/NewSale";
import SalesTable from "../components/sales/SalesTable";
import { useAuth } from "../context/AuthContext";
import { useSale } from "../context/saleContext";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import bgLocale from "date-fns/locale/es";

const Sales = () => {
  const { handleResetData } = useSale();
  const { getSalesByDateQuery } = useAuth();
  const [addSaleShow, setAddSaleShow] = useState(false);
  const [addDepositShow, setAddDepositShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSnack, setShowSnack] = useState(false);
  const [sales, setSales] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [dateValue, setDateValue] = useState(new Date());

  const fetchData = async () => {
    setLoading(true);
    const unsubscribe = await getSalesByDateQuery(dateValue);
    const docs = [];
    unsubscribe.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });
    setSales(docs);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dateValue]);

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
        <Typography variant="h4" sx={{ pb: "40px" }}>
          Ventas
        </Typography>
        {!loading ? (
          <Stack
            gap={2}
            sx={{ textAlign: "center" }}
            className="animate__animated animate__zoomIn animate__faster"
          >
            <Box display="flex" gap={2}>
              <Button
                size="large"
                variant="contained"
                color="success"
                sx={{ py: 2, flexGrow: 2 }}
                onClick={() => setAddSaleShow(true)}
              >
                <AddShoppingCartOutlined sx={{ fontSize: "60px" }} />
              </Button>
              <Button
                size="large"
                variant="contained"
                color="info"
                sx={{ py: 2 }}
                onClick={() => setAddDepositShow(true)}
              >
                <ReceiptLongOutlined sx={{ fontSize: "60px" }} />
              </Button>
            </Box>

            <Box>
              <ButtonGroup fullWidth sx={{ gap: 2 }}>
                <TextField
                  label={
                    <Typography display="flex">
                      <Search sx={{ pr: 1 }} />
                      Buscar
                    </Typography>
                  }
                  fullWidth
                  onChange={(event) => setSearchValue(event.target.value)}
                />
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={bgLocale}
                >
                  <DatePicker
                    disableFuture
                    label="Fecha"
                    openTo="day"
                    views={["day", "year", "month"]}
                    value={dateValue}
                    onChange={(newValue) => {
                      setDateValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </LocalizationProvider>
              </ButtonGroup>
              <Divider sx={{ pt: "10px" }}>Lista de ventas</Divider>
              {sales.length > 0 ? (
                <SalesTable sales={sales} searchValue={searchValue} />
              ) : (
                <Alert variant="filled" severity="warning" sx={{ mt: 1 }}>
                  No se encontraron ventas.
                </Alert>
              )}
            </Box>
          </Stack>
        ) : (
          <Box>
            <CircularProgress size="50px" color="inherit" />
          </Box>
        )}
        <NewSale
          open={addSaleShow}
          onClose={() => {
            handleResetData();
            setAddSaleShow(false);
          }}
          showSnack={setShowSnack}
        />
        <NewDeposit
          open={addDepositShow}
          onClose={() => {
            setAddDepositShow(false);
          }}
          showSnack={setShowSnack}
        />
      </Container>
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
          Venta exitosa!!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Sales;
