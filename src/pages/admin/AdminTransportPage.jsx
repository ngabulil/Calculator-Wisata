import {
  Box,
  Button,
  Flex,
  Input,
  useToast,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import TransportCard from "../../components/Admin/Transport/TransportCard/TransportCard";
import TransportForm from "../../components/Admin/Transport/TransportForm/TransportForm";
import SearchBar from "../../components/searchBar";
import { useAdminTransportContext } from "../../context/Admin/AdminTransportContext";
import { useNavigate } from "react-router-dom";
import { apiDeleteMobilFull } from "../../services/transport";
import toastConfig from "../../utils/toastConfig";
import ReactPaginate from "react-paginate";
import colorPallete from "../../utils/colorPallete";
import SkeletonList from "../../components/Admin/SkeletonList";
const ITEMS_PER_PAGE = 7;

const AdminTransportPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formActive, setFormActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transDraft, setTransDraft] = useState({});
  const {
    getAllTransport,
    allTransport,
    updateTransportData,
    setTransportDraft,
  } = useAdminTransportContext();

  // handle pagination
  const [transports, setTransports] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [recentTransports, setRecentTransports] = useState([]);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentTransports = transports.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(transports.length / ITEMS_PER_PAGE);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleSearch = (value) => {
    if (value.toLowerCase() == "") {
      setTransports(recentTransports);
    } else {
      const villaFiltered = transports.filter((trans) => {
        const query = value.toLowerCase();
        return (
          trans.jenisKendaraan.toLowerCase().includes(query) ||
          trans.vendor.toLowerCase().includes(query)
        );
      });
      setTransports(villaFiltered);
    }
  };

  //

  const handleGetAllTransport = async () => {
    setLoading(true);
    try {
      await getAllTransport();
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransport = async (id) => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    try {
      const res = await apiDeleteMobilFull(id);

      if (res.status == 200) {
        toast.close(loading);
        toast(
          toastConfig(
            "Hapus Sukses",
            "Transportasi Berhasil Dihapus",
            "success"
          )
        );
        handleGetAllTransport();
      } else {
        toast.close(loading);
        toast(
          toastConfig("Hapus Gagal", "Transportasi Gagal Dihapus", "error")
        );
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(toastConfig("Hapus Gagal", "Transportasi Gagal Dihapus", "error"));
    }
  };

  useEffect(() => {
    handleGetAllTransport();
  }, []);

  useEffect(() => {
    setTransports(allTransport);
    setRecentTransports(allTransport);
  }, [allTransport]);

  return (
    <Box>
      <Flex direction={"column"} gap={4}>
        <Flex
          direction={"row"}
          justifyContent={formActive ? "flex-end" : "space-between"}
          w="full"
          gap={2}
        >
          {!formActive && (
            <SearchBar
              placeholder="Search Transport"
              value={""}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          )}
          <Button
            bg={"teal.600"}
            onClick={() => {
              if (formActive) {
                updateTransportData(null);
                navigate("/admin/transport");
                setTransportDraft(transDraft);
              }
              setFormActive(!formActive);
            }}
          >
            {formActive ? (
              <ChevronLeftIcon fontSize={"25px"} pr={"5px"} />
            ) : (
              <AddIcon pr={"5px"} />
            )}{" "}
            {formActive ? "Back" : "Create"}
          </Button>
        </Flex>
        {formActive ? (
          <TransportForm
            onChange={() => {
              setFormActive(false);
              handleGetAllTransport();
              setTransportDraft({});
            }}
            onDraft={(data) => setTransDraft(data)}
          />
        ) : (
          <Flex direction={"row"} w={"full"} gap={"25px"} wrap={"wrap"}>
            {loading ? (
              <SkeletonList />
            ) : currentTransports.length > 0 ? (
              currentTransports.map((transport, index) => {
                return (
                  <TransportCard
                    bgIcon={colorPallete[index % colorPallete.length]}
                    key={index}
                    jenisKendaraan={transport.jenisKendaraan}
                    vendor={transport.vendor}
                    keterangan={transport.keterangan}
                    vendorLink={transport.vendor_link}
                    onDeleteButton={() => {
                      handleDeleteTransport(transport.id);
                      handleGetAllTransport();
                    }}
                    onEditButton={() => {
                      updateTransportData(transport);

                      setFormActive(true);
                    }}
                  />
                );
              })
            ) : (
              <Box
                w="full"
                textAlign="center"
                bg={"gray.800"}
                p={5}
                rounded={2}
              >
                <Text fontSize="xl" color="gray.500" fontWeight={"bold"}>
                  Transportasi Tidak Ditemukan
                </Text>
              </Box>
            )}
          </Flex>
        )}
      </Flex>

      {/* Pagination */}
      {currentTransports.length > 0 && !formActive && (
        <Box
          mt={6}
          display="flex"
          flexDirection={"row"}
          justifyContent="center"
        >
          <ReactPaginate
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
    </Box>
  );
};

export default AdminTransportPage;
