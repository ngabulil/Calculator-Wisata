import { useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useToast,
  useColorModeValue,
  Input,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { AddIcon, DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import DayCard from "../components/Expenses/DayCard";
import { useExpensesContext } from "../context/ExpensesContext";
import InvoicePDF from "./InvoicePDF";
import ItineraryPDF from "./ItineraryPDF";
import { apiPostPesanan } from "../services/pesanan";

const ExpensesPage = () => {
  const {
    days,
    addDay,
    removeDay,
    addExpenseItem,
    removeExpenseItem,
    updateExpenseItem,
    calculateDayTotal,
    // calculateGrandTotal,
    formatCurrency,
    
  } = useExpensesContext();

  const [editingItem, setEditingItem] = useState(null);
  const toast = useToast();
  const bg = useColorModeValue("gray.700", "gray.800");

  const handleRemoveDay = (dayIndex) => {
    if (days.length <= 1) {
      toast({
        title: "Tidak dapat menghapus",
        description: "Harus ada setidaknya satu hari",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    removeDay(dayIndex);
  };

  const invoiceRef = useRef();
  const itineraryRef = useRef();

  const handleCreateOrder = async () => {
    if (!invoiceRef.current || !itineraryRef.current) {
      toast({
        title: "Error",
        description: "PDF components are not ready.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const invoiceBlob = await invoiceRef.current.exportAsBlob();
      const itineraryBlob = await itineraryRef.current.exportAsBlob();

      const formData = new FormData();
      formData.append("invoice", invoiceBlob, `invoice.pdf`);
      formData.append(
        "itinerary",
        itineraryBlob,
        `itinerary.pdf`
      );

      const result = await apiPostPesanan(formData);
      console.log("Order created successfully:", result);

      toast({
        title: "Pesanan berhasil dikirim",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Gagal mengirim pesanan",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleViewPdf = () => {
    window.history.pushState({}, "", "/pdf-invoice");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleViewItineraryPdf = () => {
    window.history.pushState({}, "", "/pdf-itinerary");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // Fungsi untuk download langsung invoice
  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) {
      toast({
        title: "Error",
        description: "Invoice component is not ready.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await invoiceRef.current.download();
    } catch (error) {
      toast({
        title: "Gagal mengunduh invoice",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Fungsi untuk download langsung itinerary
  const handleDownloadItinerary = async () => {
    if (!itineraryRef.current) {
      toast({
        title: "Error",
        description: "Itinerary component is not ready.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await itineraryRef.current.download();
    } catch (error) {
      toast({
        title: "Gagal mengunduh itinerary",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="6xl" mx="auto" p={6} bg={bg} minH="100vh">
      <Box bg={bg} rounded="lg" shadow="lg" p={6}>
        <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Input Expenses Itinerary
          </Text>
          <Flex gap={3} wrap="wrap">
            {/* Tombol "Day" */}
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={addDay}
              variant="solid"
              size="md"
            >
              Hari
            </Button>
            {/* Tombol "Lihat Invoice" */}
            <Button
              leftIcon={<ViewIcon />}
              colorScheme="purple"
              onClick={handleViewPdf}
              variant="solid" 
              size="md"
            >
              Quotation
            </Button>
            {/* Tombol "Unduh Invoice" */}
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="teal"
              onClick={handleDownloadInvoice}
              variant="outline"
              size="md"
            >
              Quotation
            </Button>
            {/* Tombol "Lihat Itinerary" */}
            <Button
              leftIcon={<ViewIcon />}
              colorScheme="blue"
              onClick={handleViewItineraryPdf}
              variant="solid" 
              size="md"
            >
              Itinerary
            </Button>
            {/* Tombol "Unduh Itinerary" */}
            <Button
              leftIcon={<DownloadIcon />} 
              colorScheme="teal"
              onClick={handleDownloadItinerary}
              variant="outline"
              size="md"
            >
              Itinerary
            </Button>
          </Flex>
        </Flex>

        <Stack spacing={6}>
          {days.map((day, dayIndex) => (
            <DayCard
              key={dayIndex}
              day={day}
              dayIndex={dayIndex}
              editingItem={editingItem}
              setEditingItem={setEditingItem}
              removeDay={handleRemoveDay}
              calculateDayTotal={calculateDayTotal}
              formatCurrency={formatCurrency}
              addExpenseItem={addExpenseItem}
              removeExpenseItem={removeExpenseItem}
              updateExpenseItem={updateExpenseItem}
            />
          ))}
        </Stack>

        {/* Grand Total */}
        {/* {days.length > 0 && (
          <Box
            mt={8}
            bg={bg}
            rounded="lg"
            p={6}
            borderWidth="1px"
            borderColor="blue.200"
          >
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold" color="green">
                Total Expenses:
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {formatCurrency(calculateGrandTotal())}
              </Text>
            </Flex>
          </Box>
        )} */}
      </Box>

      {/* Komponen PDF disembunyikan dan direferensikan */}
      <Box style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <InvoicePDF ref={invoiceRef} />
        <ItineraryPDF ref={itineraryRef} />
      </Box>

      <Flex justify="center" mt={6}>
        <Button
          colorScheme="purple"
          variant="solid" 
          onClick={handleCreateOrder}
          width="100%"
          maxW="400px"
          fontSize="lg"
          py={6}
        >
          Buat Pesanan
        </Button>
      </Flex>
    </Box>
  );
};

export default ExpensesPage;