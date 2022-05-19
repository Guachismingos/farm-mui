import { MedicalServicesOutlined, Search } from "@mui/icons-material";
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
import NewProduct from "../components/products/NewProduct";
import ProductsTable from "../components/products/ProductsTable";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { onGetData } = useAuth();
  const [addProductShow, setAddProductShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onGetData("products", (querySnapShot) => {
      const docs = [];
      querySnapShot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setProducts(docs);
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
        <Badge badgeContent={products.length} color="secondary">
          <Typography variant="h4" sx={{ mb: "40px" }}>
            Productos
          </Typography>
        </Badge>
        <Stack gap={2} sx={{ textAlign: "center" }}>
          <Button
            size="large"
            variant="contained"
            color="success"
            sx={{ py: 2 }}
            onClick={() => setAddProductShow(true)}
          >
            <MedicalServicesOutlined sx={{ fontSize: "60px" }} />
          </Button>
          {!loading ? (
            products.length > 0 ? (
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
                <Divider sx={{ pt: "10px" }}>Lista de productos</Divider>
                <ProductsTable products={products} searchValue={searchValue} />
              </Box>
            ) : (
              <Alert variant="filled" severity="warning" sx={{ py: 3 }}>
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
      <NewProduct
        open={addProductShow}
        onClose={() => setAddProductShow(false)}
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

export default Products;
