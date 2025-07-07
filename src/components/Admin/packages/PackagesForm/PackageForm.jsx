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
import MobilCard from "../../../Transport/MobilCard";

import { useAdminPackageContext } from "../../../../context/Admin/AdminPackageContext";
import { useAkomodasiContext } from "../../../../context/AkomodasiContext";
import { useTransportContext } from "../../../../context/TransportContext";

import DestinationCard from "../../TourPackages/TourPackagesFormCard/DestinationCard";
import ActivityCard from "../../TourPackages/TourPackagesFormCard/ActivitiesCard";
import RestaurantCard from "../../TourPackages/TourPackagesFormCard/RestaurantCard";

const PackageCreateForm = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    getAllActivities,
    getAllRestaurant,
    getAllDestination,
    days,
    setDays,
  } = useAdminPackageContext();
  const { getMobils, getAdditionalMobil } = useTransportContext();
  const { getHotels, getVillas, getAdditional } = useAkomodasiContext();

  const handleAddDay = () => {
    setDays((prev) => [
      ...prev,
      {
        ...days[0],
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
      await getMobils();
      await getAdditionalMobil();
      await getAllActivities();
      await getAllRestaurant();
      await getAllDestination();
    };
    fetchData();
  }, []);

  useEffect(() => {
    props.onChange?.(days);
  }, [days]);

  return (
    <Container maxW="7xl" px="0">
      <Box bg={cardBg} rounded="lg" color={textColor}>
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
                  <Text fontWeight="bold" fontSize={"22px"}>
                    Akomodasi
                  </Text>
                  <Flex
                    direction={"column"}
                    gap={4}
                    p={4}
                    bg={"gray.900"}
                    rounded={"12px"}
                  >
                    <Text fontWeight="semibold">
                      Nama untuk Day {index + 1}
                    </Text>
                    <Input
                      placeholder="Contoh: Livio Suite"
                      onChange={(e) => {
                        const updated = [...days];
                        updated[index].name = e.target.value;
                        setDays(updated);
                      }}
                    />
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
                      value={day.description_day}
                      onChange={(e) => {
                        const updated = [...days];
                        updated[index].description_day = e.target.value;
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
                        {day.data.akomodasi.hotels.map((hotel, i) => (
                          <HotelCard
                            key={i}
                            isAdmin={true}
                            index={i}
                            data={hotel}
                            onChange={(newHotel) => {
                              const updated = [...days];
                              updated[index].data.akomodasi.hotels[i] =
                                newHotel;
                              setDays(updated);
                            }}
                            onDelete={() => {
                              const updated = [...days];
                              updated[index].data.akomodasi.hotels.splice(i, 1);
                              setDays(updated);
                            }}
                          />
                        ))}
                        <Button
                          variant="outline"
                          colorScheme="teal"
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.akomodasi.hotels.push({});
                            setDays(updated);
                          }}
                        >
                          Tambah Hotel
                        </Button>

                        {day.data.akomodasi.villas.map((villa, i) => (
                          <VillaCard
                            isAdmin={true}
                            key={i}
                            index={i}
                            data={villa}
                            onChange={(newVilla) => {
                              const updated = [...days];
                              updated[index].data.akomodasi.villas[i] =
                                newVilla;
                              setDays(updated);
                            }}
                            onDelete={() => {
                              const updated = [...days];
                              updated[index].data.akomodasi.villas.splice(i, 1);
                              setDays(updated);
                            }}
                          />
                        ))}
                        <Button
                          variant="outline"
                          colorScheme="purple"
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.akomodasi.villas.push({});
                            setDays(updated);
                          }}
                        >
                          Tambah Villa
                        </Button>
                      </VStack>
                    </Box>
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
                        {day.data.akomodasi.additional.map((info, i) => (
                          <InfoCard
                            isAdmin={true}
                            key={i}
                            index={i}
                            data={info}
                            onChange={(newInfo) => {
                              const updated = [...days];
                              updated[index].data.akomodasi.additional[i] =
                                newInfo;
                              setDays(updated);
                            }}
                            onDelete={() => {
                              const updated = [...days];
                              updated[index].data.akomodasi.additional.splice(
                                i,
                                1
                              );
                              setDays(updated);
                            }}
                          />
                        ))}
                        <Button
                          variant="outline"
                          colorScheme="orange"
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.akomodasi.additional.push({});
                            setDays(updated);
                          }}
                        >
                          Tambah Info
                        </Button>
                      </VStack>
                    </Box>
                  </Flex>
                  {/* Tambah tour packages  */}
                  <Flex
                    direction={"column"}
                    gap={4}
                    p={4}
                    bg={"gray.900"}
                    rounded={"12px"}
                  >
                    <Text fontWeight="bold" fontSize={"22px"}>
                      Tour
                    </Text>
                    <Box
                      border="1px solid"
                      borderColor="gray.600"
                      p={4}
                      rounded="md"
                    >
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        Tour Destination
                      </Text>

                      <VStack spacing={2} align="stretch">
                        {day.data.tour.destinations.map((tours, i) => (
                          <DestinationCard
                            key={i}
                            index={i}
                            data={tours}
                            onChange={(newInfo) => {
                              const updated = [...days];
                              updated[index].data.tour.destinations[i] =
                                newInfo;
                              setDays(updated);
                            }}
                            onDelete={() => {
                              const updated = [...days];
                              updated[index].data.tour.destinations.splice(
                                i,
                                1
                              );
                              setDays(updated);
                            }}
                          />
                        ))}
                        <Button
                          variant="outline"
                          colorScheme="blue"
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.tour.destinations.push({});
                            setDays(updated);
                          }}
                        >
                          Tambah Destinasi
                        </Button>
                      </VStack>
                    </Box>
                    <Box
                      border="1px solid"
                      borderColor="gray.600"
                      p={4}
                      rounded="md"
                    >
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        Tour Restaurant
                      </Text>

                      <VStack spacing={2} align="stretch">
                        {day.data.tour.restaurants.map((tours, i) => (
                          <RestaurantCard
                            key={i}
                            index={i}
                            data={tours}
                            onChange={(newInfo) => {
                              const updated = [...days];
                              updated[index].data.tour.restaurants[i] = newInfo;
                              setDays(updated);
                            }}
                            onDelete={() => {
                              const updated = [...days];
                              updated[index].data.tour.restaurants.splice(i, 1);
                              setDays(updated);
                            }}
                          />
                        ))}
                        <Button
                          variant="outline"
                          colorScheme="purple"
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.tour.restaurants.push({});
                            setDays(updated);
                          }}
                        >
                          Tambah Restaurant
                        </Button>
                      </VStack>
                    </Box>
                    <Box
                      border="1px solid"
                      borderColor="gray.600"
                      p={4}
                      rounded="md"
                    >
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        Tour Activity
                      </Text>

                      <VStack spacing={2} align="stretch">
                        {day.data.tour.activities.map((tours, i) => (
                          <ActivityCard
                            key={i}
                            index={i}
                            data={tours}
                            onChange={(newInfo) => {
                              const updated = [...days];
                              updated[index].data.tour.activities[i] = newInfo;
                              setDays(updated);
                            }}
                            onDelete={() => {
                              const updated = [...days];
                              updated[index].data.tour.activities.splice(i, 1);
                              setDays(updated);
                            }}
                          />
                        ))}
                        <Button
                          variant="outline"
                          colorScheme="red"
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.tour.activities.push({});
                            setDays(updated);
                          }}
                        >
                          Tambah Aktivitas
                        </Button>
                      </VStack>
                    </Box>
                  </Flex>
                  {/* Transport */}
                  <Flex
                    direction={"column"}
                    gap={4}
                    p={4}
                    bg={"gray.900"}
                    rounded={"12px"}
                  >
                    <Text fontWeight="bold" fontSize={"22px"}>
                      Transport
                    </Text>
                    <Box
                      border="1px solid"
                      borderColor="gray.600"
                      p={4}
                      rounded="md"
                    >
                      <Text fontSize="xl" fontWeight="bold" mb={2}>
                        Mobil
                      </Text>

                      <VStack spacing={2} align="stretch">
                        {day.data.transport.mobils.map((mobil, i) => (
                          <MobilCard
                            isAdmin={true}
                            key={i}
                            index={i}
                            data={mobil}
                            onChange={(newMobil) => {
                              const updated = [...days];
                              updated[index].data.transport.mobils[i] =
                                newMobil;
                              setDays(updated);
                            }}
                            onDelete={() => {
                              const updated = [...days];
                              updated[index].data.transport.mobils.splice(i, 1);
                              setDays(updated);
                            }}
                          />
                        ))}
                        <Button
                          variant="outline"
                          colorScheme="teal"
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.transport.mobils.push({});
                            setDays(updated);
                          }}
                        >
                          Tambah Mobil
                        </Button>
                      </VStack>
                    </Box>

                    {/* Additional Info */}
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
                        {day.data.transport.additional.map((info, i) => (
                          <InfoCard
                            key={i}
                            isAdmin={true}
                            index={i}
                            data={info}
                            onChange={(newInfo) => {
                              const updated = [...days];
                              updated[index].data.transport.additional[i] =
                                newInfo;
                              setDays(updated);
                            }}
                            onDelete={() => {
                              const updated = [...days];
                              updated[index].data.transport.additional.splice(
                                i,
                                1
                              );
                              setDays(updated);
                            }}
                          />
                        ))}
                        <Button
                          variant="outline"
                          colorScheme="orange"
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.transport.additional.push({});
                            setDays(updated);
                          }}
                        >
                          Tambah Info
                        </Button>
                      </VStack>
                    </Box>
                  </Flex>
                </VStack>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

