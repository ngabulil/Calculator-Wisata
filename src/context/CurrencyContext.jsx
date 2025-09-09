import React from "react";

const CurrencyContext = React.createContext();

export const useCurrencyContext = () => React.useContext(CurrencyContext);

const CurrencyContextProvider = ({ children }) => {
    const [currency, setCurrency] = React.useState("IDR");

    return (
      <CurrencyContext.Provider value={{ currency, setCurrency }}>
        {children}
      </CurrencyContext.Provider>  
    );
};

export default CurrencyContextProvider;