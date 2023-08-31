
import { useState } from "react";

export default function SecondCard({ book, info, userInfo }) {
  const dataURL = `data:image/jpeg;base64,${book.cover.toString("base64")}`;
  const [warning, setWarning] = useState();
  const [status, setStatus] = useState();

  const handleRemoveButton = async () => {
    if (book) {

      const data = {
        bookId: book._id,
        userEmail: userInfo.email,
        info: info
      }

      try {
        const response = await fetch(
          "https://bliss-express-server.vercel.app/api/product/remove/book/usingId",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          console.log("Book is removed");
          const data = await response.json();
          setWarning(data.message);
          setStatus(true);
        } else {
          console.log("Failed to remove book");
          const data = await response.json();
          setWarning(data.message);
          setStatus(false);
        }
      } catch (error) {}
    }
  };

  return (
    <>
      <div className="container flex gap-3 border-2 border-black p-3 w-96">
        <div className="image-container">
          <img src={dataURL} alt="image" className="h-52"></img>
        </div>

        <div className="book-info-container flex flex-col gap-2">
          <div className="book-title">{book.title}</div>
          <div className="book-author">{book.author}</div>
          <div className="book-price">${book.price}</div>

          <button className="bg-red-400 p-2 rounded mt-2" onClick={handleRemoveButton}>
            Remove from {info}
          </button>

          <div
              className={`warning-text mt-4 ${
                status ? "text-green-600" : "text-red-600"
              }`}
            >
              {warning}
            </div>
        </div>
      </div>
    </>
  );
}
