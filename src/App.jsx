import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import Layout from "./components/Layout";
import LayoutAdmin from "./components/Admin/Layout";

// Public Pages
import TourPackagePage from "./pages/TourPackages";
import AkomodasiPage from "./pages/AkomodasiPage";
import TransportPage from "./pages/TransportPage";
import CheckoutPage from "./pages/CheckoutPage";

// Admin Pages
import AdminPage from "./pages/admin/AdminPage";
import AdminTourPackagesPage from "./pages/admin/AdminTourPackages";
import AdminTransportPage from "./pages/admin/AdminTransportPage";
import AdminAcomodationPage from "./pages/admin/AdminAkomodasiPage";
import AdminHotelPage from "./pages/admin/AdminHotelPage";
import AdminVillaPage from "./pages/admin/AdminVillaPage";
import AdminAdditionalPage from "./pages/admin/AdminAdditionalPage";

function App() {
  const adminRoutes = [
    { path: "/admin", element: <AdminPage /> },
    { path: "/admin/edit", element: <AdminPage /> },
    { path: "/admin/packages/hotel", element: <AdminHotelPage /> },
    { path: "/admin/packages/hotel/edit", element: <AdminHotelPage /> },
    { path: "/admin/packages/villa", element: <AdminVillaPage /> },
    { path: "/admin/packages/villa/edit", element: <AdminVillaPage /> },
    { path: "/admin/packages/additional", element: <AdminAdditionalPage /> },
    { path: "/admin/tour-packages", element: <AdminTourPackagesPage /> },
    { path: "/admin/tour-packages/edit", element: <AdminTourPackagesPage /> },
    { path: "/admin/transport", element: <AdminTransportPage /> },
    { path: "/admin/transport/edit", element: <AdminTransportPage /> },
    { path: "/admin/acomodation", element: <AdminAcomodationPage /> },
    { path: "/admin/acomodation/edit", element: <AdminAcomodationPage /> },
  ];

  const publicRoutes = [
    { path: "/calculator", element: <AkomodasiPage /> },
    { path: "/tour-packages", element: <TourPackagePage /> },
    { path: "/transport", element: <TransportPage /> },
    { path: "/checkout", element: <CheckoutPage /> },
  ];

  return (
    <Routes>
      {/* Redirect from root to calculator */}
      <Route path="/" element={<Navigate to="/admin" />} />

      {/* Admin Routes */}
      {adminRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<LayoutAdmin>{element}</LayoutAdmin>}
        />
      ))}

      {/* Public Routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<Layout>{element}</Layout>} />
      ))}
    </Routes>
  );
}

export default App;
