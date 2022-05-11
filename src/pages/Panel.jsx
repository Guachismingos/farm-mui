import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import {
  ShoppingCartOutlined,
  EggOutlined,
  GroupOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material/";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

const CardButton = ({ title, color, Icon, to }) => {
  const navigate = useNavigate();
  return (
    <Grid item xs={12} sm={6}>
      <CardActionArea>
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: "50px",
            background: `${color}`,
          }}
          onClick={() => navigate(to)}
        >
          <CardContent>
            <Icon sx={{ fontSize: 60 }} />
            <Typography variant="h6" mt={1}>
              {title}
            </Typography>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
};

const Panel = () => {
  const { palette } = useTheme();
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
        sx={{ textAlign: "center" }}
      >
        <Typography variant="h4" sx={{ mb: "80px" }}>
          Panel de Control
        </Typography>
        <Grid sx={{ pb: 10 }} container spacing={3}>
          <CardButton
            title="Ventas"
            color={palette.primary.main}
            Icon={ShoppingCartOutlined}
            to="/sales"
          />
          <CardButton
            title="Cuentas"
            color={palette.success.main}
            Icon={ReceiptLongOutlined}
            to="/billing"
          />
          <CardButton
            title="Productos"
            color={palette.info.main}
            Icon={EggOutlined}
            to="/products"
          />
          <CardButton
            title="Clientes"
            color={palette.secondary.main}
            Icon={GroupOutlined}
            to="/clients"
          />
        </Grid>
      </Container>
    </Container>
  );
};

export default Panel;
