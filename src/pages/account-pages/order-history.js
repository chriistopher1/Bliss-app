import { useEffect, useState } from "react";

import OrderCard from "../../component/order-card";

export default function Order({ userInfo }) {
  const [orderInfo, setOrderInfo] = useState([]);
  const [bookInfo, setBookInfo] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (userInfo) {
        try {
          const response = await fetch("https://bliss-express-server.vercel.app/api/product/get/order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userOrder: userInfo.order }),
          });

          if (response.ok) {
            console.log("order fetch ok");
            const data = await response.json();

            setOrderInfo(data.allOrder);
            setBookInfo(data.extractedBooks);
          } else {
            console.log("order fetch not ok");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [userInfo]);

  const renderCard = () => {
    if (orderInfo.length !== 0) {
      return orderInfo.map((order, index) => (
        <OrderCard key={index} num={index} order={order} books={bookInfo[index]} />
      ));
    } else {
      // Return a message or component for when there are no orders
      return <div>No orders available.</div>;
    }
  };

  return (
    <div className="card-layout flex flex-wrap gap-3">
      {renderCard()}
    </div>
  );
}
