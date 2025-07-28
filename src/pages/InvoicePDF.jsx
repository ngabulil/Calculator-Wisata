import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useMemo,
  useCallback,
} from "react";
import { Box, Flex, Button, Input, useToast, Text } from "@chakra-ui/react";
import InvoiceHeader from "../components/InvoicePDF/InvoiceHeader";
import ItineraryTable from "../components/InvoicePDF/ItineraryTable";
import CostBreakDown from "../components/InvoicePDF/CostBreakDown";
import { usePackageContext } from "../context/PackageContext";
import { useCheckoutContext } from "../context/CheckoutContext";
import { useExpensesContext } from "../context/ExpensesContext";
import { parseAndMergeDays } from "../utils/parseAndMergeDays";
import { apiGetUser } from "../services/adminService";
import Cookies from "js-cookie";
import useExportPdf from "../hooks/useExportPdf";
import useItineraryReorder from "../hooks/useItineraryReorder";

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

  // Consolidated state untuk mengurangi re-render
  const [invoiceData, setInvoiceData] = useState({
    hotelData: [],
    villaData: [],
    transportData: [],
    additionalData: [],
    itineraryData: [],
    mergedDays: [],
    isDataProcessed: false,
  });

  const [exchangeRate, setExchangeRate] = useState(() => {
    // Initialize dari localStorage langsung
    const saved = localStorage.getItem("invoiceExchangeRate");
    return saved ? Number(saved) : 15000;
  });

  const [isEditingExchange, setIsEditingExchange] = useState(false);
  const toast = useToast();

  const { exportAsBlob, downloadPdf } = useExportPdf();
  const componentRef = useRef();

  // Memoize package ID
  const packageId = useMemo(
    () => selectedPackage?.id || selectedPackage?._id,
    [selectedPackage?.id, selectedPackage?._id]
  );

  // Initialize reorder hook dengan package ID
  const {
    days: reorderedDays,
    originalDays,
    isReordering,
    updateDays,
    moveItemUp,
    moveItemDown,
    moveDayUp,
    moveDayDown,
    toggleReordering,
    resetOrder,
    saveOrder,
    clearSavedOrder,
  } = useItineraryReorder([], packageId);

  useImperativeHandle(ref, () => ({
    async exportAsBlob() {
      return exportAsBlob(componentRef);
    },
    async download(filename = `${selectedPackage?.title || ""}_Quotation.pdf`) {
      await downloadPdf(componentRef, filename);
    },
  }));

  // Memoize calculations untuk menghindari perhitungan berulang
  const calculatedValues = useMemo(() => {
    const totalAdult =
      selectedPackage?.totalPaxAdult &&
      parseInt(selectedPackage.totalPaxAdult) > 0
        ? parseInt(selectedPackage.totalPaxAdult)
        : 0;
    const actualChild =
      selectedPackage?.totalPaxChildren &&
      parseInt(selectedPackage.totalPaxChildren) > 0
        ? parseInt(selectedPackage.totalPaxChildren)
        : 0;
    const perAdult = totalAdult > 0 ? breakdown.markup / totalAdult : 0;
    const totalExpensesFromContext = calculateGrandTotal();
    const adjustedGrandTotal = grandTotal + totalExpensesFromContext;
    const selling = adjustedGrandTotal / totalAdult;

    return {
      totalAdult,
      actualChild,
      perAdult,
      totalExpensesFromContext,
      adjustedGrandTotal,
      selling,
    };
  }, [
    selectedPackage?.totalPaxAdult,
    selectedPackage?.totalPaxChildren,
    breakdown.markup,
    grandTotal,
    calculateGrandTotal,
  ]);

  // Separate adminName state
  const [adminName, setAdminName] = useState("");

  // Fetch admin data - hanya dipanggil sekali
  useEffect(() => {
    let isMounted = true;

    const fetchAdmin = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const res = await apiGetUser(token);
        if (res.status === 200 && isMounted) {
          setAdminName(res.result.name);
        }
      } catch (error) {
        console.error("Failed to fetch admin:", error);
      }
    };

    fetchAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  // Process days data - dengan optimization
  useEffect(() => {
    let isMounted = true;

    const processDays = async () => {
      if (!selectedPackage?.days?.length) {
        if (isMounted) {
          setInvoiceData((prev) => ({ ...prev, isDataProcessed: true }));
        }
        return;
      }

      try {
        const merged = await parseAndMergeDays(selectedPackage.days);

        if (!isMounted) return;

        // Process semua data sekaligus untuk mengurangi state updates
        const hotels = [];
        const villas = [];
        const transports = [];
        const additionals = [];
        const itinerary = [];

        merged.forEach((day, dayIndex) => {
          // Hotel processing
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

          // Villa processing
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

          // Transport processing
          day.mobils?.forEach((mobil) => {
            const price = parseInt(mobil.harga) || 0;
            transports.push({
              day: `Day ${dayIndex + 1}`,
              description: mobil.mobil?.label || mobil.label,
              price: price,
            });
          });

          // Additional items processing
          const processAdditionalItems = (items, dayIndex) => {
            return (
              items?.map((item) => {
                const price = parseInt(item.harga) || 0;
                const quantity = parseInt(item.jumlah) || 1;
                return {
                  day: `Day ${dayIndex + 1}`,
                  name: item.displayName,
                  quantity: quantity,
                  price: price,
                  total: price * quantity,
                };
              }) || []
            );
          };

          additionals.push(
            ...processAdditionalItems(day.akomodasi_additionals, dayIndex),
            ...processAdditionalItems(day.transport_additionals, dayIndex)
          );

          // Itinerary processing dengan helper function
          const processActivities = (items, type) => {
            return (
              items?.map((item) => {
                const adultQty =
                  parseInt(item.jumlahadult || item.jumlahAdult) || 0;
                const childQty =
                  parseInt(item.jumlahchild || item.jumlahChild) || 0;
                const adultPrice =
                  parseInt(
                    item.hargaddult || item.hargaAdult || item.hargaadult
                  ) || 0;
                const childPrice =
                  parseInt(
                    item.hargachild || item.hargaChild || item.hargachild
                  ) || 0;

                return {
                  type: "activity",
                  item: item.displayName || item.name || `Unnamed ${type}`,
                  expense:
                    adultPrice > 0 && adultQty > 0
                      ? formatCurrency(adultPrice * adultQty)
                      : "Rp 0",
                  kidExpense:
                    childPrice > 0 && childQty > 0
                      ? formatCurrency(childPrice * childQty)
                      : "-",
                  // Tambahan data untuk keperluan lain
                  adultPrice,
                  childPrice,
                  adultQty,
                  childQty,
                  originalData: item,
                };
              }) || []
            );
          };

          // Process expense items dari context
          const processExpenseItems = (expenseItems) => {
            return (
              expenseItems?.map((item) => {
                return {
                  type: "expense",
                  item: item.label || item.name || "Unnamed Expense",
                  label: item.label || item.name || "Unnamed Expense",
                  description: item.description || "",
                  price: item.price || 0,
                  quantity: item.quantity || 1,
                  adultPrice: item.adultPrice || null,
                  childPrice: item.childPrice || null,
                  adultQuantity: item.adultQuantity || 1,
                  childQuantity: item.childQuantity || 1,
                  // Calculate display values
                  expense: (() => {
                    let total = 0;
                    if (item.adultPrice !== null || item.childPrice !== null) {
                      const adultTotal =
                        (item.adultPrice || 0) * (item.adultQuantity || 1);
                      const childTotal =
                        (item.childPrice || 0) * (item.childQuantity || 1);
                      total = adultTotal + childTotal;
                    } else {
                      total = (item.price || 0) * (item.quantity || 1);
                    }
                    return total > 0 ? formatCurrency(total) : "Rp 0";
                  })(),
                  kidExpense: "-", // Expense items biasanya tidak memiliki kid expense terpisah
                  originalData: item,
                };
              }) || []
            );
          };

          const activities = [
            ...processActivities(day.destinations, "Destination"),
            ...processActivities(day.restaurants, "Restaurant"),
            ...processActivities(day.activities, "Activity"),
          ];

          // Get expense items dari context
          const expenseDay = expenseDays[dayIndex];
          const expenseItems = processExpenseItems(expenseDay?.totals || []);

          // Gabungkan activities dan expense items menjadi satu array
          const unifiedItems = [...activities, ...expenseItems];

          itinerary.push({
            day: dayIndex + 1,
            title: day.name || `Day ${dayIndex + 1}`,
            description: day.description_day || day.day_description || "",
            date: day.date,
            items: unifiedItems,
            activities: activities,
            expenseItems: expenseItems,
          });
        });

        // Update semua state sekaligus
        setInvoiceData({
          hotelData: hotels.concat(villas),
          villaData: villas,
          transportData: transports,
          additionalData: additionals.flat(),
          itineraryData: itinerary,
          mergedDays: merged,
          adminName: adminName,
          isDataProcessed: true,
        });

        // Update reorder hook
        updateDays(itinerary);
      } catch (err) {
        console.error("Gagal memproses days:", err);
        if (isMounted) {
          setInvoiceData((prev) => ({
            ...prev,
            mergedDays: selectedPackage.days,
            isDataProcessed: true,
          }));
        }
      }
    };

    processDays();

    return () => {
      isMounted = false;
    };
  }, [
    selectedPackage?.days,
    calculateHotelTotal,
    calculateVillaTotal,
    expenseDays,
    updateDays,
  ]);

  // Memoize reorder handlers
  const handleSaveReorder = useCallback(() => {
    const success = saveOrder();
    if (success) {
      setInvoiceData((prev) => ({
        ...prev,
        itineraryData: [...reorderedDays],
      }));
      toggleReordering();
      toast({
        title: "Urutan Itinerary Disimpan",
        description:
          "Urutan berhasil disimpan dan akan dipertahankan untuk package ini",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan urutan itinerary",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [saveOrder, reorderedDays, toggleReordering, toast]);

  const handleCancelReorder = useCallback(() => {
    resetOrder();
    toggleReordering();
  }, [resetOrder, toggleReordering]);

  const handleResetToOriginal = useCallback(() => {
    clearSavedOrder();
    toast({
      title: "Urutan Direset",
      description: "Urutan itinerary dikembalikan ke urutan asli",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  }, [clearSavedOrder, toast]);

  // Memoize exchange rate handlers
  const handleSaveExchangeRate = useCallback(() => {
    localStorage.setItem("invoiceExchangeRate", exchangeRate.toString());
    setIsEditingExchange(false);
    toast({
      title: "Exchange Rate Disimpan",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  }, [exchangeRate, toast]);

  const handleCancelExchangeRate = useCallback(() => {
    const stored = localStorage.getItem("invoiceExchangeRate");
    if (stored) setExchangeRate(Number(stored));
    setIsEditingExchange(false);
  }, []);

  // Memoize untuk cek apakah order berbeda dari original
  const hasOrderChanged = useMemo(() => {
    return JSON.stringify(reorderedDays) !== JSON.stringify(originalDays);
  }, [reorderedDays, originalDays]);

  // Show loading jika data belum selesai diproses
  if (!invoiceData.isDataProcessed) {
    return (
      <Box maxW="900px" mx="auto" py={8}>
        <Text textAlign="center">Loading invoice data...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="900px" mx="auto" py={8}>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        p={4}
        bg="gray.50"
        borderRadius="md"
        flexWrap="wrap"
        gap={3}
      >
        <Text fontSize="lg" fontWeight="bold" color="#FB8C00">
          Invoice Controls
        </Text>

        <Flex gap={2} flexWrap="wrap" alignItems="center">
          {/* Reorder Controls */}
          <Box>
            {!isReordering ? (
              <Flex gap={2}>
                <Button
                  size="sm"
                  colorScheme="orange"
                  onClick={toggleReordering}
                >
                  Edit Urutan Itinerary
                </Button>
                {hasOrderChanged && (
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={handleResetToOriginal}
                  >
                    Reset ke Urutan Asli
                  </Button>
                )}
              </Flex>
            ) : (
              <Flex gap={2}>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={handleSaveReorder}
                >
                  Simpan Urutan
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={handleCancelReorder}
                >
                  Batal
                </Button>
              </Flex>
            )}
          </Box>

          {/* Exchange Rate Controls */}
          {!isEditingExchange ? (
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => setIsEditingExchange(true)}
            >
              Edit Exchange Rate
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                colorScheme="green"
                onClick={handleSaveExchangeRate}
              >
                Simpan
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={handleCancelExchangeRate}
              >
                Batal
              </Button>
            </>
          )}
        </Flex>
      </Flex>

      {/* Status indicator untuk saved order */}
      {!isReordering && hasOrderChanged && (
        <Box
          mb={4}
          p={3}
          bg="blue.50"
          borderRadius="md"
          borderLeft="4px solid"
          borderColor="blue.400"
        >
          <Text fontSize="sm" color="blue.800">
            ℹ️ Menampilkan urutan yang telah disimpan. Klik "Reset ke Urutan
            Asli" untuk mengembalikan ke urutan default.
          </Text>
        </Box>
      )}

      {/* Area PDF */}
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
          totalAdult={calculatedValues.totalAdult}
          totalChild={calculatedValues.actualChild}
          adminName={adminName}
          packageName={selectedPackage?.name}
        />

        <ItineraryTable
          days={Array.isArray(reorderedDays) ? reorderedDays : []}
          formatCurrency={formatCurrency}
          isReordering={isReordering}
          onMoveItemUp={moveItemUp}
          onMoveItemDown={moveItemDown}
          onMoveDayUp={moveDayUp}
          onMoveDayDown={moveDayDown}
          totalAdult={calculatedValues.totalAdult}
          totalChild={calculatedValues.actualChild}
        />

        <CostBreakDown
          hotelData={invoiceData.hotelData}
          villaData={invoiceData.villaData}
          transportData={invoiceData.transportData}
          additionalData={invoiceData.additionalData}
          akomodasiTotal={akomodasiTotal}
          transportTotal={transportTotal}
          tourTotal={tourTotal}
          markup={breakdown.markup}
          grandTotal={calculatedValues.adjustedGrandTotal}
          originalGrandTotal={grandTotal}
          totalExpenses={calculatedValues.totalExpensesFromContext}
          perPax={calculatedValues.perAdult}
          selling={calculatedValues.selling}
          formatCurrency={formatCurrency}
          totalAdult={calculatedValues.totalAdult}
          totalChild={calculatedValues.actualChild}
          exchangeRate={exchangeRate}
          isEditingExchangeRate={isEditingExchange}
          onExchangeRateChange={setExchangeRate}
        />
      </Box>
    </Box>
  );
});

export default InvoicePDF;