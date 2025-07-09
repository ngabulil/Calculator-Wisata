import { Flex, Button, Container, Select, useToast } from "@chakra-ui/react";
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
                  console.log(e.target.value);
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
            <ActivityFormPage />
          ) : (
            <VendorFormPage />
          )
        ) : (
          <Flex gap={6}>
            <Flex direction={"row"} gap={"20px"} wrap={"wrap"} w={"full"}>
              {mode == "activity"
                ? allActivityDetails.length != 0 &&
                  allActivityDetails.map((act) => {
                    return (
                      <ActivityCard
                        key={act.id}
                        act={act}
                        name={act.name}
                        vendorName={act.vendor.name}
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
                : allActivityVendors.length != 0 &&
                  allActivityVendors.map((ven) => {
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
                  })}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

const VendorActivityDropdown = (props) => {
  const [selectedOption, setSelectedOption] = useState("activity");

  return (
    <Select
      w={"max"}
      placeholder="Mode"
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
