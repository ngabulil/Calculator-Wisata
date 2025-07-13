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

const DayDetails = ({
  mergedDays,
  dayTotals,
  detailedBreakdown,
  formatCurrency,
  accentColor,
}) => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Rincian Per Hari
      </Text>
      <Accordion allowMultiple>
        {mergedDays.map((day, index) => {
          const dayTotal = dayTotals[index] || 0;
          const dayBreakdown = detailedBreakdown[index] || {};

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
                  {renderSection("Hotel", day.hotels, accentColor, formatCurrency, renderHotel)}
                  {renderSection("Villa", day.villas, accentColor, formatCurrency, renderHotel)}
                  {renderSection("Tambahan Akomodasi", day.akomodasi_additionals, accentColor, formatCurrency, renderAdditional)}
                  {renderSection("Transportasi", day.mobils, accentColor, formatCurrency, renderTransport)}
                  {renderSection("Tambahan Transportasi", day.transport_additionals, accentColor, formatCurrency, renderAdditional)}
                  {renderTourSection(day, accentColor, formatCurrency)}
                  {dayBreakdown.markup > 0 && (
                    <Box>
                      <HStack
                        justify="space-between"
                        fontSize="sm"
                        color="orange.300"
                      >
                        <Text>Markup</Text>
                        <Text fontWeight="bold">
                          {formatCurrency(dayBreakdown.markup)}
                        </Text>
                      </HStack>
                      <Divider my={2} />
                    </Box>
                  )}
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

const renderSection = (label, items, accentColor, formatCurrency, renderFn) => {
  if (!items || items.length === 0) return null;

  return (
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
        {label} ({items.length} item)
      </Text>
      {items.map((item, i) => renderFn(item, i, formatCurrency))}
      <Divider my={2} />
    </Box>
  );
};

const renderHotel = (item, i, formatCurrency) => {
  const total =
    (item.jumlahKamar || 0) * (item.hargaPerKamar || 0) +
    (item.useExtrabed ? (item.jumlahExtrabed || 0) * (item.hargaExtrabed || 0) : 0);

  return (
    <HStack key={i} justify="space-between" fontSize="sm" pl={4}>
      <Text>
        {item.displayName} - {item.jumlahKamar || 0} kamar
        {item.useExtrabed && ` + ${item.jumlahExtrabed || 0} extrabed`}
      </Text>
      <Text fontWeight="bold">{formatCurrency(total)}</Text>
    </HStack>
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
  const { restaurants, destinations, activities } = day;

  if (
    (!restaurants || restaurants.length === 0) &&
    (!destinations || destinations.length === 0) &&
    (!activities || activities.length === 0)
  ) {
    return null;
  }

  return (
    <Box>
      <Text fontWeight="bold" fontSize="sm" mb={2} color={accentColor}>
        Tour
      </Text>

      {restaurants?.length > 0 && (
        <>
          <Text fontSize="xs" mb={1} pl={2} color="gray.400">
            Restoran:
          </Text>
          {restaurants.map((item, i) => (
            <HStack key={i} justify="space-between" fontSize="sm" pl={4}>
              <Text>{item.displayName}</Text>
              <Text fontWeight="bold">
                {formatCurrency(
                  (item.hargaAdult || 0) * (item.jumlahAdult || 0) +
                  (item.hargaChild || 0) * (item.jumlahChild || 0)
                )}
              </Text>
            </HStack>
          ))}
        </>
      )}

      {destinations?.length > 0 && (
        <>
          <Text fontSize="xs" mb={1} pl={2} color="gray.400" mt={restaurants?.length > 0 ? 2 : 0}>
            Destinasi:
          </Text>
          {destinations.map((item, i) => (
            <HStack key={i} justify="space-between" fontSize="sm" pl={4}>
              <Text>{item.displayName}</Text>
              <Text fontWeight="bold">
                {formatCurrency(
                  (item.hargaAdult || 0) * (item.jumlahAdult || 0) +
                  (item.hargaChild || 0) * (item.jumlahChild || 0)
                )}
              </Text>
            </HStack>
          ))}
        </>
      )}

      {activities?.length > 0 && (
        <>
          <Text
            fontSize="xs"
            mb={1}
            pl={2}
            color="gray.400"
            mt={restaurants?.length || destinations?.length ? 2 : 0}
          >
            Aktivitas:
          </Text>
          {activities.map((item, i) => (
            <HStack key={i} justify="space-between" fontSize="sm" pl={4}>
              <Text>
                {item.displayName}
                {item.jumlah > 1 && ` (x${item.jumlah})`}
              </Text>
              <Text fontWeight="bold">
                {formatCurrency(
                  (item.hargaAdult || 0) * (item.jumlahAdult || 0) +
                  (item.hargaChild || 0) * (item.jumlahChild || 0)
                )}
              </Text>
            </HStack>
          ))}
        </>
      )}

      <Divider my={2} />
    </Box>
  );
};

