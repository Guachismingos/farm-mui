import {
  EggOutlined,
  HelpOutlineOutlined,
  SentimentDissatisfiedOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import NumberFormat from "react-number-format";
import { useNavigate } from "react-router-dom";

const ProductsTable = ({ products, searchValue }) => {
  const navigate = useNavigate();

  const searchResult = products.filter((product) => {
    const clientValues = (
      product.id +
      product.description +
      product.price
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
        ) && product
    );
  });

  return (
    <Box sx={{ maxHeight: "450px" }}>
      {searchResult.length > 0 ? (
        <Box>
          <List sx={{ maxHeight: "300px", overflow: "auto" }}>
            {searchResult.map(({ id, description, price }) => (
              <ListItemButton
                divider
                key={id}
                sx={{ bgcolor: "background" }}
                onClick={() => navigate(`/products/${id}`)}
              >
                <ListItemAvatar>
                  <Avatar variant="rounded">
                    <EggOutlined />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={description} secondary={id} />
                <Typography variant="body2" pr={1}>
                  Precio:{" "}
                  <NumberFormat
                    value={price}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="₡ "
                    decimalScale={2}
                  />
                </Typography>
                <HelpOutlineOutlined fontSize="large" color="info" />
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
export default ProductsTable;
