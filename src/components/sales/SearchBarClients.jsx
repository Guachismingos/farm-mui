import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const SearchBarClients = (props) => {
  const { onGetData } = useAuth();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);

  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }
    (async () => {
      if (active) {
        onGetData("clients", (querySnapshot) => {
          const docs = [];
          querySnapshot.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });
          setOptions(docs);
        });
      }
    })();
    return () => {
      active = false;
    };
  }, [loading, onGetData]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      {...props}
      options={options}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      groupBy={({ type }) => (type === 1 ? "Físico" : "Jurídico")}
      isOptionEqualToValue={(option, value) =>
        option.phone === `${value.phone}`
      }
      getOptionLabel={({ name, phone }) => `${name}, ${phone}`}
      noOptionsText="No se encontraron clientes..."
      renderInput={(params) => (
        <TextField
          {...params}
          label={"Seleccione el cliente..."}
          required
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

export default SearchBarClients;
