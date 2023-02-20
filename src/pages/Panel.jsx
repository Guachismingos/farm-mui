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
  SsidChartOutlined,
  MoneyOffCsredOutlined,
  BookmarkBorderOutlined,
} from "@mui/icons-material/";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

const CardButton = ({ title, color, Icon, to }) => {
  const navigate = useNavigate();
  return (
    <Grid item xs={12} sm={5} md={3}>
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
        pt: "50px",
        px: 0,
        height: "100%",
        position: "fixed",
        overflow: "auto",
      }}
    >
      <Container
        className="animate__animated animate__zoomIn animate__faster"
        maxWidth="lg"
        sx={{ textAlign: "center" }}
      >
        <Typography variant="h4" sx={{ mb: "40px" }}>
          Panel de Control
        </Typography>
        <Grid container gap={3} sx={{ pb: 25, placeContent: "center" }}>
          <CardButton
            title="Pedidos"
            color={palette.success.light}
            Icon={BookmarkBorderOutlined}
            to="/orders"
          />
          <CardButton
            title="Ventas"
            color={palette.primary.main}
            Icon={ShoppingCartOutlined}
            to="/sales"
          />
          <CardButton
            title="Gastos"
            color={palette.error.light}
            Icon={MoneyOffCsredOutlined}
            to="/billing"
          />
          <CardButton
            title="Contabilidad"
            color={palette.warning.light}
            Icon={SsidChartOutlined}
            to="/accounting"
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
