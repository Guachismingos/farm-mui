import {
  AddCardOutlined,
  PaidOutlined,
  SentimentDissatisfiedOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
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
      (sale.credit ? "credito" : "contado")
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
            ({ id, clientData: { name, phone }, date, credit, total }) => (
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
                    <Typography variant="caption">{date}</Typography>
                    <Chip
                      size="small"
                      variant="filled"
                      color={credit ? "warning" : "success"}
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
