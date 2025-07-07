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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
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
    calculateGrandTotal,
    formatCurrency,
    tourCode,
    setTourCode,
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

    if (!tourCode) { 
      toast({
        title: "Error",
        description: "Kode Pesanan tidak boleh kosong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const kode_pesanan = tourCode;

      const invoiceBlob = await invoiceRef.current.exportAsBlob();
      const itineraryBlob = await itineraryRef.current.exportAsBlob();

      const formData = new FormData();
      formData.append("invoice", invoiceBlob, `${kode_pesanan}_invoice.pdf`);
      formData.append(
        "itinerary",
        itineraryBlob,
        `${kode_pesanan}_itinerary.pdf`
      );
      formData.append("kode_pesanan", kode_pesanan);

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
    localStorage.setItem("expenseItineraryData", JSON.stringify(days));
    window.history.pushState({}, "", "/pdf-invoice");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleViewItineraryPdf = () => {
    localStorage.setItem("expenseItineraryData", JSON.stringify(days));
    window.history.pushState({}, "", "/pdf-itinerary");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <Box maxW="6xl" mx="auto" p={6} bg={bg} minH="100vh">
      <Box bg={bg} rounded="lg" shadow="lg" p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Input Expenses Itinerary
          </Text>
          <Flex gap={3}>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={addDay}>
              Day
            </Button>
            <Button colorScheme="teal" onClick={handleViewPdf}>
              PDF Harga
            </Button>
            <Button colorScheme="teal" onClick={handleViewItineraryPdf}>
              PDF Itinerary
            </Button>
          </Flex>
        </Flex>

        {/* Form input kode tur baru */}
        <Box mb={6}>
          <Text fontSize="lg" fontWeight="semibold" color="white" mb={2}>
            Kode Pesanan:
          </Text>
          <Input
            value={tourCode}
            onChange={(e) => setTourCode(e.target.value)}
            placeholder="Masukkan Kode Pesanan (contoh: ORD-123)"
            color="white"
            borderColor="gray.600"
            _hover={{ borderColor: "gray.500" }}
          />
        </Box>

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
        {days.length > 0 && (
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
                Total Expensis:
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {formatCurrency(calculateGrandTotal())}
              </Text>
            </Flex>
          </Box>
        )}
      </Box>

      {/* Komponen PDF disembunyikan dan direferensikan */}
      <Box style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <InvoicePDF ref={invoiceRef} />
        <ItineraryPDF ref={itineraryRef} />
      </Box>

      <Flex justify="center" mt={6}>
        <Button
          colorScheme="purple"
          variant="outline"
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