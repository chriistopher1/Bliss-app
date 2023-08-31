import { useEffect, useState } from "react";

import Card from "../../component/card";

import SecondCard from "../../component/second-card";

export default function Favourite({ userInfo }) {
  const [bookData, setBookData] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      if (userInfo) {
        const object = {
          arrayOfBookId: userInfo["favourite"],
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
    if (bookData.length !== 0 ) {
      return bookData.map((book, index) => (
        // console.log(book)
        <SecondCard book={book} info={"favourite"} userInfo={userInfo}/>
      ));
    }else{
      return <div>No favourite book yet</div>
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-5">{renderBooks()}</div>
      
    </>
  );
}
