import {
  Box,
  Text,
  Flex,
  Button,
  Container,
  Textarea,
  Input,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";

const AdminAdditionalPage = () => {
  const [formActive, setFormActive] = useState(false);

  return (
    <Container maxW="container.xl" p={0} borderRadius="lg">
      <Flex direction={"column"} gap="12px">
        <Flex direction={"row"} justifyContent={"flex-end"} w="full" gap={2}>
          <Button bg={"blue.500"} onClick={() => setFormActive(!formActive)}>
            <AddIcon pr={"5px"} /> {formActive ? "Back" : "Create"}
          </Button>
        </Flex>
        {formActive ? (
          //   <PackageFormPage />
          <p>Additional FORM</p>
        ) : (
          <Flex direction={"row"} gap={"25px"} wrap={"wrap"}>
            {/* {Array.from({ length: 8 }).map((_, index) => {
                return <PackageCard key={index} />;
              })} */}
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

export default AdminAdditionalPage;
