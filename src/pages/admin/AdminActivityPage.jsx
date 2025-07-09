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
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar";
import toastConfig from "../../utils/toastConfig";

import { useAdminActivityContext } from "../../context/Admin/AdminActivityContext";
import { apiDeleteActivityDetails } from "../../services/activityService";
import ActivityCard from "../../components/Admin/Activity/ActivityCard/ActivityCard";
import ActivityFormPage from "../../components/Admin/Activity/ActivityForm/ActivityForm";

const AdminActivityPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formActive, setFormActive] = useState(false);
  const { getAllActivityDetails, allActivityDetails, updateActivityData } =
    useAdminActivityContext();

  const handleGetActivity = async () => {
    await getAllActivityDetails();
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

  useEffect(() => {
    handleGetActivity();
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
            <SearchBar
              placeholder="Search Packages"
              value={""}
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />
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
          <ActivityFormPage />
        ) : (
          <Flex gap={6}>
            <Flex direction={"row"} gap={"20px"} wrap={"wrap"} w={"full"}>
              {allActivityDetails.length != 0 &&
                allActivityDetails.map((act) => {
                  return (
                    <ActivityCard
                      key={act.id}
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
                })}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

export default AdminActivityPage;
