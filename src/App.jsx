import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import Layout from "./components/Layout";
import LayoutAdmin from "./components/Admin/Layout";

// Public Pages

import CheckoutPage from "./pages/CheckoutPage";
import InvoicePDF from "./pages/InvoicePDF";
import ExpensesPage from "./pages/ExpensesPage";
import ItineraryPage from "./pages/ItineraryPDF";

// Auth Pages
import AuthLoginPage from "./pages/auth/AuthLoginPage";

// Admin Pages
import AdminPage from "./pages/admin/AdminPage";
import AdminTransportPage from "./pages/admin/AdminTransportPage";
import AdminHotelPage from "./pages/admin/AdminHotelPage";
import AdminVillaPage from "./pages/admin/AdminVillaPage";
import AdminPesananPage from "./pages/admin/AdminPesananPage";
import AdminActivityPage from "./pages/admin/AdminActivityPage";
import AdminRestaurantPage from "./pages/admin/AdminRestaurantPage";
import AdminDestinationPage from "./pages/admin/AdminDestinationPage";
import AdminManagePage from "./pages/admin/AdminManagePage";
import CalculatorFixPage from "./pages/CalculatorFixPage";
import RequireAuth from "./pages/auth/requireAuth";
import RequireRole from "./pages/auth/requireRole";

function App() {
  const adminRoutes = [
    { path: "/admin/paket", element: <AdminPage /> },
    { path: "/admin/paket/edit", element: <AdminPage /> },
    { path: "/admin/hotel", element: <AdminHotelPage /> },
    { path: "/admin/hotel/edit", element: <AdminHotelPage /> },
    { path: "/admin/villa", element: <AdminVillaPage /> },
    { path: "/admin/villa/edit", element: <AdminVillaPage /> },
    { path: "/admin/transport", element: <AdminTransportPage /> },
    { path: "/admin/transport/edit", element: <AdminTransportPage /> },
    { path: "/admin/restaurant", element: <AdminRestaurantPage /> },
    { path: "/admin/restaurant/edit", element: <AdminRestaurantPage /> },
    { path: "/admin/destination", element: <AdminDestinationPage /> },
    { path: "/admin/destination/edit", element: <AdminDestinationPage /> },
    { path: "/admin/pesanan", element: <AdminPesananPage /> },
    { path: "/admin/manage", element: <AdminManagePage /> },
    { path: "/admin/manage/edit", element: <AdminManagePage /> },
    { path: "/admin/activity", element: <AdminActivityPage /> },
    { path: "/admin/activity/edit", element: <AdminActivityPage /> },
    { path: "/admin/paket/pdf-itinerary", element:  <ItineraryPage /> },
  ];

  const publicRoutes = [
    { path: "/calculator", element: <CalculatorFixPage /> },
    // { path: "/tour-packages", element: <TourPackagePage /> },
    // { path: "/transport", element: <TransportPage /> },
    { path: "/checkout", element: <CheckoutPage /> },
    { path: "/pdf-invoice", element: <InvoicePDF /> },
    { path: "/expenses", element: <ExpensesPage /> },
    { path: "/pdf-itinerary", element: <ItineraryPage /> },
  ];

  const authRoutes = [{ path: "/auth/login", element: <AuthLoginPage /> }];

  return (
    <Routes>
      {/* Redirect from root to calculator */}
      <Route path="/" element={<Navigate to="/admin/paket" />} />

      {/* Admin Routes */}
      {adminRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <RequireAuth>
              <RequireRole
                allow={
                  path.includes("manage")
                    ? ["super_admin"]
                    : ["super_admin", "admin"]
                }
              >
                <LayoutAdmin>{element}</LayoutAdmin>
              </RequireRole>
            </RequireAuth>
          }
        />
      ))}

      {/* Auth Routes */}
      {authRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* Public Routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={<Layout>{element}</Layout>} />
      ))}
    </Routes>
  );
}

export default App;
