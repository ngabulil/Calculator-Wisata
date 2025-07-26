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
import useItineraryReorder from "../hooks/useItineraryReorder";

const ItineraryPDF = forwardRef((props, ref) => {
  const { selectedPackage } = usePackageContext();
  const { days: expenseDays } = useExpensesContext();
  
  // Consolidated state untuk mengurangi re-render
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
  } = useItineraryReorder([], packageId);

  useImperativeHandle(ref, () => ({
    async exportAsBlob() {
      return exportAsBlob(componentRef);
    },
    async download(filename = `itinerary_${selectedPackage?.title || ""}.pdf`) {
      await downloadPdf(componentRef, filename);
    }
  }));

  // Process days data - dengan optimization dan batching
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

        // Format itinerary data dari mergedDays
        const formattedDays = merged.map((day, index) => {
          // Gabungkan semua aktivitas dengan error handling
          const activities = [
            ...(day.destinations || []).map(dest => dest.displayName || dest.name || `Destination ${index + 1}`),
            ...(day.restaurants || []).map(resto => resto.displayName || resto.name || `Restaurant ${index + 1}`),
            ...(day.activities || []).map(act => act.displayName || act.name || `Activity ${index + 1}`),
          ].filter(Boolean); // Remove any null/undefined values

          const expenseDay = expenseDays[index];
          const expenseItems = expenseDay?.totals || [];

          return {
            day: index + 1,
            title: day.name || `Day ${index + 1}`,
            description: day.description_day || day.day_description || "",
            date: day.date,
            activities: activities,
            expenseItems: expenseItems,
          };
        });

        // Update state sekaligus
        setItineraryState({
          mergedDays: merged,
          itineraryData: formattedDays,
          isDataProcessed: true,
        });

        // Update reorder hook with new data
        updateDays(formattedDays);

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
          title={`ITINERARY ${selectedPackage?.title || ""}`} 
          days={isReordering ? reorderedDays : reorderedDays}
          isReordering={isReordering}
          onMoveItemUp={moveItemUp}
          onMoveItemDown={moveItemDown}
          onMoveDayUp={moveDayUp}
          onMoveDayDown={moveDayDown}
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