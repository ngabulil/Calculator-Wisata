import { IconButton, HStack, Tooltip } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

const ReorderControls = ({ 
  onMoveUp, 
  onMoveDown, 
  canMoveUp = true, 
  canMoveDown = true, 
  size = "xs",
  isVisible = true 
}) => {
  if (!isVisible) return null;

  return (
    <HStack spacing={1}>
      <Tooltip label="Pindah ke atas" fontSize="xs">
        <IconButton
          icon={<ChevronUpIcon />}
          size={size}
        //   variant="ghost"
          colorScheme="blue"
          onClick={onMoveUp}
          isDisabled={!canMoveUp}
          aria-label="Move up"
        />
      </Tooltip>
      <Tooltip label="Pindah ke bawah" fontSize="xs">
        <IconButton
          icon={<ChevronDownIcon />}
          size={size}
        //   variant="ghost"
          colorScheme="blue"
          onClick={onMoveDown}
          isDisabled={!canMoveDown}
          aria-label="Move down"
        />
      </Tooltip>
    </HStack>
  );
};

export default ReorderControls;