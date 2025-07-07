import { Box, Text, Flex, Button, Container, Input } from "@chakra-ui/react";
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

const ITEMS_PER_PAGE = 8;

const AdminHotelPage = () => {
  const toast = useToast();
  const [formActive, setFormActive] = useState(false);
  const { updateHotelData, getAllHotel } = useAdminHotelContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [hotels, setHotels] = useState([]);
  const [recentHotels, setRecentHotels] = useState([]);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleGetHotels = async () => {
    await getAllHotel().then((value) => {
      if (value.length != 0) {
        setHotels(value);
        setRecentHotels(value);
      }
    });
  };

  const handleSearchHotels = (value) => {
    if (value.toLowerCase() == "") {
      setHotels(recentHotels);
    } else {
      const villaFiltered = hotels.filter((hotel) => {
        const query = value.toLowerCase();
        return (
          hotel.hotelName.toLowerCase().includes(query) ||
          hotel.roomType.toLowerCase().includes(query)
        );
      });
      setHotels(villaFiltered);
    }
  };

  const handleDeleteHotel = async (id) => {
    try {
      const res = await apiDeleteHotel(id);

      console.log(res);
      if (res.status == 200) {
        toast(toastConfig("Hapus Sukses", "Hotel Berhasil Dihapus", "success"));
        handleGetHotels();
      } else {
        toast(toastConfig("Hapus Gagal", "Hotel Gagal Dihapus", "error"));
      }
    } catch (error) {
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
            bg={"blue.500"}
            onClick={() => {
              setFormActive(!formActive);
              if (formActive) {
                updateHotelData(null);
                navigate("/admin/packages/hotel");
              }
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
          <HotelForm />
        ) : (
          <>
            <Flex direction={"row"} gap={"25px"} wrap={"wrap"}>
              {currentHotels.map((hotel, index) => (
                <HotelCard
                  key={index}
                  flexGrow={currentHotels.length % 3 == 0 ? "1" : "0"}
                  photoLink={`https://picsum.photos/id/2${index}/200/300`}
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
                />
              ))}
            </Flex>

            {/* Pagination */}
            {!formActive && (
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
          </>
        )}
      </Flex>
    </Container>
  );
};

export default AdminHotelPage;
