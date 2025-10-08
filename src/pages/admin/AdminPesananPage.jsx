import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  useToast,
  Select,
  Badge,
  IconButton,
  theme,
} from '@chakra-ui/react';
import OrderCard from '../../components/Admin/Pesanan/PesananCard';
import { apiGetPesanan, apiDeletePesanan } from '../../services/pesanan';
import ReactPaginate from 'react-paginate';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import colorPallete from '../../utils/colorPallete';
import { useNavigate } from 'react-router-dom';   // ⬅️ Tambahan

const ITEMS_PER_PAGE = 4;
const ORDERS_PER_GROUP_PAGE = 6;

const MotionFlex = motion(Flex);

const resolveColor = (chakraColor) => {
  const [base, shade] = chakraColor.split(".");
  return theme.colors[base]?.[shade] || chakraColor;
};

const normalizeOrdersResponse = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.result)) {
    return data.result;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

const groupOrdersByAdmin = (orders, sortOrder) => {
  if (!Array.isArray(orders) || orders.length === 0) {
    return [];
  }

  const grouped = new Map();

  orders.forEach((order) => {
    const adminRaw = order?.admin ?? {};
    const adminId = adminRaw.id ?? adminRaw.user_id ?? adminRaw.name ?? 'unknown';
    const adminName = adminRaw.name || adminRaw.username || 'Unknown Admin';

    if (!grouped.has(adminId)) {
      grouped.set(adminId, {
        admin: {
          id: adminRaw.id ?? adminId,
          name: adminName,
        },
        orders: [],
      });
    }

    const bucket = grouped.get(adminId);
    bucket.admin = {
      id: adminRaw.id ?? adminId,
      name: adminName,
    };
    bucket.orders.push(order);
  });

  const timeOf = (value) => {
    const timeValue = value ? new Date(value).getTime() : NaN;
    return Number.isNaN(timeValue) ? 0 : timeValue;
  };

  const sortedGroups = Array.from(grouped.values()).map((group) => ({
    ...group,
    orders: [...group.orders].sort((a, b) => {
      const diff = timeOf(a?.createdAt) - timeOf(b?.createdAt);
      return sortOrder === 'asc' ? diff : -diff;
    }),
  }));

  sortedGroups.sort((a, b) =>
    (a.admin.name || '').localeCompare(b.admin.name || '', 'id', {
      sensitivity: 'base',
    })
  );

  return sortedGroups;
};

const AdminOrderTree = ({ data, color, onDeleteOrder, onEditOrder }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const resolvedColor = resolveColor(color);
  
  const pageCount = Math.ceil(data.orders.length / ORDERS_PER_GROUP_PAGE);
  const offset = currentPage * ORDERS_PER_GROUP_PAGE;
  const currentOrders = data.orders.slice(offset, offset + ORDERS_PER_GROUP_PAGE);

  return (
    <Flex direction="column" w="full">
      {/* Header folder admin */}
      <Flex
        w="full"
        bg={resolvedColor}
        p={4}
        borderTopRadius={"10px"}
        borderBottomRadius={isOpen ? "0" : "10px"}
        alignItems="center"
        justifyContent="space-between"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Flex alignItems="center" gap="10px">
          <Icon
            icon="material-symbols:folder"
            width="24"
            height="24"
            color="white"
          />
          <Text fontWeight="700" color="white">
            {data.admin.name}
          </Text>
          <Badge colorScheme="whiteAlpha" ml={2}>
            {data.orders.length} Pesanan
          </Badge>
        </Flex>
        <IconButton
          aria-label="toggle"
          size="sm"
          variant="ghost"
          icon={
            isOpen ? (
              <Icon
                icon="mdi:chevron-down"
                color="white"
                width="24"
                height="24"
              />
            ) : (
              <Icon
                icon="mdi:chevron-right"
                color="white"
                width="24"
                height="24"
              />
            )
          }
        />
      </Flex>

      {/* List pesanan dengan animasi */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <MotionFlex
            direction="column"
            w="full"
            bg={"gray.700"}
            borderColor={resolvedColor}
            borderWidth={2}
            px={3}
            borderBottomRadius={"10px"}
            alignItems="end"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            overflow="hidden"
          >
            <Flex 
              direction="row" 
              flexWrap="wrap" 
              w="full" 
              gap={4} 
              py={4}
              px={2}
            >
              {currentOrders.map((order) => (
                <Flex 
                  key={order.id} 
                  w={{ base: "full", md: "calc(50% - 8px)", lg: "calc(33.333% - 11px)" }}
                >
                  <OrderCard
                    pesanan={order}
                    onDelete={onDeleteOrder}
                    onEdit={onEditOrder}
                    bgIcon={resolvedColor}
                  />
                </Flex>
              ))}
            </Flex>

            {/* Pagination dalam grup */}
            {pageCount > 1 && (
              <Flex w="full" justifyContent="end" my={3}>
                <ReactPaginate
                  previousLabel={null}
                  nextLabel={null}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={(e) => setCurrentPage(e.selected)}
                  containerClassName="package-pagination"
                  pageClassName="package-page-item"
                  pageLinkClassName="package-page-link"
                  previousClassName="package-page-item"
                  nextClassName="package-page-item"
                  activeClassName="package-active"
                  breakClassName="package-page-item"
                  renderOnZeroPageCount={null}
                />
              </Flex>
            )}
          </MotionFlex>
        )}
      </AnimatePresence>
    </Flex>
  );
};

const AdminPesananPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState('desc');
  const toast = useToast();
  const navigate = useNavigate();   // ⬅️ Tambahan

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(0);
  };

  const handleDeleteOrder = async (order) => {
    if (!order?.id) return;

    try {
      await apiDeletePesanan(order.id);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));

      toast({
        title: "Pesanan berhasil dihapus",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Gagal menghapus pesanan",
        description: error.message || "Terjadi kesalahan",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

   const handleDownloadWord = (fileUrl) => {
    try {
      if (!fileUrl) {
        toast({
          title: "File tidak ditemukan",
          description: "Link dokumen Word tidak tersedia",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      // Buka langsung di tab baru
      window.open(fileUrl, "_blank");

      toast({
        title: "Download dimulai",
        description: "File Word dibuka di tab baru",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error opening Word file:", error);
      toast({
        title: "Gagal membuka file",
        description: "Terjadi kesalahan saat membuka file Word",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

const handleEditOrder = (order) => {
  const paketId = order?.paket?.id;

  if (!paketId) {
    toast({
      title: "Paket tidak ditemukan",
      description: "Pesanan ini belum memiliki paket untuk diedit.",
      status: "warning",
      duration: 4000,
      isClosable: true,
    });
    return;
  }
  
  navigate('/calculator', { 
    state: { 
      paketId: paketId,
      orderData: order 
    } 
  });
};

  useEffect(() => {
    const getOrders = async () => {
      setIsLoading(true);
      try {
        const data = await apiGetPesanan();
        const normalized = normalizeOrdersResponse(data);
        setOrders(normalized);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Gagal memuat pesanan",
          description: error.message || "Terjadi kesalahan saat memuat data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    getOrders();
  }, [toast]);

  const groupedOrders = useMemo(
    () => groupOrdersByAdmin(orders, sortOrder),
    [orders, sortOrder]
  );

  const pageCount = Math.ceil(groupedOrders.length / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentGroups = groupedOrders.slice(offset, offset + ITEMS_PER_PAGE);

  useEffect(() => {
    if (pageCount === 0 && currentPage !== 0) {
      setCurrentPage(0);
    } else if (currentPage >= pageCount && pageCount > 0) {
      setCurrentPage(pageCount - 1);
    }
  }, [pageCount, currentPage]);

  return (
    <Box maxW="container.xl" mx="auto" p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">Daftar Pesanan</Heading>
        <Select
          value={sortOrder}
          onChange={handleSortChange}
          width="200px"
          variant="filled"
        >
          <option value="desc">Terbaru</option>
          <option value="asc">Terlama</option>
        </Select>
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" color="teal.500" />
          <Text ml={4}>Memuat pesanan...</Text>
        </Flex>
      ) : (
        <>
          {currentGroups.length > 0 ? (
            <Flex direction="column" gap={6}>
              {currentGroups.map((group, index) => (
                <AdminOrderTree
                  key={group.admin.id}
                  data={group}
                  color={colorPallete[index % colorPallete.length]}
                  onDeleteOrder={handleDeleteOrder}
                  onDownloadWord={handleDownloadWord}
                  onEditOrder={handleEditOrder}
                />
              ))}
            </Flex>
          ) : (
            <Box
              w="full"
              textAlign="center"
              bg="gray.800"
              p={8}
              borderRadius="lg"
            >
              <Text fontSize="xl" color="gray.500" fontWeight="bold">
                Belum ada pesanan yang dibuat.
              </Text>
            </Box>
          )}

          {pageCount > 1 && (
            <Box mt={6} display="flex" justifyContent="center">
              <ReactPaginate
                forcePage={currentPage}
                pageCount={pageCount}
                onPageChange={handlePageChange}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                previousLabel="Previous"
                nextLabel="Next"
                breakLabel="..."
                containerClassName="pagination"
                activeClassName="page-item-active"
                disabledClassName="disabled"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AdminPesananPage;
