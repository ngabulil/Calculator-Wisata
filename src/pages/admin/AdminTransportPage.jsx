import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import TransportCard from "../../components/Admin/Transport/TransportCard/TransportCard";
import TransportForm from "../../components/Admin/Transport/TransportForm/TransportForm";

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
            <Box display={"flex"} gap={2}>
              <Input
                placeholder="Search Packages"
                value={""}
                onChange={(e) => {
                  console.log(e.target.value);
                }}
              />
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
          <TransportForm />
        ) : (
          <Flex direction={"row"} w={"full"} gap={"25px"} wrap={"wrap"}>
            {Array.from({ length: 8 }).map((_, index) => {
              return <TransportCard key={index} />;
            })}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default AdminTourPackagesPage;
