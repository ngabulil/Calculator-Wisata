import React from "react";

const GrandTotalContext = React.createContext();

export const useGrandTotalContext = () => React.useContext(GrandTotalContext);

const GrandTotalContextProvider = ({ children }) => {
  const [akomodasiTotal, setAkomodasiTotal] = React.useState([]);
  const [transportTotal, setTransportTotal] = React.useState([]);
  const [tourTotal, setTourTotal] = React.useState([]);

  const value = {
    akomodasiTotal,
    setAkomodasiTotal,
    transportTotal,
    setTransportTotal,
    tourTotal,
    setTourTotal,
  };
  return (
    <GrandTotalContext.Provider value={value}>
      {children}
    </GrandTotalContext.Provider>
  );
};

export default GrandTotalContextProvider;
