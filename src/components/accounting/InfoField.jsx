import { Avatar, Box, Paper, Typography } from "@mui/material";
import React from "react";
import NumberFormat from "react-number-format";

const InfoField = ({ value, title, Icon, color }) => {
  return (
    <Paper
      sx={{
        p: 2,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box flexGrow={1}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar variant="rounded" sx={{ background: color }}>
            {Icon}
          </Avatar>
          <Typography variant="body2">{title}</Typography>
        </Box>
        <Typography textAlign="end" variant="body1">
          <NumberFormat
            value={value}
            displayType="text"
            thousandSeparator={true}
            prefix="₡ "
            decimalScale={2}
          />
        </Typography>
      </Box>
    </Paper>
  );
};

export default InfoField;
