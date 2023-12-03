class Order {
    constructor(
        id,
        orders,
        totalAmount,
        userId,
        orderDate
        
      ) {
        this.id = id;
        this.orders=orders;
        this.totalAmount=totalAmount;
        this.userId = userId;
        this.orderDate=orderDate;
        
      }
    }
module.exports = Order;