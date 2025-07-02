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
import { useState } from "react";
import PackageCard from "../../components/Admin/packages/PackageCard/PackageCard";
import PackageFormPage from "../../components/Admin/packages/PackagesForm/PackageForm";

const AdminPage = () => {
  const [formActive, setFormActive] = useState(false);

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
            <Box display={"flex"} gap={2}>
              <Input
                placeholder="Search Packages"
                value={""}
                onChange={(e) => {
                  console.log(e.target.value);
                }}
              />

              <Button
                bg={"gray.700"}
                onClick={() => setFormActive(!formActive)}
              >
                Search
              </Button>
            </Box>
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
          <PackageFormPage />
        ) : (
          <Flex direction={"row"} gap={"25px"} wrap={"wrap"}>
            {Array.from({ length: 8 }).map((_, index) => {
              return <PackageCard key={index} />;
            })}
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

export default AdminPage;
