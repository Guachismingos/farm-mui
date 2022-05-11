import {
  Alert,
  Badge,
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
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Box } from "@mui/system";
import NewClient from "../components/clients/NewClient";
import ClientsTable from "../components/clients/ClientsTable";

const Clients = () => {
  const { onGetData } = useAuth();
  const [addClientShow, setAddClientShow] = useState(false);
  const [loading, setLoading] = useState(false);
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
        pt: "85px",
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
          <Typography variant="h4" sx={{ mb: "80px" }}>
            Clientes
          </Typography>
        </Badge>
        <Stack gap={2} sx={{ textAlign: "center" }}>
          <Button
            size="large"
            variant="contained"
            color="success"
            sx={{ py: 2 }}
            onClick={() => setAddClientShow(true)}
          >
            <PersonAddAlt1Outlined sx={{ fontSize: "60px" }} />
          </Button>
          {!loading ? (
            clients.length > 0 ? (
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
                <Divider sx={{ pt: "10px" }}>lista de clientes</Divider>
                <ClientsTable clients={clients} searchValue={searchValue} />
              </Box>
            ) : (
              <Alert severity="warning" sx={{ py: 3 }}>
                Aun no se han ingresado clientes.
              </Alert>
            )
          ) : (
            <Box>
              <CircularProgress size="50px" color="inherit" />
            </Box>
          )}
        </Stack>
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
