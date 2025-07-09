import React, { createContext, useContext, useState } from "react";
import {
  apiGetAllActivityDetails,
  apiGetAllActivityVendors,
} from "../../services/activityService";

const AdminActivityContext = createContext();

export const useAdminActivityContext = () => {
  return useContext(AdminActivityContext);
};

const AdminActivityContextProvider = ({ children }) => {
  const [allActivityDetails, setAllActivityDetails] = useState([]);
  const [allActivityVendors, setAllActivityVendors] = useState([]);
  const [activityData, setActivityData] = useState({
    id: "",
    vendor_id: "",
    name: "",
    price_foreign_adult: 0,
    price_foreign_child: 0,
    price_domestic_adult: 0,
    price_domestic_child: 0,
    keterangan: "",
    note: "",
  });

  const getAllActivityDetails = async () => {
    try {
      const responseVendors = await apiGetAllActivityVendors();
      const responseDetails = await apiGetAllActivityDetails();

      const vendorMap = responseVendors.result.reduce((acc, vendor) => {
        acc[vendor.id] = vendor;
        return acc;
      }, {});

      const result = responseDetails.result.map((act) => ({
        ...act,
        vendor: vendorMap[act.vendor_id] || null,
      }));

      setAllActivityDetails(result);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllActivityVendors = async () => {
    try {
      const response = await apiGetAllActivityVendors();

      setAllActivityVendors(response.result);
      return response.result;
    } catch (error) {
      console.log(error);
    }
  };

  const updateActivityData = (partial) => {
    setActivityData((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const value = {
    activityData,
    allActivityDetails,
    setActivityData,
    updateActivityData,
    getAllActivityDetails,
    allActivityVendors,
    getAllActivityVendors,
  };

  return (
    <AdminActivityContext.Provider value={value}>
      {children}
    </AdminActivityContext.Provider>
  );
};

export default AdminActivityContextProvider;
