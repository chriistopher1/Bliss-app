import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./navbar";

import { AiOutlineArrowLeft } from "react-icons/ai";

import styles from "../styles/buy.css";

import Cookies from "js-cookie";

export default function BuyNowPage() {
  const { bookId } = useParams();
  const [bookData, setBookData] = useState([]);
  const [imgUrl, setImgUrl] = useState();
  const [formattedPublishedDate, setFormattedPublishedDate] = useState();
  const [userId, setUserId] = useState();
  const [warning, setWarning] = useState();
  const [status, setStatus] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");

      if (token) {
        // Verify the user's authentication token
        const checkToken = await fetch("https://bliss-express-server.vercel.app/api/product/verify-auth", {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        if (checkToken.ok) {
          const data = await checkToken.json();

          setUserId(data.user.id);
        }
      } else {
        navigate("/login");
      }
    };

    const fetchBook = async () => {
      const arrayOfBookId = [bookId];

      try {
        const response = await fetch(
          "https://bliss-express-server.vercel.app/api/product/get/books/usingId",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ arrayOfBookId: arrayOfBookId }),
          }
        );

        if (response.ok) {
          console.log("ok");
          const data = await response.json();
          setBookData(data.books[0]);

          // Format the published date to display only the date
          const publishedDate = new Date(data.books[0].published);
          const formattedDate = publishedDate.toLocaleDateString();

          setImgUrl(
            `data:image/jpeg;base64,${data.books[0].cover.toString("base64")}`
          );
          setFormattedPublishedDate(formattedDate); // Add this line to set the formatted date
        } else {
          console.log("not ok");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
    fetchBook();
  }, [bookId]);

  const placeOrder = async () => {
    const data = {
      userId: userId,
      bookIds: [bookData._id],
      totalPrice: bookData.price,
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
        navigate("/account/order");
      } else {
        console.log("Order not placed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = async () => {
    try {
      const cardInteractResponse = await fetch(
        "https://bliss-express-server.vercel.app/api/product/cardinteract",
        {
          method: "POST",
          headers: {
            clickedbutton: "cart",
            userid: `${userId}`,
            bookid: `${bookData._id}`,
          },
        }
      );

      if (cardInteractResponse.ok) {
        const data = await cardInteractResponse.json();
        navigate("/account/cart");
      } else {
        console.log("error");
        const data = await cardInteractResponse.json();
        setWarning(data.message);
        setStatus(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <a
        href="/"
        className=" text-green-500 block mt-20 flex gap-1 items-center text-xl font-bold"
      >
        <AiOutlineArrowLeft></AiOutlineArrowLeft>
        <div className="">Back to home</div>
      </a>
      {bookData ? (
        <div className="outer-card block flex gap-3 justify-center ">
          <div className="flex bg-teal-100 w-auto shadow-lg md:max-md:">
            <div className="img-container w-auto h-auto">
              <img src={imgUrl} className="custom-image-detail"></img>
            </div>

            <div className="book-info flex flex-col p-3 gap-3 w-96">
              <div className="book-detail">Title : {bookData.title}</div>
              <div className="book-detail">Author : {bookData.author}</div>
              <div className="book-detail">
                Descriptions : {bookData.description}
              </div>
              <div className="book-detail">
                Published Date : {formattedPublishedDate}
              </div>
              <div className="book-detail">Stock : {bookData.stock}</div>
              <div className="book-detail">Viewed : {bookData.viewed}</div>
              <div className="book-detail">Wished : {bookData.wished}</div>

              <div className="custom-button-container flex gap-3">
                <button
                  className="font-bold p-4 bg-teal-400 rounded-md cursor-pointer w-32 hover:text-white"
                  onClick={placeOrder}
                >
                  Buy now
                </button>
                <button
                  className="font-bold p-4 bg-teal-400 rounded-md cursor-pointer w-32 hover:text-white"
                  onClick={addToCart}
                >
                  Add to cart
                </button>
              </div>

              <div
                className={`warning-text ${
                  status ? "text-green-600" : "text-red-600"
                }`}
              >
                {warning}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading book data...</p>
      )}
    </>
  );
}
