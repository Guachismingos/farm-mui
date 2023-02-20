import Panel from "../pages/Panel";
import Sales from "../pages/Sales";
import Billing from "../pages/Billing";
import Products from "../pages/Products";
import Clients from "../pages/Clients";
import ClientDisplay from "../components/clients/ClientDisplay";
import ProductDisplay from "../components/products/ProductDisplay";
import SaleDisplay from "../components/sales/SaleDisplay";
import Accounting from "../pages/Accounting";
import Orders from "./../pages/Orders";

const routes = [
  {
    path: "/panel",
    Component: Panel,
    name: "Panel de Control",
  },
  {
    path: "/orders",
    Component: Orders,
    name: "Pedidos",
  },
  {
    path: "/sales",
    Component: Sales,
    name: "Ventas",
  },
  {
    path: "/sales/:id",
    Component: SaleDisplay,
    name: "Venta",
  },
  {
    path: "/billing",
    Component: Billing,
    name: "Gastos",
  },
  {
    path: "/accounting",
    Component: Accounting,
    name: "Contabilidad",
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
