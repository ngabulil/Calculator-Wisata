import AdminHotelContextProvider from "./AdminHotelContext";
import AdminVillaContextProvider from "./AdminVillaContext";
import AdminPackageContextProvider from "./AdminPackageContext";

const AdminProviderContext = ({ children }) => {
  return (
    <AdminVillaContextProvider>
      <AdminPackageContextProvider>
        <AdminHotelContextProvider>{children}</AdminHotelContextProvider>
      </AdminPackageContextProvider>
    </AdminVillaContextProvider>
  );
};

export default AdminProviderContext;
