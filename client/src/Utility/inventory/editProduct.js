export const setEditFormHandler = (id, database, form, setForm) => {
  const product = database.find((product) => product._id === id);

  const keys = Object.keys(form);
  const newProduct = {
    ...product,
  };
  const parsedDate = Date.parse(`${newProduct.expiryDate}`);
  const newDate = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
  })
    .format(parsedDate)
    .replace("/", "-");
  const expiryDate = [newDate.split("-")[1], newDate.split("-")[0]].join("-");
  newProduct.expiryDate = expiryDate;
  newProduct.productCategory = newProduct.productCategory?.category;
  keys.forEach((key) => {
    setForm((prevState) => {
      const newState = { ...prevState };
      newState[key] = newProduct[key];
      return newState;
    });
  });
};
