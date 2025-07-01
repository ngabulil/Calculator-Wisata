import { Box, Button } from "@chakra-ui/react";
import TransportForm from "../../components/Admin/Transport/TransportForm/TransportForm";

const AdminTransportPage  = () => {
    return(
        <Box>
            <TransportForm/>
            <Button colorScheme="blue" onClick={()=>{}}>Simpan Transport</Button>
        </Box>
    )
}

export default AdminTransportPage;