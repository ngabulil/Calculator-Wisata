import { Box, Button, Flex, Input, useToast, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";

import SearchBar from "../../components/searchBar";
import { useAdminDestinationContext } from "../../context/Admin/AdminDestinationContext";
import { useNavigate } from "react-router-dom";
import { apiDeleteDestination } from "../../services/destinationService";
import DestinationCard from "../../components/Admin/Destination/DestinationCard/DestinationCard";
import toastConfig from "../../utils/toastConfig";
import DestinationFormPage from "../../components/Admin/Destination/DestinationForm/DestinationForm";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 7;
const AdminDestinationPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formActive, setFormActive] = useState(false);
  const { getAllDestination, allDestination, updateDestinationData } =
    useAdminDestinationContext();

  // handle pagination
  const [destination, setDestination] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [recentDestination, setRecentDestination] = useState([]);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentDestination = destination.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(destination.length / ITEMS_PER_PAGE);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleSearch = (value) => {
    if (value.toLowerCase() == "") {
      setDestination(recentDestination);
    } else {
      const villaFiltered = destination.filter((dest) => {
        const query = value.toLowerCase();
        return (
          dest.name.toLowerCase().includes(query) ||
          dest.note.toLowerCase().includes(query)
        );
      });
      setDestination(villaFiltered);
    }
  };

  //

  const handleGetAllDestination = async () => {
    await getAllDestination();
  };

  const handleDeleteDestination = async (id) => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    try {
      const res = await apiDeleteDestination(id);

      if (res.status == 200) {
        toast.close(loading);
        toast(
          toastConfig("Hapus Sukses", "Destinasi Berhasil Dihapus", "success")
        );
        handleGetAllDestination();
      } else {
        toast.close(loading);
        toast(toastConfig("Hapus Gagal", "Destinasi Gagal Dihapus", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(toastConfig("Hapus Gagal", "Destinasi Gagal Dihapus", "error"));
    }
  };

  useEffect(() => {
    handleGetAllDestination();
  }, []);

  useEffect(() => {
    setDestination(allDestination);
    setRecentDestination(allDestination);
  }, [allDestination]);

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
              placeholder="Search Destinasi"
              value={""}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          )}
          <Button
            bg={"blue.500"}
            onClick={() => {
              if (formActive) {
                updateDestinationData(null);
                navigate("/admin/destination");
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
          <DestinationFormPage
            onChange={() => {
              setFormActive(false);
              handleGetAllDestination();
            }}
          />
        ) : (
          <Flex direction={"row"} w={"full"} gap={"25px"} wrap={"wrap"}>
            {currentDestination.length > 0 ? (
              currentDestination.map((destination, index) => {
                return (
                  <DestinationCard
                    key={index}
                    name={destination.name}
                    note={destination.note}
                    destination={destination}
                    onDeleteButton={() => {
                      handleDeleteDestination(destination.id);
                      handleGetAllDestination();
                    }}
                    onEditButton={() => {
                      updateDestinationData(destination);

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
                  Destinasi Tidak Ditemukan
                </Text>
              </Box>
            )}
          </Flex>
        )}
      </Flex>

      {/* Pagination */}
      {currentDestination.length > 0 && !formActive && (
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
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            containerClassName="flex items-center justify-center !gap-[15px] p-2 mt-4 list-none "
          />
        </Box>
      )}
    </Box>
  );
};

export default AdminDestinationPage;
