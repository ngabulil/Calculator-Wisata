import { useState } from "react";
import {
  Flex,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const PackageFilterBar = ({ admins = [], onFilterChange }) => {
  const [selectedAdmins, setSelectedAdmins] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  const triggerChange = (changes) => {
    const newFilter = {
      selectedAdmins,
      sortOrder,
      ...changes,
    };
    setSelectedAdmins(newFilter.selectedAdmins);
    setSortOrder(newFilter.sortOrder);
    onFilterChange(newFilter);
  };

  return (
    <Flex gap="12px" align="center" flexWrap="wrap">
      {/* Dropdown Admin */}
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Filter Admin
        </MenuButton>
        <MenuList>
          {admins.map((admin) => (
            <MenuItem
              key={admin.id}
              onClick={() => {
                const updated = selectedAdmins.includes(admin.id)
                  ? selectedAdmins.filter((id) => id !== admin.id)
                  : [...selectedAdmins, admin.id];
                triggerChange({ selectedAdmins: updated });
              }}
            >
              <Checkbox
                isChecked={selectedAdmins.includes(admin.id)}
                mr={2}
                pointerEvents="none"
              />
              {admin.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      {/* Sort newest / oldest */}
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          {sortOrder === "newest" ? "Terbaru" : "Terlama"}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => triggerChange({ sortOrder: "newest" })}>
            Terbaru
          </MenuItem>
          <MenuItem onClick={() => triggerChange({ sortOrder: "oldest" })}>
            Terlama
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default PackageFilterBar;
