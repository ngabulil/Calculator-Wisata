import {
  Box, Button, FormLabel, HStack, IconButton, Input,
  NumberInput, NumberInputField, Select, Text, VStack
} from "@chakra-ui/react"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"

const menuOptions = [
  "Buffet Lunch",
  "Set Menu Lunch",
  "Seafood Dinner",
  "Traditional Balinese",
  "Vegan Menu"
]

const RestaurantForm = ({ onChange }) => {
  const [restaurantName, setRestaurantName] = useState("")
  const [menu, setMenu] = useState("")
  const [visitorCount, setVisitorCount] = useState(1)
  const [list, setList] = useState([])

  useEffect(() => {
    onChange?.(list)
  }, [list, onChange])

  const handleAddRestaurant = () => {
    if (!restaurantName || !menu || visitorCount <= 0) return

    const newItem = {
      restaurantName,
      menu,
      visitorCount
    }

    setList([...list, newItem])
    setRestaurantName("")
    setMenu("")
    setVisitorCount(1)
  }

  const handleDelete = (index) => {
    setList(list.filter((_, i) => i !== index))
  }

  return (
    <Box>
      <Text fontWeight="bold" fontSize="lg" mb={2}>🍽️ Restaurant & Menu</Text>
      <VStack spacing={4} align="stretch">
        <Box>
          <FormLabel>Nama Restaurant</FormLabel>
          <Input
            placeholder="Contoh: Warung Bambu Bali"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
          />
        </Box>

        <Box>
          <FormLabel>List Menu</FormLabel>
          <Select
            placeholder="Pilih menu"
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
          >
            {menuOptions.map((m, idx) => (
              <option key={idx} value={m}>{m}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <FormLabel>Jumlah Pengunjung</FormLabel>
          <NumberInput
            min={1}
            value={visitorCount}
            onChange={(_, val) => setVisitorCount(isNaN(val) ? 1 : val)}
          >
            <NumberInputField />
          </NumberInput>
        </Box>

        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAddRestaurant}>
          Tambah Restaurant
        </Button>

        {list.length > 0 && (
          <Box pt={4}>
            <Text fontWeight="semibold">Daftar Restaurant:</Text>
            {list.map((item, idx) => (
              <Box key={idx} p={3} borderWidth="1px" rounded="md" mt={2}>
                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="medium">{item.restaurantName}</Text>
                    <Text fontSize="sm" color="gray.600">
                      Menu: {item.menu} <br />
                      Pengunjung: {item.visitorCount}
                    </Text>
                  </Box>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    aria-label="hapus"
                    onClick={() => handleDelete(idx)}
                  />
                </HStack>
              </Box>
            ))}
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default RestaurantForm
