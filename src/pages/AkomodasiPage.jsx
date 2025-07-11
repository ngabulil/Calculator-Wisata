import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
  Tag,
  TagLabel,
  IconButton,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import MainSelect from "../components/MainSelect";
import { usePackageContext } from "../context/PackageContext";
import { useCheckoutContext } from "../context/CheckoutContext";
import AkomodasiTabContent from "../components/Calculator/tab-content/AkomodasiTabContent";
import TransportTabContent from "../components/Calculator/tab-content/TransportTabContent";

const AkomodasiPage = () => {
  const { packagesData, selectedPackage, setSelectedPackage, getPackages } = usePackageContext();
  const { setAkomodasiTotal, setTransportTotal, setTourTotal, setRestaurantTotal } = useCheckoutContext();
  
  const { days = [], name = "", description = "", title = "", id = null } = selectedPackage;
  const [activeDayId, setActiveDayId] = useState(1);

  // Fetch packages data when component mounts
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

  // Calculate totals from all days
  useEffect(() => {
    const days = selectedPackage?.days || [];

    let akomodasi = 0;
    let transport = 0;
    let tour = 0;
    let restaurant = 0;

    days.forEach((day) => {
      akomodasi += (day.hotels || []).reduce((sum, h) => sum + (h.total || 0), 0);
      akomodasi += (day.villas || []).reduce((sum, v) => sum + (v.total || 0), 0);
      akomodasi += (day.akomodasi_additionals || []).reduce((sum, a) => sum + (a.total || 0), 0);

      transport += (day.mobils || []).reduce((sum, m) => sum + (m.total || 0), 0);
      transport += (day.transport_additionals || []).reduce((sum, t) => sum + (t.total || 0), 0);

      tour += (day.destinations || []).reduce((sum, d) => sum + (d.total || 0), 0);
      tour += (day.activities || []).reduce((sum, a) => sum + (a.total || 0), 0);

      restaurant += (day.restaurants || []).reduce((sum, r) => sum + (r.total || 0), 0);
    });

    setAkomodasiTotal(akomodasi);
    setTransportTotal(transport);
    setTourTotal(tour);
    setRestaurantTotal(restaurant);
  }, [selectedPackage, setAkomodasiTotal, setTransportTotal, setTourTotal, setRestaurantTotal]);

  const handleDeleteDay = (id) => {
    const filtered = days.filter((d) => d.id !== id);
    setSelectedPackage((prev) => ({ ...prev, days: filtered }));
    if (activeDayId === id && filtered.length > 0) {
      setActiveDayId(filtered[0].id);
    }
  };

  return (
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
  );
};

export default AkomodasiPage;