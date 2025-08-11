import { Box, Flex, Skeleton, SkeletonText } from "@chakra-ui/react";

const SkeleteonGridList = () => {
  return (
    <Flex w="full" justifyContent="center" wrap="wrap" gap={4}>
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          bg="gray.800"
          borderRadius="md"
          p={4}
          w="300px"
          h="300px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Flex align="center" gap={3}>
            <Skeleton height="150px" width="full" borderRadius="md" />
          </Flex>

          <SkeletonText mt="4" noOfLines={2} spacing="3" />
          <SkeletonText mt="4" noOfLines={2} spacing="3" />
        </Box>
      ))}
    </Flex>
  );
};

export default SkeleteonGridList;
