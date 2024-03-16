
import React, { useState } from "react";
import {
  Layout,
  Space,
  Col,
  Row,
  Card,
  Button,
  List,
  Skeleton,
  Avatar,
  Collapse,
  Divider,
  Modal,
  Result,
  Input,
  message,
  Alert,
  Spin,
} from "antd";
const UserProfile = () => {
  const [editNewImage, setEditNewImage] = useState(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setEditNewImage(file);

    // Update the img src immediately after selecting the image
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById("profile-image").src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <img
        id="profile-image" // Added id to the img tag for easy reference
        src={localStorage.getItem("user_image")}
        alt=""
        style={{ maxWidth: "100%" }}
      />
      <br />
      <Input
        type="file"
        onChange={(e) => handleProfileImageChange(e)}
        style={{
          border: "1px solid #000",
          minHeight: "35px",
          background: "none",
        }}
      />
    </div>
  );
};

export default UserProfile;
