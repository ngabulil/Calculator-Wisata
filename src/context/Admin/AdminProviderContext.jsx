import AdminHotelContextProvider from "./AdminHotelContext";
import AdminVillaContextProvider from "./AdminVillaContext";
import AdminPackageContextProvider from "./AdminPackageContext";
import AdminActivityContextProvider from "./AdminActivityContext";
import AdminRestaurantContextProvider from "./AdminRestaurantContext";
import AdminTransportContextProvider from "./AdminTransportContext";
import AdminDestinationContextProvider from "./AdminDestinationContext";
import AdminManageContextProvider from "./AdminManageContext";

const AdminProviderContext = ({ children }) => {
  return (
    <AdminPackageContextProvider>
      <AdminVillaContextProvider>
        <AdminActivityContextProvider>
          <AdminTransportContextProvider>
            <AdminRestaurantContextProvider>
              <AdminDestinationContextProvider>
                <AdminManageContextProvider>
                  <AdminHotelContextProvider>
                    {children}
                  </AdminHotelContextProvider>
                </AdminManageContextProvider>
              </AdminDestinationContextProvider>
            </AdminRestaurantContextProvider>
          </AdminTransportContextProvider>
        </AdminActivityContextProvider>
      </AdminVillaContextProvider>
    </AdminPackageContextProvider>
  );
};

export default AdminProviderContext;
