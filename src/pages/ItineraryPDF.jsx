import { 
  useState, 
  useEffect, 
  useRef, 
  useImperativeHandle, 
  forwardRef,
  useMemo,
  useCallback
} from "react";
import { Box, Text, Divider, Button, Flex, useToast } from "@chakra-ui/react";
import HotelChoiceTable from "../components/ItineraryPDF/HotelChoiceTable";
import ItineraryTable from "../components/ItineraryPDF/ItineraryTable";
import InclusionExclusion from "../components/ItineraryPDF/InclusionExclusion";
import { usePackageContext } from "../context/PackageContext";
import { useExpensesContext } from "../context/ExpensesContext";
import { useCalculatePaxContext } from "../context/CalculatePaxContext";
import { useCurrencyContext } from "../context/CurrencyContext";
import { parseAndMergeDays } from "../utils/parseAndMergeDays";
import useExportPdf from "../hooks/useExportPdf";
import useItineraryEditor from "../hooks/useItineraryEditor";
import { useCheckoutContext } from "../context/CheckoutContext";
import { generateItineraryBlob } from "./ItineraryDocx";
import { formatCurrencyWithCode } from "../utils/currencyUtills";
import { 
  parseExpensesAccommodation,
  getAccommodationNights,
  calculateFirstRowPrices,
  calculateAlternativePrices,
  mergeAllAccommodations,
  hasAccommodationItems
} from "../utils/accomodationProcessor";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const ItineraryPDF = forwardRef((props, ref) => {
  const { selectedPackage } = usePackageContext();
  const { currency } = useCurrencyContext();
  const { days: expenseDays, hotelItems, villaItems } = useExpensesContext();
  
  const [itineraryState, setItineraryState] = useState({
    mergedDays: [],
    itineraryData: [],
    isDataProcessed: false,
  });

const [accommodationState, setAccommodationState] = useState({
    parsedExpensesData: { hotels: [], villas: [] },
    allAccommodations: [],
    accommodationNights: 0,
    firstRowPrices: null,
    hasItems: false,
    isLoading: true,
  });
  
  const [isEditingInclusion, setIsEditingInclusion] = useState(false);
  const { exportAsBlob, downloadPdf } = useExportPdf();
  const toast = useToast();
  const componentRef = useRef();
  const { 
    childTotal, 
    adultPriceTotal, 
    childPriceTotal,
    userMarkupAmount,
    childMarkupAmount
  } = useCheckoutContext();

    const {
    calculateTourAdultTotal,
    calculateAdditionalAdultTotal,
    calculateTransport,
    calculateTourChildTotals,
    calculateAdditionalChildTotals,
    calculateExtrabedChildTotals,
    adultSubtotal,
    childSubtotal
  } = useCalculatePaxContext();

  const packageId = useMemo(() => 
    selectedPackage?.id || selectedPackage?._id
  , [selectedPackage?.id, selectedPackage?._id]);

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
    editItemDescription,
    editItemTitle,
  } = useItineraryEditor([], packageId);

  useImperativeHandle(ref, () => ({
    async exportAsBlob() {
      return exportAsBlob(componentRef);
    },
    async download(filename = `itinerary_${selectedPackage?.title || ""}.pdf`) {
      await downloadPdf(componentRef, filename);
    }
  }));

  useEffect(() => {
    let isMounted = true;

    const processDays = async () => {
      if (!selectedPackage?.days?.length) {
        if (isMounted) {
          setItineraryState(prev => ({ ...prev, isDataProcessed: true }));
        }
        return;
      }

      try {
        const merged = await parseAndMergeDays(selectedPackage.days);
        
        if (!isMounted) return;

        const itinerary = [];

        merged.forEach((day, dayIndex) => {
          const processActivities = (items, type) => {
            return items?.map((item) => {
              const adultQty = parseInt(item.jumlahadult || item.jumlahAdult) || 0;
              const childQty = parseInt(item.jumlahchild || item.jumlahChild) || 0;
              const adultPrice = parseInt(item.hargaddult || item.hargaAdult || item.hargaadult) || 0;
              const childPrice = parseInt(item.hargachild || item.hargaChild || item.hargachild) || 0;

              return {
                type: "activity",
                item: item.displayName || item.name || `Unnamed ${type}`,
                expense: adultPrice > 0 && adultQty > 0 
                  ? formatCurrency(adultPrice * adultQty) 
                  : "Rp 0",
                kidExpense: childPrice > 0 && childQty > 0 
                  ? formatCurrency(childPrice * childQty) 
                  : "-",
                adultPrice,
                childPrice,
                adultQty,
                childQty,
                originalData: item,
              };
            }) || [];
          };
          const tourActivities = day.tours 
            ? processActivities(day.tours, "Tour Item") 
            : [];

          // Process expense items dari context - sama seperti InvoicePDF
          const processExpenseItems = (expenseItems) => {
            return expenseItems?.map((item) => {
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
                    const adultTotal = (item.adultPrice || 0) * (item.adultQuantity || 1);
                    const childTotal = (item.childPrice || 0) * (item.childQuantity || 1);
                    total = adultTotal + childTotal;
                  } else {
                    total = (item.price || 0) * (item.quantity || 1);
                  }
                  return total > 0 ? formatCurrency(total) : "Rp 0";
                })(),
                kidExpense: "-",
                originalData: item,
              };
            }) || [];
          };

        const activities = [
          ...(day.tours ? tourActivities : [
            ...processActivities(day.destinations, "Destination"),
            ...processActivities(day.restaurants, "Restaurant"),
            ...processActivities(day.activities, "Activity")
          ])
        ];
          const expenseDay = expenseDays[dayIndex];
          const expenseItems = processExpenseItems(expenseDay?.totals || []);
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

        setItineraryState({
          mergedDays: merged,
          itineraryData: itinerary,
          isDataProcessed: true,
        });

        props.onReady?.();

        updateDays(itinerary);

      } catch (err) {
        console.error("Gagal memproses days:", err);
        if (isMounted) {
          setItineraryState({
            mergedDays: selectedPackage.days || [],
            itineraryData: [],
            isDataProcessed: true,
          });
        }
      }
    };

    processDays();

    return () => {
      isMounted = false;
    };
  }, [selectedPackage?.days, expenseDays, updateDays]);

  useEffect(() => {
    let isMounted = true;

    const processAccommodationData = async () => {
      try {
        // Parse data expenses accommodation
        const parsedExpensesData = await parseExpensesAccommodation(hotelItems, villaItems);
        
        if (!isMounted) return;

        // Hitung data lainnya
        const accommodationNights = getAccommodationNights(selectedPackage?.days);
        
        const firstRowPrices = calculateFirstRowPrices(
          selectedPackage,
          adultSubtotal,
          childSubtotal,
          userMarkupAmount,
          childMarkupAmount
        );

        const allAccommodations = mergeAllAccommodations(
          itineraryState.mergedDays,
          parsedExpensesData,
          selectedPackage
        );

        const hasItems = hasAccommodationItems(
          itineraryState.mergedDays,
          parsedExpensesData,
          allAccommodations,
          selectedPackage
        );

        setAccommodationState({
          parsedExpensesData,
          allAccommodations,
          accommodationNights,
          firstRowPrices,
          hasItems,
          isLoading: false,
        });

      } catch (error) {
        console.error("Error processing accommodation data:", error);
        if (isMounted) {
          setAccommodationState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      }
    };

    if (hotelItems.length > 0 || villaItems.length > 0 || itineraryState.mergedDays.length > 0) {
      processAccommodationData();
    } else {
      setAccommodationState({
        parsedExpensesData: { hotels: [], villas: [] },
        allAccommodations: [],
        accommodationNights: 0,
        firstRowPrices: null,
        hasItems: false,
        isLoading: false,
      });
    }

    return () => {
      isMounted = false;
    };
  }, [
    hotelItems, 
    villaItems, 
    itineraryState.mergedDays, 
    selectedPackage,
    adultSubtotal,
    childSubtotal,
    userMarkupAmount,
    childMarkupAmount
  ]);
  
  const formatCurrencyWithContext = (amount) => formatCurrencyWithCode(amount, currency);
  const handleDownloadDocx = async () => {
  try {
    const blob = await generateItineraryBlob({
      packageName: selectedPackage?.name,
      mergedDays: itineraryState.mergedDays,
      reorderedDays: Array.isArray(reorderedDays) ? reorderedDays : [],
      inclusionExclusionData: JSON.parse(localStorage.getItem("inclusionExclusionData") || "{}"),
      accommodationData: accommodationState,
      selectedPackage: selectedPackage,
      childTotal: childTotal,
      adultPriceTotal,
      childPriceTotal,
      transportType: "6 Seater",
      getAlternativePrices: getAlternativePrices,
      currency: currency,
      formatCurrency: formatCurrencyWithContext
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedPackage?.title || "Itinerary"}_Plan.docx`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Berhasil",
      description: "Itinerary berhasil diunduh dalam format DOCX",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    console.error("Error downloading DOCX:", error);
    toast({
      title: "Gagal mengunduh DOCX",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};

  const handleSaveInclusion = useCallback(() => {
    toast({
      title: "Data Tersimpan",
      description: "Inclusion & Exclusion berhasil disimpan!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    setIsEditingInclusion(false);
  }, [toast]);

  const handleCancelEdit = useCallback(() => {
    setIsEditingInclusion(false);
  }, []);

  const handleSaveReorder = useCallback(() => {
    const success = saveOrder();
    if (success) {
      setItineraryState(prev => ({
        ...prev,
        itineraryData: [...reorderedDays],
      }));
      toggleReordering();
      toast({
        title: "Urutan Itinerary Disimpan",
        description: "Urutan berhasil disimpan dan akan dipertahankan untuk package ini",
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

  const hasOrderChanged = useMemo(() => {
    return JSON.stringify(reorderedDays) !== JSON.stringify(originalDays);
  }, [reorderedDays, originalDays]);

  const getAlternativePrices = useCallback((accommodationPrice, extrabedPrice) => {
    return calculateAlternativePrices(
      accommodationPrice,
      extrabedPrice,
      selectedPackage,
      calculateTourAdultTotal,
      calculateAdditionalAdultTotal,
      calculateTransport,
      calculateTourChildTotals,
      calculateAdditionalChildTotals,
      calculateExtrabedChildTotals
    );
  }, [
    selectedPackage,
    calculateTourAdultTotal,
    calculateAdditionalAdultTotal,
    calculateTransport,
    calculateTourChildTotals,
    calculateAdditionalChildTotals,
    calculateExtrabedChildTotals
  ]);

  if (!itineraryState.isDataProcessed) {
    return (
      <Box maxW="900px" mx="auto" py={8}>
        <Text textAlign="center">Loading itinerary data...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="900px" mx="auto" py={8}>
      {/* Control Panel - Di luar area PDF */}
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
          Itinerary Controls
        </Text>
        
        <Flex gap={2} flexWrap="wrap" alignItems="center">
          {/* Reorder Controls - Enhanced seperti InvoicePDF */}
          <Box>
            {!isReordering ? (
              <Flex gap={2}>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={handleDownloadDocx}
                  isDisabled={!itineraryState.isDataProcessed}
                >
                  Download Word
                </Button>
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

          {/* Inclusion/Exclusion Controls */}
          <Box>
            {!isEditingInclusion ? (
              <Button 
                size="sm" 
                colorScheme="blue" 
                onClick={() => setIsEditingInclusion(true)}
              >
                Edit Inclusion/Exclusion
              </Button>
            ) : (
              <Flex gap={2}>
                <Button 
                  size="sm" 
                  colorScheme="green" 
                  onClick={handleSaveInclusion}
                >
                  Simpan
                </Button>
                <Button 
                  size="sm" 
                  colorScheme="gray" 
                  onClick={handleCancelEdit}
                >
                  Batal
                </Button>
              </Flex>
            )}
          </Box>
        </Flex>
      </Flex>

      {/* Status indicator untuk saved order - seperti InvoicePDF */}
      {!isReordering && hasOrderChanged && (
        <Box mb={4} p={3} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
          <Text fontSize="sm" color="blue.800">
            ℹ️ Menampilkan urutan yang telah disimpan. Klik "Reset ke Urutan Asli" untuk mengembalikan ke urutan default.
          </Text>
        </Box>
      )}

      {/* Area PDF - Hanya ini yang akan di-export */}
      <Box
        ref={componentRef}
        data-pdf-content
        width="794px"
        minHeight="1123px"
        mx="auto"
        py="0px"
        px="40px"
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
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={2}
          color="#FB8C00"
          textAlign="center"
        >
          Travel Itinerary
        </Text>

        <Divider mb={6} borderColor="#FFA726" />

        <HotelChoiceTable 
          accommodationData={{
            allAccommodations: accommodationState.allAccommodations,
            accommodationNights: accommodationState.accommodationNights,
            firstRowPrices: accommodationState.firstRowPrices,
            hasItems: accommodationState.hasItems,
            parsedExpensesData: accommodationState.parsedExpensesData,
          }}
          getAlternativePrices={getAlternativePrices}
          selectedPackage={selectedPackage}
          childTotal={childTotal}
        />
          

        <Divider my={6} borderColor="#FFA726" />

        <ItineraryTable 
          title={`ITINERARY`} 
          days={Array.isArray(reorderedDays) ? reorderedDays : []}
          formatCurrency={formatCurrency}
          isReordering={isReordering}
          onMoveItemUp={moveItemUp}
          onMoveItemDown={moveItemDown}
          onMoveDayUp={moveDayUp}
          onMoveDayDown={moveDayDown}
          onEditItemTitle={editItemTitle}
          onEditItemDescription={editItemDescription} 
        />

        <Divider my={6} borderColor="#FFA726" />

        <InclusionExclusion 
          isEditing={isEditingInclusion}
          onSave={handleSaveInclusion}
          onCancel={handleCancelEdit}
          showButtons={false}
        />
      </Box>
    </Box>
  );
});

export default ItineraryPDF;