import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Box, Text, Divider, Button } from "@chakra-ui/react";
import HotelChoiceTable from "../components/ItineraryPDF/HotelChoiceTable";
import ItineraryTable from "../components/ItineraryPDF/ItineraryTable";
import InclusionExclusion from "../components/ItineraryPDF/InclusionExclusion";

import { useExpensesContext } from "../context/ExpensesContext";
import { useAkomodasiContext } from "../context/AkomodasiContext";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const ItineraryPDF = forwardRef ((props, ref) => {
  const { days: expensesDays } = useExpensesContext();
  const { days: akomodasiDays } = useAkomodasiContext();

  const [itineraryData, setItineraryData] = useState({
    itineraryDays: [],
  });

  const componentRef = useRef();

useImperativeHandle(ref, () => ({
        async exportAsBlob() {
            const input = componentRef.current;
            const canvas = await html2canvas(input, { scale: 1 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            return pdf.output('blob');
        }
    }));

  useEffect(() => {
    const formattedExpensesDays = expensesDays.map((day, index) => ({
      day: index + 1,
      title: day.day_name,
      description: day.day_description,
      activities: day.totals.map((item) => item.label),
    }));

    setItineraryData({
      itineraryDays: formattedExpensesDays,
    });
  }, [expensesDays]);

  return (
    <>
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

        <HotelChoiceTable akomodasiDays={akomodasiDays} />

        <Divider my={6} borderColor="#FFA726" />

        <ItineraryTable days={itineraryData.itineraryDays} />

        <Divider my={6} borderColor="#FFA726" />

        <InclusionExclusion />
      </Box>

      {/* <Box textAlign="center" my={8}>
        <Button colorScheme="orange" onClick={exportPDF}>
          Export PDF
        </Button>
      </Box> */}
    </>
  );
});

export default ItineraryPDF;