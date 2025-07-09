import { Box, Text, Button, Link, Stack, useColorModeValue } from '@chakra-ui/react';

const PesananCard = ({ pesanan }) => {
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
      <Text fontSize="sm" color="gray.500" mb={3}>
        Dibuat pada: {formattedDate}
      </Text>

      <Stack spacing={2}>
        {pesanan.invoice_pdf && (
          <Link href={pesanan.invoice_pdf} isExternal style={{ textDecoration: 'none' }}>
            <Button colorScheme="blue" variant="outline" size="sm" width="full">
              Lihat Invoice PDF
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
      </Stack>
    </Box>
  );
};

export default PesananCard;