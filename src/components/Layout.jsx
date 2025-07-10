// components/Layout.jsx
import {
  Box,
  useColorModeValue,
  Container,
  Button,
  Text,
  HStack,
  IconButton,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Tag,
  TagLabel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckoutContext } from "../context/CheckoutContext";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import {
  CloseIcon,
  ChevronUpIcon,
  AddIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import MainSelect from "./MainSelect";
import { usePackageContext } from "../context/PackageContext";
import AkomodasiTabContent from "./Calculator/tab-content/AkomodasiTabContent";
import TransportTabContent from "./Calculator/tab-content/TransportTabContent";

const Layout = ({ children }) => {
  const bg = useColorModeValue("gray.50", "gray.900");
  const location = useLocation();
  const navigate = useNavigate();
  const { akomodasiTotal, transportTotal } = useCheckoutContext();
  const [isVisible, setIsVisible] = useState(true);

  const isCheckoutPage = location.pathname === "/checkout";

  const { packagesData, getPackages, selectedPackage, setSelectedPackage } =
    usePackageContext();

  const {
    days = [],
    name = "",
    description = "",
    title = "",
    id = null,
  } = selectedPackage;
  const [activeDayId, setActiveDayId] = useState(1);

  useEffect(() => {
    getPackages();
  }, []);

  const handleAddDay = () => {
    const newId = days.length + 1;
    const newDay = {
      id: newId,
      name: `Day ${newId}`,
      description_day: "",
      hotels: [],
      villas: [],
      akomodasi_additionals: [],
      destinations: [],
      activities: [],
      restaurants: [],
      mobils: [],
      transport_additionals: [],
    };
    setSelectedPackage((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
    }));
    setActiveDayId(newId);
  };

  const handleDeleteDay = (id) => {
    const filtered = days.filter((d) => d.id !== id);
    setSelectedPackage((prev) => ({ ...prev, days: filtered }));
    if (activeDayId === id && filtered.length > 0) {
      setActiveDayId(filtered[0].id);
    }
  };

  return (
    <Box minH="100vh" bg={bg} position="relative">
      <Navbar />
      <Container maxW="7xl" py={3}>
        {/* FORM PAKET */}
        <Box bg="gray.700" p={4} borderRadius="md" mb={6}>
          <FormControl mb={4}>
            <FormLabel color="white">Pilih Paket</FormLabel>
            <MainSelect
              options={packagesData.map((p) => ({
                value: p.id,
                label: p.name,
              }))}
              value={id ? { value: id, label: title } : null}
              onChange={(selected) => {
                const found = packagesData.find((p) => p.id === selected.value);
                setSelectedPackage({
                  ...found,
                  title: found.name,
                  name: found.name,
                  days: found.days || [],
                });
                setActiveDayId(1);
              }}
              placeholder="Pilih Paket"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel color="white">Nama Paket</FormLabel>
            <Input
              placeholder="Masukkan nama package"
              bg="gray.600"
              color="white"
              value={name}
              onChange={(e) =>
                setSelectedPackage((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel color="white">Description</FormLabel>
            <Textarea
              placeholder="Deskripsi paket"
              bg="gray.600"
              color="white"
              value={description}
              onChange={(e) =>
                setSelectedPackage((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </FormControl>

          {/* DAYS */}
          <Box mt={8}>
            <HStack spacing={3} mb={3} flexWrap="wrap">
              {days.map((day) => (
                <HStack key={day.id} spacing={1}>
                  <Tag
                    size="lg"
                    borderRadius="full"
                    variant="solid"
                    bg={day.id === activeDayId ? "blue.300" : "gray.600"}
                    cursor="pointer"
                    onClick={() => setActiveDayId(day.id)}
                  >
                    <TagLabel>{day.name}</TagLabel>
                  </Tag>
                  <IconButton
                    size="xs"
                    icon={<DeleteIcon />}
                    aria-label="Hapus Day"
                    colorScheme="red"
                    onClick={() => handleDeleteDay(day.id)}
                  />
                </HStack>
              ))}
              <Button
                size="sm"
                colorScheme="gray"
                leftIcon={<AddIcon />}
                onClick={handleAddDay}
              >
                Tambah Day
              </Button>
            </HStack>

            {/* DESKRIPSI DAY */}
            <FormControl>
              <FormLabel color="white">
                Deskripsi untuk {days.find((d) => d.id === activeDayId)?.name}
              </FormLabel>
              <Textarea
                placeholder="Deskripsi hari..."
                bg="gray.600"
                color="white"
                value={
                  days.find((d) => d.id === activeDayId)?.description_day || ""
                }
                onChange={(e) => {
                  const updatedDays = days.map((day) =>
                    day.id === activeDayId
                      ? { ...day, description_day: e.target.value }
                      : day
                  );
                  setSelectedPackage((prev) => ({
                    ...prev,
                    days: updatedDays,
                  }));
                }}
              />
            </FormControl>

            {/* TABS PER HARI */}
            <Box mt={6}>
              <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab>Akomodasi</Tab>
                  <Tab>Tour</Tab>
                  <Tab>Transport</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <AkomodasiTabContent
                      dayIndex={days.findIndex((d) => d.id === activeDayId)}
                    />
                  </TabPanel>
                  <TabPanel>
                    <Text>Tour content (coming soon)</Text>
                  </TabPanel>
                  <TabPanel>
                    <TransportTabContent dayIndex={days.findIndex((d) => d.id === activeDayId)} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        </Box>

        {/* CHILDREN CONTENT */}
        {/* {children} */}
      </Container>

      {/* Grand Total Box */}
      {!isCheckoutPage && (
        <>
          {isVisible ? (
            <Box
              position="fixed"
              bottom={0}
              left={0}
              right={0}
              bg="gray.800"
              color="white"
              py={3}
              px={6}
              zIndex="banner"
              boxShadow="lg"
            >
              <HStack justify="space-between">
                <Text fontWeight="bold">
                  Grand Total: Rp{" "}
                  {(akomodasiTotal + transportTotal).toLocaleString("id-ID")}
                </Text>
                <HStack spacing={3}>
                  <Button
                    colorScheme="teal"
                    onClick={() => navigate("/checkout")}
                  >
                    Checkout
                  </Button>
                  <IconButton
                    size="sm"
                    aria-label="Tutup"
                    icon={<CloseIcon />}
                    onClick={() => setIsVisible(false)}
                  />
                </HStack>
              </HStack>
            </Box>
          ) : (
            <IconButton
              position="fixed"
              bottom={4}
              left={4}
              zIndex="banner"
              size="md"
              colorScheme="teal"
              aria-label="Buka kembali"
              icon={<ChevronUpIcon />}
              onClick={() => setIsVisible(true)}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Layout;
