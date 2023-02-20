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
import { PersonAddAlt1Outlined, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import NewClient from "../components/clients/NewClient";
import ClientsTable from "../components/clients/ClientsTable";

const Clients = () => {
  const { onGetData } = useAuth();
  const [addClientShow, setAddClientShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSnack, setShowSnack] = useState(false);
  const [clients, setClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onGetData("clients", (querySnapShot) => {
      const docs = [];
      querySnapShot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setClients(docs);
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
        <Badge badgeContent={clients.length} color="secondary">
          <Typography variant="h4" sx={{ mb: "40px" }}>
            Clientes
          </Typography>
        </Badge>
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
              onClick={() => setAddClientShow(true)}
            >
              <PersonAddAlt1Outlined sx={{ fontSize: "60px" }} />
            </Button>
            {clients.length > 0 ? (
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
                <Divider sx={{ pt: "10px" }}>Lista de clientes</Divider>
                <ClientsTable clients={clients} searchValue={searchValue} />
              </Box>
            ) : (
              <Alert variant="filled" severity="warning" sx={{ py: 3 }}>
                Aun no se han ingresado clientes.
              </Alert>
            )}
          </Stack>
        ) : (
          <Box height="50vh" sx={{ display: "grid", placeContent: "center" }}>
            <CircularProgress size="50px" color="inherit" />
          </Box>
        )}
      </Container>
      <NewClient
        open={addClientShow}
        onClose={() => setAddClientShow(false)}
        showSnack={setShowSnack}
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
          Se guardo el cliente con exito!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Clients;
