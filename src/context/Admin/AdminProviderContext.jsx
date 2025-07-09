import AdminHotelContextProvider from "./AdminHotelContext";
import AdminVillaContextProvider from "./AdminVillaContext";
import AdminPackageContextProvider from "./AdminPackageContext";
import AdminActivityContextProvider from "./AdminActivityContext";
import AdminRestaurantContextProvider from "./AdminRestaurantContext";
import AdminTransportContextProvider from "./AdminTransportContext";
import AdminDestinationContextProvider from "./AdminDestinationContext";

const AdminProviderContext = ({ children }) => {
  return (
    <AdminPackageContextProvider>
      <AdminVillaContextProvider>
        <AdminActivityContextProvider>
          <AdminTransportContextProvider>
            <AdminRestaurantContextProvider>
              <AdminDestinationContextProvider>
                <AdminHotelContextProvider>
                  {children}
                </AdminHotelContextProvider>
              </AdminDestinationContextProvider>
            </AdminRestaurantContextProvider>
          </AdminTransportContextProvider>
        </AdminActivityContextProvider>
      </AdminVillaContextProvider>
    </AdminPackageContextProvider>
  );
};

export default AdminProviderContext;
