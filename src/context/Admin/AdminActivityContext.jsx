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
  const [activityModalData, setActivityModalData] = useState({});
  const [vendorData, setVendorData] = useState({
    id: 0,
    name: "",
  });
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
  const [activityDraft, setActivityDraft] = useState({});
  const [vendorDraft, setVendorDraft] = useState({});

  const getAllActivityDetails = async () => {
    try {
      const responseVendors = await apiGetAllActivityVendors();
      const responseDetails = await apiGetAllActivityDetails();

      const vendorMap = responseVendors.result.reduce((acc, vendor) => {
        acc[vendor.id] = vendor;
        return acc;
      }, {});

      const result = responseDetails.result
        .map((act) => ({
          ...act,
          vendor: vendorMap[act.vendor_id] || null,
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      setAllActivityDetails(result);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllActivityVendors = async () => {
    try {
      const response = await apiGetAllActivityVendors();

      const sortedData = response.result.sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      setAllActivityVendors(sortedData);
      return sortedData;
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
  const updateActivityModalData = (partial) => {
    setActivityModalData((prev) => ({
      ...prev,
      ...partial,
    }));
  };
  const updateVendorData = (data) => {
    setVendorData(data);
  };

  const value = {
    activityDraft,
    setActivityDraft,
    vendorDraft,
    setVendorDraft,
    activityData,
    vendorData,
    activityModalData,
    updateActivityModalData,
    updateVendorData,
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
