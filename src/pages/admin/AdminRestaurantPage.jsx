import {
  Box,
  Text,
  Flex,
  Button,
  Container,
  Textarea,
  Input,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import PackageFormPage from "../../components/Admin/packages/PackagesForm/PackageForm";
import RestaurantCard from "../../components/Admin/Restaurant/RestaurantCard/RestaurantCard";
import SearchBar from "../../components/searchBar";
import { useAdminRestaurantContext } from "../../context/Admin/AdminRestaurantContext";
import toastConfig from "../../utils/toastConfig";
import { apiDeleteRestaurant } from "../../services/restaurantService";
import { useNavigate } from "react-router-dom";
import RestaurantFormPage from "../../components/Admin/Restaurant/RestaurantForm/RestaurantForm";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 7;

const AdminRestaurantPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formActive, setFormActive] = useState(false);
  const { getAllRestaurant, updateRestaurantData, allRestaurant } =
    useAdminRestaurantContext();

  // handle pagination
  const [restaurant, setRestaurant] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [recentRestaurant, setRecentRestaurant] = useState([]);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentRestaurant = restaurant.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(restaurant.length / ITEMS_PER_PAGE);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleSearch = (value) => {
    if (value.toLowerCase() == "") {
      setRestaurant(recentRestaurant);
    } else {
      const villaFiltered = restaurant.filter((rest) => {
        const query = value.toLowerCase();
        return rest.resto_name.toLowerCase().includes(query);
      });
      setRestaurant(villaFiltered);
    }
  };

  const handleGetAllRestaurant = async () => {
    await getAllRestaurant();
  };

  const handleDeleteRestaurant = async (id) => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    try {
      const res = await apiDeleteRestaurant(id);

      if (res.status === 200) {
        toast.close(loading);
        toast(
          toastConfig(
            "Sukses Hapus",
            "Berhasil Menghapus Restaurant ",
            "success"
          )
        );
        handleGetAllRestaurant();
      } else {
        toast.close(loading);
        toast(
          toastConfig("Gagal Hapus", "Gagal Menghapus Restaurant", "error")
        );
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(toastConfig("Gagal Hapus", "Gagal Menghapus Restaurant", "error"));
    }
  };

  useEffect(() => {
    handleGetAllRestaurant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRestaurant(allRestaurant);
    setRecentRestaurant(allRestaurant);
  }, [allRestaurant]);

  return (
    <Container maxW="container.xl" p={0} borderRadius="lg">
      <Flex direction={"column"} gap="50px">
        <Flex
          direction={"row"}
          justifyContent={formActive ? "flex-end" : "space-between"}
          w="full"
          gap={2}
        >
          {!formActive && (
            <SearchBar
              placeholder="Search Restaurant"
              value={""}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          )}
          <Button
            bg={"blue.500"}
            onClick={() => {
              setFormActive(!formActive);

              if (formActive) {
                updateRestaurantData([]);
                navigate("/admin/restaurant");
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
          <RestaurantFormPage
            onChange={() => {
              setFormActive(false);
              handleGetAllRestaurant();
            }}
          />
        ) : (
          <Flex gap={6}>
            <Flex direction={"row"} gap={"25px"} wrap={"wrap"} w={"full"}>
              {currentRestaurant.length > 0 ? (
                currentRestaurant.map((resto, index) => {
                  return (
                    <RestaurantCard
                      key={index}
                      id={resto.id}
                      name={resto.resto_name}
                      packages={resto.packages}
                      onEditButton={() => {
                        updateRestaurantData(resto);
                        setFormActive(true);
                      }}
                      onDeleteButton={() => {
                        handleDeleteRestaurant(resto.id);
                        handleGetAllRestaurant();
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
                    Restaurant Tidak Ditemukan
                  </Text>
                </Box>
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
      {/* Pagination */}
      {currentRestaurant.length > 0 && !formActive && (
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
    </Container>
  );
};

export default AdminRestaurantPage;
