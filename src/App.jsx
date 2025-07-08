import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import Layout from "./components/Layout";
import LayoutAdmin from "./components/Admin/Layout";

// Public Pages
import TourPackagePage from "./pages/TourPackages";
import AkomodasiPage from "./pages/AkomodasiPage";
import TransportPage from "./pages/TransportPage";
import CheckoutPage from "./pages/CheckoutPage";
import InvoicePDF from "./pages/InvoicePDF";
import ExpensesPage from "./pages/ExpensesPage";
import ItineraryPage from "./pages/ItineraryPDF";

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
    { path: "/admin/paket", element: <AdminPage /> },
    { path: "/admin/paket/edit", element: <AdminPage /> },
    { path: "/admin/hotel", element: <AdminHotelPage /> },
    { path: "/admin/hotel/edit", element: <AdminHotelPage /> },
    { path: "/admin/villa", element: <AdminVillaPage /> },
    { path: "/admin/villa/edit", element: <AdminVillaPage /> },
    { path: "/admin/additional", element: <AdminAdditionalPage /> },
    { path: "/admin/transport", element: <AdminTransportPage /> },
    { path: "/admin/transport/edit", element: <AdminTransportPage /> },
  ];

  const publicRoutes = [
    { path: "/calculator", element: <AkomodasiPage /> },
    { path: "/tour-packages", element: <TourPackagePage /> },
    { path: "/transport", element: <TransportPage /> },
    { path: "/checkout", element: <CheckoutPage /> },
    { path: "/pdf-invoice", element: <InvoicePDF /> },
    { path: "/expenses", element: <ExpensesPage /> },
    { path: "/pdf-itinerary", element: <ItineraryPage /> },
  ];

  return (
    <Routes>
      {/* Redirect from root to calculator */}
      <Route path="/" element={<Navigate to="/admin/paket" />} />

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
