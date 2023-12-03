class Product {
  constructor(
    id,
    code,
    name,
    category,
    file,
    priceStacked,
    quantity,
    selectedStatus,
    valueRating,
    companyName,
    taxNumber,
    email,
    description,
    creoterId,
    createDate
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.category = category;
    this.file = file;
    this.priceStacked = priceStacked;
    this.quantity = quantity;
    this.selectedStatus = selectedStatus;
    this.valueRating = valueRating;
    this.companyName = companyName;
    this.taxNumber = taxNumber;
    this.email = email;
    this.description = description;
    this.creoterId=creoterId;
    this.createDate=createDate;
  }
}
module.exports = Product;
