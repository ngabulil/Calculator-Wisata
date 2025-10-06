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
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
import { useCurrencyContext } from "../context/CurrencyContext";
import { TravelerGroupProvider } from "../context/TravelerGroupContext";

// helper id sederhana
const makeId = () => Math.random().toString(36).slice(2, 9);

const CalculatorFixPage = () => {
  const bg = useColorModeValue("gray.50", "gray.900");
  const location = useLocation();
  const navigate = useNavigate();
  const {
    akomodasiTotal,
    transportTotal,
    tourTotal,
    setAkomodasiTotal,
    setTransportTotal,
    setTourTotal,
  } = useGrandTotalContext();
  const [isVisible, setIsVisible] = useState(true);
  const { currency, setCurrency } = useCurrencyContext();

  const isCheckoutPage = location.pathname === "/checkout";

  const paketIdFromState = useMemo(() => {
    return location.state?.paketId || null;
  }, [location.state]);

  const [hasAppliedPrefill, setHasAppliedPrefill] = useState(false);


  const { packagesData, getPackages, selectedPackage, setSelectedPackage } =
    usePackageContext();

  const {
    days = [],
    name = "",
    description = "",
    title = "",
    id = null,
    childGroups = [],
    totalPaxAdult = 0,
  } = selectedPackage;

  const [activeDayId, setActiveDayId] = useState(1);

  // "adult" atau child id (e.g. "ch_xxx")
  const [activeTravelerKey, setActiveTravelerKey] = useState("adult");

  // Label tab aktif untuk tampilan
  const activeTravelerLabel = useMemo(() => {
    if (activeTravelerKey === "adult") return "Adult";
    const cg = childGroups.find((c) => c.id === activeTravelerKey);
    return cg?.label ?? "Child";
  }, [activeTravelerKey, childGroups]);

  // Nilai Total Pax aktif (bind ke input)
  const activeTotalPax = useMemo(() => {
    if (activeTravelerKey === "adult") return totalPaxAdult || 0;
    const cg = childGroups.find((c) => c.id === activeTravelerKey);
    return cg?.total ?? 0;
  }, [activeTravelerKey, totalPaxAdult, childGroups]);

  // Nilai Age aktif (khusus child)
  const activeChildAge = useMemo(() => {
    if (activeTravelerKey === "adult") return "";
    const cg = childGroups.find((c) => c.id === activeTravelerKey);
    return cg?.age ?? "";
  }, [activeTravelerKey, childGroups]);

  // ====== Effects ======
  useEffect(() => {
    getPackages();
  }, []);

  useEffect(() => {
  if (!paketIdFromState) return;
  if (!packagesData.length) return;
  if (hasAppliedPrefill) return;

  const numericId = Number(paketIdFromState);
  const targetId = Number.isNaN(numericId) ? paketIdFromState : numericId;

  const matchedPackage = packagesData.find(
    (pkg) => pkg.id === targetId || pkg.id?.toString() === paketIdFromState
  );

  if (matchedPackage) {
    setSelectedPackage({
      ...matchedPackage,
      title: matchedPackage.name,
      name: matchedPackage.name,
      totalPaxAdult: matchedPackage?.totalPaxAdult ?? 0,
      childGroups: Array.isArray(matchedPackage?.childGroups)
        ? matchedPackage.childGroups.map((g, i) => ({
            id: g.id ?? `ch_${makeId()}`,
            label: g.label ?? `Child ${i + 1}`,
            total:
              typeof g.total === "number"
                ? g.total
                : Array.isArray(g.ages)
                ? g.ages.length
                : 0,
            age: g.age ?? "",
          }))
        : [],
      totalPaxChildren: matchedPackage?.totalPaxChildren || 0,
      addAdditionalChild: false,
      addExtrabedChild: false,
      days: matchedPackage.days || [],
      childrenAges: [],
    });

    const len = (matchedPackage.days || []).length;
    setAkomodasiTotal(Array(len).fill(0));
    setTourTotal(Array(len).fill(0));
    setTransportTotal(Array(len).fill(0));
    setActiveDayId(matchedPackage?.days?.[0]?.id ?? 1);
    setActiveTravelerKey("adult");

    setHasAppliedPrefill(true);
  }
}, [paketIdFromState, packagesData, hasAppliedPrefill, setSelectedPackage, setAkomodasiTotal, setTourTotal, setTransportTotal]);


  // pastikan childGroups ter-inisialisasi (pakai age & total) & set default active traveler
  useEffect(() => {
    setSelectedPackage((prev) => ({
      ...prev,
      childGroups: Array.isArray(prev.childGroups)
        ? prev.childGroups.map((g, i) => ({
            id: g.id ?? `ch_${makeId()}`,
            label: g.label ?? `Child ${i + 1}`,
            // migrate dari struktur lama (ages[]) → ambil panjang & kosongkan
            total:
              typeof g.total === "number"
                ? g.total
                : Array.isArray(g.ages)
                ? g.ages.length
                : 0,
            age: g.age !== undefined ? g.age : "", // jika sebelumnya tidak ada age, kosong
          }))
        : [],
      totalPaxAdult:
        typeof prev.totalPaxAdult === "number" ? prev.totalPaxAdult : 0,
    }));
    setActiveTravelerKey("adult");
  }, [setSelectedPackage]);

  useEffect(() => {
    setActiveDayId(selectedPackage?.days?.[0]?.id);
  }, [selectedPackage?.id]);

  // Auto-shift tanggal day lain berdasarkan day-1
  useEffect(() => {
    const firstDay = days[0];
    if (firstDay?.date) {
      const baseDate = new Date(firstDay.date);
      const updatedDays = days.map((day, index) => {
        if (index === 0) return day;
        const newDate = new Date(baseDate);
        newDate.setDate(newDate.getDate() + index);
        return { ...day, date: newDate.toISOString().split("T")[0] };
      });
      setSelectedPackage((prev) => ({ ...prev, days: updatedDays }));
    }
  }, [days[0]?.date]); // eslint-disable-line

  // ====== Handlers: Traveler Tabs ======
  const handleAddChildGroup = () => {
    const newId = `ch_${makeId()}`;
    const nextIndex = childGroups.length + 1;
    const newGroup = {
      id: newId,
      label: `Child ${nextIndex}`,
      total: 0,
      age: "",
    };
    setSelectedPackage((prev) => ({
      ...prev,
      childGroups: [...(prev.childGroups || []), newGroup],
    }));
    setActiveTravelerKey(newId);
  };

  const handleRemoveChildGroup = (idToRemove) => {
    const filtered = childGroups.filter((c) => c.id !== idToRemove);
    setSelectedPackage((prev) => ({ ...prev, childGroups: filtered }));
    if (activeTravelerKey === idToRemove) {
      setActiveTravelerKey("adult");
    }
  };

  // Ubah Total Pax untuk Adult / Child aktif
  const handleChangeTotalPax = (val) => {
    const num = Math.max(0, parseInt(val) || 0);

    if (activeTravelerKey === "adult") {
      setSelectedPackage((prev) => ({ ...prev, totalPaxAdult: num }));
      return;
    }

    setSelectedPackage((prev) => ({
      ...prev,
      childGroups: (prev.childGroups || []).map((c) =>
        c.id === activeTravelerKey ? { ...c, total: num } : c
      ),
    }));
  };

  // Ubah Age untuk Child aktif
  const handleChangeChildAge = (val) => {
    if (activeTravelerKey === "adult") return;
    setSelectedPackage((prev) => ({
      ...prev,
      childGroups: (prev.childGroups || []).map((c) =>
        c.id === activeTravelerKey ? { ...c, age: val } : c
      ),
    }));
  };

  // ====== Handlers: Days (dibatasi hanya saat Adult aktif) ======
  const canModifyDays = activeTravelerKey === "adult";

  const handleAddDay = () => {
    if (!canModifyDays) return;
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
    if (!canModifyDays) return;
    const filtered = days.filter((d) => d.id !== id);
    setSelectedPackage((prev) => ({ ...prev, days: filtered }));
    if (activeDayId === id && filtered.length > 0) {
      setActiveDayId(filtered[0].id);
    }
  };

  // Untuk menampilkan label tombol Grand Total sesuai currency
  const formatGrandTotal = (num) => {
    if (!currency || currency === "IDR") {
      return `Rp ${num.toLocaleString("id-ID")}`;
    }
    return `${currency} ${num.toLocaleString("en-US")}`;
  };

  // Grand total
  const dayLen = days.length;
  const sumUpto = (arr) =>
    (arr || []).slice(0, dayLen).reduce((s, n) => s + (Number(n) || 0), 0);

  const grandTotal = useMemo(() => {
    return (
      sumUpto(akomodasiTotal) + sumUpto(tourTotal) + sumUpto(transportTotal)
    );
  }, [akomodasiTotal, tourTotal, transportTotal, dayLen]);

  useEffect(() => {
    const len = days.length || 0;

    const fit = (prev) => {
      if (!Array.isArray(prev)) return Array(len).fill(0);
      if (prev.length === len) return prev;
      // potong atau tambahkan 0 hingga panjangnya pas
      const next = prev.slice(0, len);
      while (next.length < len) next.push(0);
      return next;
    };

    setAkomodasiTotal((prev) => fit(prev));
    setTourTotal((prev) => fit(prev));
    setTransportTotal((prev) => fit(prev));
  }, [days.length, setAkomodasiTotal, setTourTotal, setTransportTotal]);

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
                  totalPaxAdult: found?.totalPaxAdult ?? 0,
                  // normalisasi struktur childGroups: {id,label,age,total}
                  childGroups: Array.isArray(found?.childGroups)
                    ? found.childGroups.map((g, i) => ({
                        id: g.id ?? `ch_${makeId()}`,
                        label: g.label ?? `Child ${i + 1}`,
                        total:
                          typeof g.total === "number"
                            ? g.total
                            : Array.isArray(g.ages)
                            ? g.ages.length
                            : 0,
                        age: g.age ?? "",
                      }))
                    : [],
                  // legacy (abaikan)
                  totalPaxChildren: found?.totalPaxChildren || 0,
                  addAdditionalChild: false,
                  addExtrabedChild: false,
                  days: found.days || [],
                  childrenAges: [],
                });
                // RESET total per-hari agar bersih sesuai jumlah hari paket yang baru
                const len = (found.days || []).length;
                setAkomodasiTotal(Array(len).fill(0));
                setTourTotal(Array(len).fill(0));
                setTransportTotal(Array(len).fill(0));
                setActiveDayId(found?.days?.[0]?.id ?? 1);
                setActiveTravelerKey("adult");
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

          <FormControl mb={6}>
            <FormLabel color="white">Currency</FormLabel>
            <Input
              placeholder="IDR, USD, MYR, SGD"
              bg="gray.600"
              color="white"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            />
            <Text fontSize="sm" color="gray.400" mt={2}>
              *This currency format will be applied to prices in the itinerary
            </Text>
          </FormControl>

          {/* ========================= Traveler Tabs (Adult & Child) ========================= */}
          <Box mt={8}>
            <FormLabel color="white" mb={2}>
              Traveler Groups
            </FormLabel>
            <HStack spacing={2} mb={3} flexWrap="wrap">
              {/* Adult (fixed, cannot delete) */}
              <Tag
                size="lg"
                borderRadius="full"
                variant="solid"
                bg={activeTravelerKey === "adult" ? "blue.300" : "gray.600"}
                cursor="pointer"
                onClick={() => setActiveTravelerKey("adult")}
              >
                <TagLabel>Adult</TagLabel>
              </Tag>

              {/* Child dynamic */}
              {childGroups.map((cg) => (
                <HStack key={cg.id} spacing={1}>
                  <Tag
                    size="lg"
                    borderRadius="full"
                    variant="solid"
                    bg={activeTravelerKey === cg.id ? "blue.300" : "gray.600"}
                    cursor="pointer"
                    onClick={() => setActiveTravelerKey(cg.id)}
                  >
                    <TagLabel>{cg.label}</TagLabel>
                  </Tag>
                  <IconButton
                    aria-label={`Hapus ${cg.label}`}
                    size="xs"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleRemoveChildGroup(cg.id)}
                  />
                </HStack>
              ))}

              <Button
                size="sm"
                colorScheme="gray"
                leftIcon={<AddIcon />}
                onClick={handleAddChildGroup}
              >
                Tambah Child
              </Button>
            </HStack>

            {/* Adult: hanya Total Pax. Child: Age + Total Pax */}
            {activeTravelerKey === "adult" ? (
              <FormControl mb={6}>
                <FormLabel color="white">Total Pax (Adult)</FormLabel>
                <Input
                  min={0}
                  bg="gray.600"
                  color="white"
                  value={activeTotalPax}
                  onChange={(e) => handleChangeTotalPax(e.target.value)}
                />
              </FormControl>
            ) : (
              <>
                <FormControl mb={3}>
                  <FormLabel color="white">Age (years)</FormLabel>
                  <Input
                    min={0}
                    bg="gray.600"
                    color="white"
                    value={activeChildAge}
                    onChange={(e) => handleChangeChildAge(e.target.value)}
                    placeholder="e.g. 8"
                  />
                </FormControl>
                <FormControl mb={6}>
                  <FormLabel color="white">Total Pax (Child)</FormLabel>
                  <Input
                    min={0}
                    bg="gray.600"
                    color="white"
                    value={activeTotalPax}
                    onChange={(e) => handleChangeTotalPax(e.target.value)}
                    placeholder="e.g. 2"
                  />
                </FormControl>
              </>
            )}

            {/* ========================= DAYS ========================= */}
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
                    isDisabled={!canModifyDays} // hanya aktif di Adult
                  />
                </HStack>
              ))}

              {/* Tombol tambah day hanya tampil saat Adult */}
              {canModifyDays && (
                <Button
                  size="sm"
                  colorScheme="gray"
                  leftIcon={<AddIcon />}
                  onClick={handleAddDay}
                >
                  Tambah Day
                </Button>
              )}
            </HStack>

            {/* DESKRIPSI DAY */}
            <FormControl>
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
              <TravelerGroupProvider
                value={{
                  activeTravelerKey,
                  isAdultActive: activeTravelerKey === "adult",
                }}
              >
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
              </TravelerGroupProvider>
            </Box>
          </Box>
        </Box>
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
                  Grand Total: {formatGrandTotal(grandTotal)}
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
