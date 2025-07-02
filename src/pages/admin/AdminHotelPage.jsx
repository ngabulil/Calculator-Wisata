import { Box, Text, Flex, Button, Container, Input } from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useState } from "react";
import HotelCard from "../../components/Admin/Hotel/HotelCard/HotelCard";
import HotelForm from "../../components/Admin/Hotel/HotelForm/HotelForm";
import hotels from "../../data/hotels.json";
import { useAdminHotelContext } from "../../context/Admin/AdminHotelContext";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 8;

const AdminHotelPage = () => {
  const [formActive, setFormActive] = useState(false);
  const { updateHotelData } = useAdminHotelContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentHotels = hotels.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(hotels.length / ITEMS_PER_PAGE);

  return (
    <Container maxW="container.xl" p={0} borderRadius="lg">
      <Flex direction={"column"} gap="12px">
        <Flex
          direction={"row"}
          justifyContent={formActive ? "flex-end" : "space-between"}
          w="full"
          gap={2}
        >
          {!formActive && (
            <Box display={"flex"} gap={2}>
              <Input
                placeholder="Search Hotel"
                value={""}
                onChange={(e) => {
                  console.log(e.target.value);
                }}
              />
              <Button bg={"gray.700"} onClick={() => {}}>
                Search
              </Button>
            </Box>
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
                  photoLink={`https://picsum.photos/id/2${index}/200/300`}
                  name={hotel.hotelName}
                  stars={hotel.stars}
                  seasons={hotel.seasons}
                  roomType={hotel.roomType}
                  contractUntil={hotel.contractUntil}
                  onEditButton={() => {
                    updateHotelData(hotel);
                    setFormActive(true);
                  }}
                />
              ))}
            </Flex>

            {/* Pagination */}
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
                containerClassName="flex items-center justify-center !gap-[10px] p-2 mt-4 list-none "
              />
            </Box>
          </>
        )}
      </Flex>
    </Container>
  );
};

export default AdminHotelPage;