const PackageFormPage = () => {
  const [primaryData, setPrimaryData] = useState([]);
  const [namePackages, setNamePackages] = useState("");
  const [desctiptionPackages, setDescriptionPackages] = useState("");

  const handleonChangeData = (data) => {
    setPrimaryData(data);
  };
  const handleCreatePackage = () => {
    const data = {
      name: namePackages,
      description: desctiptionPackages,
      days: [...primaryData],
    };
    const payload = {
      name: data.name,
      description_day: data.description,
      days: data.days.map((day) => {
        return {
          name: day.name,
          description_day: day.description_day,
          data: {
            akomodasi: {
              hotels: day.data.akomodasi.hotels.map((hotel) => {
                return {
                  id_hotel: hotel.hotel.value,
                  id_tipe_kamar: hotel.roomType.value,
                  season: {
                    type: data.season?.startsWith("normal")
                      ? "normal"
                      : data.season?.startsWith("high")
                      ? "high"
                      : "peak",
                    id_musim: hotel.idMusim,
                  },
                };
              }),
              villas: day.data.akomodasi.villas.map((villa) => {
                return {
                  id_villa: villa.villa.value,
                  id_tipe_kamar: villa.roomType.value,
                  season: {
                    type: data.season?.startsWith("normal")
                      ? "normal"
                      : data.season?.startsWith("high")
                      ? "high"
                      : data.season?.startsWith("honeymoon")
                      ? "honeymoon"
                      : "peak",
                    id_musim: villa.idMusim,
                  },
                };
              }),
              additional: day.data.akomodasi.additional.map((additional) => {
                return {
                  id_additional: additional.selectedInfo.value,
                };
              }),
            },
            tour: {
              destinations: day.data.tour.destinations.map((destination) => {
                return {
                  id_destinasi: destination.selectedDest.value,
                  type_wisata: destination.selectedType.value,
                };
              }),
              activities: day.data.tour.activities.map((activity) => {
                return {
                  id_vendor: activity.selectedVendor.value,
                  id_activity: activity.selectedActivity.value,
                  type_wisate: "domestik",
                };
              }),
              restaurants: day.data.tour.restaurants.map((restaurant) => {
                return {
                  id_resto: restaurant.selectedResto.value,
                  id_menu: restaurant.selectedPackage.value,
                };
              }),
            },
            transport: {
              mobils: day.data.transport.mobils.map((mobil) => {
                return {
                  id_mobil: mobil.mobil.value,
                  keterangan: mobil.kategori,
                };
              }),
              additional: day.data.transport.additional.map((additional) => {
                return {
                  id_additional: additional.selectedInfo.value,
                };
              }),
            },
          },
        };
      }),
    };

    console.log(data);
    console.log(payload);
  };

  return (
    <Flex direction={"column"} gap={5}>
      <Box p={4} bg={"gray.800"} borderRadius={"12px"}>
        <Text fontWeight="bold" fontSize={"2xl"}>
          Buat Paket
        </Text>
        <Flex direction={"column"} gap={5} py={5}>
          <Text fontWeight="semibold">Nama Paket</Text>
          <Input
            placeholder="Contoh: Tiket Tour Bali 3 Hari"
            onChange={(e) => {
              setNamePackages(e.target.value);
            }}
          />
          <Text fontWeight="semibold">Deskripsi untuk Paket</Text>
          <Textarea
            onChange={(e) => {
              setDescriptionPackages(e.target.value);
            }}
            placeholder="Deskripsi Paket..."
            bg="gray.700"
            color="white"
            _placeholder={{ color: "gray.400" }}
          />
        </Flex>
        <PackageCreateForm onChange={handleonChangeData} />
        <Button w={"full"} colorScheme="blue" onClick={handleCreatePackage}>
          Buat Paket
        </Button>
      </Box>
    </Flex>
  );
};

export default PackageFormPage;
