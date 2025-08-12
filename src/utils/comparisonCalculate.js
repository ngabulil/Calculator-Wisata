export const calculatePackageHotelTotal = (packageData, hotels, villas) => {
    if (!packageData?.days || (!hotels && !villas)) return 0;

    let totalHotelPrice = 0;

    packageData.days.forEach((day) => {
        // Hotel
        if (Array.isArray(day.hotels)) {
            day.hotels.forEach((hotel) => {
                const selectedHotel = hotels.find(h => h.id === hotel.id_hotel);
                if (!selectedHotel) return;

                const seasonList = selectedHotel.seasons?.[hotel.season_type] || [];
                const seasonMatch = seasonList.find(
                    s => s.idRoom === hotel.id_tipe_kamar && s.idMusim === hotel.id_musim
                );

                const hargaPerKamar = seasonMatch?.price || 0;
                const jumlahKamar = hotel.jumlahKamar || 1;
                const totalRoomPrice = hargaPerKamar * jumlahKamar;

                let totalExtrabedPrice = 0;
                if (hotel.useExtrabed) {
                    const extrabedData = selectedHotel.extrabed?.find(e => e.idRoom === hotel.id_tipe_kamar);
                    const hargaExtrabed = extrabedData?.price || 0;
                    const jumlahExtrabed = hotel.jumlahExtrabed || 1;
                    totalExtrabedPrice = hargaExtrabed * jumlahExtrabed;
                }

                totalHotelPrice += totalRoomPrice + totalExtrabedPrice;
            });
        }

        // Villa
        if (Array.isArray(day.villas)) {
            day.villas.forEach((villa) => {
                const selectedVilla = villas?.find(v => v.id === villa.id_villa);
                if (!selectedVilla) return;

                const seasonList = selectedVilla.seasons?.[villa.season_type] || [];
                const seasonMatch = seasonList.find(
                    s => s.idRoom === villa.id_tipe_kamar && s.idMusim === villa.id_musim
                );

                const hargaPerVilla = seasonMatch?.price || 0;
                const jumlahVilla = villa.jumlahVilla || 1;
                totalHotelPrice += hargaPerVilla * jumlahVilla;
            });
        }
    });

    return totalHotelPrice;
};

export const calculatePackageTransportTotal = (packageData, mobils) => {
    if (!packageData?.days || !mobils) return 0;

    let totalTransportPrice = 0;

    packageData.days.forEach((day) => {
        // Mobil
        if (Array.isArray(day.mobils)) {
            day.mobils.forEach((mobilData) => {
                const selectedMobil = mobils.find(m => m.id === (mobilData.id_mobil || mobilData.mobil));
                if (!selectedMobil) return;

                const convertKeteranganToCamel = (k) => {
                    const map = {
                        fullday: "fullDay",
                        halfday: "halfDay",
                        inout: "inOut",
                        menginap: "menginap",
                    };
                    return map[k?.toLowerCase()] || k;
                };

                const keterangan = convertKeteranganToCamel(mobilData.keterangan);
                const idArea = mobilData.id_area || mobilData.area;

                if (keterangan && idArea) {
                    const keteranganData = selectedMobil.keterangan[keterangan];
                    if (Array.isArray(keteranganData)) {
                        const areaData = keteranganData.find(a => a.id_area === idArea);
                        if (areaData) {
                            const hargaPerUnit = areaData.price || 0;
                            const jumlah = mobilData.jumlah || 1;
                            totalTransportPrice += hargaPerUnit * jumlah;
                        }
                    }
                }
            });
        }

        // Transport tambahan
        if (Array.isArray(day.transport_additionals)) {
            day.transport_additionals.forEach((additionalData) => {
                const harga = additionalData.harga || 0;
                const jumlah = additionalData.jumlah || 1;
                totalTransportPrice += harga * jumlah;
            });
        }
    });

    return totalTransportPrice;
};

