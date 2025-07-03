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
import PackageRead from "../../components/Admin/packages/PackageRead/PackageRead";
import SearchBar from "../../components/searchBar";

const AdminPage = () => {
  const [formActive, setFormActive] = useState(false);
  const [readPackageActive, setReadPackageActive] = useState(false);

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
              if (formActive) setFormActive(!formActive);
              if (readPackageActive) setReadPackageActive(false);
            }}
          >
            {formActive || readPackageActive ? (
              <ChevronLeftIcon fontSize={"25px"} pr={"5px"} />
            ) : (
              <AddIcon pr={"5px"} />
            )}{" "}
            {formActive || readPackageActive ? "Back" : "Create"}
          </Button>
        </Flex>
        {formActive ? (
          <PackageFormPage />
        ) : readPackageActive ? (
          <PackageRead />
        ) : (
          <Flex gap={6}>
            <Flex direction={"row"} gap={"25px"} wrap={"wrap"}>
              {Array.from({ length: 8 }).map((_, index) => {
                return (
                  <PackageCard
                    key={index}
                    onOpenButton={() => {
                      setReadPackageActive(true);
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

export default AdminPage;
