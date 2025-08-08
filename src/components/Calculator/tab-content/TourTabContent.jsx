import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import DestinasiCard from "../tour/DestinasiCard";
import ActivityCard from "../tour/ActivityCard";
import RestoCard from "../tour/RestoCard";
import { usePackageContext } from "../../../context/PackageContext";
import { useTourContext } from "../../../context/TourContext";
import { useGrandTotalContext } from "../../../context/GrandTotalContext";

const TourTabContent = ({ dayIndex }) => {
  const {
    activitesData,
    getActivites,
    restaurantsData,
    getRestaurants,
    tiketsData,
    getTickets,
  } = useTourContext();
  const { selectedPackage, setSelectedPackage } = usePackageContext();
  const { setTourTotal } = useGrandTotalContext();

  const currentDay = selectedPackage.days?.[dayIndex] || { tour: [] };

  const [markupState, setMarkupState] = useState(
    currentDay.markup || { type: "percent", value: 0 }
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => {
      setLoading(true);
      clearTimeout(timeout);
    };
  }, [selectedPackage?.id]);

  useEffect(() => {
    getActivites();
    getRestaurants();
    getTickets();
  }, []);

  const updatePackageDay = (updater) => {
    setSelectedPackage((prev) => {
      const days = [...(prev.days || [])];
      const day = { ...(days[dayIndex] || {}) };
      const newDay = updater(day);
      days[dayIndex] = newDay;
      return { ...prev, days };
    });
  };

  const total = useMemo(() => {
    const tourItems = currentDay.tour || [];

    const subtotal = tourItems.reduce((sum, item) => {
      const hargaAdult = item.hargaAdult || 0;
      const hargaChild = item.hargaChild || 0;
      const jumlahAdult = item.jumlahAdult || 0;
      const jumlahChild = item.jumlahChild || 0;
      return sum + hargaAdult * jumlahAdult + hargaChild * jumlahChild;
    }, 0);

    const markup =
      markupState.type === "percent"
        ? (markupState.value / 100) * subtotal
        : markupState.value;

    return subtotal + markup;
  }, [currentDay.tour, markupState]);

  useEffect(() => {
    setTourTotal((prev) => {
      const newTotal = [...prev];
      newTotal[dayIndex] = total;
      return newTotal;
    });
  }, [total]);

  if (loading) return null;

  return (
    <VStack spacing={6} align="stretch">
      {(currentDay.tour || []).map((item, i) => {
        if (item.id_destinasi || item.id_destinasi === null) {
          return (
            <DestinasiCard
              key={i}
              index={i}
              dayIndex={dayIndex}
              data={item}
              destinasiList={tiketsData}
              onChange={(newItem) => {
                updatePackageDay((d) => {
                  const tour = [...(d.tour || [])];
                  tour[i] = newItem;
                  return { ...d, tour };
                });
              }}
              onDelete={() => {
                updatePackageDay((d) => {
                  const tour = [...(d.tour || [])];
                  tour.splice(i, 1);
                  return { ...d, tour };
                });
              }}
            />
          );
        } else if (item.id_activity || item.id_activity === null) {
          return (
            <ActivityCard
              key={i}
              index={i}
              dayIndex={dayIndex}
              data={item}
              vendors={activitesData}
              onChange={(newItem) => {
                updatePackageDay((d) => {
                  const tour = [...(d.tour || [])];
                  tour[i] = newItem;
                  return { ...d, tour };
                });
              }}
              onDelete={() => {
                updatePackageDay((d) => {
                  const tour = [...(d.tour || [])];
                  tour.splice(i, 1);
                  return { ...d, tour };
                });
              }}
            />
          );
        } else if (item.id_resto || item.id_resto === null) {
          return (
            <RestoCard
              key={i}
              index={i}
              dayIndex={dayIndex}
              data={item}
              restaurants={restaurantsData}
              onChange={(newItem) => {
                updatePackageDay((d) => {
                  const tour = [...(d.tour || [])];
                  tour[i] = newItem;
                  return { ...d, tour };
                });
              }}
              onDelete={() => {
                updatePackageDay((d) => {
                  const tour = [...(d.tour || [])];
                  tour.splice(i, 1);
                  return { ...d, tour };
                });
              }}
            />
          );
        }
      })}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
        <Button
          size="sm"
          colorScheme="teal"
          onClick={() => {
            updatePackageDay((d) => ({
              ...d,
              tour: [...(d.tour || []), { id_destinasi: null }],
            }));
          }}
        >
          Tambah Destinasi
        </Button>
        <Button
          size="sm"
          colorScheme="teal"
          onClick={() => {
            updatePackageDay((d) => ({
              ...d,
              tour: [...(d.tour || []), { id_activity: null }],
            }));
          }}
        >
          Tambah Aktivitas
        </Button>
        <Button
          size="sm"
          colorScheme="teal"
          onClick={() => {
            updatePackageDay((d) => ({
              ...d,
              tour: [...(d.tour || []), { id_resto: null }],
            }));
          }}
        >
          Tambah Resto
        </Button>
      </Box>
      {/* === DESTINASI === */}
      {/* {(currentDay.destinations || []).map((item, i) => (
        <DestinasiCard
          dayIndex={dayIndex}
          key={i}
          index={i}
          data={item}
          destinasiList={tiketsData}
          onChange={(newItem) => {
            updatePackageDay((d) => {
              const destinations = [...(d.destinations || [])];
              destinations[i] = newItem;
              return { ...d, destinations };
            });
          }}
          onDelete={() => {
            updatePackageDay((d) => {
              const destinations = [...(d.destinations || [])];
              destinations.splice(i, 1);
              return { ...d, destinations };
            });
          }}
        />
      ))} */}
      {/* <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((d) => ({
            ...d,
            destinations: [...(d.destinations || []), {}],
          }));
        }}
      >
        Tambah Destinasi
      </Button> */}

      {/* === AKTIVITAS === */}
      {/* {(currentDay.activities || []).map((item, i) => (
        <ActivityCard
          dayIndex={dayIndex}
          key={i}
          index={i}
          data={item}
          vendors={activitesData}
          onChange={(newItem) => {
            updatePackageDay((d) => {
              const activities = [...(d.activities || [])];
              activities[i] = newItem;
              return { ...d, activities };
            });
          }}
          onDelete={() => {
            updatePackageDay((d) => {
              const activities = [...(d.activities || [])];
              activities.splice(i, 1);
              return { ...d, activities };
            });
          }}
        />
      ))} */}
      {/* <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((d) => ({
            ...d,
            activities: [...(d.activities || []), {}],
          }));
        }}
      >
        Tambah Aktivitas
      </Button> */}

      {/* === RESTO === */}
      {/* {(currentDay.restaurants || []).map((item, i) => (
        <RestoCard
          dayIndex={dayIndex}
          key={i}
          index={i}
          data={item}
          restaurants={restaurantsData}
          onChange={(newItem) => {
            updatePackageDay((d) => {
              const restaurants = [...(d.restaurants || [])];
              restaurants[i] = newItem;
              return { ...d, restaurants };
            });
          }}
          onDelete={() => {
            updatePackageDay((d) => {
              const restaurants = [...(d.restaurants || [])];
              restaurants.splice(i, 1);
              return { ...d, restaurants };
            });
          }}
        />
      ))} */}
      {/* <Button
        size="sm"
        colorScheme="teal"
        onClick={() => {
          updatePackageDay((d) => ({
            ...d,
            restaurants: [...(d.restaurants || []), {}],
          }));
        }}
      >
        Tambah Resto
      </Button> */}

      {/* === MARKUP === */}
      {/* <Box>
        <Text fontWeight="bold" mb={2}>
          Markup
        </Text>
        <HStack>
          <Select
            w="150px"
            value={markupState.type}
            onChange={(e) => {
              const newMarkup = { ...markupState, type: e.target.value };
              setMarkupState(newMarkup);
              updatePackageDay((d) => ({ ...d, markup: newMarkup }));
            }}
          >
            <option value="percent">Persen (%)</option>
            <option value="amount">Nominal (Rp)</option>
          </Select>
          <Input
            w="150px"
            value={markupState.value}
            onChange={(e) => {
              const newMarkup = {
                ...markupState,
                value: Number(e.target.value),
              };
              setMarkupState(newMarkup);
              updatePackageDay((d) => ({ ...d, markup: newMarkup }));
            }}
          />
        </HStack>
      </Box> */}

      {/* === TOTAL === */}
      <Box fontWeight="bold" mt={4}>
        Total Hari Ini: Rp {total.toLocaleString("id-ID")}
      </Box>
    </VStack>
  );
};

export default TourTabContent;