export const calculatePackageTourTotal = (packageData, destinasiData, activitesData, restaurantsData) => {
    if (!packageData?.days) {
        return 0;
    }

    let totalTourPrice = 0;
    const quantityAdult = packageData.totalPaxAdult || 0;
    const quantityChild = packageData.totalPaxChildren || 0;

    packageData.days.forEach((day) => {
        const tourItems = day.tour || [];
        
        tourItems.forEach((tourItem) => {
            let itemPrice = 0;
            
            const formatWisatawan = (typeWisata) => {
                if (typeWisata === "asing") return "foreign";
                return typeWisata || "domestic";
            };
            
            const wisatawanType = formatWisatawan(tourItem.type_wisata);
            if (tourItem.id_destinasi) {
                const destinasi = destinasiData.find(d => d.id === tourItem.id_destinasi);
  
                if (destinasi) {
                    let hargaDewasa = 0;
                    let hargaAnak = 0;

                    if (wisatawanType === 'domestic') {
                        hargaDewasa = destinasi.price_domestic_adult || 0;
                        hargaAnak = destinasi.price_domestic_child || 0;
                    } else if (wisatawanType === 'foreign') {
                        hargaDewasa = destinasi.price_foreign_adult || 0;
                        hargaAnak = destinasi.price_foreign_child || 0;
                    }

                    const destinasiPrice = (hargaDewasa * quantityAdult) + (hargaAnak * quantityChild);
                    itemPrice += destinasiPrice;
                }
            }

            if (tourItem.id_activity && tourItem.id_vendor) {
                const vendor = activitesData.find(v => v.id === tourItem.id_vendor); 
                if (vendor && vendor.activities) {
                    // Cari activity dalam vendor berdasarkan activity_id
                    const activity = vendor.activities.find(a => a.activity_id === tourItem.id_activity);            
                    if (activity) {
                        let hargaDewasa = 0;
                        let hargaAnak = 0;

                        // Sesuai dengan struktur harga di ActivityCard
                        if (wisatawanType === 'domestic') {
                            hargaDewasa = activity.price_domestic_adult || 0;
                            hargaAnak = activity.price_domestic_child || 0;
                        } else if (wisatawanType === 'foreign') {
                            hargaDewasa = activity.price_foreign_adult || 0;
                            hargaAnak = activity.price_foreign_child || 0;
                        }

                        const activityPrice = (hargaDewasa * quantityAdult) + (hargaAnak * quantityChild);
                        itemPrice += activityPrice;
                    }
                }
            }

            // RESTAURANT - Sesuaikan dengan RestoCard.jsx
            if (tourItem.id_resto && tourItem.id_menu) {
                const restaurant = restaurantsData.find(r => r.id === tourItem.id_resto);
                if (restaurant && restaurant.packages) {
                    const packages = restaurant.packages;
                    if (Array.isArray(packages) && packages.length > 0) {
                        const selectedPackage = packages.find(p => p.id_package === tourItem.id_menu);                  
                        if (selectedPackage) {
                            let hargaDewasa = 0;
                            let hargaAnak = 0;

                            if (wisatawanType === 'domestic') {
                                hargaDewasa = selectedPackage.price_domestic_adult || 0;
                                hargaAnak = selectedPackage.price_domestic_child || 0;
                            } else if (wisatawanType === 'foreign') {
                                hargaDewasa = selectedPackage.price_foreign_adult || 0;
                                hargaAnak = selectedPackage.price_foreign_child || 0;
                            }
                            
                            const packagePrice = (hargaDewasa * quantityAdult) + (hargaAnak * quantityChild);
                            itemPrice += packagePrice;
                        }
                    }
                }
            }
            totalTourPrice += itemPrice;
        });
    });

    return totalTourPrice;
};

export const calculatePackageTotalPrice = (packageData, hotels, villas, mobils, destinasiData, activitesData, restaurantsData) => {
    if (!packageData) return 0;

    const akomodasiTotal = calculatePackageHotelTotal(packageData, hotels, villas);

    let akomodasiAdditionalTotal = 0;
    if (packageData.days) {
        packageData.days.forEach((day) => {
            if (Array.isArray(day.akomodasi_additionals)) {
                day.akomodasi_additionals.forEach((additional) => {
                    const price = additional.price || 0;
                    const quantity = additional.quantity || 1;
                    akomodasiAdditionalTotal += price * quantity;
                });
            }
        });
    }

    const transportTotal = calculatePackageTransportTotal(packageData, mobils);

    const totalTourPrice = calculatePackageTourTotal(
        packageData,
        destinasiData || [],
        activitesData || [],
        restaurantsData || []
    );

    return akomodasiTotal + akomodasiAdditionalTotal + transportTotal + totalTourPrice;
};