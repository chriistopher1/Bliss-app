import { useEffect, useState } from "react";

import Card from "../../component/card";

import SecondCard from "../../component/second-card";

import { useNavigate } from "react-router-dom";

export default function Cart({ userInfo }) {
  const [bookData, setBookData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      if (userInfo) {
        const object = {
          arrayOfBookId: userInfo["cart"],
        };

        try {
          const response = await fetch(
            "https://bliss-express-server.vercel.app/api/product/get/books/usingId",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(object),
            }
          );

          if (response.ok) {
            const data = await response.json();
            setBookData(data.books);
          } else {
            console.log("not ok");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchBook();
  }, [userInfo]);

  const renderBooks = () => {
    // Check if data is undefined or empty before mapping over it
    if (bookData.length !== 0) {
      return bookData.map((book, index) => (
        // console.log(book)
        <SecondCard
          key={book._id}
          book={book}
          info={"cart"}
          userInfo={userInfo}
        />
      ));
    } else {
      return <div>No book in cart yet</div>;
    }
  };

  const placeOrder = async () => {
    const bookIdArray = bookData.map((book) => book._id);

    const totalPrice = bookData.reduce((accumulator, book) => {
      return accumulator + book.price;
    }, 0);

    const data = {
      userId: userInfo.id,
      bookIds: bookIdArray,
      totalPrice: totalPrice,
    };

    try {
      const response = await fetch("https://bliss-express-server.vercel.app/api/product/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Order Placed");
        navigate("/");
      } else {
        console.log("Order not placed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  if (bookData.length !== 0) {
    return (
      <>
        <button
          className="p-2 bg-green-300 rounded cursor-pointer hover:bg-green-500 transition duration-300 hover:text-white mb-5"
          onClick={placeOrder}
        >
          Order Now
        </button>
        <div className="flex flex-wrap gap-5">{renderBooks()}</div>
      </>
    );
  } else {
    return <div>No books in cart</div>;
  }
}
