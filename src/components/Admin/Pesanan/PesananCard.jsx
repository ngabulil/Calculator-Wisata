import { useAdminAuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Text, Button, Link, Stack, Badge, Flex, Tooltip } from '@chakra-ui/react';
import { Icon as Iconify } from '@iconify/react';

const PesananCard = ({ pesanan, onDelete, onEdit, bgIcon }) => {
  const { userData } = useAdminAuthContext();
  const navigate = useNavigate();

  if (!pesanan) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={5}
        bg="gray.800"
        shadow="md"
        w="full"
      >
        <Text color="red.500">Data pesanan tidak tersedia</Text>
      </Box>
    );
  }

  const formattedDate = pesanan.createdAt 
    ? new Date(pesanan.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : 'N/A';

  const paketAdminId = pesanan?.paket?.creator?.id;
  const isOwner = userData?.id && paketAdminId && userData.id === paketAdminId;
  const hasPaket = typeof pesanan?.paket?.id !== "undefined" && pesanan?.paket?.id !== null;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      bg="gray.800"
      shadow="lg"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'xl',
        borderColor: bgIcon || 'teal.500',
      }}
      w="full"
      position="relative"
    >
      {/* Accent bar */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="4px"
        bg={bgIcon || 'teal.500'}
        borderTopRadius="lg"
      />

      {/* Header dengan icon */}
      <Flex align="center" gap={3} mb={3} mt={2}>
        <Flex
          bg={bgIcon || 'teal.500'}
          p={2}
          borderRadius="md"
          align="center"
          justify="center"
        >
          <Iconify
            icon="mdi:file-document-outline"
            width="24"
            height="24"
            color="white"
          />
        </Flex>
        <Box flex={1}>
          <Text fontSize="md" fontWeight="bold" color="white" noOfLines={1}>
            {pesanan.kode_pesanan || 'N/A'}
          </Text>
          <Text fontSize="xs" color="gray.400">
            {formattedDate}
          </Text>
        </Box>
      </Flex>

      {/* Admin badge */}
      <Flex align="center" mb={4} gap={2}>
        <Iconify
          icon="mdi:account"
          width="16"
          height="16"
          color="gray"
        />
        <Text fontSize="xs" color="gray.400">
          Dibuat oleh:
        </Text>
        <Badge colorScheme="green" variant="subtle" fontSize="xs">
          {pesanan.admin?.name || 'N/A'}
        </Badge>
      </Flex>

      {/* Action buttons */}
      <Stack spacing={2}>
        {pesanan.invoice_pdf && (
          <Link href={pesanan.invoice_pdf} isExternal style={{ textDecoration: 'none' }}>
            <Button
              leftIcon={<Iconify icon="mdi:file-pdf-box" width="18" height="18" />}
              colorScheme="blue"
              variant="solid"
              size="sm"
              width="full"
            >
              Quotation PDF
            </Button>
          </Link>
        )}
        {pesanan.itinerary_pdf && (
          <Link href={pesanan.itinerary_pdf} isExternal style={{ textDecoration: 'none' }}>
            <Button
              leftIcon={<Iconify icon="mdi:map-marker-path" width="18" height="18" />}
              colorScheme="purple"
              variant="solid"
              size="sm"
              width="full"
            >
              Itinerary PDF
            </Button>
          </Link>
        )}
        {(!pesanan.invoice_pdf && !pesanan.itinerary_pdf) && (
          <Flex
            align="center"
            justify="center"
            p={3}
            bg="gray.700"
            borderRadius="md"
            gap={2}
          >
            <Iconify icon="mdi:alert-circle-outline" width="20" height="20" color="gray" />
            <Text color="gray.400" fontSize="sm">
              Tidak ada dokumen PDF
            </Text>
          </Flex>
        )}
        {hasPaket ? (
          <Button
            leftIcon={<Iconify icon="mdi:pencil-outline" width="18" height="18" />}
            colorScheme="teal"
            variant="outline"
            size="sm"
            width="full"
            onClick={() => onEdit?.(pesanan)}
          >
            Edit Ulang Pesanan
          </Button>
        ) : (
          <Tooltip 
            label="Pesanan ini tidak memiliki paket, tidak bisa diedit ulang" 
            placement="top"
            hasArrow
          >
            <Button
              leftIcon={<Iconify icon="mdi:lock" width="18" height="18" />}
              colorScheme="gray"
              variant="outline"
              size="sm"
              width="full"
              isDisabled
              cursor="not-allowed"
            >
              Tidak Bisa Edit Pesanan
            </Button>
          </Tooltip>
        )}

        {/* Button Edit Paket */}
        {(
          isOwner ? (
            <Button
              leftIcon={<Iconify icon="mdi:package-variant" width="18" height="18" />}
              colorScheme="orange"
              variant="outline"
              size="sm"
              width="full"
              onClick={() => {
              navigate("/admin/paket", {
                state: { 
                  editPaket: pesanan.paket, 
                  openEditForm: true 
                }
              });
            }}
            >
              Edit Paket
            </Button>
          ) : (
            <Tooltip 
              label="Hanya pemilik paket yang dapat mengedit paket" 
              placement="top"
              hasArrow
            >
              <Button
                leftIcon={<Iconify icon="mdi:lock" width="18" height="18" />}
                colorScheme="gray"
                variant="outline"
                size="sm"
                width="full"
                isDisabled
                cursor="not-allowed"
              >
                Tidak Bisa Edit Paket
              </Button>
            </Tooltip>
          )
        )}
        <Button
          leftIcon={<Iconify icon="mdi:delete" width="18" height="18" />}
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