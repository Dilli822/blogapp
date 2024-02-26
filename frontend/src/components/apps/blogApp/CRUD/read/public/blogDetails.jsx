import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Row, Col, Typography, Image, Layout } from "antd";
import AppHeader from "../../header/header";
import AppFooter from "../../footer/footer";

const { Title, Text } = Typography;
const { Content } = Layout;

const PublicBlogDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/blog/api/blog-details/${id}/`
        );

        if (!response.ok) {
          console.error(
            "Error fetching blog details. HTTP Status:",
            response.status
          );
          return;
        }

        const resultItems = await response.json();

        console.log(resultItems);
        // Exclude user_id from details
        const { user_id, ...mappedDetails } = resultItems;

        setDetails(mappedDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  if (loading) {
    return <Spin />;
  }

  return (
    <>
      <AppHeader />
      {/* Content inside Layout with 10% padding */}
      <Content style={{ padding: "0 15%" }}>
        <Row>
          <Col span={24}>
            <Title>{details.title}</Title>
            <Text>Published at: {details.created_at}</Text>
            <br />

            <div style={{ textAlign: "center" }}>
              <Image
                src={details.image}
                alt="Blog Image"
                style={{ maxWidth: "100%", width: "500px" }}
              />
            </div>

            <br />

            {/* Render other details as needed */}
            <Text size="large" style={{ fontSize: "21px" }}>
              {details.description.split("\r\n").map((paragraph, index) => (
                <React.Fragment key={index}>
                  {paragraph}
                  <br />
                </React.Fragment>
              ))}
            </Text>
          </Col>
        </Row>
      </Content>{" "}
      <br />
      <AppFooter />
    </>
  );
};

export default PublicBlogDetails;
