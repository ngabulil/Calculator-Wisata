const useCurrencyFormatter = () => {
  const format = (amount = 0) => {
    return "Rp " + Number(amount).toLocaleString("id-ID")
  }

  return { format }
}

export default useCurrencyFormatter
