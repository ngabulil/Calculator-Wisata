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
      const formatted = response.result.map((item) => {
        return {
          ...item,
          days: item.days
          .sort((a, b) => a.id - b.id)
          .map((day) => {
            const formattedDay = { ...day };
            delete formattedDay.data;
            return {
              ...formattedDay,
              hotels: day.data.akomodasi.hotels,
              villas: day.data.akomodasi.villas,
              akomodasi_additionals: day.data.akomodasi.additional,
              mobils: day.data.transport.mobils,
              transport_additionals: day.data.transport.additional,
              tour: day.data.tours,
            }
          }),
        }
      });
      const data = [...formatted, { id: -1, name: "Lainnya" }];
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
