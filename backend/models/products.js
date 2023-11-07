class Product {
    constructor(id, code,name,category , file, priceStacked,
        quantity, selectedStatus ) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.category = category;
            this.file = file;
            this.priceStacked = priceStacked;
            this.quantity = quantity;
            this.selectedStatus = selectedStatus;
           
    }
}
module.exports = Product;