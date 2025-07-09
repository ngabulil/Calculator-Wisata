import { Box, Button, Flex, Input, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";

import SearchBar from "../../components/searchBar";
import { useAdminDestinationContext } from "../../context/Admin/AdminDestinationContext";
import { useNavigate } from "react-router-dom";
import { apiDeleteDestination } from "../../services/destinationService";
import DestinationCard from "../../components/Admin/Destination/DestinationCard/DestinationCard";
import toastConfig from "../../utils/toastConfig";
import DestinationFormPage from "../../components/Admin/Destination/DestinationForm/DestinationForm";

const AdminDestinationPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formActive, setFormActive] = useState(false);
  const { getAllDestination, allDestination, updateDestinationData } =
    useAdminDestinationContext();

  const handleGetAllDestination = async () => {
    await getAllDestination();
  };

  const handleDeleteDestination = async (id) => {
    try {
      const res = await apiDeleteDestination(id);

      if (res.status == 200) {
        toast(
          toastConfig("Hapus Sukses", "Destinasi Berhasil Dihapus", "success")
        );
        handleGetAllDestination();
      } else {
        toast(toastConfig("Hapus Gagal", "Destinasi Gagal Dihapus", "error"));
      }
    } catch (error) {
      console.log(error);
      toast(toastConfig("Hapus Gagal", "Destinasi Gagal Dihapus", "error"));
    }
  };

  useEffect(() => {
    handleGetAllDestination();
  }, []);

  return (
    <Box>
      <Flex direction={"column"} gap={4}>
        <Flex
          direction={"row"}
          justifyContent={formActive ? "flex-end" : "space-between"}
          w="full"
          gap={2}
        >
          {!formActive && (
            <SearchBar
              placeholder="Search Destinasi"
              value={""}
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />
          )}
          <Button
            bg={"blue.500"}
            onClick={() => {
              if (formActive) {
                updateDestinationData(null);
                navigate("/admin/destination");
              }
              setFormActive(!formActive);
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
          <DestinationFormPage />
        ) : (
          <Flex direction={"row"} w={"full"} gap={"25px"} wrap={"wrap"}>
            {allDestination.length > 0 &&
              allDestination.map((destination, index) => {
                return (
                  <DestinationCard
                    key={index}
                    name={destination.name}
                    note={destination.note}
                    destination={destination}
                    onDeleteButton={() => {
                      handleDeleteDestination(destination.id);
                      handleGetAllDestination();
                    }}
                    onEditButton={() => {
                      updateDestinationData(destination);

                      setFormActive(true);
                    }}
                  />
                );
              })}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default AdminDestinationPage;
