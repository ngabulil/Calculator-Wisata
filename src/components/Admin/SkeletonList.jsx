import { Box, Flex, Skeleton, SkeletonText } from "@chakra-ui/react";

const SkeleteonList = () => {
  return (
    <Flex w="full" direction={"column"} justifyContent="center" gap={3}>
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          bg="gray.800"
          borderRadius="md"
          p={4}
          w="full"
          h="120px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Flex align="center" gap={3}>
            <Skeleton height="40px" width="40px" borderRadius="md" />
            <Skeleton height="20px" width="70%" />
          </Flex>

          <SkeletonText mt="4" noOfLines={2} spacing="3" />
        </Box>
      ))}
    </Flex>
  );
};

export default SkeleteonList;
