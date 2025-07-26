// hooks/useItineraryReorder.js
import { useState, useCallback } from 'react';

const useItineraryReorder = (initialDays = [], packageId = null) => {
  const [days, setDays] = useState(initialDays);
  const [originalDays, setOriginalDays] = useState(initialDays);
  const [isReordering, setIsReordering] = useState(false);

  // Generate storage key based on package ID
  const getStorageKey = useCallback((pkgId) => {
    return pkgId ? `itinerary_order_${pkgId}` : null;
  }, []);

  // Save order to localStorage
  const saveOrderToStorage = useCallback((orderData, pkgId) => {
    const key = getStorageKey(pkgId);
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(orderData));
      } catch (error) {
        console.error('Failed to save itinerary order to localStorage:', error);
      }
    }
  }, [getStorageKey]);

  // Load order from localStorage
  const loadOrderFromStorage = useCallback((pkgId) => {
    const key = getStorageKey(pkgId);
    if (key) {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : null;
      } catch (error) {
        console.error('Failed to load itinerary order from localStorage:', error);
        return null;
      }
    }
    return null;
  }, [getStorageKey]);

  // Apply saved order to days data
  const applySavedOrder = useCallback((daysData, savedOrder) => {
    if (!savedOrder || !Array.isArray(savedOrder.dayOrder)) {
      return daysData;
    }

    try {
      // Reorder days based on saved order
      const reorderedDays = savedOrder.dayOrder.map(dayOrderInfo => {
        const originalDay = daysData.find(day => day.day === dayOrderInfo.originalDay);
        if (!originalDay) return null;

        const reorderedDay = { ...originalDay, day: dayOrderInfo.newDay };

        // Apply item orders if they exist
        if (dayOrderInfo.itemOrders) {
          // Reorder activities
          if (dayOrderInfo.itemOrders.activities && originalDay.activities) {
            reorderedDay.activities = dayOrderInfo.itemOrders.activities.map(index => 
              originalDay.activities[index]
            ).filter(Boolean);
          }

          // Reorder expense items
          if (dayOrderInfo.itemOrders.expenseItems && originalDay.expenseItems) {
            reorderedDay.expenseItems = dayOrderInfo.itemOrders.expenseItems.map(index => 
              originalDay.expenseItems[index]
            ).filter(Boolean);
          }
        }

        return reorderedDay;
      }).filter(Boolean);

      return reorderedDays.length === daysData.length ? reorderedDays : daysData;
    } catch (error) {
      console.error('Failed to apply saved order:', error);
      return daysData;
    }
  }, []);

  // Generate order data for saving
  const generateOrderData = useCallback((currentDays, originalDays) => {
    const dayOrder = currentDays.map((day, newIndex) => {
      // Find original day number
      const originalDay = originalDays.find(orig => 
        orig.title === day.title && orig.date === day.date
      );
      
      const orderInfo = {
        originalDay: originalDay ? originalDay.day : day.day,
        newDay: newIndex + 1,
        itemOrders: {}
      };

      // Save activities order
      if (day.activities && originalDay?.activities) {
        orderInfo.itemOrders.activities = day.activities.map(activity => 
          originalDay.activities.findIndex(orig => orig.item === activity.item)
        ).filter(index => index !== -1);
      }

      // Save expense items order - IMPROVED matching
      if (day.expenseItems && originalDay?.expenseItems) {
        orderInfo.itemOrders.expenseItems = day.expenseItems.map(expenseItem => 
          originalDay.expenseItems.findIndex(orig => 
            // Try multiple fields for matching
            orig.label === expenseItem.label || 
            orig.id === expenseItem.id ||
            (orig.description === expenseItem.description && orig.price === expenseItem.price)
          )
        ).filter(index => index !== -1);
      }

      return orderInfo;
    });

    return {
      dayOrder,
      timestamp: Date.now()
    };
  }, []);

  // Update days when initial data changes
  const updateDays = useCallback((newDays) => {
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
  }, [packageId, loadOrderFromStorage, applySavedOrder]);

  // Move item up within a day - ENHANCED to support all item types
  const moveItemUp = useCallback((dayIndex, itemIndex, itemType = 'activities') => {
    if (itemIndex === 0) return;

    setDays(prevDays => {
      const newDays = [...prevDays];
      const day = { ...newDays[dayIndex] };
      const items = [...(day[itemType] || [])];
      
      // Swap items
      [items[itemIndex - 1], items[itemIndex]] = [items[itemIndex], items[itemIndex - 1]];
      
      day[itemType] = items;
      newDays[dayIndex] = day;
      
      return newDays;
    });
  }, []);

  // Move item down within a day - ENHANCED to support all item types
  const moveItemDown = useCallback((dayIndex, itemIndex, itemType = 'activities') => {
    setDays(prevDays => {
      const day = prevDays[dayIndex];
      const items = day[itemType] || [];
      
      if (itemIndex >= items.length - 1) return prevDays;

      const newDays = [...prevDays];
      const newDay = { ...newDays[dayIndex] };
      const newItems = [...items];
      
      // Swap items
      [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
      
      newDay[itemType] = newItems;
      newDays[dayIndex] = newDay;
      
      return newDays;
    });
  }, []);

  // Move day up
  const moveDayUp = useCallback((dayIndex) => {
    if (dayIndex === 0) return;

    setDays(prevDays => {
      const newDays = [...prevDays];
      [newDays[dayIndex - 1], newDays[dayIndex]] = [newDays[dayIndex], newDays[dayIndex - 1]];
      
      // Update day numbers
      newDays.forEach((day, index) => {
        day.day = index + 1;
      });
      
      return newDays;
    });
  }, []);

  // Move day down
  const moveDayDown = useCallback((dayIndex) => {
    setDays(prevDays => {
      if (dayIndex >= prevDays.length - 1) return prevDays;

      const newDays = [...prevDays];
      [newDays[dayIndex], newDays[dayIndex + 1]] = [newDays[dayIndex + 1], newDays[dayIndex]];
      
      // Update day numbers
      newDays.forEach((day, index) => {
        day.day = index + 1;
      });
      
      return newDays;
    });
  }, []);

  // Toggle reordering mode
  const toggleReordering = useCallback(() => {
    setIsReordering(prev => !prev);
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
        console.error('Failed to clear saved order:', error);
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