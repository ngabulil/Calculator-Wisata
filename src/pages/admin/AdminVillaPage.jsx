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
import VillaCard from "../../components/Admin/Villa/VillaCard/VillaCard";
import VillaForm from "../../components/Admin/Villa/VillaForm/VillaForm";
import villas from "../../data/villas.json";

const AdminVillaPage = () => {
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
          <VillaForm />
        ) : (
          <Flex direction={"row"} gap={"25px"} wrap={"wrap"}>
            {villas.map((villa, index) => (
              <VillaCard
                key={index}
                photoLink={`https://picsum.photos/1${index + 10}/300`}
                name={villa.villaName}
                stars={villa.stars}
                honeymoonPackage={villa.honeymoonPackage}
                seasons={villa.seasons}
                roomType={villa.roomType}
                contractUntil={villa.contractUntil}
              />
            ))}
          </Flex>
        )}
      </Flex>
    </Container>
  );
};

export default AdminVillaPage;
