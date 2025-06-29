import React from "react";

const CheckoutContext = React.createContext();

export const useCheckoutContext = () => {
  return React.useContext(CheckoutContext);
};

const CheckoutContextProvider = ({ children }) => {
  const [akomodasiTotal, setAkomodasiTotal] = React.useState(0);
  const [transportTotal, setTransportTotal] = React.useState(0);

  const value = {
    akomodasiTotal,
    setAkomodasiTotal,
    transportTotal,
    setTransportTotal,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutContextProvider;
