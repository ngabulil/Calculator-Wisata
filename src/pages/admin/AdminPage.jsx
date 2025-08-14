import {
  Box,
  Text,
  Flex,
  Button,
  Container,
  useToast,
  IconButton,
  theme,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState, useMemo } from "react";
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
import colorPallete from "../../utils/colorPallete";
import SkeletonList from "../../components/Admin/SkeletonList";
import { motion, AnimatePresence } from "framer-motion";
import PackageFilterBar from "../../components/Admin/packages/FilterPakcage";
import { useAdminAuthContext } from "../../context/AuthContext";
import { Icon } from "@iconify/react";

const ITEMS_PER_PAGE = 4;

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

  const currentPackages = useMemo(() => {
    const offset = currentPage * ITEMS_PER_PAGE;
    return packages.slice(offset, offset + ITEMS_PER_PAGE);
  }, [currentPage, packages]);
  const pageCount = Math.ceil(packages.length / ITEMS_PER_PAGE);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleSearch = (value) => {
    const query = value.toLowerCase().trim();

    if (query === "") {
      setPackages(recentPackages);
    } else {
      const filtered = recentPackages
        .map((adminData) => {
          const matchedPackages = adminData.packages.filter((pkg) => {
            return (
              pkg.name.toLowerCase().includes(query) ||
              pkg.description.toLowerCase().includes(query) ||
              pkg.creator?.name?.toLowerCase().includes(query) ||
              pkg.creator?.username?.toLowerCase().includes(query) ||
              pkg.updater?.name?.toLowerCase().includes(query) ||
              pkg.updater?.username?.toLowerCase().includes(query)
            );
          });

          if (matchedPackages.length > 0) {
            return { ...adminData, packages: matchedPackages };
          }
          return null;
        })
        .filter(Boolean);

      setPackages(filtered);
    }
  };

  //

  const handleGetAllPackageFull = async () => {
    setLoading(true);
    try {
      const res = await getAllPackageFull();

      const adminMap = new Map();

      res.forEach((pkg) => {
        // kalau creator null → pakai fallback
        const creator = pkg?.creator || {
          id: "unknown",
          username: "unknown",
          name: "Unknown Admin",
        };

        if (!adminMap.has(creator.id)) {
          adminMap.set(creator.id, {
            admin: creator,
            packages: [],
          });
        }

        adminMap.get(creator.id).packages.push(pkg);
      });

      const groupedData = Array.from(adminMap.values());

      setPackages(groupedData);
      setRecentPackages(groupedData);
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

  const handleFilterChange = ({ selectedAdmins, sortOrder }) => {
    let filtered = recentPackages;

    // filter admin
    if (selectedAdmins.length > 0) {
      filtered = filtered.filter((group) =>
        selectedAdmins.includes(group.admin.id)
      );
    }

    // sort
    filtered.forEach((group) => {
      group.packages.sort((a, b) => {
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
      });
    });

    setPackages(filtered);
  };

  const handleDraftPackage = (data) => {
    updatePackageDraft(data);
  };

  useEffect(() => {
    handleGetAllPackageFull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <Flex gap={"10px"} w={"full"}>
              <SearchBar
                w="30%"
                placeholder="Search Packages"
                value={""}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
              <PackageFilterBar
                admins={recentPackages.map((g) => g.admin)}
                onFilterChange={handleFilterChange}
              />
            </Flex>
          )}
          <Button
            bg={"teal.600"}
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
            <Flex direction={"row"} gap={"20px"} wrap={"wrap"} w={"full"}>
              {loading ? (
                <SkeletonList />
              ) : currentPackages.length > 0 ? (
                <Flex direction="column" w="full" gap={6}>
                  {currentPackages.map((data, indexColor) => (
                    <AdminPackageTree
                      key={data.admin.id}
                      data={data}
                      color={colorPallete[indexColor % colorPallete.length]}
                      onPackageActions={{
                        handleDuplicate: handleCreatePackage,
                        handleOpen: (pkg) => {
                          setReadPackageActive(true);
                          updatePackageFull(pkg);
                        },
                        handleDelete: handleDeletePackageFull,
                        handleEdit: (pkg) => {
                          setFormActive(true);
                          updateHeadline(pkg.name, pkg.description);
                          updatePackageFull(pkg);
                        },
                      }}
                    />
                  ))}
                </Flex>
              ) : (
                <Box
                  w="full"
                  textAlign="center"
                  bg="gray.800"
                  p={5}
                  rounded={2}
                >
                  <Text fontSize="xl" color="gray.500" fontWeight="bold">
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

const MotionFlex = motion(Flex);

const resolveColor = (chakraColor) => {
  const [base, shade] = chakraColor.split(".");
  return theme.colors[base]?.[shade] || chakraColor;
};

const AdminPackageTree = ({ data, color, onPackageActions }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const { userData } = useAdminAuthContext();
  const resolvedColor = resolveColor(color);
  const pageCount = Math.ceil(data.packages.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPackages = data.packages.slice(offset, offset + itemsPerPage);

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

      {/* List paket dengan animasi */}
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
            style={{ "--package-color": resolvedColor }} // biar CSS pagination bisa pakai
          >
            {currentPackages.map((packageItem, index) => (
              <Flex w="98%" key={packageItem.id}>
                {/* Garis tree */}
                <Flex
                  w="50px"
                  position="relative"
                  alignItems="start"
                  justifyContent="start"
                >
                  <Box
                    h={currentPackages.length - 1 === index ? "50%" : "full"}
                    w="3px"
                    bg={resolvedColor}
                  ></Box>

                  <Box
                    w="full"
                    alignSelf="center"
                    position="absolute"
                    display="flex"
                  >
                    <Box
                      h="3px"
                      w="full"
                      bg={resolvedColor}
                      alignSelf="center"
                      position="absolute"
                    ></Box>
                    <Box
                      bg={resolvedColor}
                      borderRadius="full"
                      w="10px"
                      h="10px"
                      right="4px"
                      position="relative"
                    ></Box>
                  </Box>
                </Flex>

                {/* Card paket */}
                <PackageCard
                  flexGrow={0}
                  isOwner={userData?.id === packageItem.creator?.id}
                  bgIcon={resolvedColor}
                  title={packageItem.name}
                  description={packageItem.description}
                  days={packageItem.days}
                  date={packageItem.updatedAt}
                  updater={
                    packageItem.updater?.name ||
                    packageItem.creator?.name ||
                    "Unknown Admin"
                  }
                  onDuplicateButton={() =>
                    onPackageActions.handleDuplicate(packageItem)
                  }
                  onOpenButton={() => onPackageActions.handleOpen(packageItem)}
                  onDeleteButton={() =>
                    onPackageActions.handleDelete(packageItem.id)
                  }
                  onEditButton={() => onPackageActions.handleEdit(packageItem)}
                />
              </Flex>
            ))}

            {/* Pagination */}
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

export default AdminPage;
