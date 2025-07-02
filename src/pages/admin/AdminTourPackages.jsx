import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import TourPackagesForm from "../../components/Admin/tourPackages/TourPackagesForm/TourPackagesForm";
import TourPackagesCard from "../../components/Admin/TourPackages/TourPackagesCard/TourPackagesCard";

const AdminTourPackagesPage = () => {
  const [formActive, setFormActive] = useState(false);
  return (
    <Box>
      <Flex direction={"column"} gap={4}>
        <Flex direction={"row"} w={"full"} justifyContent={"flex-end"} gap={2}>
          <Button bg={"blue.500"} onClick={() => setFormActive(!formActive)}>
            <AddIcon pr={"5px"} /> {formActive ? "Back" : "Create"}
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
