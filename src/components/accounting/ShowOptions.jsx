import { AssessmentOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Fragment, useCallback, useState } from "react";
import { useEffect } from "react";
import * as XLSX from "xlsx-js-style/dist/xlsx.bundle";

const ShowOptions = ({
  title,
  Icon,
  color,
  dateValue,
  setDateValue,
  setDisplayType,
  paidData,
  billData,
  displayType,
  recoveriesData,
}) => {
  const [dataIn, setDataIn] = useState([]);

  const [dataOut, setDataOut] = useState([]);

  const [orderedRecoveries, setOrderedRecoveries] = useState([]);

  const [loading, setLoading] = useState(true);

  const headerStyle = (colorRGB) => ({
    font: { bold: true, color: { rgb: "FFFFFF" }, sz: 14 },
    fill: { fgColor: { rgb: colorRGB } },
    border: {
      top: { style: "medium", color: { rgb: "000000" } },
      bottom: { style: "medium", color: { rgb: "000000" } },
      right: { style: "medium", color: { rgb: "000000" } },
      left: { style: "medium", color: { rgb: "000000" } },
    },
  });

  const cellStyle = {
    font: { color: { rgb: "000000" }, sz: 12 },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const headers = [
    [
      {
        v: "Cod.",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Nombre.",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Teléfono.",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Fecha.",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Debe.",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Haber.",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Total.",
        t: "s",
        s: headerStyle("26BB26"),
      },
    ],
  ];

  const headersRecoveries = [
    [
      {
        v: "Cod.",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Cod. Venta.",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Nombre Cliente",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Fecha.",
        t: "s",
        s: headerStyle("26BB26"),
      },
      {
        v: "Total.",
        t: "s",
        s: headerStyle("26BB26"),
      },
    ],
  ];

  const getIncomeSheetXLSX = (data) => {
    const worksheet = XLSX.utils.aoa_to_sheet(headers, { origin: "B2" });

    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: "J2" });
    XLSX.utils.sheet_add_aoa(worksheet, headersRecoveries, { origin: "R2" });
    XLSX.utils.sheet_add_aoa(worksheet, headersRecoveries, { origin: "X2" });
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: "Contado.",
            t: "s",
            s: headerStyle("26BB26"),
          },
        ],
      ],
      { origin: "B1" }
    );
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: "Credito.",
            t: "s",
            s: headerStyle("26BB26"),
          },
        ],
      ],
      { origin: "J1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: "Recuperaciones.",
            t: "s",
            s: headerStyle("26BB26"),
          },
          {
            v: "Efectivo.",
            t: "s",
            s: headerStyle("26BB26"),
          },
        ],
      ],
      { origin: "R1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: "Recuperaciones.",
            t: "s",
            s: headerStyle("26BB26"),
          },
          {
            v: "Bancarias.",
            t: "s",
            s: headerStyle("26BB26"),
          },
        ],
      ],
      { origin: "X1" }
    );

    const filteredPaidData = data.filter(({ credit }) => !credit);
    const filteredCreditData = data.filter(({ credit }) => credit);

    const getTotal = (data) => {
      let refValue = 0;
      data.forEach(({ total }) => {
        refValue += total.v;
      });
      return refValue;
    };

    const getPaid = (data) => {
      let refValue = 0;
      data.forEach(({ paid }) => {
        refValue += paid.v;
      });
      return refValue;
    };

    const getPending = (data) => {
      let refValue = 0;
      data.forEach(({ pending }) => {
        refValue += pending.v;
      });
      return refValue;
    };

    const getRecoveriesMoney = (data) => {
      let refValue = 0;
      data.forEach(({ paid, type }) => {
        if(type.v === 1){
          refValue += paid.v;
        }
      });
      return refValue;
    };

    const getRecoveriesTransfer = (data) => {
      let refValue = 0;
      data.forEach(({ paid, type }) => {
        if(type.v > 1){
          refValue += paid.v;
        }
      });
      return refValue;
    };

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: getPending(filteredPaidData),
            t: "s",
            s: cellStyle,
          },
        ],
      ],
      { origin: "F1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: getPaid(filteredPaidData),
            t: "s",
            s: cellStyle,
          },
        ],
      ],
      { origin: "G1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: getTotal(filteredPaidData),
            t: "s",
            s: cellStyle,
          },
        ],
      ],
      { origin: "H1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: getPending(filteredCreditData),
            t: "s",
            s: cellStyle,
          },
        ],
      ],
      { origin: "N1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: getPaid(filteredCreditData),
            t: "s",
            s: cellStyle,
          },
        ],
      ],
      { origin: "O1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: getTotal(filteredCreditData),
            t: "s",
            s: cellStyle,
          },
        ],
      ],
      { origin: "P1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: getRecoveriesMoney(orderedRecoveries),
            t: "s",
            s: cellStyle,
          },
        ],
      ],
      { origin: "V1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: getRecoveriesTransfer(orderedRecoveries),
            t: "s",
            s: cellStyle,
          },
        ],
      ],
      { origin: "AB1" }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      filteredPaidData.map(
        ({ id, name, phone, date, pending, paid, total }) => [
          id,
          name,
          phone,
          date,
          pending,
          paid,
          total,
        ]
      ),
      { origin: "B3", skipHeader: true }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      filteredCreditData.map(
        ({ id, name, phone, date, pending, paid, total }) => [
          id,
          name,
          phone,
          date,
          pending,
          paid,
          total,
        ]
      ),
      { origin: "J3", skipHeader: true }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      orderedRecoveries
        .filter(({ type }) => type.v === 1)
        .map(({ id, saleId, name, date, paid }) => [
          id,
          saleId,
          name,
          date,
          paid,
        ]),
      { origin: "R3", skipHeader: true }
    );

    XLSX.utils.sheet_add_aoa(
      worksheet,
      orderedRecoveries
        .filter(({ type }) => type.v > 1)
        .map(({ id, saleId, name, date, paid }) => [
          id,
          saleId,
          name,
          date,
          paid,
        ]),
      { origin: "X3", skipHeader: true }
    );

    worksheet["!cols"] = [
      { wch: 2 },
      { wch: 22 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 2 },
      { wch: 22 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 2 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 15 },
      { wch: 10 },
      { wch: 2 },
      { wch: 22 },
      { wch: 22 },
      { wch: 22 },
      { wch: 15 },
      { wch: 10 },
    ];
    return worksheet;
  };

  const getOutcomeSheetXLSX = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data, { origin: "B2" });
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          {
            v: "Cod.",
            t: "s",
            s: headerStyle("D93733"),
          },
          {
            v: "Descripción.",
            t: "s",
            s: headerStyle("D93733"),
          },
          {
            v: "Estado.",
            t: "s",
            s: headerStyle("D93733"),
          },
          {
            v: "Fecha.",
            t: "s",
            s: headerStyle("D93733"),
          },
          {
            v: "Debe.",
            t: "s",
            s: headerStyle("D93733"),
          },
          {
            v: "Haber.",
            t: "s",
            s: headerStyle("D93733"),
          },
          {
            v: "Total.",
            t: "s",
            s: headerStyle("D93733"),
          },
        ],
      ],
      { origin: "B2" }
    );
    worksheet["!cols"] = [
      { wch: 2 },
      { wch: 22 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];
    return worksheet;
  };

  const saveXlSX = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet1 = getIncomeSheetXLSX(dataIn);
    const worksheet2 = getOutcomeSheetXLSX(dataOut);
    XLSX.utils.book_append_sheet(workbook, worksheet1, "Ingreso");
    XLSX.utils.book_append_sheet(workbook, worksheet2, "Gasto");
    XLSX.writeFile(
      workbook,
      `Informe_${
        displayType < 2 ? (displayType === 0 ? "Diario" : "mensual") : "Anual"
      }_${dateValue.toLocaleDateString("es-CR")}.xlsx`
    );
  };

  const orderPaidData = useCallback(
    (data) => {
      const refData = [];
      data.forEach(
        ({
          id,
          clientData: { name, phone },
          date,
          credit,
          payAmount,
          total,
        }) => {
          refData.push({
            id: { v: id, t: "s", s: cellStyle },
            name: { v: name, t: "s", s: cellStyle },
            phone: { v: phone, t: "s", s: cellStyle },
            date: {
              v: new Date(date).toLocaleDateString("es-CR"),
              t: "s",
              s: cellStyle,
            },
            credit,
            pending: { v: total - payAmount, t: "s", s: cellStyle },
            paid: { v: payAmount, t: "s", s: cellStyle },
            total: { v: total, t: "s", s: cellStyle },
          });
        }
      );
      setDataIn(refData);
    },
    [dateValue, displayType]
  );

  const orderBillData = useCallback(
    (data) => {
      const refData = [];
      data.forEach(({ id, description, date, credit, payAmount, total }) => {
        refData.push({
          id: { v: id, t: "s", s: cellStyle },
          description: { v: description, t: "s", s: cellStyle },
          date: {
            v: new Date(date).toLocaleDateString("es-CR"),
            t: "s",
            s: cellStyle,
          },
          credit: {
            v: credit ? "Pendiente" : "Cancelado",
            t: "s",
            s: cellStyle,
          },
          pending: { v: total - payAmount, t: "s", s: cellStyle },
          paid: { v: payAmount, t: "s", s: cellStyle },
          total: { v: total, t: "s", s: cellStyle },
        });
      });
      setDataOut(refData);
    },
    [dateValue, displayType]
  );

  const orderRecoveryData = useCallback(
    (data) => {
      const refData = [];
      data.forEach(({ id, saleId, name, payAmount, date, type }) => {
        refData.push({
          id: { v: id, t: "s", s: cellStyle },
          saleId: { v: saleId, t: "s", s: cellStyle },
          name: { v: name, t: "s", s: cellStyle },
          date: {
            v: new Date(date).toLocaleDateString("es-CR"),
            t: "s",
            s: cellStyle,
          },
          paid: { v: payAmount, t: "s", s: cellStyle },
          type: { v: type, t: "s", s: cellStyle },
        });
      });
      setOrderedRecoveries(refData);
    },
    [dateValue, displayType]
  );

  useEffect(() => {
    setLoading(true);
    if (!!paidData) {
      orderPaidData(paidData);
      orderBillData(billData);
      orderRecoveryData(recoveriesData);
      setLoading(false);
    }
  }, [
    paidData,
    displayType,
    dateValue,
    orderPaidData,
    orderBillData,
    billData,
  ]);

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
        <Box>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              md={3}
              display="flex"
              gap={2}
              alignItems="center"
            >
              <Avatar variant="rounded" sx={{ background: color }}>
                {Icon}
              </Avatar>
              <Typography variant="body2">{title}</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <DatePicker
                disableFuture
                label="Fecha"
                openTo="day"
                views={["year", "month", "day"]}
                value={dateValue}
                onChange={(newValue) => {
                  setDateValue(newValue);
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  defaultValue={0}
                  name="displayType"
                  label="Tipo"
                  onChange={(event) => {
                    setDisplayType(event.target.value);
                  }}
                >
                  <MenuItem value={0}>Diario</MenuItem>
                  <MenuItem value={1}>Mensual</MenuItem>
                  <MenuItem value={2}>Anual</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} columnGap={2}>
              <Button
                disabled={loading}
                variant="contained"
                color="info"
                fullWidth
                sx={{ height: "100%" }}
                onClick={saveXlSX}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={30} />
                ) : (
                  <Fragment>
                    <AssessmentOutlined sx={{ paddingRight: 1 }} />
                    Generar informe
                  </Fragment>
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default ShowOptions;
