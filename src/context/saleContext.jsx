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
  const [credit, setCredit] = useState(false);
  const [done, setDone] = useState(true);
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

  const handleResetData = () => {
    setSelectedProducts({});
    setTotal(0);
    setClient(null);
    setPayWith(1);
    setCredit(false);
    setPayAmount(0);
  };

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
    payAmount,
    credit,
    setCredit,
    setPayAmount,
    handleResetData,
    done,
    setDone,
  };

  useEffect(() => {
    setTotal(0);
    Object.values(selectedProducts).forEach(({ total }) =>
      setTotal((AllTotal) => AllTotal + parseInt(total))
    );
  }, [selectedProducts]);

  return <SaleContext.Provider value={value}>{children}</SaleContext.Provider>;
};
