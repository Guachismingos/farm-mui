import {
  MoneyOffOutlined,
  SentimentDissatisfiedOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import NumberFormat from "react-number-format";

const BillsTable = ({ bills, searchValue, setSelectedId, setPayBillShow }) => {
  const searchResult = bills.filter((bill) => {
    const clientValues = (
      bill.id +
      bill.description +
      bill.price
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
        ) && bill
    );
  });

  return (
    <Box sx={{ maxHeight: "450px" }}>
      {searchResult.length > 0 ? (
        <Box>
          <List sx={{ maxHeight: "300px", overflow: "auto" }}>
            {searchResult.map(({ id, description, total, date, credit }) => (
              <ListItemButton
                divider
                key={id}
                sx={{ bgcolor: "background" }}
                onClick={() => {
                  setSelectedId(id);
                  setPayBillShow(true);
                }}
              >
                <ListItemAvatar>
                  <Avatar variant="rounded">
                    <MoneyOffOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={description}
                  secondary={`Fecha: ${new Date(date).toLocaleDateString(
                    "es-CR"
                  )}`}
                />
                <Box textAlign="end">
                  <Typography variant="body2" pr={1}>
                    Total:{" "}
                    <NumberFormat
                      value={total}
                      displayType="text"
                      thousandSeparator={true}
                      prefix="₡ "
                      decimalScale={2}
                    />
                  </Typography>
                  <Chip
                    size="small"
                    variant="filled"
                    color={credit ? "warning" : "success"}
                    label={credit ? "Crédito" : "Contado"}
                  />
                </Box>
              </ListItemButton>
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
export default BillsTable;
