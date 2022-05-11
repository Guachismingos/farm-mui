import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Badge, Button, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import NewSale from "../components/sales/NewSale";
import { useAuth } from "../context/AuthContext";
import { SaleProvider } from "../context/saleContext";

const Sales = () => {
  const [addSaleShow, setAddSaleShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [sales, setSales] = useState([]);

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
        <Badge badgeContent={2} color="secondary">
          <Typography variant="h4" sx={{ mb: "80px" }}>
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
        </Stack>
        <SaleProvider>
          <NewSale
            open={addSaleShow}
            onClose={() => setAddSaleShow(false)}
            showSnack={setShowSnack}
          />
        </SaleProvider>
      </Container>
    </Container>
  );
};

export default Sales;
