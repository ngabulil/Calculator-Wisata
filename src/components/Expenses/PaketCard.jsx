import React from "react";
import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  VStack, 
  HStack, 
  FormControl, 
  FormLabel,
  useToast
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import MainSelect from "../MainSelect";
import { useExpensesContext } from "../../context/ExpensesContext";
import { usePackageContext } from "../../context/PackageContext";

const PaketCard = ({packagesData}) => {
  const toast = useToast();
  const { comparisonPackages, addComparisonPackage, removeComparisonPackage, updateComparisonPackage } = useExpensesContext();
  const { selectedPackage } = usePackageContext();

  React.useEffect(() => {
    if (selectedPackage && comparisonPackages.length > 0) {
      comparisonPackages.forEach((pkg, index) => {
        if (pkg.id && (
          pkg.totalPaxAdult !== selectedPackage.totalPaxAdult || 
          pkg.totalPaxChildren !== selectedPackage.totalPaxChildren
        )) {
          updateComparisonPackage(index, {
            ...pkg,
            totalPaxAdult: selectedPackage.totalPaxAdult,
            totalPaxChildren: selectedPackage.totalPaxChildren
          });
        }
      });
    }
  }, [selectedPackage?.totalPaxAdult, selectedPackage?.totalPaxChildren]);

  const handleAddPackage = () => {
    if (comparisonPackages.length >= 5) {
      toast({
        title: "Batas Maksimal Tercapai",
        description: "Maksimal hanya 5 paket yang dapat dipilih",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    addComparisonPackage({ id: null, title: "", calculatedPrice: 0 });
  };

const handleRemovePackage = (index) => {
  removeComparisonPackage(index);
  
  toast({
    title: "Paket Dihapus", 
    description: "Paket berhasil dihapus dari perbandingan",
    status: "success",
    duration: 2000,
    isClosable: true,
  });
};

  const handlePackageChange = (index, selected) => {
    const found = packagesData.find((p) => p.id === selected.value);
    
    if (!found) return;
    
    const packageData = {
      ...found,
      title: found.name,
      name: found.name,
      totalPaxAdult: selectedPackage?.totalPaxAdult || 0,
      totalPaxChildren: selectedPackage?.totalPaxChildren || 0,
      days: found.days || [],
    };

    updateComparisonPackage(index, packageData);
  };

  return (
    <Box bg="gray.700" p={4} borderRadius="md" mx={6} my={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="white">
          Paket Wisata Untuk Perbandingan
        </Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          onClick={handleAddPackage}
          isDisabled={comparisonPackages.length >= 5}
        >
          Tambah Paket ({comparisonPackages.length}/5)
        </Button>
      </Flex>

      {/* Display Adult and Children Count */}
      <Box bg="gray.600" p={3} borderRadius="md" mb={4}>
        <HStack spacing={6}>
          <Box>
            <Text fontSize="sm" color="gray.300">
              Total Pax Adult
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="white">
              {selectedPackage?.totalPaxAdult || 0}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.300">
              Total Pax Children
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="white">
              {selectedPackage?.totalPaxChildren || 0}
            </Text>
          </Box>
        </HStack>
      </Box>

      <VStack spacing={4} align="stretch">
        {comparisonPackages.map((pkg, index) => (
          <Box key={index} bg="gray.600" p={4} borderRadius="md">
            <HStack spacing={3} align="flex-start">
              <FormControl flex="1">
                <FormLabel color="white" fontSize="sm">
                  Paket {index + 1}
                </FormLabel>
                <MainSelect
                  options={packagesData.map((p) => ({
                    value: p.id,
                    label: p.name,
                  }))}
                  value={pkg.id ? { value: pkg.id, label: pkg.title } : null}
                  onChange={(selected) => handlePackageChange(index, selected)}
                  placeholder="Pilih Paket"
                />
              </FormControl>

                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleRemovePackage(index)}
                  mt={6}
                >
                  Hapus
                </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default PaketCard;