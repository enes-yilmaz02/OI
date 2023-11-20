class Order {
    constructor(
        id,
        orders,
        totalAmount,
        userId,
        
      ) {
        this.id = id;
        this.orders=orders;
        this.totalAmount=totalAmount;
        this.userId = userId;
        
      }
    }
module.exports = Order;