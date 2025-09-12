import {
  Box,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import DestinasiCard from "../tour/DestinasiCard";
import ActivityCard from "../tour/ActivityCard";
import RestoCard from "../tour/RestoCard";
import { usePackageContext } from "../../../context/PackageContext";
import { useTourContext } from "../../../context/TourContext";
import { useGrandTotalContext } from "../../../context/GrandTotalContext";
import { useTravelerGroup } from "../../../context/TravelerGroupContext";

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

  const { activeTravelerKey, isAdultActive } = useTravelerGroup();

  const currentDay = selectedPackage.days?.[dayIndex] || {};
  const currentTour =
    currentDay.tour_by_group?.[activeTravelerKey] || [];

  const [markupState, setMarkupState] = useState(
    currentDay.markup || { type: "percent", value: 0 }
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout = setTimeout(() => setLoading(false), 100);
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
      const hargaAdult = Number(item.hargaAdult) || 0;
      const hargaChild = Number(item.hargaChild) || 0;

      const q = item.quantities || {};
      const adultQty = Number(q.adult ?? item.jumlahAdult ?? 0);
      const childQtyFromMap = Object.entries(q)
        .filter(([k]) => k !== "adult")
        .reduce((s, [, v]) => s + (Number(v) || 0), 0);
      const legacyChild = Number(item.jumlahChild || 0);
      const childQty = childQtyFromMap || legacyChild;

      return sum + hargaAdult * adultQty + hargaChild * childQty;
    }, 0);

    const markup =
      markupState.type === "percent"
        ? ((Number(markupState.value) || 0) / 100) * subtotal
        : Number(markupState.value) || 0;

    return subtotal + markup;
  }, [currentDay.tour, markupState]);

  useEffect(() => {
    setTourTotal((prev) => {
      const newTotal = [...(prev || [])];
      newTotal[dayIndex] = total;
      return newTotal;
    });
  }, [total]);

  if (loading) return null;

  return (
    <VStack spacing={6} align="stretch">
      {(currentTour || []).map((item, i) => {
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
                  const tour_by_group = { ...(d.tour_by_group || {}) };
                  const groupTour = [...(tour_by_group[activeTravelerKey] || [])];
                  groupTour[i] = newItem;
                  tour_by_group[activeTravelerKey] = groupTour;
                  return { ...d, tour_by_group };
                });
              }}
              onDelete={() => {
                if (!isAdultActive) return;
                updatePackageDay((d) => {
                  const tour_by_group = { ...(d.tour_by_group || {}) };
                  const groupTour = [...(tour_by_group[activeTravelerKey] || [])];
                  groupTour.splice(i, 1);
                  tour_by_group[activeTravelerKey] = groupTour;
                  return { ...d, tour_by_group };
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
                  const tour_by_group = { ...(d.tour_by_group || {}) };
                  const groupTour = [...(tour_by_group[activeTravelerKey] || [])];
                  groupTour[i] = newItem;
                  tour_by_group[activeTravelerKey] = groupTour;
                  return { ...d, tour_by_group };
                });
              }}
              onDelete={() => {
                if (!isAdultActive) return;
                updatePackageDay((d) => {
                  const tour_by_group = { ...(d.tour_by_group || {}) };
                  const groupTour = [...(tour_by_group[activeTravelerKey] || [])];
                  groupTour.splice(i, 1);
                  tour_by_group[activeTravelerKey] = groupTour;
                  return { ...d, tour_by_group };
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
                  const tour_by_group = { ...(d.tour_by_group || {}) };
                  const groupTour = [...(tour_by_group[activeTravelerKey] || [])];
                  groupTour[i] = newItem;
                  tour_by_group[activeTravelerKey] = groupTour;
                  return { ...d, tour_by_group };
                });
              }}
              onDelete={() => {
                if (!isAdultActive) return;
                updatePackageDay((d) => {
                  const tour_by_group = { ...(d.tour_by_group || {}) };
                  const groupTour = [...(tour_by_group[activeTravelerKey] || [])];
                  groupTour.splice(i, 1);
                  tour_by_group[activeTravelerKey] = groupTour;
                  return { ...d, tour_by_group };
                });
              }}
            />
          );
        }
        return null;
      })}

      {/* tombol tambah: HANYA untuk Adult */}
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
        <Button
          size="sm"
          colorScheme="teal"
          onClick={() => {
            updatePackageDay((d) => {
              const tour_by_group = { ...(d.tour_by_group || {}) };
              const groupTour = [...(tour_by_group[activeTravelerKey] || [])];
              groupTour.push({ id_destinasi: null });
              tour_by_group[activeTravelerKey] = groupTour;
              return { ...d, tour_by_group };
            });
          }}
          isDisabled={!isAdultActive}
        >
          Tambah Destinasi
        </Button>
        <Button
          size="sm"
          colorScheme="teal"
          onClick={() => {
            updatePackageDay((d) => {
              const tour_by_group = { ...(d.tour_by_group || {}) };
              const groupTour = [...(tour_by_group[activeTravelerKey] || [])];
              groupTour.push({ id_activity: null });
              tour_by_group[activeTravelerKey] = groupTour;
              return { ...d, tour_by_group };
            });
          }}
          isDisabled={!isAdultActive}
        >
          Tambah Aktivitas
        </Button>
        <Button
          size="sm"
          colorScheme="teal"
          onClick={() => {
            updatePackageDay((d) => {
              const tour_by_group = { ...(d.tour_by_group || {}) };
              const groupTour = [...(tour_by_group[activeTravelerKey] || [])];
              groupTour.push({ id_resto: null });
              tour_by_group[activeTravelerKey] = groupTour;
              return { ...d, tour_by_group };
            });
          }}
          isDisabled={!isAdultActive}
        >
          Tambah Resto
        </Button>
      </Box>

      <Box fontWeight="bold" mt={4}>
        Total Hari Ini: Rp {total.toLocaleString("id-ID")}
      </Box>
    </VStack>
  );
};

export default TourTabContent;
