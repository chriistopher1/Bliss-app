export default function OrderCard({ num, order, books }) {

    const formattedTotalPrice = order.totalPrice.toFixed(2);

    const orderDate = new Date(order.orderDate);
    const formattedDate = orderDate.toLocaleDateString();

    return (
      <div className="card-container-detail max-w-xs flex flex-col bg-teal-100 p-5 h-auto">
        <div className="card-title text-xl mb-3">Order {num + 1}</div>
        <div className="card-books">Books:</div>
        <ul className="pb-4">
          {books.map((book) => (
            <li key={book._id}>{book.title}</li>
          ))}
        </ul>
        <div className="card-total">Total Price : ${formattedTotalPrice}</div>
        <div className="card-date">Order Placed : {formattedDate}</div>
      </div>
    );
  }
  