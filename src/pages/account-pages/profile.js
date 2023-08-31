import { useState, useEffect } from "react";

import Cookies from "js-cookie";

import jwt_decode from "jwt-decode";

export default function Profile() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");
  
      if (token) {
        try {
          // Verify the user's authentication token
          const checkToken = await fetch("https://bliss-express-server.vercel.app/api/product/verify-auth", {
            method: "GET",
            headers: {
              Authorization: `${token}`, 
            },
          });
  
          if (checkToken.ok) {
            const data = await checkToken.json();
            const decodedToken = data.user;
            const userId = decodedToken.id;
            
            const response = await fetch("https://bliss-express-server.vercel.app/api/product/get/userinfo", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId }),
            });
  
            if(response.ok){
              console.log("profile data ok");
              const getUserData = await response.json();
              const userData = getUserData.userData;
              // console.log(userData);
              setData(userData);
            }
            
          } else {
            console.log("Authentication failed");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
  
    // Call the fetchUserData function
    fetchUserData();
  }, []);
  

  return (
    <>
      <div className="profile-container flex flex-col gap-4 bg-teal-100 w-full p-4">
        <div className="detail-container flex gap-2">
          <div className="column-name font-semibold">Name : </div>
          <div className="detail">{data["name"]}</div>
        </div>

        <div className="detail-container flex gap-2">
          <div className="column-name font-semibold">Email : </div>
          <div className="detail">{data["email"]}</div>
        </div>
      </div>
    </>
  );
}
