import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Box, Button } from '@chakra-ui/react';
import InvoiceHeader from '../components/InvoicePDF/InvoiceHeader';
import ItineraryTable from '../components/InvoicePDF/ItineraryTable';
import CostBreakDown from '../components/InvoicePDF/CostBreakDown';
import { useExpensesContext } from '../context/ExpensesContext'; //
import { useAkomodasiContext } from '../context/AkomodasiContext';
import { useTransportContext } from '../context/TransportContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
};

const InvoicePDF = forwardRef ((props, ref) => {
    const { days: expensesDays, calculateGrandTotal: calculateExpensesGrandTotal, tourCode } = useExpensesContext();
    const { days: akomodasiDays } = useAkomodasiContext();
    const { days: transportDays } = useTransportContext();

    const hitungTotalHotel = (hotels) =>
        hotels.reduce((total, h) => {
            const extrabed = h.useExtrabed
                ? (h.jumlahExtrabed || 0) * (h.hargaExtrabed || 0)
                : 0;
            return total + (h.jumlahKamar || 0) * (h.hargaPerKamar || 0) + extrabed;
        }, 0);

    const hitungTotalVilla = (villas) =>
        villas.reduce((total, v) => {
            const extrabed = v.useExtrabed
                ? (v.jumlahExtrabed || 0) * (v.hargaExtrabed || 0)
                : 0;
            return total + (v.jumlahKamar || 0) * (v.hargaPerKamar || 0) + extrabed;
        }, 0);

    const hitungTotalAdditional = (additional) =>
        additional.reduce((total, a) => {
            return total + (a.jumlah || 0) * (a.harga || 0);
        }, 0);

    const hitungTotalTransportMobil = (mobils) =>
        mobils.reduce((total, m) => {
            return total + (m.harga || 0) * (m.jumlah || 1);
        }, 0);

    const getAdditionalData = () => {
        const additionalItems = [];

        akomodasiDays.forEach((day) => {
            if (day.additionalInfo && day.additionalInfo.length > 0) {
                day.additionalInfo.forEach(item => {
                    additionalItems.push({
                        name: item.name || item.nama || "-",
                        quantity: item.jumlah || 1,
                        price: item.harga || 0,
                        total: (item.harga || 0) * (item.jumlah || 1)
                    });
                });
            }
        });

        transportDays.forEach((day) => {
            if (day.additionalInfo && day.additionalInfo.length > 0) {
                day.additionalInfo.forEach(item => {
                    additionalItems.push({
                        name: item.name || item.nama || "-",
                        quantity: item.jumlah || 1,
                        price: item.harga || 0,
                        total: (item.harga || 0) * (item.jumlah || 1)
                    });
                });
            }
        });

        return additionalItems;
    };

    const [itineraryData, setItineraryData] = useState({
        code: "", 
        totalPax: "",
        totalFee: "",
        days: [],
        hotelChoices: [],
        grandTotal: 0,
        perPax: 0,
        selling: 0,
        additionalData: [],
        totalAdditional: 0
    });

    const [hotelData, setHotelData] = useState([]);
    const [transportData, setTransportData] = useState([]);

    const componentRef = useRef();

useImperativeHandle(ref, () => ({
        async exportAsBlob() {
            const input = componentRef.current;
            const canvas = await html2canvas(input, { scale: 1 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            return pdf.output('blob');
        }
    }));

    useEffect(() => {
        const mappedExpensesDays = expensesDays.map((day, index) => ({
            day: index + 1,
            title: day.day_name,
            description: day.day_description,
            activities: day.totals.map(item => ({
                item: item.label,
                expense: item.price !== null ? formatCurrency(item.price) : ""
            }))
        }));

        const processedHotelData = [];
        akomodasiDays.forEach((day, dayIndex) => {
            if (day.hotels && day.hotels.length > 0) {
                day.hotels.forEach(hotel => {
                    const totalPerHotel = (hotel.hargaPerKamar || 0) * (hotel.jumlahKamar || 1);
                    const extrabed = hotel.useExtrabed ? (hotel.jumlahExtrabed || 0) * (hotel.hargaExtrabed || 0) : 0;
                    processedHotelData.push({
                        day: `Day${dayIndex + 1}`,
                        name: hotel.hotel?.label || "-",
                        pricePerNight: hotel.hargaPerKamar || 0,
                        nights: hotel.jumlahKamar || 1,
                        rooms: hotel.jumlahKamar || 1,
                        total: totalPerHotel + extrabed
                    });
                });
            }

            if (day.villas && day.villas.length > 0) {
                day.villas.forEach(villa => {
                    const totalPerVilla = (villa.hargaPerKamar || 0) * (villa.jumlahKamar || 1);
                    const extrabed = villa.useExtrabed ? (villa.jumlahExtrabed || 0) * (villa.hargaExtrabed || 0) : 0;
                    processedHotelData.push({
                        day: `Day ${dayIndex + 1}`,
                        name: villa.villa?.label || "-",
                        pricePerNight: villa.hargaPerKamar || 0,
                        nights: villa.jumlahKamar || 1,
                        rooms: villa.jumlahKamar || 1,
                        total: totalPerVilla + extrabed
                    });
                });
            }
        });

        const processedTransportData = [];
        transportDays.forEach((day, dayIndex) => {
            if (day.mobils && day.mobils.length > 0) {
                day.mobils.forEach(mobil => {
                    processedTransportData.push({
                        description: `Day ${dayIndex + 1} ${mobil.mobil?.label || mobil.name || "-"}`,
                        price: (mobil.harga || 0) * (mobil.jumlah || 1)
                    });
                });
            }
        });

        const grandTotalAkomodasi = akomodasiDays.reduce((sum, day) => {
            const totalHotel = hitungTotalHotel(day.hotels || []);
            const totalVilla = hitungTotalVilla(day.villas || []);
            const totalAdditional = hitungTotalAdditional(day.additionalInfo || []);
            const subtotal = totalHotel + totalVilla + totalAdditional;

            const markup = day.markup || { type: "percent", value: 0 };
            const markupAmount =
                markup.type === "amount" ? markup.value : (markup.value / 100) * subtotal;

            return sum + subtotal + markupAmount;
        }, 0);

        const grandTotalTransport = transportDays.reduce((sum, day) => {
            const totalMobil = hitungTotalTransportMobil(day.mobils || []);
            const totalAdditional = hitungTotalAdditional(day.additionalInfo || []);
            const subtotal = totalMobil + totalAdditional;

            const markup = day.markup || { type: "percent", value: 0 };
            const markupAmount =
                markup.type === "amount" ? markup.value : (markup.value / 100) * subtotal;

            return sum + subtotal + markupAmount;
        }, 0);

        const expensesGrandTotal = calculateExpensesGrandTotal();
        const combinedGrandTotal = grandTotalAkomodasi + grandTotalTransport + expensesGrandTotal;
        const currentTotalPax = parseFloat(itineraryData.totalPax.replace(" Pax", ""));

        const totalMarkupAkomodasi = akomodasiDays.reduce((sum, day) => {
            const totalHotel = hitungTotalHotel(day.hotels || []);
            const totalVilla = hitungTotalVilla(day.villas || []);
            const totalAdditional = hitungTotalAdditional(day.additionalInfo || []);
            const subtotal = totalHotel + totalVilla + totalAdditional;
            const markup = day.markup || { type: "percent", value: 0 };
            const markupAmount =
                markup.type === "amount" ? markup.value : (markup.value / 100) * subtotal;
            return sum + markupAmount;
        }, 0);

        const totalMarkupTransport = transportDays.reduce((sum, day) => {
            const totalMobil = hitungTotalTransportMobil(day.mobils || []);
            const totalAdditional = hitungTotalAdditional(day.additionalInfo || []);
            const subtotal = totalMobil + totalAdditional;
            const markup = day.markup || { type: "percent", value: 0 };
            const markupAmount =
                markup.type === "amount" ? markup.value : (markup.value / 100) * subtotal;
            return sum + markupAmount;
        }, 0);

        const totalMarkup = totalMarkupAkomodasi + totalMarkupTransport;

        const calculatedPerPax = currentTotalPax > 0 ? totalMarkup / currentTotalPax : 0;
        const calculatedSelling = combinedGrandTotal / 2;

        const additionalData = getAdditionalData();
        const totalAdditional = additionalData.reduce((sum, item) => sum + item.total, 0);

        setHotelData(processedHotelData);
        setTransportData(processedTransportData);

        setItineraryData(prevData => ({
            ...prevData,
            code: tourCode || prevData.code, // Gunakan tourCode dari konteks, atau default jika kosong
            totalFee: formatCurrency(expensesGrandTotal),
            days: mappedExpensesDays,
            hotelChoices: akomodasiDays.flatMap((day) => {
                const choices = [];
                if (day.hotels) {
                    day.hotels.forEach(hotel => {
                        choices.push({
                            name: hotel.hotel?.label || "-",
                            roomType: hotel.roomType && hotel.roomType.length > 0 ? hotel.roomType[0].label : "(Superior Room)",
                            price: hotel.hargaPerKamar ? formatCurrency(hotel.hargaPerKamar) : ""
                        });
                    });
                }
                if (day.villas) {
                    day.villas.forEach(villa => {
                        choices.push({
                            name: villa.villa?.label || "-",
                            roomType: villa.roomType && villa.roomType.length > 0 ? villa.roomType[0].label : "(Superior Room)",
                            price: villa.hargaPerKamar ? formatCurrency(villa.hargaPerKamar) : ""
                        });
                    });
                }
                return choices;
            }),
            grandTotal: combinedGrandTotal,
            perPax: calculatedPerPax,
            selling: calculatedSelling,
            additionalData,
            totalAdditional
        }));
    }, [expensesDays, akomodasiDays, transportDays, calculateExpensesGrandTotal, itineraryData.totalPax, tourCode]); // Tambahkan tourCode ke dependency array

    return (
        <>
            <Box
                ref={componentRef}
                data-pdf-content
                width="794px"
                minHeight="1123px"
                mx="auto"
                p="40px"
                bg="white"
                display="block !important"
                fontFamily="Arial, sans-serif"
                fontSize="14px"
                lineHeight="1.4"
                color="#000000"
                boxSizing="border-box"
                sx={{
                    '& img': {
                        display: 'block !important',
                        maxWidth: '100%',
                        height: 'auto'
                    },
                    '& table': {
                        borderCollapse: 'collapse',
                        width: '100%',
                        marginBottom: '20px'
                    },
                    '& th, & td': {
                        border: '1px solid #ddd',
                        padding: '8px',
                        textAlign: 'left',
                        verticalAlign: 'top'
                    },
                    '& th': {
                        backgroundColor: '#FB8C00',
                        color: '#000000',
                        fontWeight: 'bold'
                    }
                }}
            >
                <InvoiceHeader
                    code={itineraryData.code}
                    totalPax={itineraryData.totalPax} 
                />

                <ItineraryTable
                    days={itineraryData.days} //
                    formatCurrency={formatCurrency}
                />

                <CostBreakDown
                    hotelData={hotelData}
                    transportData={transportData}
                    additionalData={itineraryData.additionalData} //
                    totalAdditional={itineraryData.totalAdditional} //
                    grandTotal={itineraryData.grandTotal} //
                    perPax={itineraryData.perPax} //
                    selling={itineraryData.selling} //
                    formatCurrency={formatCurrency}
                />
            </Box>
        </>
    );
});

export default InvoicePDF;