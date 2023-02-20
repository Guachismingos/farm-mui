import { useState } from "react";
import { AddTask, Search } from "@mui/icons-material";
import {
  Alert,
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
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import NewOrder from "../components/orders/NewOrder";
import OrdersTable from "../components/orders/OrdersTable";

const Orders = () => {
  const { onGetData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [showSnack, setShowSnack] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [addOrderShow, setAddOrderShow] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onGetData("orders", (querySnapShot) => {
      const docs = [];
      querySnapShot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setOrders(docs);
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
        <Typography variant="h4" sx={{ mb: "40px" }}>
          Pedidos
        </Typography>
        {!loading ? (
          <Stack
            gap={2}
            sx={{ textAlign: "center" }}
            className="animate__animated animate__zoomIn animate__faster"
          >
            <Button
              size="large"
              variant="contained"
              color="success"
              sx={{ py: 2 }}
              onClick={() => setAddOrderShow(true)}
            >
              <AddTask sx={{ fontSize: "60px", m: 0, p: 0 }} />
            </Button>
            {orders.length > 0 ? (
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
                <Divider sx={{ pt: "10px" }}>Lista de gastos</Divider>
                <OrdersTable orders={orders} searchValue={searchValue} />
              </Box>
            ) : (
              <Alert variant="filled" severity="warning" sx={{ py: 3 }}>
                Aun no se han ingresado pedidos.
              </Alert>
            )}
          </Stack>
        ) : (
          <Box>
            <CircularProgress size="50px" color="inherit" />
          </Box>
        )}
      </Container>
      <NewOrder
        open={addOrderShow}
        onClose={() => setAddOrderShow(false)}
        showSnack={setShowSnack}
      />
      <Snackbar
        open={showSnack}
        autoHideDuration={4000}
        onClose={() => setShowSnack(false)}
      ></Snackbar>
    </Container>
  );
};

export default Orders;
