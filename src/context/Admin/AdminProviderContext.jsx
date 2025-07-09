import AdminHotelContextProvider from "./AdminHotelContext";
import AdminVillaContextProvider from "./AdminVillaContext";
import AdminPackageContextProvider from "./AdminPackageContext";
import AdminActivityContextProvider from "./AdminActivityContext";
import AdminRestaurantContextProvider from "./AdminRestaurantContext";

const AdminProviderContext = ({ children }) => {
  return (
    <AdminPackageContextProvider>
      <AdminVillaContextProvider>
        <AdminActivityContextProvider>
          <AdminRestaurantContextProvider>
            <AdminHotelContextProvider>{children}</AdminHotelContextProvider>
          </AdminRestaurantContextProvider>
        </AdminActivityContextProvider>
      </AdminVillaContextProvider>
    </AdminPackageContextProvider>
  );
};

export default AdminProviderContext;
