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
import { parseAndMergeDays } from "../utils/parseAndMergeDays"; // Tetap gunakan ini untuk data lain
import { apiGetUser } from "../services/adminService";
import Cookies from "js-cookie";
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
  const {
    days: expenseDays,
    calculateGrandTotal,
    tourCode,
    pax,
  } = useExpensesContext();

  const [hotelData, setHotelData] = useState([]);
  const [villaData, setVillaData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [itineraryData, setItineraryData] = useState([]);
  const [mergedDays, setMergedDays] = useState([]);
  const [adminName, setAdminName] = useState("");

  const { exportAsBlob, downloadPdf } = useExportPdf();
  const componentRef = useRef();

  useImperativeHandle(ref, () => ({
    async exportAsBlob() {
      return exportAsBlob(componentRef);
    },
    async download(filename = `${tourCode}_invoice.pdf`) {
      await downloadPdf(componentRef, filename);
    },
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
        } else {
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
        const price = parseInt(mobil.harga) || 0; //
        transports.push({
          day: `Day ${dayIndex + 1}`,
          description: mobil.mobil?.label || mobil.label,
          price: price,
        });
      });

      // Akomodasi tambahan
      day.akomodasi_additionals?.forEach((item) => {
        const price = parseInt(item.harga) || 0;
        const quantity = parseInt(item.jumlah) || 1;
        additionals.push({
          day: `Day ${dayIndex + 1}`,
          name: item.displayName,
          quantity: quantity,
          price: price,
          total: price * quantity,
        });
      });

      // Transport tambahan
      day.transport_additionals?.forEach((item) => {
        const price = parseInt(item.harga) || 0;
        const quantity = parseInt(item.jumlah) || 1;
        additionals.push({
          day: `Day ${dayIndex + 1}`,
          name: item.displayName,
          quantity: quantity,
          price: price,
          total: price * quantity,
        });
      });
    });

    setHotelData(hotels.concat(villas));
    setVillaData(villas);
    setTransportData(transports);
    setAdditionalData(additionals);

    // Itinerary with kid expenses and expense items
    const itinerary = mergedDays.map((day, index) => {
      console.log(`Processing day ${index}:`, day); // Debug log

      const activities = [];

      // Process destinations
      if (day.destinations && Array.isArray(day.destinations)) {
        day.destinations.forEach((dest) => {
          const adultQty =
            parseInt(dest.jumlahadult) || parseInt(dest.jumlahAdult) || 0;
          const childQty =
            parseInt(dest.jumlahchild) || parseInt(dest.jumlahChild) || 0;
          const adultPrice =
            parseInt(dest.hargaddult) ||
            parseInt(dest.hargaAdult) ||
            parseInt(dest.hargaadult) ||
            0;
          const childPrice =
            parseInt(dest.hargachild) ||
            parseInt(dest.hargaChild) ||
            parseInt(dest.hargachild) ||
            0;

          console.log(`Destination ${dest.displayName}:`, {
            adultQty,
            childQty,
            adultPrice,
            childPrice,
          }); // Debug log

          activities.push({
            item: dest.displayName || dest.name || "Unnamed Destination",
            expense:
              adultPrice > 0 && adultQty > 0
                ? formatCurrency(adultPrice * adultQty)
                : "Rp 0",
            kidExpense:
              childPrice > 0 && childQty > 0
                ? formatCurrency(childPrice * childQty)
                : "-",
          });
        });
      }

      // Process restaurants
      if (day.restaurants && Array.isArray(day.restaurants)) {
        day.restaurants.forEach((resto) => {
          const adultQty =
            parseInt(resto.jumlahadult) || parseInt(resto.jumlahAdult) || 0;
          const childQty =
            parseInt(resto.jumlahchild) || parseInt(resto.jumlahChild) || 0;
          const adultPrice =
            parseInt(resto.hargaddult) ||
            parseInt(resto.hargaAdult) ||
            parseInt(resto.hargaadult) ||
            0;
          const childPrice =
            parseInt(resto.hargachild) ||
            parseInt(resto.hargaChild) ||
            parseInt(resto.hargachild) ||
            0;

          console.log(`Restaurant ${resto.displayName}:`, {
            adultQty,
            childQty,
            adultPrice,
            childPrice,
          }); // Debug log

          activities.push({
            item: resto.displayName || resto.name || "Unnamed Restaurant",
            expense:
              adultPrice > 0 && adultQty > 0
                ? formatCurrency(adultPrice * adultQty)
                : "Rp 0",
            kidExpense:
              childPrice > 0 && childQty > 0
                ? formatCurrency(childPrice * childQty)
                : "-",
          });
        });
      }

      // Process activities
      if (day.activities && Array.isArray(day.activities)) {
        day.activities.forEach((act) => {
          const adultQty =
            parseInt(act.jumlahadult) || parseInt(act.jumlahAdult) || 0;
          const childQty =
            parseInt(act.jumlahchild) || parseInt(act.jumlahChild) || 0;
          const adultPrice =
            parseInt(act.hargaddult) ||
            parseInt(act.hargaAdult) ||
            parseInt(act.hargaadult) ||
            0;
          const childPrice =
            parseInt(act.hargachild) ||
            parseInt(act.hargaChild) ||
            parseInt(act.hargachild) ||
            0;

          console.log(`Activity ${act.displayName}:`, {
            adultQty,
            childQty,
            adultPrice,
            childPrice,
          }); // Debug log

          activities.push({
            item: act.displayName || act.name || "Unnamed Activity",
            expense:
              adultPrice > 0 && adultQty > 0
                ? formatCurrency(adultPrice * adultQty)
                : "Rp 0",
            kidExpense:
              childPrice > 0 && childQty > 0
                ? formatCurrency(childPrice * childQty)
                : "-",
          });
        });
      }

      // Get expense items from ExpensesContext for this day
      const expenseDay = expenseDays[index];
      const expenseItems = expenseDay?.totals || [];

      return {
        day: index + 1,
        title: day.day_name || `Day ${index + 1}`,
        description: day.description_day || day.day_description || "",
        date: day.date,
        activities: activities,
        expenseItems: expenseItems,
      };
    });

    setItineraryData(itinerary);
  }, [mergedDays, calculateHotelTotal, calculateVillaTotal, expenseDays]);

  const actualPax = pax && parseInt(pax) > 0 ? parseInt(pax) : 1;
  const perPax = actualPax > 0 ? breakdown.markup / actualPax : 0;
  const totalExpensesFromContext = calculateGrandTotal();
  const adjustedGrandTotal = grandTotal + totalExpensesFromContext;
  const selling = adjustedGrandTotal / actualPax;

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
      <InvoiceHeader
        code={tourCode}
        totalPax={actualPax}
        adminName={adminName}
      />

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
