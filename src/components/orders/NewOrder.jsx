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
  FormGroup,
  Grid,
  IconButton,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useForm from "../../hooks/useForm";
import SearchBarClients from "./../sales/SearchBarClients";
import NewClient from "./../clients/NewClient";
import {
  CheckCircleOutlined,
  Close,
  CloseOutlined,
  PersonAddOutlined,
} from "@mui/icons-material";
const NewOrder = (props) => {
  const [{ client, description }, handleInputChange, setValues] = useForm({
    client: null,
    description: "",
  });

  const { saveOrder } = useAuth();

  const [error, setError] = useState({ error: null, type: "info" });
  const [addClientShow, setAddClientShow] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewOrder = async (event) => {
    event.preventDefault();
    if (client === null) {
      setError({
        error: "Debe de seleccionar un cliente",
        type: "warning",
      });
    } else {
      try {
        setError({ ...error, error: null });
        setLoading(true);
        await saveOrder(client, description);
        props.showSnack(true);
        props.onClose();
      } catch (err) {
        setError({
          error: `Hubo un error al generar la orden!!, ${err}`,
          type: "error",
        });
      }
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
              <CheckCircleOutlined />
            </Avatar>{" "}
            Nuevo Pedido
          </Typography>
          <Box component="form" onSubmit={handleNewOrder}>
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
                <FormGroup
                  sx={{ display: "flex", flexDirection: "row", columnGap: 2 }}
                >
                  <SearchBarClients
                    onChange={(_, value) => {
                      if (value) {
                        setValues({ description, client: value });
                      } else {
                        setValues({ description, client: null });
                      }
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => setAddClientShow(true)}
                  >
                    <PersonAddOutlined />{" "}
                  </Button>
                </FormGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="description"
                  label="Información"
                  multiline
                  minRows={3}
                  maxRows={6}
                  value={description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
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
                    "Guardar pedido"
                  ) : (
                    <CircularProgress size="26px" color="inherit" />
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Stack>
        <NewClient
          open={addClientShow}
          onClose={() => setAddClientShow(false)}
          showSnack={setShowSnack}
        />
        <Snackbar
          open={showSnack}
          autoHideDuration={4000}
          onClose={() => setShowSnack(false)}
        ></Snackbar>
      </Container>
    </Modal>
  );
};

export default NewOrder;
