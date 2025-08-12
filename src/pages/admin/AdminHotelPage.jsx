import { Box, Text, Flex, Button, Container, Spinner } from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import HotelCard from "../../components/Admin/Hotel/HotelCard/HotelCard";
import HotelForm from "../../components/Admin/Hotel/HotelForm/HotelForm";

import { useAdminHotelContext } from "../../context/Admin/AdminHotelContext";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBar from "../../components/searchBar";
import { useToast } from "@chakra-ui/react";
import toastConfig from "../../utils/toastConfig";
import { apiDeleteHotel } from "../../services/hotelService";
import HotelRead from "../../components/Admin/Hotel/HotelRead/HotelRead";
import SkeleteonGridList from "../../components/Admin/SkeletonGridList";

const ITEMS_PER_PAGE = 8;

const AdminHotelPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { updateHotelData, getAllHotel } = useAdminHotelContext();
  //
  const [loading, setLoading] = useState(false);
  const [readHotelActive, setReadHotelActive] = useState(false);
  const [formActive, setFormActive] = useState(false);
  //
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [recentHotels, setRecentHotels] = useState([]);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleGetHotels = async () => {
    setLoading(true);
    try {
      await getAllHotel().then((value) => {
        if (value.length != 0) {
          setHotels(value);
          setRecentHotels(value);
        }
      });
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchHotels = (value) => {
    if (value.toLowerCase() == "") {
      setHotels(recentHotels);
    } else {
      const villaFiltered = hotels.filter((hotel) => {
        const query = value.toLowerCase();
        return hotel.hotelName.toLowerCase().includes(query);
      });
      setHotels(villaFiltered);
    }
  };

  const handleDeleteHotel = async (id) => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    try {
      const res = await apiDeleteHotel(id);

      if (res.status == 200) {
        toast.close(loading);
        toast(toastConfig("Hapus Sukses", "Hotel Berhasil Dihapus", "success"));
        handleGetHotels();
      } else {
        toast.close(loading);
        toast(toastConfig("Hapus Gagal", "Hotel Gagal Dihapus", "error"));
      }
    } catch (error) {
      toast.close(loading);
      console.log(error);
      toast(toastConfig("Hapus Gagal", "Hotel Gagal Dihapus", "error"));
    }
  };

  useEffect(() => {
    handleGetHotels();
  }, []);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentHotels = hotels.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(hotels.length / ITEMS_PER_PAGE);

  return (
    <Container maxW="container.xl" p={0} pb={10} borderRadius="lg">
      <Flex direction={"column"} gap="12px">
        <Flex
          direction={"row"}
          justifyContent={formActive ? "flex-end" : "space-between"}
          w="full"
          gap={2}
        >
          {!formActive && (
            <SearchBar
              placeholder="Search Hotel"
              onChange={(e) => {
                handleSearchHotels(e.target.value);
              }}
            />
          )}
          <Button
            bg={"teal.600"}
            onClick={() => {
              if (formActive) {
                updateHotelData(null);
                navigate("/admin/hotel");
                handleGetHotels();
              }

              if (readHotelActive) {
                setReadHotelActive(false);
              } else {
                setFormActive(!formActive);
              }
            }}
          >
            {formActive || readHotelActive ? (
              <ChevronLeftIcon fontSize={"25px"} pr={"5px"} />
            ) : (
              <AddIcon pr={"5px"} />
            )}{" "}
            {formActive || readHotelActive ? "Back" : "Create"}
          </Button>
        </Flex>

        {formActive ? (
          <HotelForm />
        ) : readHotelActive ? (
          <HotelRead />
        ) : (
          <>
            <Flex direction={"row"} gap={"25px"} wrap={"wrap"} w={"full"}>
              {loading ? (
                <SkeleteonGridList />
              ) : currentHotels.length > 0 ? (
                currentHotels.map((hotel, index) => (
                  <HotelCard
                    key={index}
                    flexGrow={currentHotels.length % 4 != 0 ? 0 : 1}
                    photoLink={hotel.photoLink}
                    name={hotel.hotelName}
                    stars={hotel.stars}
                    seasons={hotel.seasons}
                    roomType={hotel.roomType}
                    extraBed={hotel.extrabed}
                    contractUntil={hotel.contractUntil}
                    onEditButton={() => {
                      updateHotelData(hotel);
                      setFormActive(true);
                    }}
                    onDeleteButton={() => {
                      handleDeleteHotel(hotel.id);
                      handleGetHotels();
                    }}
                    onOpenButton={() => {
                      updateHotelData(hotel);
                      setReadHotelActive(true);
                    }}
                  />
                ))
              ) : (
                <Box
                  w="full"
                  textAlign="center"
                  bg={"gray.800"}
                  p={5}
                  rounded={2}
                >
                  <Text fontSize="xl" color="gray.500" fontWeight={"bold"}>
                    Hotel Tidak Ditemukan
                  </Text>
                </Box>
              )}
            </Flex>

            {/* Pagination */}
            {currentHotels.length != 0 && !formActive && !readHotelActive && (
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
          </>
        )}
      </Flex>
    </Container>
  );
};

export default AdminHotelPage;
