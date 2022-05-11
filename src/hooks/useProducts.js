import { useState } from "react";

const useProducts = (initialState = {}) => {
  const [values, setValues] = useState(initialState);

  const handleInputChange = ({ target: { name, value } }) => {
    setValues({ ...values, [name]: value });
  };

  return [values, handleInputChange, setValues];
};

export default useProducts;
