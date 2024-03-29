import { MoneyOffCsredOutlined, Search } from "@mui/icons-material";
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
import { useEffect, useState } from "react";
import BillsTable from "../components/bills/BillsTable";
import NewBill from "../components/bills/NewBill";
import PayBill from "../components/bills/PayBill";
import { useAuth } from "../context/AuthContext";

const Billing = () => {
  const { onGetData } = useAuth();
  const [addBillShow, setAddBillShow] = useState(false);
  const [payBillShow, setPayBillShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSnack, setShowSnack] = useState(false);
  const [bills, setBills] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onGetData("bills", (querySnapShot) => {
      const docs = [];
      querySnapShot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setBills(docs);
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
          Gastos
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
              color="warning"
              sx={{ py: 2 }}
              onClick={() => setAddBillShow(true)}
            >
              <MoneyOffCsredOutlined sx={{ fontSize: "60px", m: 0, p: 0 }} />
            </Button>
            {bills.length > 0 ? (
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
                <BillsTable
                  bills={bills}
                  searchValue={searchValue}
                  setSelectedId={setSelectedId}
                  setPayBillShow={setPayBillShow}
                />
              </Box>
            ) : (
              <Alert variant="filled" severity="info" sx={{ py: 3 }}>
                Aun no se han ingresado gastos.
              </Alert>
            )}
          </Stack>
        ) : (
          <Box>
            <CircularProgress size="50px" color="inherit" />
          </Box>
        )}
      </Container>
      <NewBill
        open={addBillShow}
        onClose={() => setAddBillShow(false)}
        showSnack={setShowSnack}
      />
      <PayBill
        open={payBillShow}
        onClose={() => setPayBillShow(false)}
        showSnack={setShowSnack}
        selectedId={selectedId}
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
          Se guardaron los gastos con exito!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Billing;
