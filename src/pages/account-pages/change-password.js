import { useState } from "react";

export default function ChangePassword( { userId } ) {
  const [warning, setWarning] = useState();
  const [status, setStatus] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const oldPassword = e.target["oldPassword"].value;
    const newPassword = e.target["newPassword"].value;
    const confirmNewPassword = e.target["confirmNewPassword"].value;

    if (newPassword !== confirmNewPassword) {
      setWarning("Passwords do not match. Please make sure they match.");
      setStatus(false);
      return;
    }

    const data = {
      userId: userId,
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    try {
      
      const response = await fetch("https://bliss-express-server.vercel.app/api/product/change-password", {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if(response.ok){
        const data = await response.json();
        setWarning(data.message);
        setStatus(true);
      }else{
        const data = await response.json();
        setWarning(data.message);
        setStatus(false);
      }

    } catch (error) {
      console.error(error);
    }

  };

  return (
    <>
      <div className="pass-change-container flex flex-col bg-teal-100 p-3">
        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          <div className="container flex gap-2">
            <label>Old Password : </label>
            <input
              type="password"
              name="oldPassword"
              className="outline-0"
              required
            />
          </div>
          <div className="container flex gap-2">
            <label>New Password : </label>
            <input
              type="password"
              name="newPassword"
              className="outline-0"
              required
            />
          </div>
          <div className="container flex gap-2">
            <label className="">Confirm New Password : </label>
            <input
              type="password"
              name="confirmNewPassword"
              className="outline-0"
              required
            />
          </div>
          <div>
            <input
              type="submit"
              className="bg-teal-400 p-2 rounded cursor-pointer"
              value="Change Password"
            />
          </div>
        </form>
        <div
          className={`warning-text mt-5 ${
            status ? "text-green-600" : "text-red-500"
          }`}
        >
          {warning}
        </div>
      </div>
    </>
  );
}
