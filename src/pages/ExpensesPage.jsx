import { useState, useRef, useEffect } from "react";
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
import HotelCard from "../components/Calculator/akomodasi/HotelCard";
import VillaCard from "../components/Calculator/akomodasi/VillaCard";
import { useAkomodasiContext } from "../context/AkomodasiContext";

const ExpensesPage = () => {
  const {
    days,
    addDay,
    removeDay,
    addExpenseItem,
    removeExpenseItem,
    updateExpenseItem,
    calculateDayTotal,
    formatCurrency,
    // Hotel dan Villa dari context
    hotelItems,
    addHotelItem,
    updateHotelItem,
    removeHotelItem,
    villaItems,
    addVillaItem,
    updateVillaItem,
    removeVillaItem,
  } = useExpensesContext();
  
  const { getHotels, getVillas } = useAkomodasiContext();

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

  useEffect(() => {
    getHotels();
    getVillas();
  }, []);

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
      formData.append("itinerary", itineraryBlob, `itinerary.pdf`);

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

  // Handler untuk hotel menggunakan context
const handleHotelChange = (index, updatedItem) => {
  updateHotelItem(index, updatedItem);
};

const handleVillaChange = (index, updatedItem) => {
  updateVillaItem(index, updatedItem);
};

  const handleHotelDelete = (index) => {
    removeHotelItem(index);
  };

const handleAddHotel = () => {
  addHotelItem({
    jumlahKamar: 1,
    jumlahExtrabed: 1,
    useExtrabed: false,
  });
};

const handleAddVilla = () => {
  addVillaItem({
    jumlahKamar: 1,
    jumlahExtrabed: 1,
    useExtrabed: false,
  });
};

  const handleVillaDelete = (index) => {
    removeVillaItem(index);
  };

  return (
    <Box maxW="6xl" mx="auto" p={6} bg={bg} minH="100vh">
      <Box bg={bg} rounded="lg" shadow="lg" p={6}>
        <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            Input Expenses Itinerary
          </Text>
          <Flex gap={3} wrap="wrap">
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={addDay}
              variant="solid"
              size="md"
            >
              Hari
            </Button>
            <Button
              leftIcon={<ViewIcon />}
              colorScheme="purple"
              onClick={handleViewPdf}
              variant="solid" 
              size="md"
            >
              Quotation
            </Button>
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="teal"
              onClick={handleDownloadInvoice}
              variant="outline"
              size="md"
            >
              Quotation
            </Button>
            <Button
              leftIcon={<ViewIcon />}
              colorScheme="blue"
              onClick={handleViewItineraryPdf}
              variant="solid" 
              size="md"
            >
              Itinerary
            </Button>
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
      </Box>

      {/* Komponen PDF disembunyikan dan direferensikan */}
      <Box style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <InvoicePDF ref={invoiceRef} />
        <ItineraryPDF ref={itineraryRef} />
      </Box>

      <Box mt={8}>
        <Text fontSize="xl" fontWeight="bold" mb={4} color="white">
          Accommodation for Price Comparison
        </Text>

        {/* Hotel Section */}
        <VStack spacing={4} mb={6} align="stretch">
          <Text fontSize="lg" fontWeight="semibold" color="white">
            Hotel Options
          </Text>
          {hotelItems.map((item, index) => (
            <HotelCard
              key={index}
              index={index}
              dayIndex={null}
              data={item}
              onDelete={() => handleHotelDelete(index)}
              onChange={(updatedItem) => handleHotelChange(index, updatedItem)}
            />
          ))}
          <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={handleAddHotel}>
            Tambah Hotel
          </Button>
        </VStack>

        {/* Villa Section */}
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="semibold" color="white">
            Villa Options
          </Text>
          {villaItems.map((item, index) => (
            <VillaCard
              key={index}
              index={index}
              dayIndex={null}
              data={item}
              onDelete={() => handleVillaDelete(index)}
              onChange={(updatedItem) => handleVillaChange(index, updatedItem)}
            />
          ))}
          <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleAddVilla}>
            Tambah Villa
          </Button>
        </VStack>


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