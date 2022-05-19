import { AddShoppingCartOutlined, Search } from "@mui/icons-material";
import {
  Alert,
  Badge,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import NewSale from "../components/sales/NewSale";
import SalesTable from "../components/sales/SalesTable";
import { useAuth } from "../context/AuthContext";
import { useSale } from "../context/saleContext";

const Sales = () => {
  const { handleResetData } = useSale();
  const { onGetData } = useAuth();
  const [addSaleShow, setAddSaleShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [sales, setSales] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onGetData("sales", (querySnapShot) => {
      const docs = [];
      querySnapShot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setSales(docs);
      setLoading(false);
    });
    return unsubscribe;
  }, [onGetData]);

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
        <Badge badgeContent={2} color="secondary">
          <Typography variant="h4" sx={{ pb: "40px" }}>
            Ventas
          </Typography>
        </Badge>
        <Stack gap={2} sx={{ textAlign: "center" }}>
          <Button
            size="large"
            variant="contained"
            color="success"
            sx={{ py: 2 }}
            onClick={() => setAddSaleShow(true)}
          >
            <AddShoppingCartOutlined sx={{ fontSize: "60px" }} />
          </Button>
          {!loading ? (
            sales.length > 0 ? (
              <Box>
                <TextField
                  size="small"
                  label={
                    <Typography display="flex">
                      <Search sx={{ pr: 1 }} />
                      Buscar
                    </Typography>
                  }
                  fullWidth
                  onChange={(event) => setSearchValue(event.target.value)}
                />
                <Divider sx={{ pt: "10px" }}>Lista de ventas</Divider>
                <SalesTable sales={sales} searchValue={searchValue} />
              </Box>
            ) : (
              <Alert variant="filled" severity="warning" sx={{ py: 3 }}>
                Aun no hay ventas.
              </Alert>
            )
          ) : (
            <Box>
              <CircularProgress size="50px" color="inherit" />
            </Box>
          )}
        </Stack>
        <NewSale
          open={addSaleShow}
          onClose={() => {
            handleResetData();
            setAddSaleShow(false);
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
