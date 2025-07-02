import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import AccomodationCard from "../../components/Admin/Akomodasi/AccomodationCard/AccomodationCard";
import AccomodationForm from "../../components/Admin/Akomodasi/AccomodationForm/AccomodationForm";

const AdminAccomodationPage = () => {
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
