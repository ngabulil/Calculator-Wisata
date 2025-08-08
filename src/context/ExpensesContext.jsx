import React from "react";
import { usePackageContext } from "./PackageContext";

const ExpensesContext = React.createContext();

export const useExpensesContext = () => {
    return React.useContext(ExpensesContext);
};

const ExpensesContextProvider = ({ children }) => {
    const [days, setDays] = React.useState([
        {
            id: 1,
            day_name: "Day 1",
            day_description: "",
            totals: [],
        },
    ]);

    const [hotelItems, setHotelItems] = React.useState([]);
    const [villaItems, setVillaItems] = React.useState([]);
    const [accommodationMarkup, setAccommodationMarkup] = React.useState({ type: "percent", value: 0 });
    
    // State untuk menyimpan hotel yang sedang dalam proses input
    const [tempHotelItems, setTempHotelItems] = React.useState([]);
    const [tempVillaItems, setTempVillaItems] = React.useState([]);

    const { selectedPackage } = usePackageContext();

    React.useEffect(() => {
    }, [selectedPackage]);

    const updateDay = (index, updatedDay) => {
        setDays((prev) => {
            const newDays = [...prev];
            newDays[index] = { ...newDays[index], ...updatedDay };
            return newDays;
        });
    };

    const applyMarkup = (price, markup) => {
        if (markup.type === "percent") {
            return price + (price * (markup.value / 100));
        }
        return price + markup.value;
    };

    const updateAccommodationMarkup = (markup) => {
        setAccommodationMarkup(markup);
    };

    const addDay = () => {
        setDays((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                day_name: `Day ${prev.length + 1}`,
                day_description: "",
                totals: [],
            },
        ]);
    };

    const removeDay = (index) => {
        setDays((prev) => {
            const newDays = prev.filter((_, i) => i !== index);
            return newDays.map((day, i) => ({
                ...day,
                id: i + 1,
                day_name: `Day ${i + 1}`,
            }));
        });
    };

    const updateDayDescription = (dayIndex, description) => {
        setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex] = { ...newDays[dayIndex], day_description: description };
            return newDays;
        });
    };

    const addExpenseItem = (dayIndex) => {
        let newItemIndex; 
        setDays((prev) => {
            const newDays = [...prev];
            newItemIndex = newDays[dayIndex].totals.length; 
            newDays[dayIndex].totals.push({
                label: "",
                description: "",
                price: null,
                adultPrice: null,
                childPrice: null,
                quantity: 1,
                unit: "item",
                isEditing: true, 
            });
            return newDays;
        });
        return newItemIndex; 
    };

    const removeExpenseItem = (dayIndex, itemIndex) => {
        setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex].totals = newDays[dayIndex].totals.filter(
                (_, i) => i !== itemIndex
            );
            return newDays;
        });
    };

    const updateExpenseItem = (dayIndex, itemIndex, key, value) => {
        setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex].totals[itemIndex] = {
                ...newDays[dayIndex].totals[itemIndex],
                [key]: value,
            };
            return newDays;
        });
    };

    // Fungsi untuk mengelola hotel items - MODIFIED
    const addTempHotelItem = () => {
        const tempId = Date.now(); // Generate unique temporary ID
        setTempHotelItems(prev => [...prev, {
            tempId,
            isTemporary: true
        }]);
        return tempId;
    };

    const updateTempHotelItem = (tempId, updatedItem) => {
        setTempHotelItems(prev => {
            const newItems = [...prev];
            const index = newItems.findIndex(item => item.tempId === tempId);
            if (index !== -1) {
                newItems[index] = { ...newItems[index], ...updatedItem };
                
                // Check if item has price and should be moved to permanent array
                const item = newItems[index];
                if (item.hargaPerKamar && item.hargaPerKamar > 0) {
                    // Move to permanent array
                    const permanentItem = { ...item };
                    delete permanentItem.tempId;
                    delete permanentItem.isTemporary;
                    
                    setHotelItems(prevHotels => [...prevHotels, permanentItem]);
                    
                    // Remove from temporary array
                    setTempHotelItems(prevTemp => prevTemp.filter(tempItem => tempItem.tempId !== tempId));
                }
            }
            return newItems;
        });
    };

    const removeTempHotelItem = (tempId) => {
        setTempHotelItems(prev => prev.filter(item => item.tempId !== tempId));
    };

    // Fungsi untuk hotel permanent (sudah ada harga)
    const updateHotelItem = (index, updatedItem) => {
        setHotelItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], ...updatedItem };
            return newItems;
        });
    };

    const removeHotelItem = (index) => {
        setHotelItems(prev => prev.filter((_, i) => i !== index));
    };

    // Fungsi untuk mengelola villa items - MODIFIED (similar pattern)
    const addTempVillaItem = () => {
        const tempId = Date.now();
        setTempVillaItems(prev => [...prev, {
            tempId,
            isTemporary: true
        }]);
        return tempId;
    };

    const updateTempVillaItem = (tempId, updatedItem) => {
        setTempVillaItems(prev => {
            const newItems = [...prev];
            const index = newItems.findIndex(item => item.tempId === tempId);
            if (index !== -1) {
                newItems[index] = { ...newItems[index], ...updatedItem };
                
                // Check if item has price and should be moved to permanent array
                const item = newItems[index];
                if (item.hargaPerKamar && item.hargaPerKamar > 0) {
                    // Move to permanent array
                    const permanentItem = { ...item };
                    delete permanentItem.tempId;
                    delete permanentItem.isTemporary;
                    
                    setVillaItems(prevVillas => [...prevVillas, permanentItem]);
                    
                    // Remove from temporary array
                    setTempVillaItems(prevTemp => prevTemp.filter(tempItem => tempItem.tempId !== tempId));
                }
            }
            return newItems;
        });
    };

    const removeTempVillaItem = (tempId) => {
        setTempVillaItems(prev => prev.filter(item => item.tempId !== tempId));
    };

    const updateVillaItem = (index, updatedItem) => {
        setVillaItems(prev => {
            const newItems = [...prev];
            newItems[index] = { ...newItems[index], ...updatedItem };
            return newItems;
        });
    };

    const removeVillaItem = (index) => {
        setVillaItems(prev => prev.filter((_, i) => i !== index));
    };

    const calculateDayTotal = (dayIndex) => {
        const day = days[dayIndex];
        if (!day || !day.totals) return 0;
        
        // Gunakan nilai dari selectedPackage
        const totalAdult = selectedPackage?.totalPaxAdult || 0;
        const totalChild = selectedPackage?.totalPaxChildren || 0;
        
        return day.totals.reduce((total, item) => {
            if (item.adultPrice !== null || item.childPrice !== null) {
                const adultTotal = (item.adultPrice || 0) * totalAdult;
                const childTotal = (item.childPrice || 0) * totalChild;
                return total + adultTotal + childTotal;
            }
            
            const price = item.price || 0;
            const quantity = item.quantity || 1;
            return total + (price * quantity);
        }, 0);
    };

    const calculateGrandTotal = () => {
        return days.reduce((total, _, dayIndex) => {
            return total + calculateDayTotal(dayIndex);
        }, 0);
    };

    // Fungsi untuk menghitung total harga hotel
    const calculateHotelTotal = () => {
        const total = hotelItems.reduce((acc, item) => {
            return acc + (item.price || 0);
        }, 0);
        return applyMarkup(total, accommodationMarkup);
    };

    // Modifikasi fungsi untuk menghitung total harga villa agar menggunakan markup baru
    const calculateVillaTotal = () => {
        const total = villaItems.reduce((acc, item) => {
            return acc + (item.price || 0);
        }, 0);
        return applyMarkup(total, accommodationMarkup);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <ExpensesContext.Provider 
            value={{ 
                days, 
                setDays, 
                updateDay,
                addDay,
                removeDay,
                updateDayDescription,
                addExpenseItem,
                removeExpenseItem,
                updateExpenseItem,
                calculateDayTotal,
                calculateGrandTotal,
                formatCurrency,
                // Hotel management - UPDATED
                hotelItems,
                setHotelItems,
                addTempHotelItem, // New function
                updateTempHotelItem, // New function
                removeTempHotelItem, // New function
                tempHotelItems, // New state
                updateHotelItem,
                removeHotelItem,
                calculateHotelTotal,
                // Villa management - UPDATED
                villaItems,
                setVillaItems,
                addTempVillaItem, // New function
                updateTempVillaItem, // New function
                removeTempVillaItem, // New function
                tempVillaItems, // New state
                updateVillaItem,
                removeVillaItem,
                calculateVillaTotal,
                accommodationMarkup,
                updateAccommodationMarkup,
            }}
        >
            {children}
        </ExpensesContext.Provider>
    );
};

export default ExpensesContextProvider;