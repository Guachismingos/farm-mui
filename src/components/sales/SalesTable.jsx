import {
  AddCardOutlined,
  PaidOutlined,
  SentimentDissatisfiedOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Chip,
  List,
  ListItemButton,
  Typography,
} from "@mui/material";
import NumberFormat from "react-number-format";
import { useNavigate } from "react-router-dom";

const SalesTable = ({ sales, searchValue }) => {
  const navigate = useNavigate();
  const searchResult = sales.filter((sale) => {
    const clientValues = (
      sale.id +
      sale.clientData.id +
      sale.clientData.name +
      (sale.credit ? "credito" : "contado") +
      (sale.paid ? "cancelado cancelada" : "por cobrar") +
      (sale.done ? "entregado" : "entrega pendiente")
    ).toLowerCase();
    return (
      clientValues
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          searchValue
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        ) && sale
    );
  });

  return (
    <Box sx={{ maxHeight: "450px" }}>
      {searchResult.length > 0 ? (
        <List sx={{ maxHeight: "300px", overflow: "auto" }}>
          {searchResult.map(
            ({
              id,
              clientData: { name, phone },
              date,
              credit,
              total,
              paid,
              done,
            }) => (
              <ListItemButton
                divider
                key={id}
                sx={{ bgcolor: "background" }}
                onClick={() => navigate(`/sales/${id}`)}
              >
                <Box
                  display="grid"
                  columnGap={1}
                  gridTemplateColumns="1fr 9fr 3fr"
                  width="100%"
                >
                  <Avatar variant="rounded">
                    {credit ? <AddCardOutlined /> : <PaidOutlined />}
                  </Avatar>
                  <Box>
                    <Typography>{`${name}, ${phone}`}</Typography>
                    <Typography variant="body2">{id}</Typography>
                    <Badge
                      variant="dot"
                      color="error"
                      invisible={paid}
                      sx={{ mr: 1 }}
                    >
                      <Chip
                        size="small"
                        variant="filled"
                        color={paid ? "success" : "warning"}
                        label={paid ? "Cancelado" : "Por cobrar!"}
                      />
                    </Badge>
                    <Badge variant="dot" color="error" invisible={done}>
                      <Chip
                        size="small"
                        variant="filled"
                        color={done ? "success" : "warning"}
                        label={done ? "Entregado" : "Entrega Pendiente!"}
                      />
                    </Badge>
                  </Box>
                  <Box textAlign="end">
                    <Typography variant="caption">
                      Total:{" "}
                      <NumberFormat
                        value={total}
                        displayType="text"
                        thousandSeparator={true}
                        prefix="₡ "
                        decimalScale={2}
                      />
                    </Typography>
                    <br />
                    <Typography variant="caption">
                      {new Date(date).toLocaleDateString("es-CR")}
                    </Typography>
                    <Chip
                      size="small"
                      variant="filled"
                      color={credit ? "secondary" : "primary"}
                      label={credit ? "Crédito" : "Contado"}
                    />
                  </Box>
                </Box>
              </ListItemButton>
            )
          )}
        </List>
      ) : (
        <Alert
          variant="filled"
          severity="warning"
          icon={<SentimentDissatisfiedOutlined sx={{ fontSize: "50px" }} />}
          sx={{ display: "flex", alignItems: "center", mt: 2 }}
        >
          No se encontraron resultados...
        </Alert>
      )}
    </Box>
  );
};

export default SalesTable;
