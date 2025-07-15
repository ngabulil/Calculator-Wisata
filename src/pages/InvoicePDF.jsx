import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Box } from "@chakra-ui/react";
import InvoiceHeader from "../components/InvoicePDF/InvoiceHeader";
import ItineraryTable from "../components/InvoicePDF/ItineraryTable";
import CostBreakDown from "../components/InvoicePDF/CostBreakDown";
import { usePackageContext } from "../context/PackageContext";
import { useCheckoutContext } from "../context/CheckoutContext";
import { useExpensesContext } from "../context/ExpensesContext";
import { parseAndMergeDays } from "../utils/parseAndMergeDays";
import { apiGetUser } from "../services/adminService";
import Cookies from "js-cookie"
import useExportPdf from "../hooks/useExportPdf";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const InvoicePDF = forwardRef((props, ref) => {
  const { selectedPackage } = usePackageContext();
  const {
    akomodasiTotal,
    transportTotal,
    tourTotal,
    grandTotal,
    breakdown,
    calculateHotelTotal,
    calculateVillaTotal,
  } = useCheckoutContext();
  const { days: expenseDays, calculateGrandTotal, tourCode, pax } = useExpensesContext();

  const [hotelData, setHotelData] = useState([]);
  const [villaData, setVillaData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [itineraryData, setItineraryData] = useState([]);
  const [mergedDays, setMergedDays] = useState([]);
  const [adminName, setAdminName] = useState("")

  const { exportAsBlob, downloadPdf } = useExportPdf();
  const componentRef = useRef();

  useImperativeHandle(ref, () => ({
    async exportAsBlob() {
      return exportAsBlob(componentRef);
    },
    async download(filename = `${tourCode}_invoice.pdf`) {
      await downloadPdf(componentRef, filename);
    }
  }));

  useEffect(() => {
    const processDays = async () => {
      if (selectedPackage?.days?.length > 0) {
        try {
          const merged = await parseAndMergeDays(selectedPackage.days);
          setMergedDays(merged);
        } catch (err) {
          console.error("Gagal memproses days:", err);
          setMergedDays(selectedPackage.days);
        }
      }
    };

    const fetchAdmin = async () => {
      const token = Cookies.get("token");
      if (!token) {
        return;
      }

      try {
        const res = await apiGetUser(token);
        if (res.status === 200) {
          setAdminName(res.result.name);
        } else{
          console.log("Error", "Failed to fetch admin users", "error");
        }
      } catch (error) {
        console.log(error);
        console.log("Error", "Invalid Token", "error");
      }
    };

    processDays();
    fetchAdmin();
  }, [selectedPackage]);

  useEffect(() => {
    if (mergedDays.length === 0) return;

    const hotels = [];
    const villas = [];
    const transports = [];
    const additionals = [];

    mergedDays.forEach((day, dayIndex) => {
      // Hotel
      day.hotels?.forEach((hotel) => {
        hotels.push({
          day: `Day ${dayIndex + 1}`,
          name: hotel.displayName,
          rooms: hotel.jumlahKamar || 1,
          extrabedQty: hotel.useExtrabed ? hotel.jumlahExtrabed || 0 : 0,
          pricePerNight: hotel.hargaPerKamar || 0,
          extrabedPrice: hotel.hargaExtrabed || 0,
          total: calculateHotelTotal([hotel]),
        });
      });

      // Villa
      day.villas?.forEach((villa) => {
        villas.push({
          day: `Day ${dayIndex + 1}`,
          name: villa.displayName,
          rooms: villa.jumlahKamar || 1,
          extrabedQty: villa.useExtrabed ? villa.jumlahExtrabed || 0 : 0,
          pricePerNight: villa.hargaPerKamar || 0,
          extrabedPrice: villa.hargaExtrabed || 0,
          total: calculateVillaTotal([villa]),
        });
      });

      // Transport
      day.mobils?.forEach((mobil) => {
        transports.push({
          day: `Day ${dayIndex + 1}`,
          description: mobil.displayName,
          price: mobil.harga || 0,
        });
      });

      // Akomodasi tambahan
      day.akomodasi_additionals?.forEach((item) => {
        additionals.push({
          day: `Day ${dayIndex + 1}`,
          name: item.displayName,
          quantity: item.jumlah || 1,
          price: item.harga || 0,
          total: (item.harga || 0) * (item.jumlah || 1),
        });
      });

      // Transport tambahan
      day.transport_additionals?.forEach((item) => {
        additionals.push({
          day: `Day ${dayIndex + 1}`,
          name: item.displayName,
          quantity: item.jumlah || 1,
          price: item.harga || 0,
          total: (item.harga || 0) * (item.jumlah || 1),
        });
      });
    });

    setHotelData(hotels.concat(villas));
    setVillaData(villas);
    setTransportData(transports);
    setAdditionalData(additionals);

    // Itinerary with kid expenses and expense items
    const itinerary = mergedDays.map((day, index) => {
      const activities = [
        ...(day.destinations || []).map((dest) => ({
          item: dest.displayName,
          expense: formatCurrency(dest.hargaAdult || 0),
          kidExpense: formatCurrency(dest.hargaChild || 0),
        })),
        ...(day.restaurants || []).map((resto) => ({
          item: resto.displayName,
          expense: formatCurrency(resto.hargaAdult || 0),
          kidExpense: formatCurrency(resto.hargaChild || 0),
        })),
        ...(day.activities || []).map((act) => ({
          item: act.displayName,
          expense: formatCurrency(act.hargaAdult || 0),
          kidExpense: formatCurrency(act.hargaChild || 0),
        })),
      ];

      // Get expense items from ExpensesContext for this day
      const expenseDay = expenseDays[index];
      const expenseItems = expenseDay?.totals || [];

      return {
        day: index + 1,
        title: day.day_name || `Day ${index + 1}`,
        description: day.description_day || day.day_description || "",
        activities: activities,
        expenseItems: expenseItems,
      };
    });

    setItineraryData(itinerary);
  }, [mergedDays, calculateHotelTotal, calculateVillaTotal, expenseDays]);

  const actualPax = pax && parseInt(pax) > 0 ? parseInt(pax) : 1;
  const perPax = actualPax > 0 ? breakdown.markup / actualPax : 0;
  const selling = grandTotal / actualPax;
  
  const totalExpensesFromContext = calculateGrandTotal();
  
  const adjustedGrandTotal = grandTotal + totalExpensesFromContext;

  return (
    <Box
      ref={componentRef}
      data-pdf-content
      width="794px"
      minHeight="1123px"
      mx="auto"
      p="40px"
      bg="white"
      display="block !important"
      fontFamily="Arial, sans-serif"
      fontSize="14px"
      lineHeight="1.4"
      color="#000000"
      boxSizing="border-box"
    >
      <InvoiceHeader code={tourCode} totalPax={actualPax} adminName={adminName} />

      <ItineraryTable days={itineraryData} formatCurrency={formatCurrency} />

      <CostBreakDown
        hotelData={hotelData}
        villaData={villaData}
        transportData={transportData}
        additionalData={additionalData}
        akomodasiTotal={akomodasiTotal}
        transportTotal={transportTotal}
        tourTotal={tourTotal}
        markup={breakdown.markup}
        grandTotal={adjustedGrandTotal}
        originalGrandTotal={grandTotal}
        totalExpenses={totalExpensesFromContext}
        perPax={perPax}
        selling={selling}
        formatCurrency={formatCurrency}
      />
    </Box>
  );
});

export default InvoicePDF;
