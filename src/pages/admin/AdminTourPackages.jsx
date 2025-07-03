import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import TourPackagesForm from "../../components/Admin/tourPackages/TourPackagesForm/TourPackagesForm";
import TourPackagesCard from "../../components/Admin/TourPackages/TourPackagesCard/TourPackagesCard";
import SearchBar from "../../components/searchBar";

const AdminTourPackagesPage = () => {
  const [formActive, setFormActive] = useState(false);
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
              placeholder="Search Packages"
              value={""}
              onChange={(e) => {
                console.log(e.target.value);
              }}
            />
          )}
          <Button bg={"blue.500"} onClick={() => setFormActive(!formActive)}>
            {formActive ? (
              <ChevronLeftIcon fontSize={"25px"} pr={"5px"} />
            ) : (
              <AddIcon pr={"5px"} />
            )}{" "}
            {formActive ? "Back" : "Create"}
          </Button>
        </Flex>
        {formActive ? (
          <TourPackagesForm />
        ) : (
          <Flex direction={"row"} w={"full"} gap={"25px"} wrap={"wrap"}>
            {Array.from({ length: 8 }).map((_, index) => {
              return <TourPackagesCard key={index} />;
            })}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default AdminTourPackagesPage;
