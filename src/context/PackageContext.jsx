import React from "react";
import { apiGetAllPaket } from "../services/calculator/paket";

const PackageContext = React.createContext();

export const usePackageContext = () => {
  return React.useContext(PackageContext);
};

const PackageContextProvider = ({ children }) => {
  const [packagesData, setPackagesData] = React.useState([]);
  const [selectedPackage, setSelectedPackage] = React.useState({
    days: [],
  });

  const getPackages = async () => {
    try {
      const response = await apiGetAllPaket();
      const data = [...response.result, { id: -1, name: "Lainnya" }];
      setPackagesData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    packagesData,
    getPackages,
    selectedPackage,
    setSelectedPackage,
  };
  return (
    <PackageContext.Provider value={value}>{children}</PackageContext.Provider>
  );
};

export default PackageContextProvider;
