import Panel from "../pages/Panel";
import Sales from "../pages/Sales";
import Billing from "../pages/Billing";
import Products from "../pages/Products";
import Clients from "../pages/Clients";
import ClientDisplay from "../components/clients/ClientDisplay";
import ProductDisplay from "../components/products/ProductDisplay";
import NewSale from "../components/sales/NewSale";

const routes = [
  {
    path: "/panel",
    Component: Panel,
    name: "Panel de Control",
  },
  {
    path: "/sales",
    Component: Sales,
    name: "Ventas",
  },
  {
    path: "/billing",
    Component: Billing,
    name: "Cuentas por Cobrar",
  },
  {
    path: "/products",
    Component: Products,
    name: "Productos",
  },
  {
    path: "/products/:id",
    Component: ProductDisplay,
    name: "Producto",
  },
  {
    path: "/clients",
    Component: Clients,
    name: "Clientes",
  },
  {
    path: "/clients/:id",
    Component: ClientDisplay,
    name: "Cliente",
  },
];

export default routes;
