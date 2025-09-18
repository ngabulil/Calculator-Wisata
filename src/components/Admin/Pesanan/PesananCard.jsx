import { Box, Text, Button, Link, Stack, useColorModeValue, Badge, Flex } from '@chakra-ui/react';

const PesananCard = ({ pesanan, onDelete }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  if (!pesanan) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={5}
        bg={cardBg}
        shadow="md"
      >
        <Text color="red.500">Data pesanan tidak tersedia</Text>
      </Box>
    );
  }

  const formattedDate = pesanan.createdAt ? new Date(pesanan.createdAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'N/A';

  return (
    <Box
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      p={5}
      bg={cardBg}
      shadow="md"
      transition="all 0.2s ease-in-out"
    >
      <Text fontSize="lg" fontWeight="bold" color={textColor} mb={1}>
        Kode Pesanan: {pesanan.kode_pesanan || 'N/A'}
      </Text>
      <Text fontSize="sm" color="gray.500" mb={2}>
        Dibuat pada: {formattedDate}
      </Text>

      {/* Admin Information */}
      <Flex align="center" mb={3}>
        <Text fontSize="sm" color="gray.600" mr={2}>
          Dibuat oleh:
        </Text>
        <Badge colorScheme="green" variant="subtle">
          {pesanan.admin?.name || 'N/A'}
        </Badge>
      </Flex>

      <Stack spacing={2}>
        {pesanan.invoice_pdf && (
          <Link href={pesanan.invoice_pdf} isExternal style={{ textDecoration: 'none' }}>
            <Button colorScheme="blue" variant="outline" size="sm" width="full">
              Lihat Quotation PDF
            </Button>
          </Link>
        )}
        {pesanan.itinerary_pdf && (
          <Link href={pesanan.itinerary_pdf} isExternal style={{ textDecoration: 'none' }}>
            <Button colorScheme="purple" variant="outline" size="sm" width="full">
              Lihat Itinerary PDF
            </Button>
          </Link>
        )}
        {(!pesanan.invoice_pdf && !pesanan.itinerary_pdf) && (
          <Text color="gray.500" fontSize="sm" textAlign="center">
            Tidak ada dokumen PDF tersedia.
          </Text>
        )}
        <Button
          colorScheme="red"
          variant="solid"
          size="sm"
          width="full"
          onClick={() => onDelete?.(pesanan)}
        >
          Hapus Pesanan
        </Button>
      </Stack>
    </Box>
  );
};

export default PesananCard;