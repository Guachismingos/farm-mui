import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import InfoField from "../components/accounting/InfoField";
import {
  AccountBalanceOutlined,
  AttachMoneyOutlined,
  MoneyOffOutlined,
  PendingActionsOutlined,
  SettingsApplicationsOutlined,
} from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import AccountingChart from "../components/accounting/AccountingChart";
import ShowOptions from "../components/accounting/ShowOptions";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import bgLocale from "date-fns/locale/es";
import PendingChart from "../components/accounting/PendingChart";

const Accounting = () => {
  const theme = useTheme();
  const {
    getIncomeDataDaily,
    getIncomeDataMonthly,
    getIncomeDataYearly,
    getOutComeDataDaily,
    getOutcomeDataMonthly,
    getOutcomeDataYearly,
    getPaidOrNotQuery,
    getBillsPaidOrNotQuery,
    getRecoveryDataDaily,
    getRecoveryDataMonthly,
    getRecoveryDataYearly,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [outComeData, setOutComeData] = useState([]);
  const [pendingIncomeData, setPendingIncomeData] = useState([]);
  const [pendingOutcomeData, setPendingOutcomeData] = useState([]);
  const [recoveriesData, setRecoveriesData] = useState([]);
  const [dateValue, setDateValue] = useState(new Date());
  const [displayType, setDisplayType] = useState(0);

  const getPaidSalesAmount = (data) => {
    let reftotal = 0;
    data.forEach(({ payAmount }) => {
      reftotal += payAmount;
    });
    return reftotal;
  };

  const getPendingIncome = (data) => {
    const filteredData = data.filter(({ paid }) => !paid);
    let reftotal = 0;
    filteredData.forEach(({ total, payAmount }) => {
      reftotal += total - payAmount;
    });
    return reftotal;
  };

  const handleLoadData = useCallback(
    async (setData, getQuery, refDateValue) => {
      try {
        setLoading(true);
        const querySnapshot = await getQuery(refDateValue);
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setData(docs);
        setLoading(false);
      } catch (err) {
      }
    },
    []
  );

  useLayoutEffect(() => {
    switch (displayType) {
      case 0:
        handleLoadData(setIncomeData, getIncomeDataDaily, dateValue);
        handleLoadData(setOutComeData, getOutComeDataDaily, dateValue);
        handleLoadData(setRecoveriesData, getRecoveryDataDaily, dateValue);
        break;
      case 1:
        handleLoadData(setIncomeData, getIncomeDataMonthly, dateValue);
        handleLoadData(setOutComeData, getOutcomeDataMonthly, dateValue);
        handleLoadData(setRecoveriesData, getRecoveryDataMonthly, dateValue);
        break;
      case 2:
        handleLoadData(setIncomeData, getIncomeDataYearly, dateValue);
        handleLoadData(setOutComeData, getOutcomeDataYearly, dateValue);
        handleLoadData(setRecoveriesData, getRecoveryDataYearly, dateValue);
        break;
      default:
        break;
    }
  }, [
    dateValue,
    displayType,
    getIncomeDataDaily,
    getOutComeDataDaily,
    getIncomeDataMonthly,
    getOutcomeDataMonthly,
    getIncomeDataYearly,
    getOutcomeDataYearly,
    handleLoadData,
  ]);

  useEffect(() => {
    const handleLoadPendingData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getPaidOrNotQuery(false);
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setPendingIncomeData(docs);
        setLoading(false);
      } catch (err) {
      }
    };
    const handleLoadPendingBillsData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getBillsPaidOrNotQuery(false);
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id });
        });
        setPendingOutcomeData(docs);
        setLoading(false);
      } catch (err) {
      }
    };
    handleLoadPendingData();
    handleLoadPendingBillsData();
  }, [getBillsPaidOrNotQuery, getPaidOrNotQuery]);

  return (
    <Container
      maxWidth={false}
      sx={{
        pt: "50px",
        px: 0,
        height: "100%",
        position: "fixed",
        overflow: "auto",
      }}
    >
      <Container
        className="animate__animated animate__zoomIn animate__faster"
        maxWidth="xl"
        sx={{ textAlign: "center", pb: 25 }}
      >
        <Typography variant="h4" sx={{ mb: "40px" }}>
          Contabilidad
        </Typography>

        <Stack
          id="report"
          paddingY={2}
          className="animate__animated animate__zoomIn animate__faster"
        >
          <Grid container spacing={2} padding={1} justifyContent="center">
            <Grid item xs={12} display="flex">
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={bgLocale}
              >
                <ShowOptions
                  title="Ajustes"
                  Icon={<SettingsApplicationsOutlined />}
                  color={theme.palette.info.main}
                  dateValue={dateValue}
                  setDateValue={setDateValue}
                  displayType={displayType}
                  setDisplayType={setDisplayType}
                  paidData={incomeData}
                  billData={outComeData}
                  recoveriesData={recoveriesData}
                />
              </LocalizationProvider>
            </Grid>
            {!loading ? (
              <Fragment>
                <Grid item xs={12} md={12} lg={12 / 5} display="flex">
                  <InfoField
                    title="Balance"
                    value={
                      getPaidSalesAmount(incomeData) -
                      getPaidSalesAmount(outComeData)
                    }
                    Icon={<AccountBalanceOutlined />}
                    color={theme.palette.primary.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={12 / 5} display="flex">
                  <InfoField
                    title="Ventas Cobradas"
                    value={getPaidSalesAmount(incomeData)}
                    Icon={<AttachMoneyOutlined />}
                    color={theme.palette.success.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={12 / 5} display="flex">
                  <InfoField
                    title="Gastos Pagados"
                    value={getPaidSalesAmount(outComeData)}
                    Icon={<MoneyOffOutlined />}
                    color={theme.palette.error.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={12 / 5} display="flex">
                  <InfoField
                    title="Cuentas por Cobrar"
                    value={getPendingIncome(pendingIncomeData)}
                    Icon={<PendingActionsOutlined />}
                    color={theme.palette.warning.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={12 / 5} display="flex">
                  <InfoField
                    title="Cuentas por Pagar"
                    value={getPendingIncome(pendingOutcomeData)}
                    Icon={<PendingActionsOutlined />}
                    color={theme.palette.secondary.main}
                  />
                </Grid>
                <Grid item xs={12} md={(12 / 5) * 3.5} display="flex">
                  <Paper
                    sx={{
                      p: 2,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box flexGrow={1}>
                      <Typography
                        textAlign="start"
                        variant="body2"
                        paddingBottom={1}
                      >
                        Resultados, <b>Ventas - Gastos</b>
                      </Typography>
                      <AccountingChart
                        year={dateValue.getFullYear()}
                        month={dateValue.getMonth()}
                        theme={theme}
                        paidData={incomeData}
                        billData={outComeData}
                        displayType={displayType}
                      />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={(12 / 5) * 1.5} display="flex">
                  <Paper
                    sx={{
                      p: 2,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box flexGrow={1}>
                      <Typography
                        textAlign="start"
                        variant="body2"
                        paddingBottom={1}
                      >
                        Resultados, Cuentas por <b>"Cobrar - Pagar"</b>
                      </Typography>
                      <PendingChart
                        theme={theme}
                        creditIncome={getPendingIncome(pendingIncomeData)}
                        creditOutcome={getPendingIncome(pendingOutcomeData)}
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Fragment>
            ) : (
              <Box>
                <CircularProgress size="50px" color="inherit" sx={{ mt: 3 }} />
              </Box>
            )}
          </Grid>
        </Stack>
      </Container>
    </Container>
  );
};

export default Accounting;
