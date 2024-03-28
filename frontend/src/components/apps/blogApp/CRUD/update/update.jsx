import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Button, Alert, Typography, Layout, Modal } from "antd";
import AppHeader from "../../header/header";
import AppFooter from "../../footer/footer";

const { Title, Text } = Typography;
const { Content } = Layout;
const { confirm } = Modal;

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/blog/api/user-blog-crud/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDetails(data);
        setEditTitle(data.title);
        setEditDescription(data.description);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Something went wrong! Failed to fetch data");
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);

  const handleUpdateBlog = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/blog/api/update-blog/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Blog post updated successfully
      // You can show a success message here if needed
    } catch (error) {
      console.error("Error updating blog:", error);
      setError("Something went wrong! Failed to update blog post");
    }
  };
  

  const handleDiscardChanges = () => {
    setEditTitle(details.title);
    setEditDescription(details.description);
  };

  return (
    <>
      <AppHeader />
      <Content style={{ padding: "50px" }}>
        {isLoading ? (
          <div style={{ textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center" }}>
            <Alert message={error} type="error" />
            <Button style={{ marginTop: "10px" }} onClick={() => window.location.reload()}>
              Reload Again
            </Button>
          </div>
        ) : (
          <>
            <Title level={2}>Edit Blog</Title>
            <div>
              <label>Title:</label>
              <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div>
              <label>Description:</label>
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div>
              <Button onClick={handleDiscardChanges}>Discard Changes</Button>
              <Button type="primary" onClick={handleUpdateBlog} style={{ marginLeft: "10px" }}>Update</Button>
            </div>
          </>
        )}
      </Content>
      <AppFooter />
    </>
  );
};

export default EditBlog;
