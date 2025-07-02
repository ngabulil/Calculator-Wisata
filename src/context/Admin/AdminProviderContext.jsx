import AdminHotelContextProvider from "./AdminHotelContext";

const AdminProviderContext = ({ children }) => {
  return <AdminHotelContextProvider>{children}</AdminHotelContextProvider>;
};

export default AdminProviderContext;
