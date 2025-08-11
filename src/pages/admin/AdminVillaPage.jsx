import {
  Box,
  Text,
  Flex,
  Button,
  Container,
  Textarea,
  Spinner,
  Input,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import VillaCard from "../../components/Admin/Villa/VillaCard/VillaCard";
import VillaForm from "../../components/Admin/Villa/VillaForm/VillaForm";

import { useAdminVillaContext } from "../../context/Admin/AdminVillaContext";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBar from "../../components/searchBar";
import { apiDeleteVilla } from "../../services/villaService";
import toastConfig from "../../utils/toastConfig";
import { useToast } from "@chakra-ui/react";
import VillaRead from "../../components/Admin/Villa/VillaRead/VillaRead";
import SkeleteonGridList from "../../components/Admin/SkeletonGridList";

const ITEMS_PER_PAGE = 8;

const AdminVillaPage = () => {
  const toast = useToast();
  const { updateVillaData, getAllVilla } = useAdminVillaContext();
  const navigate = useNavigate();
  const [readVillaActive, setReadVillaActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [villas, setVillas] = useState([]);
  const [recentVillas, setRecentVillas] = useState([]);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleGetVillas = async () => {
    setLoading(true);
    try {
      await getAllVilla().then((value) => {
        if (value.length != 0) {
          setVillas(value);
          setRecentVillas(value);
        }
      });
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVillaSearch = (value) => {
    if (value.toLowerCase() == "") {
      setVillas(recentVillas);
    } else {
      const villaFiltered = villas.filter((villa) => {
        const query = value.toLowerCase();
        return villa.villaName.toLowerCase().includes(query);
      });
      setVillas(villaFiltered);
    }
  };

  const handleDeleteVilla = async (id) => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    try {
      const res = await apiDeleteVilla(id);

      if (res.status == 200) {
        toast.close(loading);
        toast(toastConfig("Hapus Sukses", "Villa Berhasil Dihapus", "success"));
        handleGetVillas();
      } else {
        toast.close(loading);
        toast(toastConfig("Hapus Gagal", "Villa Gagal Dihapus", "error"));
      }
    } catch (error) {
      toast.close(loading);
      console.log(error);
      toast(toastConfig("Hapus Gagal", "Villa Gagal Dihapus", "error"));
    }
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentVillas = villas.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(villas.length / ITEMS_PER_PAGE);

  useEffect(() => {
    handleGetVillas();
  }, []);

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
            <SearchBar
              placeholder="Search Villa"
              onChange={(e) => {
                handleVillaSearch(e.target.value);
              }}
            />
          )}
          <Button
            bg={"teal.600"}
            onClick={() => {
              if (formActive) {
                updateVillaData(null);
                navigate("/admin/villa");
                handleGetVillas();
              }
              if (readVillaActive) {
                setReadVillaActive(false);
              } else {
                setFormActive(!formActive);
              }
            }}
          >
            {formActive || readVillaActive ? (
              <ChevronLeftIcon fontSize={"25px"} pr={"5px"} />
            ) : (
              <AddIcon pr={"5px"} />
            )}{" "}
            {formActive || readVillaActive ? "Back" : "Create"}
          </Button>
        </Flex>

        {formActive ? (
          <VillaForm />
        ) : readVillaActive ? (
          <VillaRead />
        ) : (
          <Flex direction={"row"} gap={"25px"} wrap={"wrap"} w={"full"}>
            {loading ? (
              <SkeleteonGridList />
            ) : currentVillas.length > 0 ? (
              currentVillas.map((villa, index) => (
                <VillaCard
                  key={index}
                  flexGrow={currentVillas % 4 != 0 ? 0 : 1}
                  photoLink={villa.photoLink}
                  name={villa.villaName}
                  stars={villa.stars}
                  honeymoonPackage={villa.honeymoonPackage}
                  extraBed={villa.extrabed}
                  seasons={villa.seasons}
                  roomType={villa.roomType}
                  contractUntil={villa.contractUntil}
                  onEditButton={() => {
                    updateVillaData(villa);
                    setFormActive(true);
                  }}
                  onDeleteButton={() => {
                    handleDeleteVilla(villa.id);
                    handleGetVillas();
                  }}
                  onOpenButton={() => {
                    updateVillaData(villa);
                    setReadVillaActive(true);
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
                  Villa Tidak Ditemukan
                </Text>
              </Box>
            )}
          </Flex>
        )}

        {currentVillas.length > 0 && !formActive && !readVillaActive && (
          <Box mt={6} display="flex" justifyContent="center">
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
      </Flex>
    </Container>
  );
};

export default AdminVillaPage;
