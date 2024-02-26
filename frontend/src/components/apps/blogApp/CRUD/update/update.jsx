import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb, Layout, Typography } from "antd";

import AppHeader from "../../header/header";
import AppFooter from "../../footer/footer";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Update = () => {
  const { id } = useParams();
  const [updateData, setUpdateData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for blog with id:", id); // Log the id for debugging
        const response = await fetch(
          `http://localhost:8000/blog/api/user-blog-details/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            mode: "no-cors",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUpdateData(data); // Assuming data is an object, not an array
        console.log("update data --->", data);

        console.log("ID:", updateData.id);
        console.log("Title:", updateData.title);
        console.log("Description:", updateData.description);
        console.log("Image:", updateData.image);
        console.log("Date:", updateData.date);
        console.log("Created At:", updateData.created_at);
        console.log("Updated At:", updateData.updated_at);
        console.log("Slug:", updateData.slug);
        console.log("User ID:", updateData.user_id);
      } catch (error) {
        console.error("Error fetching update data:", error);
      }
    };

    fetchData(); // Call the async function when the component mounts

    // cleanup function if needed
    return () => {
      // cleanup logic
    };
  }, [id]); // Include 'id' in the dependency array if needed

  return (
    <>
      <AppHeader />
      <Layout style={{ padding: "0 10%" }}>
        <Title> Update/Edit Blog {id}</Title>
        {/* You can use the 'id' variable to perform actions based on the blog ID */}
      </Layout>
      <AppFooter />
    </>
  );
};

export default Update;
