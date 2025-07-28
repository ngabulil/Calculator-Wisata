// hooks/useItineraryReorder.js
import { useState, useCallback } from "react";

const useItineraryReorder = (initialDays = [], packageId = null) => {
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

  // Generate order data for saving
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
      }

      return orderInfo;
    });

    return {
      dayOrder,
      timestamp: Date.now(),
    };
  }, []);

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
    setIsReordering((prev) => !prev);
  }, []);

  // Save current order
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
  };
};

export default useItineraryReorder;
