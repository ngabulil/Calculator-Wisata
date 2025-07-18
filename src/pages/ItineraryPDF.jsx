import { 
  useState, 
  useEffect, 
  useRef, 
  useImperativeHandle, 
  forwardRef 
} from "react";
import { Box, Text, Divider,Button } from "@chakra-ui/react";
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
  const { exportAsBlob, downloadPdf } = useExportPdf();
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

      <ItineraryTable   title={`ITINERARY ${selectedPackage?.title || ""}`} days={itineraryData} />

      <Divider my={6} borderColor="#FFA726" />

      <InclusionExclusion />
    </Box>
  );
});

export default ItineraryPDF;