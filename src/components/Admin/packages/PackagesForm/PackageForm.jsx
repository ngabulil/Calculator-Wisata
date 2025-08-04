import React, { useState, useEffect } from "react";

import {
  Container,
  Box,
  Button,
  Textarea,
  Text,
  VStack,
  Flex,
  HStack,
  IconButton,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";

import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
//
import HotelCard from "../../../Akomodasi/HotelPaketCard";
import VillaCard from "../../../Akomodasi/VillaPaketCard";
import InfoCard from "../../../Akomodasi/InfoCard";
import InfoTransportCard from "../../../Transport/InfoCard";
import MobilCard from "../../../Transport/MobilPaketCard";

import { useAdminPackageContext } from "../../../../context/Admin/AdminPackageContext";
import { useAkomodasiContext } from "../../../../context/AkomodasiContext";
import { useTransportContext } from "../../../../context/TransportContext";

import DestinationCard from "../../TourPackages/TourPackagesFormCard/DestinationCard";
import ActivityCard from "../../TourPackages/TourPackagesFormCard/ActivitiesCard";
import RestaurantCard from "../../TourPackages/TourPackagesFormCard/RestaurantCard";

//
import { useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import toastConfig from "../../../../utils/toastConfig";
import {
  apiPostPackageFull,
  apiPutPackageFull,
} from "../../../../services/packageService";
import parseDays from "../../../../utils/encodedParseDays";
import buildPayloadPaket from "../../../../utils/buildPayloadPaket";

const PackageCreateForm = (props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalTrigger, setModalTrigger] = useState(false);
  const location = useLocation();
  const {
    getAllActivities,
    getAllRestaurant,
    getAllDestination,
    onePackageFull,
    days,
    setDays,
  } = useAdminPackageContext();
  const { getMobils, getAdditionalMobil } = useTransportContext();
  const { getHotels, getVillas, getAdditional } = useAkomodasiContext();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [editFormActive, setEditFormActive] = useState(false);
  const handleSetValue = async () => {
    setLoading(true);

    try {
      const res = await parseDays(onePackageFull.days);

      const firstDay = res[0]?.data?.tour;
      const typeFromDestinations = firstDay?.destinations?.[0].type_wisata;
      const typeFromActivities = firstDay?.activities?.[0]?.type_wisata;
      const typeFromRestaurants = firstDay?.restaurants?.[0]?.type_wisata;

      const foundType =
        typeFromDestinations || typeFromActivities || typeFromRestaurants || "";

      setSelectedTypeWisata(foundType);

      setDays(
        res.map((day) => {
          return {
            ...day,
            data: {
              ...day.data,
              tour: {
                ...day.data.tour,
                type_wisata: foundType,
              },
            },
          };
        })
      );
    } catch (err) {
      console.error("Failed to parse days:", err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedTypeWisata, setSelectedTypeWisata] = useState("");

  const typeWisataOptions = [
    { value: "domestik", label: "Domestik" },
    { value: "asing", label: "Asing" },
  ];
  const handleAddDay = () => {
    setDays((prev) => {
      const updated = [
        ...prev,
        {
          name: "",
          description_day: "",
          data: {
            akomodasi: {
              hotels: [],
              villas: [],
              additional: [],
            },
            tour: {
              destinations: [],
              activities: [],
              restaurants: [],
              type_wisata: "",
            },
            transport: {
              mobils: [],
              additional: [],
            },
          },
        },
      ];

      setActiveIndex(updated.length - 1);
      return updated;
    });
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
  }, [modalTrigger]);

  useEffect(() => {
    props.onChange?.(days);
  }, [days]);

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleSetValue();
    }
  }, [location.pathname, onePackageFull]);

  useEffect(() => {
    if (!selectedTypeWisata) return;

    const updatedDays = days.map((day) => {
      return {
        ...day,
        data: {
          ...day.data,
          tour: {
            ...day.data.tour,
            type_wisata: selectedTypeWisata,
          },
        },
      };
    });

    setDays(updatedDays);
    props.onChange?.(updatedDays);
  }, [selectedTypeWisata]);

  return (
    <Container maxW="7xl" px="0">
      {loading ? (
        <Flex w="full" justifyContent="center" py={10}>
          <Spinner size="xl" color="teal.500" />
        </Flex>
      ) : (
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
                      <HStack justify="space-between">
                        <Text fontWeight="semibold">
                          Nama untuk Day {index + 1}
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
                      <Input
                        value={day.name}
                        placeholder="Contoh: Hari Pertama di Bali"
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
                              onModalClose={(val) => {
                                setModalTrigger(!val);
                              }}
                              onChange={(newHotel) => {
                                const updated = [...days];
                                updated[index].data.akomodasi.hotels[i] =
                                  newHotel;
                                setDays(updated);
                              }}
                              onDelete={() => {
                                const updated = [...days];
                                updated[index].data.akomodasi.hotels.splice(
                                  i,
                                  1
                                );
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
                              onModalClose={(val) => {
                                setModalTrigger(!val);
                              }}
                              onDelete={() => {
                                const updated = [...days];
                                updated[index].data.akomodasi.villas.splice(
                                  i,
                                  1
                                );
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
                          Type Wisata
                        </Text>
                        <Select
                          placeholder="Pilih Tipe Wisata"
                          value={selectedTypeWisata}
                          onChange={(e) =>
                            setSelectedTypeWisata(e.target.value)
                          }
                        >
                          {typeWisataOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </Box>
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
                              onModalClose={(val) => {
                                setModalTrigger(!val);
                              }}
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
                              onModalClose={(val) => {
                                setModalTrigger(!val);
                              }}
                              onChange={(newInfo) => {
                                const updated = [...days];

                                updated[index].data.tour.restaurants[i] =
                                  newInfo;
                                setDays(updated);
                              }}
                              onDelete={() => {
                                const updated = [...days];
                                updated[index].data.tour.restaurants.splice(
                                  i,
                                  1
                                );
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
                              onModalClose={(val) => {
                                setModalTrigger(!val);
                              }}
                              onChange={(newInfo) => {
                                const updated = [...days];

                                updated[index].data.tour.activities[i] =
                                  newInfo;
                                setDays(updated);
                              }}
                              onDelete={() => {
                                const updated = [...days];
                                updated[index].data.tour.activities.splice(
                                  i,
                                  1
                                );
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
                              onModalClose={(val) => {
                                setModalTrigger(!val);
                                const updated = [...days];

                                setDays(updated);
                              }}
                              onChange={(newMobil) => {
                                const updated = [...days];
                                updated[index].data.transport.mobils[i] =
                                  newMobil;

                                setDays(updated);
                              }}
                              onDelete={() => {
                                const updated = [...days];
                                updated[index].data.transport.mobils.splice(
                                  i,
                                  1
                                );
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
                            <InfoTransportCard
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
      )}
    </Container>
  );
};

const PackageFormPage = (props) => {
  const toast = useToast();
  const location = useLocation();

  const { headline, onePackageFull } = useAdminPackageContext();
  const [primaryData, setPrimaryData] = useState([]);
  const [namePackages, setNamePackages] = useState("");
  const [desctiptionPackages, setDescriptionPackages] = useState("");
  const [editFormActive, setEditFormActive] = useState(false);

  const handleonChangeData = (data) => {
    setPrimaryData(data);
  };
  const handleButtonPackage = async () => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));

    try {
      const hasMissingTypeWisata = primaryData.some((day) => {
        const type_wisata = day.data.tour.type_wisata;

        return (
          (day.data.tour.destinations.length > 0 ||
            day.data.tour.activities.length > 0 ||
            day.data.tour.restaurants.length > 0) &&
          !type_wisata
        );
      });

      if (hasMissingTypeWisata) {
        toast.close(loading);
        toast(
          toastConfig(
            "Info",
            "Silakan pilih tipe wisata karena Anda sudah mengisi salah satu data tour",
            "warning"
          )
        );
        return;
      }

      const data = {
        name: namePackages,
        description: desctiptionPackages,
        days: [...primaryData],
      };

      const payload = buildPayloadPaket(data);

      let res;

      editFormActive
        ? (res = await apiPutPackageFull(onePackageFull.id, payload))
        : (res = await apiPostPackageFull(payload));

      if (res.status == 201 || res.status == 200) {
        toast.close(loading);
        toast(
          toastConfig(
            editFormActive ? "Edit berhasil " : "Buat Berhasil",
            editFormActive
              ? "Paket berhasil diubah!"
              : "Paket berhasil dibuat!",
            "success",
            () => {
              props.onChange();
            }
          )
        );
      } else {
        toast.close(loading);
        toast(
          toastConfig(
            editFormActive ? "Edit Gagal " : "Buat Gagal",
            "Data tidak lengkap!",
            "error"
          )
        );
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(
        toastConfig(
          editFormActive ? "Edit Gagal " : "Buat Gagal",
          error.message,
          "error"
        )
      );
    }
  };

  const handleSetValue = () => {
    setNamePackages(headline.name || "");
    setDescriptionPackages(headline.description || "");
  };

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleSetValue();
    }
  }, [location.pathname]);
  return (
    <Flex direction={"column"} gap={5}>
      <Box p={4} bg={"gray.800"} borderRadius={"12px"}>
        <Text fontWeight="bold" fontSize={"2xl"}>
          {editFormActive ? "Edit Paket" : "Buat Paket"}
        </Text>
        <Flex direction={"column"} gap={5} py={5}>
          <Text fontWeight="semibold">Nama Paket</Text>
          <Input
            value={namePackages}
            placeholder="Contoh: Tiket Tour Bali 3 Hari"
            onChange={(e) => {
              setNamePackages(e.target.value);
            }}
          />
          <Text fontWeight="semibold">Deskripsi untuk Paket</Text>
          <Textarea
            value={desctiptionPackages}
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
        <Button w={"full"} colorScheme="blue" onClick={handleButtonPackage}>
          {editFormActive ? "Edit Paket" : "Buat Paket"}
        </Button>
      </Box>
    </Flex>
  );
};

export default PackageFormPage;
