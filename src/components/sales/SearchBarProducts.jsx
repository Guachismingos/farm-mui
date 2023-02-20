import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSale } from "../../context/saleContext";

const SearchBarProducts = ({ product, setProduct }) => {
  const { selectedProducts } = useSale();
  const { onGetData } = useAuth();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const loading = open && options.length === 0;

  const handleOnChange = (_, value) => {
    if (value) {
      setProduct({
        ...value,
        quantity: 1,
        total: value.price,
      });
    } else {
      setProduct(null);
    }
  };

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }
    (async () => {
      if (active) {
        onGetData("products", (querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            if (!Object.keys(selectedProducts).includes(doc.id)) {
              docs.push({ ...doc.data(), id: doc.id });
            }
          });
          setOptions(docs);
        });
      }
    })();
    return () => {
      active = false;
    };
  }, [loading, onGetData, selectedProducts]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      onChange={handleOnChange}
      value={product}
      options={options}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.id === `${value.id}`}
      getOptionLabel={({ description, price }) =>
        `${description}, ₡ ${price.toLocaleString("en-US")}`
      }
      noOptionsText="No se encontraron productos..."
      renderInput={(params) => (
        <TextField
          {...params}
          label={
            <Typography sx={{ display: "flex", justifyContent: "center" }}>
              <Search sx={{ pr: 1 }} />
              Buscar Producto...
            </Typography>
          }
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default SearchBarProducts;
