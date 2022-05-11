import {
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useSale } from "../../context/saleContext";

const SelectedProductsTable = () => {
  const columns = [
    { id: "description", label: "item" },
    {
      id: "price",
      label: "Precio ₡",
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "quantity",
      label: "Cantidad",
      align: "right",
    },
    {
      id: "total",
      label: "Total ₡",
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];

  const { selectedProducts, total, handleChangeQuantity } = useSale();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "auto" }}>
      {Object.values(selectedProducts).length > 0 ? (
        <Fragment>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ maxWidth: column.maxWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(selectedProducts)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell
                              key={column.id}
                              style={{ maxWidth: column.maxWidth }}
                              align={column.align}
                            >
                              {column.id !== "quantity" ? (
                                column.format && typeof value === "number" ? (
                                  column.format(value)
                                ) : (
                                  value
                                )
                              ) : (
                                <TextField
                                  type="number"
                                  name={row.id}
                                  value={row.quantity}
                                  onChange={handleChangeQuantity}
                                  inputProps={{
                                    min: 1,
                                    style: {
                                      textAlign: "right",
                                      padding: 1,
                                      maxWidth: 50,
                                    },
                                  }}
                                />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">
                    {total.toLocaleString("en-US")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={Object.values(selectedProducts).length}
            rowsPerPage={rowsPerPage}
            labelRowsPerPage="Mostrar"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Fragment>
      ) : (
        <Alert severity="info" sx={{ py: 3 }}>
          Aun no se han ingresado productos.
        </Alert>
      )}
    </Paper>
  );
};

export default SelectedProductsTable;
