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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { parseAndMergeDays } from "../utils/parseAndMergeDays";

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
  const { days: expenseDays, calculateGrandTotal } = useExpensesContext();

  const [hotelData, setHotelData] = useState([]);
  const [villaData, setVillaData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const [itineraryData, setItineraryData] = useState([]);
  const [mergedDays, setMergedDays] = useState([]);

  const componentRef = useRef();
  const { totalPax = 0, tourCode = "N/A" } = props;

  useImperativeHandle(ref, () => ({
    async exportAsBlob() {
      const input = componentRef.current;
      const canvas = await html2canvas(input, { scale: 1 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return pdf.output("blob");
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
    processDays();
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

  console.log(mergedDays);

  const perPax = totalPax > 0 ? breakdown.markup / totalPax : 0;
  const selling = grandTotal / 2;
  
  // Calculate total expenses from ExpensesContext
  const totalExpensesFromContext = calculateGrandTotal();
  
  // Calculate adjusted grand total including expenses
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
      sx={{
        "& img": {
          display: "block !important",
          maxWidth: "100%",
          height: "auto",
        },
        "& table": {
          borderCollapse: "collapse",
          width: "100%",
          marginBottom: "20px",
        },
        "& th, & td": {
          border: "1px solid #ddd",
          padding: "8px",
          textAlign: "left",
          verticalAlign: "top",
        },
        "& th": {
          backgroundColor: "#FB8C00",
          color: "#000000",
          fontWeight: "bold",
        },
      }}
    >
      <InvoiceHeader code={tourCode} totalPax={`${totalPax} Pax`} />

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