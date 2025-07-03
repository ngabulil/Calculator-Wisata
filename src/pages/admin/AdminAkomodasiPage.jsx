import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import AccomodationCard from "../../components/Admin/Akomodasi/AccomodationCard/AccomodationCard";
import AccomodationForm from "../../components/Admin/Akomodasi/AccomodationForm/AccomodationForm";
import SearchBar from "../../components/searchBar";

const AdminAccomodationPage = () => {
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
          <AccomodationForm />
        ) : (
          <Flex direction={"row"} w={"full"} gap={"25px"} wrap={"wrap"}>
            {Array.from({ length: 8 }).map((_, index) => {
              return <AccomodationCard key={index} />;
            })}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default AdminAccomodationPage;
