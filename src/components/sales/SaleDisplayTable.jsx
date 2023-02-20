import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Fragment, useState } from "react";

const SaleDisplayTable = ({ products, total, all }) => {
  const columns = [
    { id: "description", label: "Item" },
    {
      id: "price",
      label: "Precio \u00A2",
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
      label: "Total \u00A2",
      align: "right",
      format: (value) => value.toLocaleString("en-US"),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    all ? Object.keys(products).length : 5
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "auto", borderRadius: 0 }}>
      {Object.values(products).length > 0 ? (
        <Fragment>
          <TableContainer sx={{ maxHeight: !all && 440 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        maxWidth: column.maxWidth,
                        color: all && "black",
                        background: all && "white",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(products)
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
                              style={{
                                maxWidth: column.maxWidth,
                                color: all && "black",
                                background: all && "white",
                              }}
                              align={column.align}
                            >
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                <TableRow>
                  <TableCell
                    style={{
                      color: all && "black",
                      background: all && "white",
                    }}
                    colSpan={2}
                  />
                  <TableCell
                    style={{
                      color: all && "black",
                      background: all && "white",
                    }}
                    align="right"
                  >
                    Total &cent;
                  </TableCell>
                  <TableCell
                    style={{
                      color: all && "black",
                      background: all && "white",
                    }}
                    align="right"
                  >
                    {total.toLocaleString("en-US")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {!all && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={Object.values(products).length}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage="Mostrar"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Fragment>
      ) : (
        <Alert variant="filled" severity="info" sx={{ py: 3 }}>
          <CircularProgress /> Cargando productos.
        </Alert>
      )}
    </Paper>
  );
};

export default SaleDisplayTable;
