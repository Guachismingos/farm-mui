import {
  MoneyOffOutlined,
  SentimentDissatisfiedOutlined,
} from "@mui/icons-material";
import { useAuth } from "./../../context/AuthContext";
import {
  Alert,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";

const OrdersTable = ({ orders, searchValue }) => {
  const { deleteOrder } = useAuth();
  const searchResult = orders.filter((order) => {
    const clientValues = (
      order.id +
      order.description +
      order.client.name +
      order.client.phone
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
        ) && order
    );
  });

  const handleDeleteOrder = async ({ target }) => {
    try {
      await deleteOrder(target.id);
    } catch (error) {
      return;
    }
  };

  return (
    <Box sx={{ maxHeight: "450px" }}>
      {searchResult.length > 0 ? (
        <Box>
          <List sx={{ maxHeight: "300px", overflow: "auto" }}>
            {searchResult.map(({ id, description, client }) => (
              <ListItem key={id} sx={{ bgcolor: "background" }}>
                <ListItemAvatar>
                  <Avatar variant="rounded">
                    <MoneyOffOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${client.name}, ${client.phone}`}
                  secondary={description}
                />
                <Box textAlign="end">
                  <Typography variant="body2" pr={1}>
                    Dirección: {client.address}
                  </Typography>
                </Box>
                <Box height="100%" py={2} pl={2}>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ py: 2 }}
                    id={id}
                    onClick={handleDeleteOrder}
                  >
                    X
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
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

export default OrdersTable;
