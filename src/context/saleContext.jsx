import { useContext, createContext, useState, useEffect } from "react";

const SaleContext = createContext({});

export const useSale = () => {
  return useContext(SaleContext);
};

export const SaleProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState({});
  const [total, setTotal] = useState(0);
  const [client, setClient] = useState(null);
  const [payWith, setPayWith] = useState(1);
  const [payAmount, setPayAmount] = useState(0);

  const handleChangeQuantity = ({ target: { name, value } }) => {
    const tempUpdate = Object.values(selectedProducts).find(
      (item) => item.id === name
    );
    setSelectedProducts({
      ...selectedProducts,
      [name]: {
        ...tempUpdate,
        quantity: value,
        total: tempUpdate.price * value,
      },
    });
  };

  const handleChangeAmout = ({ target: { name, value } }) => {};

  const value = {
    client,
    setClient,
    selectedProducts,
    setSelectedProducts,
    total,
    setTotal,
    handleChangeQuantity,
    payWith,
    setPayWith,
  };

  useEffect(() => {
    setTotal(0);
    Object.values(selectedProducts).forEach(({ total }) =>
      setTotal((AllTotal) => AllTotal + parseInt(total))
    );
  }, [selectedProducts]);

  return <SaleContext.Provider value={value}>{children}</SaleContext.Provider>;
};
