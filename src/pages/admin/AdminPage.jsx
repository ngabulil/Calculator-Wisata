import {
  Box,
  Text,
  Flex,
  Button,
  Container,
  Textarea,
  Input,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import PackageCard from "../../components/Admin/packages/PackageCard/PackageCard";
import PackageFormPage from "../../components/Admin/packages/PackagesForm/PackageForm";
import PackageRead from "../../components/Admin/packages/PackageRead/PackageRead";
import SearchBar from "../../components/searchBar";
import { useAdminPackageContext } from "../../context/Admin/AdminPackageContext";
import toastConfig from "../../utils/toastConfig";
import { apiDeletePackageFull } from "../../services/packageService";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formActive, setFormActive] = useState(false);
  const [readPackageActive, setReadPackageActive] = useState(false);
  const { getAllPackageFull, packageFull, updateHeadline, updatePackageFull } =
    useAdminPackageContext();

  const handleGetAllPackageFull = async () => {
    await getAllPackageFull();
  };

  const handleDeletePackageFull = async (id) => {
    try {
      const res = await apiDeletePackageFull(id);

      if (res.status === 200) {
        toast(
          toastConfig("Sukses Hapus", "Berhasil Menghapus paket", "success")
        );
        handleGetAllPackageFull();
      } else {
        toast(toastConfig("Gagal Hapus", "Gagal Menghapus paket", "error"));
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast(toastConfig("Gagal Hapus", "Gagal Menghapus paket", "error"));
    }
  };

  useEffect(() => {
    handleGetAllPackageFull();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              setFormActive(!formActive);

              if (formActive) {
                updatePackageFull([]);
              }
              if (readPackageActive) {
                setReadPackageActive(false);
              }
              navigate("/admin/paket");
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
              {packageFull.map((packageItem, index) => {
                return (
                  <PackageCard
                    key={index}
                    title={packageItem.name}
                    description={packageItem.description}
                    onOpenButton={() => {
                      setReadPackageActive(true);
                      updatePackageFull(packageItem);
                    }}
                    onDeleteButton={() =>
                      handleDeletePackageFull(packageItem.id)
                    }
                    onEditButton={() => {
                      setFormActive(true);
                      updateHeadline(packageItem.name, packageItem.description);
                      updatePackageFull(packageItem);
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
