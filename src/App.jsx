import { Routes, Route, Navigate } from "react-router-dom";
import TourPackagePage from "./pages/TourPackages";
import AkomodasiPage from "./pages/AkomodasiPage";
import CheckoutPage from "./pages/CheckoutPage"; // <- jika sudah punya
import Layout from "./components/Layout";
import TransportPage from "./pages/TransportPage";
// admin
import LayoutAdmin from "./components/Admin/Layout";
import AdminPage from "./pages/admin/AdminPage";
import AdminTourPackagesPage from "./pages/admin/AdminTourPackages";
import AdminTransportPage from "./pages/admin/AdminTransportPage";
import AdminAcomodationPage from "./pages/admin/AdminAkomodasiPage";
import AdminHotelPage from "./pages/admin/AdminHotelPage";
import AdminVillaPage from "./pages/admin/AdminVillaPage";
import AdminAdditionalPage from "./pages/admin/AdminAdditionalPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/calculator" />} />
      <Route
        path="/admin"
        element={
          <LayoutAdmin>
            <AdminPage />
          </LayoutAdmin>
        }
      />
      <Route
        path="/admin/packages/hotel"
        element={
          <LayoutAdmin>
            <AdminHotelPage />
          </LayoutAdmin>
        }
      />
      <Route
        path="/admin/packages/villa"
        element={
          <LayoutAdmin>
            <AdminVillaPage />
          </LayoutAdmin>
        }
      />
      <Route
        path="/admin/packages/additional"
        element={
          <LayoutAdmin>
            <AdminAdditionalPage />
          </LayoutAdmin>
        }
      />
      <Route
        path="/admin/tour-packages"
        element={
          <LayoutAdmin>
            <AdminTourPackagesPage />
          </LayoutAdmin>
        }
      />
      <Route
        path="/admin/transport"
        element={
          <LayoutAdmin>
            <AdminTransportPage />
          </LayoutAdmin>
        }
      />
      <Route
        path="/admin/acomodation"
        element={
          <LayoutAdmin>
            <AdminAcomodationPage />
          </LayoutAdmin>
        }
      />

      <Route
        path="/calculator"
        element={
          <Layout>
            <AkomodasiPage />
          </Layout>
        }
      />
      <Route
        path="/tour-packages"
        element={
          <Layout>
            <TourPackagePage />
          </Layout>
        }
      />
      <Route
        path="/transport"
        element={
          <Layout>
            <TransportPage />
          </Layout>
        }
      />
      <Route
        path="/checkout"
        element={
          <Layout>
            <CheckoutPage />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
