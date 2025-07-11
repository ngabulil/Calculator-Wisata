export const formatWisatawan = (wisatawan) => {
  switch (wisatawan) {
    case "asing":
    case "foreign":
      return "foreign";
    case "domestik":
    case "domestic":
      return "domestic";
    default:
      return "";
  }
};