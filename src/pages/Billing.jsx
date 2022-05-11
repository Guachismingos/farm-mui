import { Badge, Container, Typography } from "@mui/material";

const Billing = () => {
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
      </Container>
    </Container>
  );
};

export default Billing;
