function formatBike(bike) {
  const extract = (text) => {
    if (!text) return null;
    const match = text.match(/\d{1,3}(?:\.\d{3})*/g);
    if (!match) return null;
    return parseFloat(match[0].replace(/\./g, ""));
  };

  const sale = extract(bike.priceSale);
  const original = extract(bike.priceOriginal);

  let discount = null;

  if (sale && original && original > sale) {
    discount = Math.round(((original - sale) / original) * 100);
  }

  return {
    ...bike,
    sale,
    original,
    discount,
  };
}

module.exports = { formatBike };
