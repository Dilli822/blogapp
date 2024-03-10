import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin, Row, Col, Typography, Image, Layout, Alert } from "antd";
import AppHeader from "../../header/header";
import AppFooter from "../../footer/footer";

const { Title, Text } = Typography;
const { Content } = Layout;

const Details = () => {
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/blog/api/blog-details/${id}/`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch blog details. HTTP Status: ${response.status}`);
        }

        const resultItems = await response.json();
        const { user_id, ...mappedDetails } = resultItems;
        setDetails(mappedDetails);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setError("Failed to fetch blog details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  return (
    <>
      <AppHeader />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        {isLoading ? (
          <Spin size="large" />
        ) : error ? (
          <Alert message={error} type="error" />
        ) : (
          <>
            <Content style={{ padding: "0 15%" }}>
              <Row>
                <Col span={24}>
                  <Title>{details.title}</Title>
                  <Text>Published at: {details.created_at}</Text>
                  <Text>
                    <p>
                      {" "}
                      #{details.user} | #{details.username}{" "}
                    </p>
                  </Text>
                  <br />

                  <div style={{ textAlign: "center" }}>
                    <Image
                      src={details.image}
                      alt="Blog Image"
                      style={{ maxWidth: "100%", width: "500px" }}
                    />
                  </div>

                  <br />

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
            </Content>
          </>
        )}
      </div>
      <br></br>
      <br></br>
      <AppFooter />
    </>
  );
};

export default Details;
