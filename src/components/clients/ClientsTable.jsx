import {
  Business,
  HelpOutlineOutlined,
  PersonOutlined,
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
} from "@mui/material";
import { amber, blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const ClientsTable = ({ clients, searchValue }) => {
  const navigate = useNavigate();

  const searchResult = clients.filter((client) => {
    const clientValues = (
      client.name +
      (client.type === "1" ? "Físico" : "Jurídico") +
      client.phone +
      client.address
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
        ) && client
    );
  });

  return (
    <Box sx={{ maxHeight: "450px" }}>
      {searchResult.length > 0 ? (
        <Box>
          <List sx={{ maxHeight: "300px", overflow: "auto" }}>
            {searchResult.map(({ name, type, phone }) => (
              <ListItemButton
                divider
                key={phone}
                sx={{ bgcolor: "background" }}
                onClick={() => navigate(`/clients/${phone}`)}
              >
                <ListItemAvatar>
                  {type === 1 ? (
                    <Avatar variant="rounded" sx={{ bgcolor: blue[600] }}>
                      <PersonOutlined />
                    </Avatar>
                  ) : (
                    <Avatar variant="rounded" sx={{ bgcolor: amber[600] }}>
                      <Business />
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText primary={name} secondary={phone} />
                <HelpOutlineOutlined fontSize="large" color="info" />
              </ListItemButton>
            ))}
          </List>
        </Box>
      ) : (
        <Alert
          severity="warning"
          icon={<SentimentDissatisfiedOutlined sx={{ fontSize: "50px" }} />}
          sx={{ display: "flex", alignItems: "center" }}
        >
          No se encontraron resultados...
        </Alert>
      )}
    </Box>
  );
};

export default ClientsTable;
