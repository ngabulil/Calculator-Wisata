import { Box, Text ,
    Flex,

    Button,
    Container, Textarea , Input} from "@chakra-ui/react";
import { AddIcon,  } from "@chakra-ui/icons";
import { useState } from "react";
import SubNavbarPackage from "../../components/Admin/packages/SubNavbarPackage/SubNavbarPackage";
import PackageCard from "../../components/Admin/packages/PackageCard/PackageCard";
import PackageFormPage from "../../components/Admin/packages/PackagesForm/PackageForm";


const AdminPage  = () => {

    const [ formActive , setFormActive ] = useState(false);


    return(
        <Container maxW="container.lg" p={0} borderRadius="lg">
            <Flex direction={'column'} gap='12px'>
                <Flex direction={'row'} justifyContent={'space-between'}   gap={2}>
                    <SubNavbarPackage/>
                    <Button bg={'blue.500'} onClick={() => setFormActive(!formActive)}><AddIcon pr={'5px'}/> { formActive ? 'Back' : 'Create' }</Button>
                </Flex>
              {

                formActive ? 
                <PackageFormPage/> :   
                <Flex direction={'row'} gap={10} wrap={'wrap'}>
                    {
                        Array.from({ length: 9 }).map((_, index) => {
                            return(
                            <PackageCard key={index}/>
                            )
                        })
                    }
                </Flex>

              }
            </Flex>
        </Container>
    );
    
}

export default AdminPage;