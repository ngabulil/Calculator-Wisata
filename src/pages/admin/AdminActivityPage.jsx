import {
  Box,
  Flex,
  Button,
  Container,
  Select,
  useToast,
  Text,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar";
import toastConfig from "../../utils/toastConfig";

import { useAdminActivityContext } from "../../context/Admin/AdminActivityContext";
import {
  apiDeleteActivityDetails,
  apiDeleteActivityVendors,
} from "../../services/activityService";
import ActivityCard from "../../components/Admin/Activity/ActivityCard/ActivityCard";
import ActivityFormPage from "../../components/Admin/Activity/ActivityForm/ActivityForm";
import VendorFormPage from "../../components/Admin/Activity/ActivityForm/VendorForm";
import VendorCard from "../../components/Admin/Activity/ActivityCard/VendorCard";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 7;

const AdminActivityPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState("activity");
  const [formActive, setFormActive] = useState(false);
  const {
    getAllActivityDetails,
    getAllActivityVendors,
    allActivityVendors,
    allActivityDetails,
    updateActivityData,
    updateVendorData,
  } = useAdminActivityContext();

  // handle pagination
  const [activities, setActivities] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentActivities = activities.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(activities.length / ITEMS_PER_PAGE);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleSearch = (value) => {
    if (value.toLowerCase() == "") {
      setActivities(recentActivities);
    } else {
      const villaFiltered =
        mode == "activity"
          ? activities.filter((act) => {
              const query = value.toLowerCase();
              return (
                act.name.toLowerCase().includes(query) ||
                act.note.toLowerCase().includes(query) ||
                act.keterangan.toLowerCase().includes(query)
              );
            })
          : activities.filter((act) => {
              const query = value.toLowerCase();
              return act.name.toLowerCase().includes(query);
            });
      setActivities(villaFiltered);
    }
  };
  //

  const handleGetActivity = async () => {
    await getAllActivityDetails();
  };
  const handleGetVendors = async () => {
    await getAllActivityVendors();
  };

  const handleDeleteActivity = async (id) => {
    try {
      const res = await apiDeleteActivityDetails(id);

      if (res.status === 200) {
        toast(
          toastConfig("Sukses Hapus", "Berhasil Menghapus activity", "success")
        );
        handleGetActivity();
      } else {
        toast(toastConfig("Gagal Hapus", "Gagal Menghapus activity", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast(toastConfig("Gagal Hapus", "Gagal Menghapus activity", "error"));
    }
  };
  const handleDeleteVendor = async (id) => {
    try {
      const res = await apiDeleteActivityVendors(id);

      if (res.status === 200) {
        toast(
          toastConfig("Sukses Hapus", "Berhasil Menghapus vendor", "success")
        );
        handleGetVendors();
      } else {
        toast(toastConfig("Gagal Hapus", "Gagal Menghapus vendor", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast(toastConfig("Gagal Hapus", "Gagal Menghapus vendor", "error"));
    }
  };

  useEffect(() => {
    handleGetActivity();
    handleGetVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode == "activity") {
      setActivities(allActivityDetails);
      setRecentActivities(allActivityDetails);
    } else {
      setActivities(allActivityVendors);
      setRecentActivities(allActivityVendors);
    }
  }, [allActivityDetails, allActivityVendors, mode]);

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
            <Flex direction={"row"} alignItems={"center"} w={"50%"} gap={2}>
              <SearchBar
                placeholder="Search Aktivitas"
                value={""}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
              <VendorActivityDropdown
                onChange={(v) => {
                  setMode(v);
                }}
              />
            </Flex>
          )}
          <Button
            bg={"blue.500"}
            onClick={() => {
              setFormActive(!formActive);

              if (formActive) {
                updateActivityData([]);
              }

              navigate("/admin/activity");
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
          mode == "activity" ? (
            <ActivityFormPage
              onChange={() => {
                setFormActive(false);
                handleGetActivity();
              }}
            />
          ) : (
            <VendorFormPage
              onChange={() => {
                setFormActive(false);
                handleGetVendors();
              }}
            />
          )
        ) : (
          <Flex gap={6}>
            <Flex direction={"row"} gap={"20px"} wrap={"wrap"} w={"full"}>
              {mode == "activity" ? (
                currentActivities.length != 0 ? (
                  currentActivities.map((act) => {
                    return (
                      <ActivityCard
                        key={act.id}
                        act={act}
                        name={act.name}
                        vendorName={act?.vendor?.name || "Vendor"}
                        keterangan={act.keterangan}
                        note={act.note}
                        onEditButton={() => {
                          updateActivityData(act);
                          setFormActive(true);
                        }}
                        onDeleteButton={() => {
                          handleDeleteActivity(act.id);
                          handleGetActivity();
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
                      Aktivitas Tidak Ditemukan
                    </Text>
                  </Box>
                )
              ) : currentActivities.length != 0 ? (
                currentActivities.map((ven) => {
                  return (
                    <VendorCard
                      key={ven.id}
                      name={ven.name}
                      onEditButton={() => {
                        updateVendorData(ven);
                        setFormActive(true);
                      }}
                      onDeleteButton={() => {
                        handleDeleteVendor(ven.id);
                        handleGetVendors();
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
                    Vendor Tidak Ditemukan
                  </Text>
                </Box>
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
      {/* Pagination */}
      {currentActivities.length > 0 && !formActive && (
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

const VendorActivityDropdown = (props) => {
  const [selectedOption, setSelectedOption] = useState("activity");

  return (
    <Select
      w={"max"}
      value={selectedOption}
      onChange={(e) => {
        setSelectedOption(e.target.value);
        props.onChange(e.target.value);
      }}
    >
      <option value="vendor">Vendor</option>
      <option value="activity">Aktivitas</option>
    </Select>
  );
};

export default AdminActivityPage;
