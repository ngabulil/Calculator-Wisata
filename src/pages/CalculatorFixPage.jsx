import {
  Box,
  useColorModeValue,
  Container,
  Button,
  Text,
  HStack,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tag,
  TagLabel,
  Checkbox,
  SimpleGrid,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  CloseIcon,
  ChevronUpIcon,
  AddIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { usePackageContext } from "../context/PackageContext";
import TransportTabContent from "../components/Calculator/tab-content/TransportTabContent";
import TourTabContent from "../components/Calculator/tab-content/TourTabContent";
import { useGrandTotalContext } from "../context/GrandTotalContext";
import MainSelect from "../components/MainSelect";
import AkomodasiTabContent from "../components/Calculator/tab-content/AkomodasiTabContent";

const CalculatorFixPage = () => {
  const bg = useColorModeValue("gray.50", "gray.900");
  const location = useLocation();
  const navigate = useNavigate();
  const { akomodasiTotal, transportTotal, tourTotal } = useGrandTotalContext();
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

  useEffect(() => {
    setActiveDayId(selectedPackage?.days[0]?.id);
  }, [selectedPackage?.id]);

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

  useEffect(() => {
    const firstDay = days[0];
    if (firstDay?.date) {
      const baseDate = new Date(firstDay.date);

      const updatedDays = days.map((day, index) => {
        if (index === 0) return day; // skip first day, already set manually

        const newDate = new Date(baseDate);
        newDate.setDate(newDate.getDate() + index); // index 1 = +1 day, etc.

        return {
          ...day,
          date: newDate.toISOString().split("T")[0], // format to yyyy-mm-dd
        };
      });

      setSelectedPackage((prev) => ({
        ...prev,
        days: updatedDays,
      }));
    }
  }, [days[0]?.date]);

  return (
    <Box minH="100vh" bg={bg} position="relative">
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
                  totalPaxAdult: found.totalPaxAdult || 0,
                  totalPaxChildren: found.totalPaxChildren || 0,
                  addAdditionalChild: false,
                  days: found.days || [],
                  childrenAges: [],
                });
                setActiveDayId(found.id);
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

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
            {/* Total Pax Adult */}
            <FormControl>
              <FormLabel color="white">Total Pax Adult</FormLabel>
              <Input
                bg="gray.600"
                color="white"
                value={selectedPackage.totalPaxAdult || 0}
                onChange={(e) =>
                  setSelectedPackage((prev) => ({
                    ...prev,
                    totalPaxAdult: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </FormControl>

            {/* Total Pax Children + Umur Anak */}
            <FormControl>
              <FormLabel color="white">Total Pax Children</FormLabel>
              <Input
                bg="gray.600"
                color="white"
                value={selectedPackage.totalPaxChildren || 0}
                onChange={(e) => {
                  const count = parseInt(e.target.value) || 0;

                  setSelectedPackage((prev) => {
                    let newAges = prev.childrenAges || [];
                    if (count > newAges.length) {
                      newAges = [
                        ...newAges,
                        ...Array(count - newAges.length).fill(""),
                      ];
                    } else {
                      newAges = newAges.slice(0, count);
                    }
                    return {
                      ...prev,
                      totalPaxChildren: count,
                      childrenAges: newAges,
                    };
                  });
                }}
              />

              {/* Input Umur Anak */}
              {selectedPackage.totalPaxChildren > 0 && (
                <Box mt={3}>
                  <FormLabel color="white">Umur Anak</FormLabel>
                  <HStack spacing={3} wrap="wrap">
                    {(selectedPackage.childrenAges || []).map((age, idx) => (
                      <Input
                        key={idx}
                        type="number"
                        min="0"
                        placeholder={`Anak ${idx + 1}`}
                        value={age}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedPackage((prev) => {
                            const updatedAges = [...(prev.childrenAges || [])];
                            updatedAges[idx] = val;
                            return {
                              ...prev,
                              childrenAges: updatedAges,
                            };
                          });
                        }}
                        bg="gray.600"
                        color="white"
                        width="100px"
                      />
                    ))}
                  </HStack>
                </Box>
              )}
            </FormControl>
          </SimpleGrid>
          <HStack spacing={4} mb={4}>
            <Checkbox
              colorScheme="blue"
              size="md"
              value={selectedPackage.addAdditionalChild}
              onChange={(e) =>
                setSelectedPackage((prev) => ({
                  ...prev,
                  addAdditionalChild: e.target.checked,
                }))
              }
              isChecked={selectedPackage.addAdditionalChild}
            >
              Additional will be shared
            </Checkbox>
          </HStack>
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
              {/* Label dan Input Tanggal */}
              <FormLabel color="white">
                Tanggal untuk {days.find((d) => d.id === activeDayId)?.name}
              </FormLabel>
              <Input
                type="date"
                bg="gray.600"
                color="white"
                value={days.find((d) => d.id === activeDayId)?.date || ""}
                onChange={(e) => {
                  const updatedDays = days.map((day) =>
                    day.id === activeDayId
                      ? { ...day, date: e.target.value }
                      : day
                  );
                  setSelectedPackage((prev) => ({
                    ...prev,
                    days: updatedDays,
                  }));
                }}
              />

              {/* Deskripsi Hari */}
              <FormLabel mt={4} color="white">
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
                    {days.map((day, index) => (
                      <div
                        key={index}
                        style={{
                          display: activeDayId === day.id ? "block" : "none",
                        }}
                      >
                        <AkomodasiTabContent dayIndex={index} />
                      </div>
                    ))}
                  </TabPanel>
                  <TabPanel px={0}>
                    {days.map((day, index) => (
                      <div
                        key={index}
                        style={{
                          display: activeDayId === day.id ? "block" : "none",
                        }}
                      >
                        <TourTabContent dayIndex={index} />
                      </div>
                    ))}
                  </TabPanel>
                  <TabPanel px={0}>
                    {days.map((day, index) => (
                      <div
                        key={index}
                        style={{
                          display: activeDayId === day.id ? "block" : "none",
                        }}
                      >
                        <TransportTabContent dayIndex={index} />
                      </div>
                    ))}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        </Box>

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
                  {[akomodasiTotal, tourTotal, transportTotal]
                    .flat()
                    .reduce((sum, num) => sum + num, 0)
                    .toLocaleString("id-ID")}
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

export default CalculatorFixPage;
