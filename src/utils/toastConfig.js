const toastConfig = (title, description, status, onClose) => {
  return {
    title: title,
    status: status,
    description: description,
    duration: 3000,
    isClosable: true,
    position: "top-right",
    onCloseComplete: onClose,
  };
};
export default toastConfig;
