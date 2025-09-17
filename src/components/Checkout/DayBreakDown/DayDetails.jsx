import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
  Flex,
  Spacer,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { usePackageContext } from "../../../context/PackageContext";

const DayDetails = ({
  mergedDays,
  dayTotals,
  formatCurrency,
  accentColor,
}) => {
  const { selectedPackage } = usePackageContext();

  const childGroups =
    selectedPackage?.childGroups?.map((child, idx) => ({
      id: child.id || `child-${idx}`,
      label: `${child.label} (${child.age} thn)`, 
      total: child.total || 1,
      age: child.age,
    })) || [];
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Rincian Per Hari
      </Text>
      <Accordion allowMultiple>
        {mergedDays.map((day, index) => {
          const dayTotal = dayTotals[index] || 0;

          return (
            <AccordionItem
              key={index}
              border="1px"
              borderColor="gray.600"
              rounded="lg"
              mb={2}
            >
              <AccordionButton
                bg="gray.600"
                rounded="lg"
                _expanded={{ bg: "gray.500" }}
              >
                <Box flex="1" textAlign="left">
                  <Flex align="center">
                    <Text fontWeight="bold">Hari {index + 1}</Text>
                    <Spacer />
                    <Badge colorScheme="teal" mr={2}>
                      {formatCurrency(dayTotal)}
                    </Badge>
                  </Flex>
                </Box>
                <AccordionIcon />
              </AccordionButton>

               <AccordionPanel pb={4} bg="gray.650">
                <VStack spacing={3} align="stretch">
                  {renderSection("Hotel", day.hotels, accentColor, formatCurrency, renderHotel, childGroups)}
                  {renderSection("Villa", day.villas, accentColor, formatCurrency, renderHotel, childGroups)}
                  {renderSection("Tambahan Akomodasi", day.akomodasi_additionals, accentColor, formatCurrency, renderAdditional)}
                  {renderSection("Transportasi", day.mobils, accentColor, formatCurrency, renderTransport)}
                  {renderSection("Tambahan Transportasi", day.transport_additionals, accentColor, formatCurrency, renderAdditional)}
                  {renderTourSection(day, accentColor, formatCurrency)}
                  <HStack justify="space-between" fontWeight="bold">
                    <Text>Total Hari {index + 1}</Text>
                    <Text color={accentColor}>{formatCurrency(dayTotal)}</Text>
                  </HStack>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Box>
  );
};

export default DayDetails;

const renderSection = (label, items, accentColor, formatCurrency, renderFn, childGroups = []) => {
  if (!items || items.length === 0) return null;

  return (
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
        {label} ({items.length} item)
      </Text>
      {items.map((item, i) => renderFn(item, i, formatCurrency, childGroups))}
      <Divider my={2} />
    </Box>
  );
};

const getChildAgeLabel = (childId, childGroups = []) => {
  if (childId === 'adult') return 'Dewasa';
  const child = childGroups.find(c => c.id === childId);
  return child ? `Anak ${child.age} thn` : childId;
};

const renderHotel = (item, i, formatCurrency, childGroups = []) => {
  const roomCost = (item.jumlahKamar || 0) * (item.hargaPerKamar || 0);

  const extrabeds = item.extrabedByTraveler
    ? Object.entries(item.extrabedByTraveler).map(([travelerId, bed]) => {
      const qty = bed.qty || 0;
      const harga = bed.use ? (Number(item.hargaExtrabed) || 0) : 0; // Mengambil harga dari item induk
      return {
        travelerId,
        qty,
        harga,
        total: qty * harga,
      };
    })
    : [];

  const extrabedTotal = extrabeds.reduce((sum, b) => sum + b.total, 0);

  return (
    <Box key={i} pl={4} fontSize="sm">
      <HStack justify="space-between">
        <Text>
          {item.displayName} - {item.jumlahKamar || 0} kamar
        </Text>
        <Text fontWeight="bold">{formatCurrency(roomCost)}</Text>
      </HStack>

      {extrabeds.map((bed, idx) => {
        if (bed.qty > 0) {
          return (
            <HStack key={idx} justify="space-between" pl={6}>
              <Text>
                Extrabed ({getChildAgeLabel(bed.travelerId, childGroups)}) x {bed.qty}
              </Text>
              <Text>{formatCurrency(bed.total)}</Text>
            </HStack>
          );
        }
        return null;
      })}
    </Box>
  );
};

const renderAdditional = (item, i, formatCurrency) => (
  <VStack
    key={i}
    align="stretch"
    fontSize="sm"
    pl={4}
    spacing={1}
  >
    <HStack justify="space-between">
      <Text fontWeight="bold">{item.displayName || item.name || item.nama}</Text>
      <Text>{formatCurrency((item.harga || 0) * (item.jumlah || 1))}</Text>
    </HStack>
  </VStack>
);

const renderTransport = (item, i, formatCurrency) => (
  <VStack
    key={i}
    align="stretch"
    fontSize="sm"
    pl={4}
    spacing={1}
  >
    <HStack justify="space-between">
      <Text fontWeight="bold">{item.displayName}</Text>
      <Text>{formatCurrency(item.harga || 0)}</Text>
    </HStack>
  </VStack>
);

const renderTourSection = (day, accentColor, formatCurrency) => {
  const tours = day.tours || [];

  // hitung total seluruh tour hari ini
  const totalTourHariIni = tours.reduce((sum, item) => {
    if (item.jenis_wisatawan) {
      const hargaAdult = parseFloat(item.hargaAdult) || 0;
      const hargaChild = parseFloat(item.hargaChild) || 0;

      const adultCount = item.quantities?.adult || 0;
      const childCount = Object.entries(item.quantities || {})
        .filter(([key]) => key !== "adult")
        .reduce((acc, [, val]) => acc + (parseInt(val) || 0), 0);

      return sum + hargaAdult * adultCount + hargaChild * childCount;
    } else if (item.harga && item.jumlah) {
      return (
        sum +
        (parseFloat(item.harga) || 0) * (parseInt(item.jumlah) || 1)
      );
    }
    return sum;
  }, 0);

  return (
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
        Tour ({tours.length} item)
      </Text>

      {tours.map((item, i) => {
        let total = 0;
        let displayName = item.displayName || item.nama || "Unknown Item";

        if (item.jenis_wisatawan) {
          const hargaAdult = parseFloat(item.hargaAdult) || 0;
          const hargaChild = parseFloat(item.hargaChild) || 0;

          const adultCount = item.quantities?.adult || 0;
          const childCount = Object.entries(item.quantities || {})
            .filter(([key]) => key !== "adult")
            .reduce((acc, [, val]) => acc + (parseInt(val) || 0), 0);

          total = hargaAdult * adultCount + hargaChild * childCount;
        } else if (item.harga && item.jumlah) {
          total =
            (parseFloat(item.harga) || 0) * (parseInt(item.jumlah) || 1);
        }

        return (
          <HStack key={i} justify="space-between" fontSize="sm" pl={4}>
            <Text>{displayName}</Text>
            <Text fontWeight="bold">{formatCurrency(total)}</Text>
          </HStack>
        );
      })}

      {/* total semua tour hari ini */}
      {tours.length > 0 && (
        <HStack justify="space-between" fontWeight="bold" pl={4} mt={2}>
          <Text>Total Tour Hari Ini</Text>
          <Text color={accentColor}>{formatCurrency(totalTourHariIni)}</Text>
        </HStack>
      )}

      <Divider my={2} />
    </Box>
  );
};

