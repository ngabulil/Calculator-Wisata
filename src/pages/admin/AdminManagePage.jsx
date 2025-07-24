import {
  Box,
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Flex,
  Button,
  Container,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

import SearchBar from "../../components/searchBar";
import { useAdminManageContext } from "../../context/Admin/AdminManageContext";
import AdminAccountCard from "../../components/Admin/Manage/AdminAccountCard/AdminAccountCard";
import toastConfig from "../../utils/toastConfig";
import { apiDeleteAdmin } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
import AdminFormPage from "../../components/Admin/Manage/AdminAccountForm/AdminAccountForm";

import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 7;

const AdminManagePage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formActive, setFormActive] = useState(false);
  const [loading , setLoading] = useState(false);
  const { getAllAdmin, updateAdminData, allAdminAccount } =
    useAdminManageContext();

  // handle pagination
  const [adminAccount, setAdminAccount] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [recentAdmin, setRecentAdmin] = useState([]);

  const offset = currentPage * ITEMS_PER_PAGE;
  const currentAdminAccount = adminAccount.slice(
    offset,
    offset + ITEMS_PER_PAGE
  );
  const pageCount = Math.ceil(adminAccount.length / ITEMS_PER_PAGE);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleSearch = (value) => {
    if (value.toLowerCase() == "") {
      setAdminAccount(recentAdmin);
    } else {
      const villaFiltered = adminAccount.filter((acc) => {
        const query = value.toLowerCase();
        return (
          acc.name.toLowerCase().includes(query) ||
          acc.username.toLowerCase().includes(query)
        );
      });
      setAdminAccount(villaFiltered);
    }
  };

  const handleGetAllAdmin = async () => {
 
    setLoading(true);
    try {
      await getAllAdmin();
    } catch (error) {
      console.error("Error", error);
  
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteadminAccount = async (id) => {
    const loading = toast(toastConfig("Loading", "Mohon Menunggu", "loading"));
    try {
      const res = await apiDeleteAdmin(id);

      if (res.status === 200) {
        toast.close(loading);
        toast(
          toastConfig(
            "Sukses Hapus",
            "Berhasil Menghapus admin account ",
            "success"
          )
        );
        handleGetAllAdmin();
      } else {
        toast.close(loading);
        toast(
          toastConfig("Gagal Hapus", "Gagal Menghapus admin account", "error")
        );
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.close(loading);
      toast(
        toastConfig("Gagal Hapus", "Gagal Menghapus admin account", "error")
      );
    }
  };

  useEffect(() => {
    handleGetAllAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAdminAccount(allAdminAccount);
    setRecentAdmin(allAdminAccount);
  }, [allAdminAccount]);

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
              placeholder="Search Admin Account"
              value={""}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
          )}
          <Button
            bg={"blue.500"}
            onClick={() => {
              setFormActive(!formActive);

              if (formActive) {
                updateAdminData([]);
                navigate("/admin/manage");
              }
            }}
          >
            {formActive ? (
              <ChevronLeftIcon fontSize={"25px"} pr={"5px"} />
            ) : (
              <AddIcon pr={"5px"} />
            )}{" "}
            {formActive ? "Back" : "Create"}
          </Button>
        </Flex>
        {formActive ? (
          <AdminFormPage
            onChange={() => {
              navigate("/admin/manage");
              setFormActive(false);
              handleGetAllAdmin();
            }}
          />
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              {currentAdminAccount.length > 0 && (
                <Thead bg="gray.800">
                  <Tr>
                    <Th>No</Th>
                    <Th>Username</Th>
                    <Th>Name</Th>
                    <Th>Role</Th>
                    <Th>Created At</Th>
                    <Th>Updated At</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
              )}
              <Tbody>
                {
                  loading ?     
      
                  <Flex w={'full'} justifyContent={'center'}> <Spinner size="xl" color="teal.500" /></Flex>
                :
                currentAdminAccount.length > 0 ? (
                  currentAdminAccount.map((account, index) => (
                    <AdminAccountCard
                      key={index}
                      account={account}
                      nomor={index + 1 + offset}
                      onEditButton={() => {
                        updateAdminData(account);
                        setFormActive(true);
                      }}
                      onDeleteButton={async () => {
                        await handleDeleteadminAccount(account.id);
                        handleGetAllAdmin();
                      }}
                    />
                  ))
                ) : (
                  <Box
                    w="full"
                    textAlign="center"
                    bg={"gray.800"}
                    p={5}
                    rounded={2}
                  >
                    <Text fontSize="xl" color="gray.500" fontWeight={"bold"}>
                      Daftar Admin Tidak Ditemukan
                    </Text>
                  </Box>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Flex>
      {/* Pagination */}
      {currentAdminAccount.length > 0 && !formActive && (
        <Box
          mt={6}
          display="flex"
          flexDirection={"row"}
          justifyContent="center"
        >
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            containerClassName="flex items-center justify-center !gap-[15px] p-2 mt-4 list-none "
          />
        </Box>
      )}
    </Container>
  );
};

export default AdminManagePage;
