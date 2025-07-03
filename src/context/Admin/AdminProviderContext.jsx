import AdminHotelContextProvider from "./AdminHotelContext";
import AdminVillaContextProvider from "./AdminVillaContext";

const AdminProviderContext = ({ children }) => {
  return (
    <AdminVillaContextProvider>
      <AdminHotelContextProvider>{children}</AdminHotelContextProvider>
    </AdminVillaContextProvider>
  );
};

export default AdminProviderContext;
