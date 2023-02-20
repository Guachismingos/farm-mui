import Chart from "react-apexcharts";

import es from "apexcharts/dist/locales/es.json";

const AccountingChart = ({
  theme,
  paidData,
  billData,
  year,
  month,
  displayType,
}) => {
  const getLiquid = (month, year, refPaidData) => {
    const date = new Date(year, displayType < 2 ? month : 0, 1);
    const days = [];
    while (
      displayType < 2 ? date.getMonth() === month : date.getFullYear() === year
    ) {
      days.push({
        x: new Date(date).getTime(),
        y: getDayTotal(date.toDateString(), refPaidData),
      });
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getLiquidBalance = (refPaidData, refBillData) => {
    const result = [];
    for (let i = 0; i < refPaidData.length; i++) {
      result.push({
        ...refPaidData[i],
        y: refPaidData[i].y - refBillData[i].y,
      });
    }
    return result;
  };

  const getDayTotal = (dateRef, amounts) => {
    let amount = 0;
    amounts.forEach(({ payArray }) => {
      payArray?.forEach(({ payAmount, date }) => {
        if (date === dateRef) {
          amount += payAmount;
        }
      });
    });

    return amount;
  };

  const monthlyLiquidPaid = getLiquid(month, year, paidData);
  const monthlyLiquidBill = getLiquid(month, year, billData);
  const monthlyLiquidBalance = getLiquidBalance(
    monthlyLiquidPaid,
    monthlyLiquidBill
  );

  const options = {
    theme: { mode: theme.palette.mode },
    chart: {
      foreColor: theme.palette.text.primary,
      background: theme.palette.background.paper,
      id: "resumen-chart",
      locales: [es],
      defaultLocale: "es",
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: false,
      },
    },
    grid: {
      borderColor: "gray",
      padding: {
        left: 20,
      },
    },
    tooltip: { theme: theme.palette.mode },
    colors: [
      theme.palette.success.main,
      theme.palette.error.main,
      theme.palette.primary.main,
    ],
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      labels: {
        offsetX: 10,
        formatter: function (val) {
          return `₡ ${val.toLocaleString("en-US")}`;
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [50, 90, 100],
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val === 0 ? undefined : `₡ ${val.toLocaleString("en-US")}`;
      },
      offsetX: 0,
    },
  };

  const series = [
    { name: "Ventas Cobradas", data: monthlyLiquidPaid },
    { name: "Gastos Pagados", data: monthlyLiquidBill },
    { name: "Balance", data: monthlyLiquidBalance },
  ];

  return <Chart options={options} series={series} height="300px" type="area" />;
};

export default AccountingChart;
