import { createContext, useContext } from "react";
import { usePackageContext } from "./PackageContext";


const CalculatePaxContext = createContext();
export const useCalculatePaxContext = () => {
    return useContext(CalculatePaxContext);
};

const CalculatePaxProvider = ({ children }) => {
    const { selectedPackage } = usePackageContext();

    const calculateTourAdultTotal = (days = selectedPackage?.days || []) => {
        return days.reduce((sum, day) => {
            const tours = day.tours || day.tour || [];
            return sum + tours.reduce((tourSum, item) => {
                const adultPrice = Number(item.hargaAdult) || 0;
                const adultCount = Number(item.quantities?.adult) || 0;
                return tourSum + adultPrice * adultCount;
            }, 0);
        }, 0);
    };

    const calculateHotelTotal = (hotels = []) => {
        return hotels.reduce((sum, hotel) => {
            const roomCost =
                (Number(hotel.jumlahKamar) || 0) *
                (Number(hotel.hargaPerKamar) || 0);
            return sum + roomCost;
        }, 0);
    };

    const calculateVillaTotal = (villas = []) => {
        return villas.reduce((sum, villa) => {
            const roomCost =
                (Number(villa.jumlahKamar) || 0) *
                (Number(villa.hargaPerKamar) || 0);
            return sum + roomCost;
        }, 0);
    };

    const calculateAkomodasi = (days = selectedPackage?.days || []) => {
        return days.reduce((sum, day) => {
            const hotelTotal = calculateHotelTotal(day.hotels);
            const villaTotal = calculateVillaTotal(day.villas);
            return sum + hotelTotal + villaTotal;
        }, 0);
    };

    const calculateExtrabedAdultTotal = (days = selectedPackage?.days || []) => {
        return days.reduce((sum, day) => {
            return sum + (day.hotels || []).reduce((acc, hotel) => {
                const adultExtrabedQty = hotel.extrabedByTraveler?.adult?.use
                    ? Number(hotel.extrabedByTraveler.adult.qty) || 0
                    : 0;
                return acc + adultExtrabedQty * (Number(hotel.hargaExtrabed) || 0);
            }, 0);
        }, 0);
    };

    const calculateAdditionalAdultTotal = (days = selectedPackage?.days || []) => {
        return days.reduce((sum, day) => {
            let akomodasiAdult = 0;
            const akomodasiArr = day.akomodasi_additionalsByTraveler?.adult;
            if (Array.isArray(akomodasiArr)) {
                akomodasiAdult = akomodasiArr.reduce((acc, item) => {
                    return acc + (Number(item.harga) || 0) * (Number(item.jumlah) || 1);
                }, 0);
            }

            let transportAdult = 0;
            const transportArr = day.transport_additionals_by_group?.adult;
            if (Array.isArray(transportArr)) {
                transportAdult = transportArr.reduce((acc, item) => {
                    return acc + (Number(item.harga) || 0) * (Number(item.jumlah) || 1);
                }, 0);
            }

            return sum + akomodasiAdult + transportAdult;
        }, 0);
    };

    const calculateTransport = (days = selectedPackage?.days || []) => {
        return days.reduce((sum, day) => {
            return sum + (day.mobils || []).reduce((acc, mobil) => {
                return acc + (Number(mobil.harga) || 0);
            }, 0);
        }, 0);
    };

    const calculateTourChildTotals = (days = selectedPackage?.days || [], childGroups = []) => {
        const result = {};

        childGroups.forEach(group => {
            const groupId = group.id;
            let total = 0;

            days.forEach(day => {
            const tours = day.tours || day.tour || [];
            tours.forEach(item => {
                const childCount = Number(item.quantities?.[groupId]) || 0;
                const childPrice = Number(item.hargaChild) || 0;
                total += childCount * childPrice;
            });
            });

            result[groupId] = total;
        });

        return result;
        };

    const calculateExtrabedChildTotals = (days = selectedPackage?.days || [], childGroups = []) => {
    const result = {};

    childGroups.forEach(group => {
        const groupId = group.id;
        let total = 0;

        days.forEach(day => {
        (day.hotels || []).forEach(hotel => {
            const childExtrabed = hotel.extrabedByTraveler?.[groupId];
            if (childExtrabed?.use) {
            total += (Number(childExtrabed.qty) || 0) * (Number(hotel.hargaExtrabed) || 0);
            }
        });

        (day.villas || []).forEach(villa => {
            const childExtrabed = villa.extrabedByTraveler?.[groupId];
            if (childExtrabed?.use) {
            total += (Number(childExtrabed.qty) || 0) * (Number(villa.hargaExtrabed) || 0);
            }
        });
        });

        result[groupId] = total;
    });

    return result;
    };

    const calculateAdditionalChildTotals = (days = selectedPackage?.days || [], childGroups = []) => {
        const result = {};

        childGroups.forEach(group => {
            const groupId = group.id;
            let total = 0;

            days.forEach(day => {
                const akomodasiArr = day.akomodasi_additionalsByTraveler?.[groupId];
                if (Array.isArray(akomodasiArr)) {
                    akomodasiArr.forEach(item => {
                        total += (Number(item.harga) || 0) * (Number(item.jumlah) || 1);
                    });
                }
                const transportArr = day.transport_additionals_by_group?.[groupId];
                if (Array.isArray(transportArr)) {
                    transportArr.forEach(item => {
                        total += (Number(item.harga) || 0) * (Number(item.jumlah) || 1);
                    });
                }
            });

            result[groupId] = total;
        });

        return result;
    };

    const tourAdult = calculateTourAdultTotal(selectedPackage?.days || []);
    const akomodasiTotal = calculateAkomodasi(selectedPackage?.days || []);
    const extrabedTotal = calculateExtrabedAdultTotal(selectedPackage?.days || []);
    const additionalAdultTotal = calculateAdditionalAdultTotal(selectedPackage?.days || []);
    console.log("add ADult",additionalAdultTotal)
    const transportTotal = calculateTransport(selectedPackage?.days || []);

    const adultSubtotal = (tourAdult + akomodasiTotal + extrabedTotal + additionalAdultTotal + transportTotal) / (selectedPackage?.totalPaxAdult || 1);

    const tourChild = calculateTourChildTotals(selectedPackage?.days || [], selectedPackage?.childGroups || []);
    const extrabedChild = calculateExtrabedChildTotals(selectedPackage?.days || [], selectedPackage?.childGroups || []);
    const additionalChild = calculateAdditionalChildTotals(selectedPackage?.days || [], selectedPackage?.childGroups || []);
    
    const childSubtotal = {};
    (selectedPackage?.childGroups || []).forEach((group) => {
        const id = group.id;
        const totalChildren = Number(group.total) || 1; 
        const groupTotal = tourChild[id] + extrabedChild[id] + additionalChild[id];

        childSubtotal[id] = groupTotal / totalChildren;
    });
    const value = {
        calculateTourAdultTotal,
        calculateAdditionalAdultTotal,
        calculateTransport,
        calculateAdditionalChildTotals,
        calculateExtrabedChildTotals,
        calculateTourChildTotals,
        adultSubtotal,
        childSubtotal
    };
    return (
        <CalculatePaxContext.Provider value={value}>
            {children}
        </CalculatePaxContext.Provider>
    );
};

export default CalculatePaxProvider;