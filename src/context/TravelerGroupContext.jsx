import React from "react";

const TravelerGroupContext = React.createContext({
  activeTravelerKey: "adult",
  isAdultActive: true,
});

export const TravelerGroupProvider = ({ value, children }) => (
  <TravelerGroupContext.Provider value={value}>
    {children}
  </TravelerGroupContext.Provider>
);

export const useTravelerGroup = () => React.useContext(TravelerGroupContext);
