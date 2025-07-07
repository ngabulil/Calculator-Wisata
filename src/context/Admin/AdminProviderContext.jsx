import AdminHotelContextProvider from "./AdminHotelContext";
import AdminVillaContextProvider from "./AdminVillaContext";
import AdminPackageContextProvider from "./AdminPackageContext";

const AdminProviderContext = ({ children }) => {
  return (
    <AdminPackageContextProvider>
      <AdminVillaContextProvider>
        <AdminHotelContextProvider>{children}</AdminHotelContextProvider>
      </AdminVillaContextProvider>
    </AdminPackageContextProvider>
  );
};

export default AdminProviderContext;
