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

    const { selectedPackage } = usePackageContext();

    const updateDay = (index, updatedDay) => {
        setDays((prev) => {
            const newDays = [...prev];
            newDays[index] = { ...newDays[index], ...updatedDay };
            return newDays;
        });
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

 const calculateDayTotal = (dayIndex) => {
        const day = days[dayIndex];
        if (!day || !day.totals) return 0;
        
        // Gunakan nilai dari selectedPackage
        const totalAdult = selectedPackage?.totalPaxAdult || 1;
        const totalChild = selectedPackage?.totalPaxChildren || 1;
        
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
            }}
        >
            {children}
        </ExpensesContext.Provider>
    );
};

export default ExpensesContextProvider;