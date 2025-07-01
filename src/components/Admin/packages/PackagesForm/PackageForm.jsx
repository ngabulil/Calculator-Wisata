import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Button,
  Textarea,
  Link,
  Text,
  VStack,
  Flex,
  HStack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import HotelCard from "../../../Akomodasi/HotelCard";
import VillaCard from "../../../Akomodasi/VillaCard";
import InfoCard from "../../../Akomodasi/InfoCard";
import { useAkomodasiContext } from "../../../../context/AkomodasiContext";
import { useCheckoutContext } from "../../../../context/CheckoutContext";

const PackageCreateForm = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { getHotels, getVillas, getAdditional, days, setDays } =
    useAkomodasiContext();
  const { setAkomodasiTotal } = useCheckoutContext();

  const hitungTotalHotel = (hotels) =>
    hotels.reduce((total, h) => {
      const kamar = h.jumlahKamar || 0;
      const harga = h.hargaPerKamar || 0;
      const extrabed = h.useExtrabed
        ? (h.jumlahExtrabed || 0) * (h.hargaExtrabed || 0)
        : 0;
      return total + kamar * harga + extrabed;
    }, 0);

  const hitungTotalVilla = (villas) =>
    villas.reduce((total, v) => {
      const kamar = v.jumlahKamar || 0;
      const harga = v.hargaPerKamar || 0;
      const extrabed = v.useExtrabed
        ? (v.jumlahExtrabed || 0) * (v.hargaExtrabed || 0)
        : 0;
      return total + kamar * harga + extrabed;
    }, 0);

  const hitungTotalAdditional = (additional) =>
    additional.reduce(
      (total, a) => total + (a.harga || 0) * (a.jumlah || 0),
      0
    );

  const handleAddDay = () => {
    setDays((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        description: "",
        hotels: [],
        villas: [],
        additionalInfo: [],
        markup: { type: "percent", value: 0 },
      },
    ]);
    setActiveIndex(days.length);
  };

  const handleRemoveDay = (index) => {
    const updated = [...days];
    updated.splice(index, 1);
    setDays(updated);
    setActiveIndex((prev) =>
      index >= updated.length ? updated.length - 1 : prev
    );
  };

  const cardBg = useColorModeValue("gray.700", "gray.800");
  const textColor = useColorModeValue("white", "white");

  useEffect(() => {
    const fetchData = async () => {
      await getHotels();
      await getVillas();
      await getAdditional();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const total = days.reduce((sum, day) => {
      const subtotal =
        hitungTotalHotel(day.hotels) +
        hitungTotalVilla(day.villas) +
        hitungTotalAdditional(day.additionalInfo);

      const markup = day.markup || { type: "percent", value: 0 };
      const markupAmount =
        markup.type === "amount"
          ? markup.value
          : (markup.value / 100) * subtotal;

      return sum + subtotal + markupAmount;
    }, 0);

    setAkomodasiTotal(total);
  }, [days]);

  return (
    <Container maxW="7xl" py={2} px={0}>
      <Box bg={cardBg} rounded="lg"  color={textColor}>
        <Tabs
          index={activeIndex}
          onChange={setActiveIndex}
          variant="soft-rounded"
          colorScheme="blue"
        >
          <HStack justify="space-between" mb={2}>
            <TabList overflowX="auto">
              {days.map((_, i) => (
                <Tab key={i}>Day {i + 1}</Tab>
              ))}
            </TabList>
            <Button size="sm" leftIcon={<AddIcon />} onClick={handleAddDay}>
              Tambah Day
            </Button>
          </HStack>

          <TabPanels>
            {days.map((day, index) => (
              <TabPanel key={index} px={0}>
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">
                      Deskripsi untuk Day {index + 1}
                    </Text>
                    {days.length > 1 && (
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveDay(index)}
                      />
                    )}
                  </HStack>

                  <Textarea
                    value={day.description}
                    onChange={(e) => {
                      const updated = [...days];
                      updated[index].description = e.target.value;
                      setDays(updated);
                    }}
                    placeholder="Deskripsi hari..."
                    bg="gray.700"
                    color="white"
                    _placeholder={{ color: "gray.400" }}
                  />

                  {/* Hotel dan Villa */}
                  <Box
                    border="1px solid"
                    borderColor="gray.600"
                    p={4}
                    rounded="md"
                  >
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      Hotel / Villa
                    </Text>

                    <VStack spacing={2} align="stretch">
                      {day.hotels.map((hotel, i) => (
                        <HotelCard
                          key={i}
                          index={i}
                          data={hotel}
                          onChange={(newHotel) => {
                            const updated = [...days];
                            updated[index].hotels[i] = newHotel;
                            setDays(updated);
                          }}
                          onDelete={() => {
                            const updated = [...days];
                            updated[index].hotels.splice(i, 1);
                            setDays(updated);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="teal"
                        onClick={() => {
                          const updated = [...days];
                          updated[index].hotels.push({});
                          setDays(updated);
                        }}
                      >
                        Tambah Hotel
                      </Button>

                      {day.villas.map((villa, i) => (
                        <VillaCard
                          key={i}
                          index={i}
                          data={villa}
                          onChange={(newVilla) => {
                            const updated = [...days];
                            updated[index].villas[i] = newVilla;
                            setDays(updated);
                          }}
                          onDelete={() => {
                            const updated = [...days];
                            updated[index].villas.splice(i, 1);
                            setDays(updated);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="purple"
                        onClick={() => {
                          const updated = [...days];
                          updated[index].villas.push({});
                          setDays(updated);
                        }}
                      >
                        Tambah Villa
                      </Button>
                    </VStack>
                  </Box>

                  {/* Additional */}
                  <Box
                    border="1px solid"
                    borderColor="gray.600"
                    p={4}
                    rounded="md"
                  >
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      Additional Info
                    </Text>

                    <VStack spacing={2} align="stretch">
                      {day.additionalInfo.map((info, i) => (
                        <InfoCard
                          key={i}
                          index={i}
                          data={info}
                          onChange={(newInfo) => {
                            const updated = [...days];
                            updated[index].additionalInfo[i] = newInfo;
                            setDays(updated);
                          }}
                          onDelete={() => {
                            const updated = [...days];
                            updated[index].additionalInfo.splice(i, 1);
                            setDays(updated);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="orange"
                        onClick={() => {
                          const updated = [...days];
                          updated[index].additionalInfo.push({});
                          setDays(updated);
                        }}
                      >
                        Tambah Info
                      </Button>
                    </VStack>
                  </Box>


                  {/* Tambah tour packages  */}
                  <Box
                    border="1px solid"
                    borderColor="gray.600"
                    p={4}
                    rounded="md"
                  >
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      Tour packages
                    </Text>

                    <VStack spacing={2} align="stretch">
                      {day.additionalInfo.map((info, i) => (
                        <InfoCard
                          key={i}
                          index={i}
                          data={info}
                          onChange={(newInfo) => {
                            const updated = [...days];
                            updated[index].additionalInfo[i] = newInfo;
                            setDays(updated);
                          }}
                          onDelete={() => {
                            const updated = [...days];
                            updated[index].additionalInfo.splice(i, 1);
                            setDays(updated);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => {
                          const updated = [...days];
                          updated[index].additionalInfo.push({});
                          setDays(updated);
                        }}
                      >
                        Tambah Tour Packages
                      </Button>
                    </VStack>
                  </Box>

                  {/* Transport */}
                  <Box
                    border="1px solid"
                    borderColor="gray.600"
                    p={4}
                    rounded="md"
                  >
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                      Transport
                    </Text>

                    <VStack spacing={2} align="stretch">
                      {day.additionalInfo.map((info, i) => (
                        <InfoCard
                          key={i}
                          index={i}
                          data={info}
                          onChange={(newInfo) => {
                            const updated = [...days];
                            updated[index].additionalInfo[i] = newInfo;
                            setDays(updated);
                          }}
                          onDelete={() => {
                            const updated = [...days];
                            updated[index].additionalInfo.splice(i, 1);
                            setDays(updated);
                          }}
                        />
                      ))}
                      <Button
                        variant="outline"
                        colorScheme="red"
                        onClick={() => {
                          const updated = [...days];
                          updated[index].additionalInfo.push({});
                          setDays(updated);
                        }}
                      >
                        Tambah Transport
                      </Button>
                    </VStack>
                  </Box>

                  {/* Markup */}
            
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>

      {/* TOTAL */}
     
    </Container>
  );
};



const PackageFormPage = () => {
  return(
    <Flex direction={'column'} gap={5}>
 
      <Box p={4} bg={'gray.800'} borderRadius={'12px'} >
          <Text fontWeight="bold" fontSize={'2xl'}>
              Buat Paket
          </Text>
          <Flex direction={"column"} gap={5} py={5} >
              <Text fontWeight="semibold">
                  Nama Paket
              </Text>
              <Input
                  placeholder="Contoh: Tiket Tour Bali 3 Hari"
                  value={''}
                  onChange={(e) => {console.log(e.target.value)}}
                  />
              <Text fontWeight="semibold">
                  Deskripsi untuk Paket
              </Text>
              <Textarea
                  value={''}
                  onChange={(e) => {
                      console.log(e.target.value)
                  }}
                  placeholder="Deskripsi Paket..."
                  bg="gray.700"
                  color="white"
                  _placeholder={{ color: "gray.400" }}
              />
          </Flex>
          <PackageCreateForm/>
          <Button colorScheme="blue" onClick={()=>{}}>Simpan Paket</Button>
      </Box>
  </Flex>
  )
}

export default PackageFormPage

