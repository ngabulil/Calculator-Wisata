// hooks/useItineraryEditor.js
import { useState, useCallback, useEffect } from "react";

const useItineraryEditor = (initialDays = [], packageId = null) => {
  const [days, setDays] = useState(initialDays);
  const [originalDays, setOriginalDays] = useState(initialDays);
  const [isReordering, setIsReordering] = useState(false);

  // Generate storage key based on package ID
  const getStorageKey = useCallback((pkgId) => {
    return pkgId ? `itinerary_order_${pkgId}` : null;
  }, []);

  // Save order to localStorage
  const saveOrderToStorage = useCallback(
    (orderData, pkgId) => {
      const key = getStorageKey(pkgId);
      if (key) {
        try {
          localStorage.setItem(key, JSON.stringify(orderData));
        } catch (error) {
          console.error(
            "Failed to save itinerary order to localStorage:",
            error
          );
        }
      }
    },
    [getStorageKey]
  );

  // Load order from localStorage
  const loadOrderFromStorage = useCallback(
    (pkgId) => {
      const key = getStorageKey(pkgId);
      if (key) {
        try {
          const saved = localStorage.getItem(key);
          return saved ? JSON.parse(saved) : null;
        } catch (error) {
          console.error(
            "Failed to load itinerary order from localStorage:",
            error
          );
          return null;
        }
      }
      return null;
    },
    [getStorageKey]
  );

  // Apply saved order to days data
  const applySavedOrder = useCallback((daysData, savedOrder) => {
    if (!savedOrder || !Array.isArray(savedOrder.dayOrder)) {
      return daysData;
    }

    try {
      const reorderedDays = savedOrder.dayOrder
        .map((dayOrderInfo) => {
          const originalDay = daysData.find(
            (day) => day.day === dayOrderInfo.originalDay
          );
          if (!originalDay) return null;

          const reorderedDay = { ...originalDay, day: dayOrderInfo.newDay };

          // Apply unified item order if available
          if (dayOrderInfo.itemOrders?.items && originalDay.items) {
            reorderedDay.items = dayOrderInfo.itemOrders.items
              .map((index) => originalDay.items[index])
              .filter(Boolean);

            // Auto-split ulang activities dan expenseItems untuk kompatibilitas
            reorderedDay.activities = reorderedDay.items.filter(
              (item) => item.type === "activity"
            );
            reorderedDay.expenseItems = reorderedDay.items.filter(
              (item) => item.type === "expense"
            );
          }

          // Apply edited content if available
          if (dayOrderInfo.editedContent) {
            // Apply day-level edits
            if (dayOrderInfo.editedContent.title) {
              reorderedDay.title = dayOrderInfo.editedContent.title;
            }
            if (dayOrderInfo.editedContent.description) {
              reorderedDay.description = dayOrderInfo.editedContent.description;
            }

            // Apply item-level edits
            if (dayOrderInfo.editedContent.items && reorderedDay.items) {
              reorderedDay.items = reorderedDay.items.map((item, index) => {
                const editedItem = dayOrderInfo.editedContent.items[index];
                if (editedItem) {
                  return {
                    ...item,
                    ...(editedItem.title && { 
                      item: item.type === 'activity' ? editedItem.title : item.item,
                      label: item.type === 'expense' ? editedItem.title : item.label 
                    }),
                    ...(editedItem.description && { description: editedItem.description })
                  };
                }
                return item;
              });

              // Update activities and expenseItems arrays
              reorderedDay.activities = reorderedDay.items.filter(
                (item) => item.type === "activity"
              );
              reorderedDay.expenseItems = reorderedDay.items.filter(
                (item) => item.type === "expense"
              );
            }
          }

          return reorderedDay;
        })
        .filter(Boolean);

      return reorderedDays.length === daysData.length
        ? reorderedDays
        : daysData;
    } catch (error) {
      console.error("Failed to apply saved order:", error);
      return daysData;
    }
  }, []);

  // Generate order data for saving (with edited content)
  const generateOrderData = useCallback((currentDays, originalDays) => {
    const dayOrder = currentDays.map((day, newIndex) => {
      // Temukan day asli dari originalDays
      const originalDay = originalDays.find(
        (orig) => orig.title === day.title && orig.date === day.date
      );

      const orderInfo = {
        originalDay: originalDay ? originalDay.day : day.day,
        newDay: newIndex + 1,
        itemOrders: {},
        editedContent: {
          title: day.title !== originalDay?.title ? day.title : null,
          description: day.description !== originalDay?.description ? day.description : null,
          items: []
        }
      };

      // Simpan urutan items (unified)
      if (day.items && originalDay?.items) {
        orderInfo.itemOrders.items = day.items
          .map((item) => {
            return originalDay.items.findIndex((orig) => {
              if (!orig) return false;

              const matchById = orig.id && item.id && orig.id === item.id;
              const matchByItem =
                orig.item === item.item && orig.type === item.type;
              const matchByDesc =
                orig.description &&
                item.description &&
                orig.description === item.description;

              return matchById || matchByItem || matchByDesc;
            });
          })
          .filter((index) => index !== -1);

        // Simpan edited content untuk setiap item
        orderInfo.editedContent.items = day.items.map((item, index) => {
          const originalIndex = orderInfo.itemOrders.items[index];
          const originalItem = originalIndex !== -1 ? originalDay.items[originalIndex] : null;
          
          if (!originalItem) return null;

          const editedItem = {};
          
          // Check if title/name changed
          const currentTitle = item.type === 'activity' ? item.item : item.label;
          const originalTitle = originalItem.type === 'activity' ? originalItem.item : originalItem.label;
          
          if (currentTitle !== originalTitle) {
            editedItem.title = currentTitle;
          }

          // Check if description changed
          if (item.description !== originalItem.description) {
            editedItem.description = item.description;
          }

          return Object.keys(editedItem).length > 0 ? editedItem : null;
        });

        // Remove null entries
        orderInfo.editedContent.items = orderInfo.editedContent.items.filter(Boolean);
      }

      // Remove editedContent if no changes
      if (!orderInfo.editedContent.title && 
          !orderInfo.editedContent.description && 
          orderInfo.editedContent.items.length === 0) {
        delete orderInfo.editedContent;
      }

      return orderInfo;
    });

    return {
      dayOrder,
      timestamp: Date.now(),
    };
  }, []);

  // Auto-save function untuk menyimpan perubahan secara otomatis
  const autoSave = useCallback(() => {
    if (packageId && days.length > 0 && originalDays.length > 0) {
      const orderData = generateOrderData(days, originalDays);
      saveOrderToStorage(orderData, packageId);
    }
  }, [days, originalDays, packageId, generateOrderData, saveOrderToStorage]);

  // Effect untuk auto-save ketika ada perubahan pada days
  useEffect(() => {
    // Only auto-save if we have meaningful data and we're in editing mode
    if (isReordering && days.length > 0 && originalDays.length > 0) {
      // Debounce auto-save to avoid too frequent saves
      const timeoutId = setTimeout(() => {
        if (packageId && days.length > 0 && originalDays.length > 0) {
          const orderData = generateOrderData(days, originalDays);
          saveOrderToStorage(orderData, packageId);
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [days, isReordering, packageId, originalDays, generateOrderData, saveOrderToStorage]);

  // Update days when initial data changes
  const updateDays = useCallback(
    (newDays) => {
      setOriginalDays(newDays);

      // Try to load saved order and apply it
      if (packageId) {
        const savedOrder = loadOrderFromStorage(packageId);
        if (savedOrder) {
          const reorderedDays = applySavedOrder(newDays, savedOrder);
          setDays(reorderedDays);
          return;
        }
      }

      setDays(newDays);
    },
    [packageId, loadOrderFromStorage, applySavedOrder]
  );

  // Move item up within a day - ENHANCED to support all item types
  const moveItemUp = useCallback((dayIndex, itemIndex) => {
    if (itemIndex === 0) return;

    setDays((prevDays) => {
      const newDays = [...prevDays];
      const day = { ...newDays[dayIndex] };

      if (!day.items || itemIndex >= day.items.length) return prevDays;

      const items = [...day.items];
      [items[itemIndex - 1], items[itemIndex]] = [
        items[itemIndex],
        items[itemIndex - 1],
      ];

      day.items = items;
      day.activities = items.filter((item) => item.type === "activity");
      day.expenseItems = items.filter((item) => item.type === "expense");

      newDays[dayIndex] = day;
      return newDays;
    });
  }, []);

  // Move item down in unified day.items
  const moveItemDown = useCallback((dayIndex, itemIndex) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      const day = { ...newDays[dayIndex] };

      if (!day.items || itemIndex >= day.items.length - 1) return prevDays;

      const items = [...day.items];
      [items[itemIndex], items[itemIndex + 1]] = [
        items[itemIndex + 1],
        items[itemIndex],
      ];

      day.items = items;
      day.activities = items.filter((item) => item.type === "activity");
      day.expenseItems = items.filter((item) => item.type === "expense");

      newDays[dayIndex] = day;
      return newDays;
    });
  }, []);

  // Move day up
  const moveDayUp = useCallback((dayIndex) => {
    if (dayIndex === 0) return;

    setDays((prevDays) => {
      const newDays = [...prevDays];
      [newDays[dayIndex - 1], newDays[dayIndex]] = [
        newDays[dayIndex],
        newDays[dayIndex - 1],
      ];

      // Update day numbers
      newDays.forEach((day, index) => {
        day.day = index + 1;
      });

      return newDays;
    });
  }, []);

  // Move day down
  const moveDayDown = useCallback((dayIndex) => {
    setDays((prevDays) => {
      if (dayIndex >= prevDays.length - 1) return prevDays;

      const newDays = [...prevDays];
      [newDays[dayIndex], newDays[dayIndex + 1]] = [
        newDays[dayIndex + 1],
        newDays[dayIndex],
      ];

      // Update day numbers
      newDays.forEach((day, index) => {
        day.day = index + 1;
      });

      return newDays;
    });
  }, []);

  // Toggle reordering mode
  const toggleReordering = useCallback(() => {
    setIsReordering((prev) => {
      const newReordering = !prev;
      
      // Auto-save when exiting reordering mode
      if (!newReordering && packageId && days.length > 0 && originalDays.length > 0) {
        const orderData = generateOrderData(days, originalDays);
        saveOrderToStorage(orderData, packageId);
      }
      
      return newReordering;
    });
  }, [days, originalDays, packageId, generateOrderData, saveOrderToStorage]);

  // Save current order - Enhanced to include edited content
  const saveOrder = useCallback(() => {
    if (packageId) {
      const orderData = generateOrderData(days, originalDays);
      saveOrderToStorage(orderData, packageId);
      return true;
    }
    return false;
  }, [days, originalDays, packageId, generateOrderData, saveOrderToStorage]);

  // Reset to original order
  const resetOrder = useCallback(() => {
    setDays([...originalDays]);
  }, [originalDays]);

  // Clear saved order
  const clearSavedOrder = useCallback(() => {
    const key = getStorageKey(packageId);
    if (key) {
      try {
        localStorage.removeItem(key);
        setDays([...originalDays]);
      } catch (error) {
        console.error("Failed to clear saved order:", error);
      }
    }
  }, [packageId, getStorageKey, originalDays]);

  // Enhanced edit functions with auto-save
  const editItemTitle = useCallback((dayIndex, itemIndex, newTitle) => {
    setDays(prevDays => {
      const newDays = [...prevDays];
      const day = { ...newDays[dayIndex] };
      const items = [...day.items];
      
      // Update field yang sesuai (item untuk activity, label untuk expense)
      const item = { ...items[itemIndex] };
      if (item.type === 'activity') {
        item.item = newTitle;
      } else if (item.type === 'expense') {
        item.label = newTitle;
      }
      
      items[itemIndex] = item;
      day.items = items;
      
      // Update activities and expenseItems arrays
      day.activities = items.filter((item) => item.type === "activity");
      day.expenseItems = items.filter((item) => item.type === "expense");
      
      newDays[dayIndex] = day;
      return newDays;
    });
  }, []);

  const editItemDescription = useCallback((dayIndex, itemIndex, newDescription) => {
    setDays(prevDays => {
      const newDays = [...prevDays];
      const day = { ...newDays[dayIndex] };
      const items = [...day.items];
      
      const item = { ...items[itemIndex] };
      item.description = newDescription;
      
      items[itemIndex] = item;
      day.items = items;
      
      // Update activities and expenseItems arrays
      day.activities = items.filter((item) => item.type === "activity");
      day.expenseItems = items.filter((item) => item.type === "expense");
      
      newDays[dayIndex] = day;
      return newDays;
    });
  }, []);

  // Function to manually trigger save (useful for explicit save operations)
  const saveChanges = useCallback(() => {
    if (packageId && days.length > 0 && originalDays.length > 0) {
      const orderData = generateOrderData(days, originalDays);
      saveOrderToStorage(orderData, packageId);
      return true;
    }
    return false;
  }, [days, originalDays, packageId, generateOrderData, saveOrderToStorage]);

  return {
    days,
    originalDays,
    isReordering,
    updateDays,
    moveItemUp,
    moveItemDown,
    moveDayUp,
    moveDayDown,
    toggleReordering,
    resetOrder,
    saveOrder,
    clearSavedOrder,
    editItemDescription,
    editItemTitle,
    saveChanges,
    autoSave,
  };
};

export default useItineraryEditor;