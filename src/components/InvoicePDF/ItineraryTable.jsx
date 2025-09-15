import React, { useState, useCallback } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  Textarea,
  Input,
  IconButton,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import ReorderControls from "../ReorderControls";
import { usePackageContext } from "../../context/PackageContext";

const orange = "#FFA726";
const orangeLight = "#FFE0B2";
const gray = "#F5F5F5";

const tableStyles = {
  header: {
    backgroundColor: orange,
    color: "#222",
    fontWeight: "bold",
    fontSize: "1rem",
    padding: "2px 20px 12px 10px",
  },
  subHeader: {
    backgroundColor: orangeLight,
    fontWeight: "bold",
    padding: "2px 20px 12px 10px",
  },
  total: {
    backgroundColor: orange,
    fontWeight: "bold",
    padding: "2px 20px 12px 10px",
  },
  cell: {
    padding: "2px 30px 12px 10px",
    verticalAlign: "top",
  },
};

const ItineraryTable = ({
  days,
  formatCurrency,
  isReordering = false,
  onMoveItemUp,
  onMoveItemDown,
  onEditItemTitle,
  onEditItemDescription,
}) => {
  const { selectedPackage } = usePackageContext();
  const childGroups = selectedPackage?.childGroups || [];

  const [editingItem, setEditingItem] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", description: "" });
  const toast = useToast();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // PERBAIKAN UTAMA: Normalisasi data yang lebih konsisten
  const normalizedDays = (Array.isArray(days) ? days : []).map((day, dayIdx) => {
    return {
      ...day,
      items: (day.items || []).map((item, itemIdx) => {
        // Gunakan data dari item itu sendiri, bukan dari originalData yang mungkin tidak sinkron
        const finalItem = {
          ...item,
          // Pastikan semua field yang dibutuhkan ada
          hargaAdult: item.hargaAdult || item.adultPrice || 0,
          hargaChild: item.hargaChild || item.childPrice || 0,
          quantities: item.quantities || {},
          // Simpan data asli untuk referensi jika diperlukan
          originalData: item.originalData || item,
        };

        // Jika ada originalData dan quantities kosong, ambil dari originalData
        if (item.originalData && (!item.quantities || Object.keys(item.quantities).length === 0)) {
          finalItem.quantities = item.originalData.quantities || {};
          finalItem.hargaAdult = item.originalData.hargaAdult || item.originalData.adultPrice || finalItem.hargaAdult;
          finalItem.hargaChild = item.originalData.hargaChild || item.originalData.childPrice || finalItem.hargaChild;
        }

        return finalItem;
      }),
    };
  });

  const startEditing = useCallback((dayIndex, itemIndex, currentTitle, currentDescription) => {
    setEditingItem({ dayIndex, itemIndex });
    setEditValues({
      title: currentTitle || "",
      description: currentDescription || "",
    });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingItem(null);
    setEditValues({ title: "", description: "" });
  }, []);

  const saveEditing = useCallback(() => {
    if (!editingItem) return;
    const { dayIndex, itemIndex } = editingItem;

    if (onEditItemTitle && editValues.title.trim()) {
      onEditItemTitle(dayIndex, itemIndex, editValues.title.trim());
    }

    if (onEditItemDescription) {
      onEditItemDescription(dayIndex, itemIndex, editValues.description.trim());
    }

    toast({
      title: "Item Updated",
      description: "Item has been updated successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    setEditingItem(null);
    setEditValues({ title: "", description: "" });
  }, [editingItem, editValues, onEditItemTitle, onEditItemDescription, toast]);

  // PERBAIKAN: Perhitungan harga yang lebih akurat
  const calculateItemPrice = (item) => {
    // Gunakan data langsung dari item yang sudah dinormalisasi
    const quantities = item.quantities || {};
    const hargaAdult = Number(item.hargaAdult) || 0;
    const hargaChild = Number(item.hargaChild) || 0;

    // Hitung adult expense
    const adultQty = Number(quantities.adult || 0);
    const adultExpense = adultQty * hargaAdult;

    // Hitung child expenses per group
    const childExpenses = childGroups.map((child) => {
      const qty = Number(quantities[child.id] || 0);
      return qty * hargaChild;
    });

    const childTotal = childExpenses.reduce((sum, expense) => sum + expense, 0);

    return {
      adultExpense,
      childExpenses,
      total: adultExpense + childTotal,
    };
  };

  const calculateGrandTotal = () => {
    return normalizedDays.reduce((sum, day) => {
      return sum + day.items.reduce((daySum, item) => {
        const itemPrice = calculateItemPrice(item);
        return daySum + itemPrice.total;
      }, 0);
    }, 0);
  };

  const renderItemContent = (item, dayIndex, itemIndex) => {
    const isCurrentlyEditing =
      editingItem?.dayIndex === dayIndex && editingItem?.itemIndex === itemIndex;
    
    const title = item.item || item.label || "Unnamed Item";
    const description = item.description || "";

    if (isReordering || isCurrentlyEditing) {
      return (
        <VStack align="stretch" spacing={2}>
          <HStack>
            <Text fontSize="sm" fontWeight="bold" minWidth="60px">
              Name:
            </Text>
            <Input
              value={isCurrentlyEditing ? editValues.title : title}
              onChange={(e) => {
                if (isCurrentlyEditing) {
                  setEditValues((prev) => ({ ...prev, title: e.target.value }));
                } else {
                  onEditItemTitle?.(dayIndex, itemIndex, e.target.value);
                }
              }}
              size="sm"
              placeholder="Enter item name"
              bg="white"
              border="1px solid"
              borderColor="gray.300"
            />
          </HStack>
          <HStack align="flex-start">
            <Text fontSize="sm" fontWeight="bold" minWidth="60px">
              Desc:
            </Text>
            <Textarea
              value={isCurrentlyEditing ? editValues.description : description}
              onChange={(e) => {
                if (isCurrentlyEditing) {
                  setEditValues((prev) => ({ ...prev, description: e.target.value }));
                } else {
                  onEditItemDescription?.(dayIndex, itemIndex, e.target.value);
                }
              }}
              size="sm"
              placeholder="Enter description (optional)"
              rows={2}
              resize="vertical"
              bg="white"
              border="1px solid"
              borderColor="gray.300"
            />
          </HStack>
          {isCurrentlyEditing && (
            <HStack spacing={1}>
              <IconButton
                icon={<CheckIcon />}
                size="xs"
                colorScheme="green"
                onClick={saveEditing}
                aria-label="Save changes"
              />
              <IconButton
                icon={<CloseIcon />}
                size="xs"
                colorScheme="red"
                onClick={cancelEditing}
                aria-label="Cancel editing"
              />
            </HStack>
          )}
        </VStack>
      );
    }

    return (
      <HStack align="flex-start" spacing={2}>
        <Box flex={1}>
          <Text>• {title}</Text>
          {description && (
            <Text fontSize="xs" color="gray.600" fontStyle="italic" ml={3}>
              {description}
            </Text>
          )}
        </Box>
        <IconButton
          icon={<EditIcon />}
          size="xs"
          variant="ghost"
          onClick={() => startEditing(dayIndex, itemIndex, title, description)}
          aria-label="Edit item"
          _hover={{ bg: "gray.100" }}
        />
      </HStack>
    );
  };

  const renderItem = (item, itemIndex, dayIndex, currentDay) => {
    const totalItems = currentDay.items?.length || 0;
    const canMoveUp = itemIndex > 0;
    const canMoveDown = itemIndex < totalItems - 1;
    const isCurrentlyEditing =
      editingItem?.dayIndex === dayIndex && editingItem?.itemIndex === itemIndex;

    const { adultExpense, childExpenses } = calculateItemPrice(item);

    return (
      <Tr
        key={`item-${dayIndex}-${itemIndex}`}
        _hover={{
          background: !isCurrentlyEditing && !isReordering ? gray : undefined,
        }}
      >
        {isReordering && (
          <Td style={tableStyles.cell}>
            <ReorderControls
              onMoveUp={() => onMoveItemUp?.(dayIndex, itemIndex)}
              onMoveDown={() => onMoveItemDown?.(dayIndex, itemIndex)}
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
              isVisible={isReordering}
            />
          </Td>
        )}
        <Td></Td>
        <Td style={tableStyles.cell}>{renderItemContent(item, dayIndex, itemIndex)}</Td>
        {/* Adult */}
        <Td style={tableStyles.cell}>
          {adultExpense > 0 ? formatCurrency(adultExpense) : "-"}
        </Td>
        {/* Child per kolom */}
        {childExpenses.map((val, idx) => (
          <Td key={idx} style={tableStyles.cell}>
            {val > 0 ? formatCurrency(val) : "-"}
          </Td>
        ))}
      </Tr>
    );
  };

  return (
    <Box mb={8} borderRadius="md" overflow="hidden">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            {isReordering && (
              <Th textAlign="center" width="80px" style={tableStyles.header}>
                Order
              </Th>
            )}
            <Th textAlign="center" width="60px" style={tableStyles.header}>
              Day
            </Th>
            <Th style={tableStyles.header}>Quotation</Th>
            <Th textAlign="center" width="160px" style={tableStyles.header}>
              Adult
            </Th>
            {childGroups.map((child) => (
              <Th
                key={child.id}
                textAlign="center"
                width="120px"
                style={tableStyles.header}
              >
                {child.label}
              </Th>
            ))}
          </Tr>
        </Thead>

        <Tbody color="#222">
          {normalizedDays.map((day, dayIndex) => (
            <React.Fragment key={`day-${dayIndex}`}>
              {/* Day Header */}
              <Tr>
                {isReordering && <Td style={tableStyles.subHeader}></Td>}
                <Td textAlign="center" fontWeight="bold" style={tableStyles.subHeader}>
                  {dayIndex + 1}
                </Td>
                <Td fontWeight="bold" style={tableStyles.subHeader}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm">
                      {day.name || `Day ${dayIndex + 1}`}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {day.description_day || day.day_description || ""}
                    </Text>
                    <Text fontSize="xs" fontStyle="italic" color="gray.500">
                      {formatDate(day.date)}
                    </Text>
                  </Box>
                </Td>
                <Td style={tableStyles.subHeader}></Td>
                {childGroups.map((_, idx) => (
                  <Td key={idx} style={tableStyles.subHeader}></Td>
                ))}
              </Tr>

              {/* Render Items */}
              {day.items.map((item, itemIndex) =>
                renderItem(item, itemIndex, dayIndex, day)
              )}
            </React.Fragment>
          ))}

          {/* Total Row */}
          <Tr>
            {isReordering && <Td style={tableStyles.total}></Td>}
            <Td colSpan={2} style={tableStyles.total}>
              Grand Total
            </Td>
            <Td colSpan={1 + childGroups.length} textAlign="right" style={tableStyles.total}>
              {formatCurrency(calculateGrandTotal())}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default ItineraryTable;