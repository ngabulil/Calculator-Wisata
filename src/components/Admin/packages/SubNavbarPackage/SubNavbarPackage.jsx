import { Box, 
  
    Link,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
 } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";



const SubNavbarPackage  = () => {
    return(

        <Box>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Packages
                </MenuButton>
                <MenuList>
                    <MenuItem as={Link} href="/packages/hotel">Hotel</MenuItem>
                    <MenuItem as={Link} href="/packages/villa">Villa</MenuItem>
                    <MenuItem as={Link} href="/packages/additional">Additional</MenuItem>
                </MenuList>
            </Menu>
        </Box>
       
    );
    
}

export default SubNavbarPackage;