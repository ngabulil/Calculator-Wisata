import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  VStack,
  Button,
  Textarea,
  Input,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const orange = "#FB8C00";

const tableHeaderStyle = {
  backgroundColor: orange,
  color: "#222",
  fontWeight: "bold",
  fontSize: "1rem",
  padding: "8px",
  verticalAlign: "top",
};

const tableCellStyle = {
  padding: "8px",
  verticalAlign: "top",
};

const InclusionExclusionTable = ({ 
  isEditing = false, 
  onSave, 
  onCancel, 
  showButtons = true,
  resetTrigger 
}) => {
  const toast = useToast();
  
  // Default data
  const defaultData = {
    inclusions: [
      "Stay for 3 Nights at 4 stars Hotel in Kuta Area",
      "All entrance fees, meals, and activities as mention in program",
      "Welcome flower in Ngurah Rai International",
      "Transport: 6 Seaters car (use maximum 10-12 hours day)",
      "Private experience driver"
    ],
    estimationTime: {
      title: "Suggest Estimation Time :",
      items: [
        "Arrival in Bali around 12 Pm (afternoon)",
        "Departure Time From Bali Anytime"
      ],
    },
    exclusions: [
      "Flight tickets",
      "Shopping, Laundry, Medicine, And any others",
      "Tipping for Driver"
    ],
    priceChanges: {
      title: "PRICE PROMO VALID FOR PERIOD:",
      items: [
        "Promo Valid Until June 2025"
      ]
    },
    otherProvisions: [
      "We at Bali Sundaram Travel are not responsible for delays or cancellations",
      "Flight Schedules for both Arrivals and Departures so that you can change the Package Schedule",
      "Tour that has been programmed."
    ]
  };

  const [editData, setEditData] = useState(defaultData);

  useEffect(() => {
    const savedData = localStorage.getItem('inclusionExclusionData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setEditData(parsedData);
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, [resetTrigger]);

  useEffect(() => {
    localStorage.setItem('inclusionExclusionData', JSON.stringify(editData));
  }, [editData]);


  // Simpan data ke localStorage
  const saveData = () => {
    try {
      localStorage.setItem('inclusionExclusionData', JSON.stringify(editData));
      if (onSave) {
        onSave();
      } else {
        toast({
          title: "Data Tersimpan",
          description: "Perubahan telah disimpan successfully!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Reset data ke default
  const resetData = () => {
    setEditData(defaultData);
    localStorage.removeItem('inclusionExclusionData');
    toast({
      title: "Data Direset",
      description: "Data telah dikembalikan ke default",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Handle perubahan array items
  const handleArrayChange = (section, index, value) => {
    setEditData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? value : item)
    }));
  };

  // Handle perubahan nested object items
  const handleNestedArrayChange = (section, index, value) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        items: prev[section].items.map((item, i) => i === index ? value : item)
      }
    }));
  };

  // Handle perubahan nested object title/note
  const handleNestedFieldChange = (section, field, value) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Tambah item baru ke array
  const addArrayItem = (section) => {
    setEditData(prev => ({
      ...prev,
      [section]: [...prev[section], ""]
    }));
  };

  // Tambah item baru ke nested array
  const addNestedArrayItem = (section) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        items: [...prev[section].items, ""]
      }
    }));
  };

  // Hapus item dari array
  const removeArrayItem = (section, index) => {
    setEditData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Hapus item dari nested array
  const removeNestedArrayItem = (section, index) => {
    setEditData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        items: prev[section].items.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = () => {
    saveData();
    if (onSave) onSave();
  };

  const handleCancel = () => {
    // Reload data dari localStorage atau gunakan data terakhir yang disimpan
    const savedData = localStorage.getItem('inclusionExclusionData');
    if (savedData) {
      setEditData(JSON.parse(savedData));
    }
    if (onCancel) onCancel();
  };

  const renderEditableList = (items, section, isNested = false) => {
    const handleChange = isNested ? handleNestedArrayChange : handleArrayChange;
    const addItem = isNested ? () => addNestedArrayItem(section) : () => addArrayItem(section);
    const removeItem = isNested ? removeNestedArrayItem : removeArrayItem;

    return (
      <VStack spacing={2} align="stretch">
        {items.map((item, index) => (
          <Flex key={index} gap={2}>
            <Input
              size="sm"
              value={item}
              onChange={(e) => handleChange(section, index, e.target.value)}
              placeholder={`Item ${index + 1}`}
            />
            <Button 
              size="sm" 
              colorScheme="red" 
              onClick={() => removeItem(section, index)}
              isDisabled={items.length === 1}
            >
              -
            </Button>
          </Flex>
        ))}
        <Button size="sm" colorScheme="green" onClick={addItem}>
          + Tambah Item
        </Button>
      </VStack>
    );
  };

  const renderDisplayList = (items) => (
    <VStack spacing={1} align="flex-start">
      {items.map((item, index) => (
        <Text key={index} fontSize="sm">• {item}</Text>
      ))}
    </VStack>
  );

  return (
    <>
      {showButtons && (
        <Flex justify="space-between" mb={4} flexWrap="wrap" gap={2}>
          <Text fontSize="lg" fontWeight="bold">Inclusion & Exclusion</Text>
          <Flex gap={2} flexWrap="wrap">
            {!isEditing ? (
              // eslint-disable-next-line no-undef
              <Button size="sm" colorScheme="blue" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            ) : (
              <>
                <Button size="sm" colorScheme="green" onClick={handleSave}>
                  Simpan
                </Button>
                <Button size="sm" colorScheme="gray" onClick={handleCancel}>
                  Batal
                </Button>
              </>
            )}
            <Button size="sm" colorScheme="red" onClick={resetData}>
              Reset
            </Button>
          </Flex>
        </Flex>
      )}

      <Box mb={6} borderRadius="md" overflow="hidden" color={"#222"}>
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Td width="50%" style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">INCLUSION</Text>
              </Td>
              <Td width="50%" style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">Estimation Time</Text>
              </Td>
            </Tr>
            <Tr>
              <Td style={tableCellStyle}>
                {isEditing ? (
                  renderEditableList(editData.inclusions, 'inclusions')
                ) : (
                  renderDisplayList(editData.inclusions)
                )}
              </Td>
              <Td style={tableCellStyle}>
                {isEditing ? (
                  <VStack spacing={3} align="stretch">
                    <Input
                      size="sm"
                      value={editData.estimationTime.title}
                      onChange={(e) => handleNestedFieldChange('estimationTime', 'title', e.target.value)}
                      placeholder="Estimation Time Title"
                    />
                    {renderEditableList(editData.estimationTime.items, 'estimationTime', true)}
                    <Input
                      size="sm"
                      value={editData.estimationTime.note}
                      onChange={(e) => handleNestedFieldChange('estimationTime', 'note', e.target.value)}
                      placeholder="Note"
                    />
                  </VStack>
                ) : (
                  <>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                      {editData.estimationTime.title}
                    </Text>
                    {editData.estimationTime.items.map((item, index) => (
                      <Text key={index} fontSize="sm">• {item}</Text>
                    ))}
                    <Text fontSize="sm" fontWeight="semibold" mt={3}>
                      {editData.estimationTime.note}
                    </Text>
                  </>
                )}
              </Td>
            </Tr>
            <Tr>
              <Td style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">EXCLUSIONS:</Text>
              </Td>
              <Td style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">PRICE CHANGES:</Text>
              </Td>
            </Tr>
            <Tr>
              <Td style={tableCellStyle}>
                {isEditing ? (
                  renderEditableList(editData.exclusions, 'exclusions')
                ) : (
                  renderDisplayList(editData.exclusions)
                )}
              </Td>
              <Td style={tableCellStyle}>
                {isEditing ? (
                  <VStack spacing={3} align="stretch">
                    <Input
                      size="sm"
                      value={editData.priceChanges.title}
                      onChange={(e) => handleNestedFieldChange('priceChanges', 'title', e.target.value)}
                      placeholder="Price Changes Title"
                    />
                    {renderEditableList(editData.priceChanges.items, 'priceChanges', true)}
                  </VStack>
                ) : (
                  <>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                      {editData.priceChanges.title}
                    </Text>
                    {editData.priceChanges.items.map((item, index) => (
                      <Text key={index} fontSize="sm">• {item}</Text>
                    ))}
                  </>
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Box mb={6} borderRadius="md" overflow="hidden" color={"#222"}>
        <Table variant="simple" size="sm">
          <Tbody>
            <Tr>
              <Td style={tableHeaderStyle} textAlign="center">
                <Text fontWeight="bold">OTHER PROVISIONS</Text>
              </Td>
            </Tr>
            <Tr>
              <Td style={tableCellStyle} textAlign="center">
                {isEditing ? (
                  renderEditableList(editData.otherProvisions, 'otherProvisions')
                ) : (
                  <VStack spacing={2} fontSize="sm" align="flex-start">
                    {editData.otherProvisions.map((item, index) => (
                      <Text key={index}>• {item}</Text>
                    ))}
                  </VStack>
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default InclusionExclusionTable;