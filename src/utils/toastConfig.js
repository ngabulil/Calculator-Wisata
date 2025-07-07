const toastConfig = (title, description, status) => {
  return {
    title: title,
    status: status,
    description: description,
    duration: 3000,
    isClosable: true,
    position: "top-right",
  };
};
export default toastConfig;
