import {
  Box, Button, FormLabel, HStack, IconButton, Input, Select, Textarea, VStack
} from "@chakra-ui/react"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { useState, useEffect } from "react"

const predefinedPackages = [
  { label: "Custom", value: "custom" },
  { label: "Package 1 - 1 day Nusa Penida", value: "nusa-penida" },
  { label: "Package 2 - 1 day Ubud", value: "ubud" },
  { label: "Package 3 - 1 day Uluwatu", value: "uluwatu" },
]

const TourHeaderForm = ({ onChange }) => {
  const [packageName, setPackageName] = useState("")
  const [packageType, setPackageType] = useState("custom")
  const [days, setDays] = useState([{ title: "Day 1", description: "" }])

  useEffect(() => {
    onChange?.({ packageName, packageType, days })
  }, [packageName, packageType, days, onChange])

  const handleAddDay = () => {
    const newDay = {
      title: `Day ${days.length + 1}`,
      description: "",
    }
    setDays([...days, newDay])
  }

  const handleDeleteDay = (index) => {
    const updatedDays = days.filter((_, i) => i !== index)
    setDays(updatedDays)
  }

  const handleDayChange = (index, value) => {
    const updated = [...days]
    updated[index].description = value
    setDays(updated)
  }

  return (
    <Box>
      <VStack align="stretch" spacing={4}>
        <Box>
          <FormLabel>Nama Paket (Tiket Destinasi)</FormLabel>
          <Input
            placeholder="Contoh: Tiket Tour Bali 3 Hari"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
          />
        </Box>

        <Box>
          <FormLabel>Jenis Paket</FormLabel>
          <Select
            value={packageType}
            onChange={(e) => setPackageType(e.target.value)}
          >
            {predefinedPackages.map((p, idx) => (
              <option key={idx} value={p.value}>{p.label}</option>
            ))}
          </Select>
        </Box>

        <Box>
          <FormLabel>Deskripsi per Hari</FormLabel>
          {days.map((day, idx) => (
            <Box key={idx} borderWidth="1px" borderRadius="md" p={3} mb={2}>
              <HStack justify="space-between">
                <strong>{day.title}</strong>
                {days.length > 1 && (
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    aria-label="Hapus Hari"
                    onClick={() => handleDeleteDay(idx)}
                  />
                )}
              </HStack>
              <Textarea
                mt={2}
                placeholder={`Deskripsi untuk ${day.title}`}
                value={day.description}
                onChange={(e) => handleDayChange(idx, e.target.value)}
              />
            </Box>
          ))}

          <Button mt={2} leftIcon={<AddIcon />} onClick={handleAddDay}>
            Tambah Hari
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default TourHeaderForm
