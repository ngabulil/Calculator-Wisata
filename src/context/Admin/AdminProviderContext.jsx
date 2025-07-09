import AdminHotelContextProvider from "./AdminHotelContext";
import AdminVillaContextProvider from "./AdminVillaContext";
import AdminPackageContextProvider from "./AdminPackageContext";
import AdminActivityContextProvider from "./AdminActivityContext";

const AdminProviderContext = ({ children }) => {
  return (
    <AdminPackageContextProvider>
      <AdminVillaContextProvider>
        <AdminActivityContextProvider>
          <AdminHotelContextProvider>{children}</AdminHotelContextProvider>
        </AdminActivityContextProvider>
      </AdminVillaContextProvider>
    </AdminPackageContextProvider>
  );
};

export default AdminProviderContext;
