import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import OrderCard from '../../components/Admin/Pesanan/PesananCard';
import { apiGetPesanan } from '../../services/pesanan';
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 12;

const AdminPesananPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const toast = useToast();

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  useEffect(() => {
    const getOrders = async () => {
      setIsLoading(true);
      try {
        const data = await apiGetPesanan();
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (data && Array.isArray(data.result)) {
          setOrders(data.result);
        } else if (data && data.data && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          console.warn('Format data tidak sesuai:', data);
          setOrders([]);
        }
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

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentOrders = orders.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(orders.length / ITEMS_PER_PAGE);

  return (
    <Box maxW="6xl" mx="auto" p={6}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">Daftar Pesanan</Heading>
      </Flex>

      {isLoading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" color="teal.500" />
          <Text ml={4}>Memuat pesanan...</Text>
        </Flex>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {currentOrders.length > 0 ? (
              currentOrders.map(order => (
                <OrderCard
                  key={order.id}
                  pesanan={order}
                />
              ))
            ) : (
              <Box textAlign="center" py={8}>
                <Text fontSize="lg" color="gray.500">
                  Belum ada pesanan yang dibuat.
                </Text>
              </Box>
            )}
          </SimpleGrid>

          {/* Pagination */}
          {orders.length > ITEMS_PER_PAGE && (
            <Box mt={6} display="flex" justifyContent="center">
              <ReactPaginate
                pageCount={pageCount}
                onPageChange={handlePageChange}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                previousLabel="<"
                nextLabel=">"
                breakLabel="..."
                containerClassName="flex items-center justify-center !gap-[12px] list-none"
                activeClassName="text-blue-500 font-bold"
                previousClassName="text-gray-500"
                nextClassName="text-gray-500"
                disabledClassName="opacity-50"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AdminPesananPage;
