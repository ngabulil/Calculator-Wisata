import {
  Box,
  Text,
  Flex,
  Button,
  Container,
  Textarea,
  Input,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import VillaCard from "../../components/Admin/Villa/VillaCard/VillaCard";
import VillaForm from "../../components/Admin/Villa/VillaForm/VillaForm";
import villasJson from "../../data/villas.json";
import { useAdminVillaContext } from "../../context/Admin/AdminVillaContext";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 6;

const AdminVillaPage = () => {
  const [formActive, setFormActive] = useState(false);
  const { updateVillaData } = useAdminVillaContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [villas, setVillas] = useState([]);
  const [recentVillas, setRecentVillas] = useState([]);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleGetVillas = () => {
    setVillas(villasJson);
    setRecentVillas(villasJson);
  };

  const filteredVillas = (value) => {
    if (value.toLowerCase() == "") {
      setVillas(recentVillas);
    } else {
      const villaFiltered = villas.filter((villa) => {
        const query = value.toLowerCase();
        return (
          villa.villaName.toLowerCase().includes(query) ||
          villa.roomType.toLowerCase().includes(query)
        );
      });
      setVillas(villaFiltered);
    }
  };

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentVillas = villas.slice(offset, offset + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(filteredVillas.length / ITEMS_PER_PAGE);

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
            <Box display={"flex"} gap={2}>
              <Input
                placeholder="Search Villa"
                onChange={(e) => {
                  filteredVillas(e.target.value);
                }}
              />
            </Box>
          )}
          <Button
            bg={"blue.500"}
            onClick={() => {
              setFormActive(!formActive);
              if (formActive) {
                updateVillaData(null);
                navigate("/admin/packages/villa");
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
          <VillaForm />
        ) : (
          <Flex direction={"row"} gap={"25px"} wrap={"wrap"}>
            {currentVillas.map((villa, index) => (
              <VillaCard
                key={index}
                photoLink={`https://picsum.photos/1${index + 10}/300`}
                name={villa.villaName}
                stars={villa.stars}
                honeymoonPackage={villa.honeymoonPackage}
                seasons={villa.seasons}
                roomType={villa.roomType}
                contractUntil={villa.contractUntil}
                onEditButton={() => {
                  updateVillaData(villa);
                  setFormActive(true);
                }}
              />
            ))}
          </Flex>
        )}

        {!formActive && (
          <Box mt={6} display="flex" justifyContent="center">
            <ReactPaginate
              pageCount={pageCount}
              onPageChange={handlePageChange}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              previousLabel="<"
              nextLabel=">"
              breakLabel="..."
              containerClassName="flex items-center justify-center !gap-[15px] p-2 mt-4 list-none"
            />
          </Box>
        )}
      </Flex>
    </Container>
  );
};

export default AdminVillaPage;
