import React, { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import useAuth from "../context/AuthContext";
import axios from "../utils/axios";

const Profile = () => {
  const { user, setUser, token } = useAuth();
  const [preview, setPreview] = useState(user?.displayPicture || "");
  const fileInputRef = useRef();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("displayPicture", file);
    try {
      const res = await axios.put(`/users/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setUser( res.data.displayPicture );
      localStorage.setItem("userDetail",JSON.stringify(res.data))
      alert("Profile image updated!");
    } catch (err) {
      alert("Image upload failed");
    }
  };

  // Helper to get first name
  const getFirstName = (name = "") => name.trim().split(" ")[0] || "";
  const getUsername = user?.username;

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: "2rem",
          marginLeft: "2rem",
        }}
      >
        <div style={{ position: "relative", width: 180, height: 180 }}>
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "#555",
              // cursor: "pointer",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <span style={{ fontWeight: 600 }}>{getFirstName(getUsername)}</span>
            )}
            <button
              onClick={e => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 1001, // higher than image
                background: "#fff",
                border: "none",
                borderRadius: "50%",
                padding: 10,
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
                
              }}
              title="Edit Image"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M4 21h17"
                  stroke="#555"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M17.25 6.085l.665-.665a2.121 2.121 0 1 1 3 3l-.665.665m-3-3l-9.193 9.193a2 2 0 0 0-.497.832l-1.06 3.18 3.18-1.06a2 2 0 0 0 .832-.497l9.193-9.193m-3-3 3 3"
                  stroke="#555"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <h2 style={{ marginTop: "1.5rem", fontWeight: 600, fontSize: "2rem" }}>
          {getUsername}
        </h2>
      </div>
    </div>
  );
};

export default Profile;