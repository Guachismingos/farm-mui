import Chart from "react-apexcharts";

const PendingChart = ({ theme, creditIncome, creditOutcome }) => {
  const options = {
    theme: { mode: theme.palette.mode },
    chart: {
      foreColor: theme.palette.text.primary,
      background: theme.palette.background.paper,
    },
    grid: {
      borderColor: "gray",
      padding: {
        left: 20,
      },
    },
    tooltip: { theme: theme.palette.mode },
    yaxis: {
      labels: {
        offsetX: 10,
        formatter: function (val) {
          return `₡ ${val.toLocaleString("en-US")}`;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `₡ ${val.toLocaleString("en-US")}`;
      },
      offsetX: 0,
    },
  };

  const series = [
    {
      name: "",
      data: [
        {
          x: "Cuentas por Cobrar",
          y: creditIncome,
          fillColor: theme.palette.warning.main,
        },
        {
          x: "Cuentas por Pagar",
          y: creditOutcome,
          fillColor: theme.palette.secondary.main,
        },
      ],
    },
  ];

  return <Chart options={options} series={series} height="300px" type="bar" />;
};

export default PendingChart;
