import { Button, Flex, Text, useToast } from "@chakra-ui/react"
import useCalculator from "../hooks/useCalculator"
import { generateWhatsAppMessage } from "../utils/whatsappFormatter"
import { v4 as uuidv4 } from "uuid"

const SubmitBar = ({ onReset }) => {
  const {
    hotels, villas, tours, extras, totalPrice, resetAll
  } = useCalculator()

  const toast = useToast()

  const isEmpty =
    hotels.length === 0 &&
    villas.length === 0 &&
    tours.length === 0 &&
    extras.length === 0

  if (isEmpty) return null

  const handleSaveToHistory = () => {
    const item = {
      id: uuidv4(),
      guestName: "Budi",
      agent: "Fikri",
      date: new Date().toISOString().slice(0, 10),
      hotels, villas, tours, extras,
      totalPrice
    }

    try {
      const existing = JSON.parse(localStorage.getItem("calc_history") || "[]")
      const updated = [...existing, item]
      localStorage.setItem("calc_history", JSON.stringify(updated))

      toast({
        title: "Disimpan ke Riwayat.",
        description: "Simulasi berhasil disimpan.",
        status: "success",
        duration: 3000,
        isClosable: true
      })
    } catch (e) {
      if (e.name === "QuotaExceededError" || e.code === 22) {
        toast({
          title: "Penyimpanan penuh!",
          description: "LocalStorage penuh. Silakan hapus beberapa riwayat.",
          status: "error",
          duration: 5000,
          isClosable: true
        })
      } else {
        toast({
          title: "Gagal menyimpan.",
          description: "Terjadi kesalahan tidak terduga.",
          status: "error",
          duration: 4000,
          isClosable: true
        })
        console.error("Error saving to localStorage:", e)
      }
    }
  }

  const handleWhatsApp = () => {
    const message = generateWhatsAppMessage({
      hotels, villas, tours, extras, total: totalPrice
    })

    const number = "6281338905757"
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    window.open(url, "_blank")
  }

  const handleReset = () => {
    resetAll()
    localStorage.removeItem("calc_history") // 
    toast({
      title: "🔄 Reset berhasil.",
      description: "Semua data telah dikosongkan.",
      status: "info",
      duration: 3000,
      isClosable: true
    })
    onReset?.()
  }

  return (
    <Flex
      justify="space-between"
      align="center"
      bg="gray.100"
      p={4}
      position="sticky"
      bottom={0}
      zIndex={10}
      background="blackAlpha.800"
      color="white"
    >
      <Text fontWeight="bold">
        Total: Rp {totalPrice.toLocaleString("id-ID")}
      </Text>

      <Flex gap={2}>
        <Button colorScheme="green" onClick={handleWhatsApp}>
          Kirim via WhatsApp
        </Button>
        <Button onClick={handleReset}>
          Reset
        </Button>
        <Button colorScheme="blue" onClick={handleSaveToHistory}>
          Simpan
        </Button>
      </Flex>
    </Flex>
  )
}

export default SubmitBar
