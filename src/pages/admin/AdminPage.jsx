import {
  Box,
  Text,
  Flex,
  Button,
  Container,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import PackageCard from "../../components/Admin/packages/PackageCard/PackageCard";
import PackageFormPage from "../../components/Admin/packages/PackagesForm/PackageForm";
import PackageRead from "../../components/Admin/packages/PackageRead/PackageRead";
import SearchBar from "../../components/searchBar";
import { useAdminPackageContext } from "../../context/Admin/AdminPackageContext";
import toastConfig from "../../utils/toastConfig";
import { apiDeletePackageFull } from "../../services/packageService";
import { useNavigate } from "react-router-dom";
import { apiPostPackageFull } from "../../services/packageService";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 8;

const AdminPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formActive, setFormActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [readPackageActive, setReadPackageActive] = useState(false);
  const [draftPaket, setDraftPaket] = useState(false);
  const {
    getAllPackageFull,
    packageFull,
    updateHeadline,
    updatePackageFull,
    updatePackageDraft,
    setDays,
  } = useAdminPackageContext();
  // handle pagination
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [recentPackages, setRecentPackages] = useState([]);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentPackages = packages.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(packages.length / ITEMS_PER_PAGE);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleSearch = (value) => {
    if (value.toLowerCase() == "") {
      setPackages(recentPackages);
    } else {
      const villaFiltered = packages.filter((pkg) => {
        const query = value.toLowerCase();
        return (
          pkg.name.toLowerCase().includes(query) ||
          pkg.description.toLowerCase().includes(query)
        );
      });
      setPackages(villaFiltered);
    }
  };

  //

  const handleGetAllPackageFull = async () => {
    setLoading(true);
    try {
      await getAllPackageFull();
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async (payload) => {
    const data = {
      ...payload,
      name: `[DUPLICATE] ${payload.name}`,
    };

    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));

    try {
      const res = await apiPostPackageFull(data);

      if (res.status == 201 || res.status == 200) {
        toast.close(loading);
        toast(
          toastConfig("Buat Berhasil", "Paket berhasil dibuat!", "success")
        );
        handleGetAllPackageFull();
      } else {
        toast.close(loading);
        toast(toastConfig("Buat Gagal", "Data tidak lengkap!", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(toastConfig("Buat Gagal", error.message, "error"));
    }
  };

  const handleDeletePackageFull = async (id) => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    try {
      const res = await apiDeletePackageFull(id);

      if (res.status === 200) {
        toast.close(loading);
        toast(
          toastConfig("Sukses Hapus", "Berhasil Menghapus paket", "success")
        );
        handleGetAllPackageFull();
      } else {
        toast.close(loading);
        toast(toastConfig("Gagal Hapus", "Gagal Menghapus paket", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(toastConfig("Gagal Hapus", "Gagal Menghapus paket", "error"));
    }
  };

  const handleDraftPackage = (data) => {
    updatePackageDraft(data);
  };

  useEffect(() => {
    handleGetAllPackageFull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPackages(packageFull);
    setRecentPackages(packageFull);
  }, [packageFull]);

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
              placeholder="Search Packages"
              value={""}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          )}
          <Button
            bg={"blue.500"}
            onClick={() => {
              // updatePackageFull("");

              if (formActive) {
                navigate("/admin/paket");
                handleGetAllPackageFull();
                handleDraftPackage(draftPaket);
              }
              if (readPackageActive) {
                setReadPackageActive(false);
              } else {
                setFormActive(!formActive);
              }
            }}
          >
            {formActive || readPackageActive ? (
              <ChevronLeftIcon fontSize={"25px"} pr={"5px"} />
            ) : (
              <AddIcon pr={"5px"} />
            )}{" "}
            {formActive || readPackageActive ? "Back" : "Create"}
          </Button>
        </Flex>
        {formActive ? (
          <PackageFormPage
            onDraft={(data) => setDraftPaket(data)}
            onChange={() => {
              navigate("/admin/paket");
              setFormActive(false);
              handleGetAllPackageFull();
              handleDraftPackage("");
              updatePackageFull("");
              setDays([
                {
                  name: "",
                  description_day: "",
                  data: {
                    akomodasi: {
                      hotels: [],
                      villas: [],
                      additional: [],
                    },
                    tours: [],
                    type_wisata: "",
                    transport: {
                      mobils: [],
                      additional: [],
                    },
                  },
                },
              ]);
            }}
          />
        ) : readPackageActive ? (
          <PackageRead />
        ) : (
          <Flex gap={6}>
            <Flex direction={"row"} gap={"25px"} wrap={"wrap"} w={"full"}>
              {loading ? (
                <Flex w={"full"} justifyContent={"center"}>
                  {" "}
                  <Spinner size="xl" color="teal.500" />
                </Flex>
              ) : currentPackages.length > 0 ? (
                currentPackages.map((packageItem, index) => {
                  return (
                    <PackageCard
                      flexGrow={currentPackages.length % 4 != 0 ? 0 : 1}
                      key={index}
                      title={packageItem.name}
                      description={packageItem.description}
                      days={packageItem.days}
                      date={packageItem.updatedAt}
                      onDuplicateButton={() => {
                        handleCreatePackage(packageItem);
                      }}
                      onOpenButton={() => {
                        setReadPackageActive(true);
                        updatePackageFull(packageItem);
                      }}
                      onDeleteButton={() =>
                        handleDeletePackageFull(packageItem.id)
                      }
                      onEditButton={() => {
                        setFormActive(true);
                        updateHeadline(
                          packageItem.name,
                          packageItem.description
                        );
                        updatePackageFull(packageItem);
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
                    Paket Tidak Ditemukan
                  </Text>
                </Box>
              )}
            </Flex>
          </Flex>
        )}
      </Flex>

      {/* Pagination */}
      {currentPackages.length > 0 && !formActive && !readPackageActive && (
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
    </Container>
  );
};

export default AdminPage;
