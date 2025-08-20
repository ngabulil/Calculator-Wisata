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
import { parseAndMergeDays } from "../utils/parseAndMergeDays";
import useExportPdf from "../hooks/useExportPdf";
import useItineraryEditor from "../hooks/useItineraryEditor";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const ItineraryPDF = forwardRef((props, ref) => {
  const { selectedPackage } = usePackageContext();
  const { days: expenseDays } = useExpensesContext();
  
  // Consolidated state untuk mengurangi re-render - sama seperti InvoicePDF
  const [itineraryState, setItineraryState] = useState({
    mergedDays: [],
    itineraryData: [],
    isDataProcessed: false,
  });
  
  const [isEditingInclusion, setIsEditingInclusion] = useState(false);
  const { exportAsBlob, downloadPdf } = useExportPdf();
  const toast = useToast();
  const componentRef = useRef();

  // Memoize package ID untuk reorder hook
  const packageId = useMemo(() => 
    selectedPackage?.id || selectedPackage?._id
  , [selectedPackage?.id, selectedPackage?._id]);

  // Calculate total adults and children - sama seperti InvoicePDF
  const calculatedValues = useMemo(() => {
    const totalAdult = selectedPackage?.totalPaxAdult && parseInt(selectedPackage.totalPaxAdult) > 0
      ? parseInt(selectedPackage.totalPaxAdult)
      : 1;
    const actualChild = selectedPackage?.totalPaxChildren && parseInt(selectedPackage.totalPaxChildren) > 0
      ? parseInt(selectedPackage.totalPaxChildren)
      : 0;

    return {
      totalAdult,
      actualChild,
    };
  }, [selectedPackage?.totalPaxAdult, selectedPackage?.totalPaxChildren]);

  // Initialize reorder hook dengan package ID untuk menyimpan urutan
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

  // Process days data - PERBAIKAN: Gunakan logika yang sama seperti InvoicePDF
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

        // PERBAIKAN: Gunakan processing yang sama seperti InvoicePDF
        const itinerary = [];

        merged.forEach((day, dayIndex) => {
          // Helper function untuk process activities - sama seperti InvoicePDF
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
                // Tambahan data untuk keperluan lain
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
                kidExpense: "-", // Expense items biasanya tidak memiliki kid expense terpisah
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

          // Get expense items dari context
          const expenseDay = expenseDays[dayIndex];
          const expenseItems = processExpenseItems(expenseDay?.totals || []);

          // PERBAIKAN: Gabungkan activities dan expense items menjadi unified items
          const unifiedItems = [...activities, ...expenseItems];

          itinerary.push({
            day: dayIndex + 1,
            title: day.name || `Day ${dayIndex + 1}`,
            description: day.description_day || day.day_description || "",
            date: day.date,
            // PERBAIKAN: Tambahkan unified items array
            items: unifiedItems,
            // Keep backward compatibility
            activities: activities,
            expenseItems: expenseItems,
          });
        });

        // Update state sekaligus
        setItineraryState({
          mergedDays: merged,
          itineraryData: itinerary,
          isDataProcessed: true,
        });

        // Update reorder hook with new data
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

  // Memoized handlers untuk inclusion/exclusion
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

  // Memoized reorder handlers - sama seperti InvoicePDF
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

  // Memoize untuk cek apakah order berbeda dari original
  const hasOrderChanged = useMemo(() => {
    return JSON.stringify(reorderedDays) !== JSON.stringify(originalDays);
  }, [reorderedDays, originalDays]);

  // Show loading jika data belum selesai diproses
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

        <HotelChoiceTable akomodasiDays={itineraryState.mergedDays} />

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
          totalAdult={calculatedValues.totalAdult}
          totalChild={calculatedValues.actualChild}
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