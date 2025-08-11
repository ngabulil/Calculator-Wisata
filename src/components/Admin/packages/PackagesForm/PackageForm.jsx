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
    packageDraft,
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

      setSelectedTypeWisata(res[0].data.type_wisata);

      setDays(res);
    } catch (err) {
      console.error("Failed to parse days:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSetDraft = async () => {
    setLoading(true);

    try {
      if (packageDraft?.days) {
        setSelectedTypeWisata(packageDraft.days[0]?.data?.type_wisata || "");
        setDays(packageDraft.days);
      }
    } catch (err) {
      console.error("Failed to parse days:", err);
    } finally {
      setLoading(false);
    }
  };

  const [selectedTypeWisata, setSelectedTypeWisata] = useState("");
  const [isDaysReady, setIsDaysReady] = useState(false);

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
            tours: [],
            type_wisata: selectedTypeWisata,
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
    } else {
      handleSetDraft();
    }
    setIsDaysReady(true);
  }, [location.pathname, onePackageFull, packageDraft]);

  useEffect(() => {
    if (!isDaysReady) return;

    const updatedDays = days.map((day) => ({
      ...day,
      data: {
        ...day.data,
        type_wisata: selectedTypeWisata,
      },
    }));

    setDays(updatedDays);
    props.onChange?.(updatedDays);
  }, [selectedTypeWisata, isDaysReady]);

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
                          onChange={(e) => {
                            setSelectedTypeWisata(e.target.value);
                          }}
                        >
                          {typeWisataOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                      </Box>
                      <HStack spacing={4} mb={4}>
                        <Button
                          variant="outline"
                          colorScheme="blue"
                          w={"full"}
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.tours.push({
                              no: updated[index].data.tours.length + 1,
                              id_destinasi: null,
                              type_wisata: "",
                            });
                            setDays(updated);
                          }}
                        >
                          Tambah Destinasi
                        </Button>

                        <Button
                          variant="outline"
                          w={"full"}
                          colorScheme="purple"
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.tours.push({
                              no: updated[index].data.tours.length + 1,
                              id_resto: null,
                              id_menu: null,
                              type_wisata: "",
                            });
                            setDays(updated);
                          }}
                        >
                          Tambah Restaurant
                        </Button>

                        <Button
                          variant="outline"
                          colorScheme="red"
                          w={"full"}
                          onClick={() => {
                            const updated = [...days];
                            updated[index].data.tours.push({
                              no: updated[index].data.tours.length + 1,
                              id_vendor: null,
                              id_activity: null,
                              type_wisata: "",
                            });
                            setDays(updated);
                          }}
                        >
                          Tambah Aktivitas
                        </Button>
                      </HStack>

                      {/*  TOUR ITEMS  */}

                      <VStack spacing={4} align="stretch">
                        {Array.isArray(day.data.tours) &&
                          day.data.tours?.map((tourItem, i) => {
                            const handleChange = (newInfo) => {
                              const updated = [...days];
                              updated[index].data.tours[i] = newInfo;
                              setDays(updated);
                            };

                            const handleDelete = () => {
                              const updated = [...days];
                              updated[index].data.tours.splice(i, 1);
                              setDays(updated);
                            };

                            if ("id_destinasi" in tourItem) {
                              return (
                                <Box
                                  key={i}
                                  border="1px solid"
                                  borderColor="gray.600"
                                  p={4}
                                  rounded="md"
                                >
                                  <DestinationCard
                                    index={i}
                                    data={tourItem}
                                    onModalClose={(val) =>
                                      setModalTrigger(!val)
                                    }
                                    onChange={handleChange}
                                    onDelete={handleDelete}
                                  />
                                </Box>
                              );
                            }

                            if ("id_activity" in tourItem) {
                              return (
                                <Box
                                  key={i}
                                  border="1px solid"
                                  borderColor="gray.600"
                                  p={4}
                                  rounded="md"
                                >
                                  <ActivityCard
                                    index={i}
                                    data={tourItem}
                                    onModalClose={(val) =>
                                      setModalTrigger(!val)
                                    }
                                    onChange={handleChange}
                                    onDelete={handleDelete}
                                  />
                                </Box>
                              );
                            }

                            if ("id_resto" in tourItem) {
                              return (
                                <Box
                                  key={i}
                                  border="1px solid"
                                  borderColor="gray.600"
                                  p={4}
                                  rounded="md"
                                >
                                  <RestaurantCard
                                    index={i}
                                    data={tourItem}
                                    onModalClose={(val) =>
                                      setModalTrigger(!val)
                                    }
                                    onChange={handleChange}
                                    onDelete={handleDelete}
                                  />
                                </Box>
                              );
                            }

                            return null;
                          })}
                      </VStack>
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

  const { headline, onePackageFull, packageDraft, setDays } =
    useAdminPackageContext();
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
        const type_wisata = day.data.type_wisata;

        return day.data.tours.length > 0 && type_wisata == "";
      });

      if (hasMissingTypeWisata) {
        toast.close(loading);
        toast(toastConfig("Info", "Silakan pilih tipe wisata", "warning"));
        return;
      }

      if (namePackages === "") {
        toast.close(loading);
        toast(toastConfig("Info", "Nama paket tidak boleh kosong", "warning"));
        return;
      }

      if (desctiptionPackages === "") {
        toast.close(loading);
        toast(
          toastConfig("Info", "Deskripsi paket tidak boleh kosong", "warning")
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
  const handleSetDraft = () => {
    setNamePackages(packageDraft.name || "");
    setDescriptionPackages(packageDraft.description || "");
  };

  useEffect(() => {
    if (editFormActive == false) {
      const data = {
        name: namePackages,
        description: desctiptionPackages,
        days: [...primaryData],
      };

      props.onDraft(data);
    }
  }, [location.pathname, namePackages, desctiptionPackages, primaryData]);

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setEditFormActive(true);
      handleSetValue();
    } else {
      handleSetDraft();
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
