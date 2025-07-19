import { 
  useState, 
  useEffect, 
  useRef, 
  useImperativeHandle, 
  forwardRef 
} from "react";
import { Box, Text, Divider, Button, Flex, useToast } from "@chakra-ui/react";
import HotelChoiceTable from "../components/ItineraryPDF/HotelChoiceTable";
import ItineraryTable from "../components/ItineraryPDF/ItineraryTable";
import InclusionExclusion from "../components/ItineraryPDF/InclusionExclusion";
import { usePackageContext } from "../context/PackageContext";
import { parseAndMergeDays } from "../utils/parseAndMergeDays";
import useExportPdf from "../hooks/useExportPdf";

const ItineraryPDF = forwardRef((props, ref) => {
  const { selectedPackage } = usePackageContext();
  const [mergedDays, setMergedDays] = useState([]);
  const [itineraryData, setItineraryData] = useState([]);
  const [isEditingInclusion, setIsEditingInclusion] = useState(false);
  const { exportAsBlob, downloadPdf } = useExportPdf();
  const toast = useToast();
  const componentRef = useRef();

  useImperativeHandle(ref, () => ({
    async exportAsBlob() {
      return exportAsBlob(componentRef);
    },
    async download(filename = `itinerary_${selectedPackage?.title || ""}.pdf`) {
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
    processDays();
  }, [selectedPackage]);

  useEffect(() => {
    if (mergedDays.length === 0) return;

    // Format itinerary data dari mergedDays
    const formattedDays = mergedDays.map((day, index) => {
      // Gabungkan semua aktivitas
      const activities = [
        ...(day.destinations || []).map(dest => dest.displayName),
        ...(day.restaurants || []).map(resto => resto.displayName),
        ...(day.activities || []).map(act => act.displayName),
      ];

      return {
        day: index + 1,
        title: day.day_name || `Day ${index + 1}`,
        description: day.description_day || day.day_description || "",
        date: day.date,
        activities: activities,
      };
    });

    setItineraryData(formattedDays);
  }, [mergedDays]);

  const handleSaveInclusion = () => {
    toast({
      title: "Data Tersimpan",
      description: "Inclusion & Exclusion berhasil disimpan!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    setIsEditingInclusion(false);
  };

  const handleCancelEdit = () => {
    setIsEditingInclusion(false);
  };

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
        
        <Flex gap={2} flexWrap="wrap">
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
          Travel Itinerary & Quotation
        </Text>

        <Text fontSize="md" textAlign="center" mb={6} color="gray.600">
          Your Adventure Awaits!
        </Text>

        <Divider mb={6} borderColor="#FFA726" />

        <HotelChoiceTable akomodasiDays={mergedDays} />

        <Divider my={6} borderColor="#FFA726" />

        <ItineraryTable title={`ITINERARY ${selectedPackage?.title || ""}`} days={itineraryData} />

        <Divider my={6} borderColor="#FFA726" />

        {/* Pass state edit dan handler ke komponen */}
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