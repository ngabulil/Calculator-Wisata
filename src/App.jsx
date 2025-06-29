import { Routes, Route, Navigate } from "react-router-dom";
import TourPackagePage from "./pages/TourPackages";
import AkomodasiPage from "./pages/AkomodasiPage";
import CheckoutPage from "./pages/CheckoutPage"; // <- jika sudah punya
import Layout from "./components/Layout";
import TransportPage from "./pages/TransportPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/calculator" />} />
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
