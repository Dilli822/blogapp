import React, { useState, useEffect } from "react";
import AppHeader from "../header/publicHeader";
import AppFooter from "../footer/footer";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Layout, Button, Col, Row, Card, Timeline, Spin, Alert } from "antd";
import { Link } from "react-router-dom";
import NewsFeed from "./newsFeed";

const { Meta } = Card;
const { Header, Sider, Content } = Layout;

const formatDate = (rawDate) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = new Date(rawDate).toLocaleDateString(
    undefined,
    options
  );
  return formattedDate;
};

const Home = () => {
  const [isAdditionalVisible, setIsAdditionalVisible] = useState(false);
  const [recentBlogsData, setRecentBlogsData] = useState([]);
  const [randomBlogsData, setRandomBlogsData] = useState(null);
  const [blogBannerData, setBlogBannerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBlogsPosted, setTotalBlogsPosted] = useState("");

  const currentDate = new Date().toLocaleDateString();
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = new Date(currentDate).toLocaleDateString(
    undefined,
    options
  );

  const handleToggleVisibility = () => {
    setIsAdditionalVisible(!isAdditionalVisible);
  };

  const timelineItems = [
    {
      children: "Create account",
    },
    {
      children: "Prepare your blog or articles",
    },
    {
      children: "Post Your Article or blog",
    },
    {
      children: "Done!",
    },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/blog/api/latest-blog/"
      );
      if (response.ok) {
        const data = await response.json();
        setBlogBannerData(data);
        setIsLoading(false);
      } else {
        console.error(
          "Error fetching blog details:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      setError("Failed to fetch blog details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRandomBlogsData = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/blog/api/random-blogs/"
      );
      if (response.ok) {
        const data = await response.json();
        setRandomBlogsData(data);
        setIsLoading(false);
      } else {
        console.error(
          "Error fetching random blogs details:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching random blogs details:", error);
      setError("Failed to fetch blog details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentBlogsData = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/blog/api/random-recentBlogs/"
      );
      if (response.ok) {
        const data = await response.json();
        setRecentBlogsData(data);
        setIsLoading(false);
      } else {
        console.error(
          "Error fetching recent blogs:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching recent blogs:", error);
      setError("Failed to fetch blog details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTotalBlogsData = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/blog/api/total-blogs-count/"
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTotalBlogsPosted(data.total_blogs_count);
        localStorage.setItem("total_blogs_count");
        setIsLoading(false);
      } else {
        console.error(
          "Error fetching recent blogs:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching recent blogs:", error);
      setError("Failed to fetch blog details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRandomBlogsData();
    fetchRecentBlogsData();
    fetchTotalBlogsData();
  }, []);

  return (
    <div>
      <div>
        <AppHeader></AppHeader>

        <Layout className="ant-container " style={{ minHeight: "80vh" }}>
          <br />

          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 64px)", // Subtract the height of the header
              }}
            >
              <Spin size="large" />
            </div>
          ) : error && error.response && error.response.status === 500 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "calc(100vh - 400px)", // Subtract the height of the header
              }}
            >
              <Alert message={error} type="error" />
            </div>
          ) : (
            <>
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Row style={{ display: "flex", alignItems: "center" }}>
                  <Col xs={24} md={7}>
                    <img
                      alt=""
                      src={
                        blogBannerData
                          ? `http://127.0.0.1:8000${blogBannerData.image}`
                          : "https://unsplash.it/700"
                      }
                      style={{
                        width: "100%",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                      }}
                    />
                  </Col>

                  <Col xs={24} md={17}>
                    {blogBannerData && (
                      <>
                        <div style={{ padding: "2%  5%" }}>
                          <Link
                            to={`public/blog/details/${blogBannerData.id}`}
                            style={{
                              fontWeight: "normal",
                              alignItems: "start",
                              color: "#000",
                            }}
                          >
                            <h1>{blogBannerData.title}</h1>
                            <p style={{ height: "100px", overflow: "hidden" }}>
                              {blogBannerData.description}
                            </p>
                            <span>🗓️ {formatDate(blogBannerData.date)}</span>
                            <br /> <br />
                            <span>
                              {" "}
                              <b>Read More.. </b>{" "}
                            </span>
                          </Link>
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
              </Row>

              <>
                <br />

                <h1 style={{ textAlign: "left" }}> Blog & Articles </h1>
                <Row gutter={24}>
                  <Col md={17} style={{}}>
                    {Array.isArray(randomBlogsData) &&
                    randomBlogsData.length > 0 ? (
                      randomBlogsData.map((blog) => (
                        <Col
                          key={blog.id}
                          xs={24}
                          md={24}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "1% 0",
                            padding: "2% 0",
                            background: "#fff",
                            borderRadius: "8px",
                          }}
                        >
                          <Col xs={6} md={5}>
                            <img
                              alt=""
                              src={`http://127.0.0.1:8000${blog.image}`}
                              style={{ width: "100%", borderRadius: "3px" }}
                            />
                          </Col>
                          <Col xs={18} md={19}>
                            <Link
                              to={`public/blog/details/${blog.id}`}
                              style={{
                                fontWeight: "normal",
                                alignItems: "start",
                                color: "#000",
                              }}
                            >
                              <h3>{blog.title}</h3>
                              <p
                                style={{ height: "100px", overflow: "hidden" }}
                              >
                                {blog.description}
                              </p>
                              <span>
                                <b>{blog.username}</b> &nbsp;
                                <span>
                                  🗓️{" "}
                                  {new Date(blog.created_at).toLocaleString(
                                    "en-US",
                                    {
                                      month: "long",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </span>
                              </span>
                            </Link>
                          </Col>
                        </Col>
                      ))
                    ) : (
                      <Col span={24}>
                        <p>No random blogs to show</p>
                      </Col>
                    )}
                  </Col>

                  <Col
                    md={7}
                    style={{
                      background: "#fff",
                      borderRadius: "8px",
                      margin: "10px 0",
                      height: "calc(100vh - 150px)",
                      overflow: "hidden",
                    }}
                  >
                    <h2>Recent </h2>
                    <hr />

                    {Array.isArray(recentBlogsData) &&
                    recentBlogsData.length > 0 ? (
                      recentBlogsData.map((blog) => (
                        <Col
                          key={blog.id}
                          xs={24}
                          md={24}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "1% 0",
                            padding: "2% 0",
                            background: "#fff",
                            borderRadius: "8px",
                          }}
                        >
                          <Col xs={6} md={5}>
                            <img
                              alt=""
                              src={`http://127.0.0.1:8000${blog.image}`}
                              style={{ width: "100%", borderRadius: "3px" }}
                            />
                          </Col>
                          <Col xs={18} md={19}>
                            <Link
                              to={`public/blog/details/${blog.id}`}
                              style={{
                                fontWeight: "normal",
                                alignItems: "start",
                                color: "#000",
                              }}
                            >
                              <h3>{blog.title}</h3>
                              <p> {blog.username}</p>
                              <p>
                                🗓️{" "}
                                {new Date(blog.created_at).toLocaleString(
                                  "en-US",
                                  {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}{" "}
                              </p>
                            </Link>
                          </Col>
                        </Col>
                      ))
                    ) : (
                      <Col span={24}>
                        <p>No recent blogs to show</p>
                      </Col>
                    )}
                  </Col>
                </Row>

                <div style={{ textAlign: "left", marginTop: "20px" }}>
                  {isAdditionalVisible ? (
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={handleToggleVisibility}
                    >
                      You Must Login/Signup to view more
                    </Button>
                  ) : (
                    <Button
                      icon={<ArrowRightOutlined />}
                      onClick={handleToggleVisibility}
                    >
                      View More
                    </Button>
                  )}
                </div>
              </>
              <br />
              <br />
              <Row
                gutter={24}
                style={{
                  background: "#fff",
                  alignItems: "center",
                }}
              >
                <Col xs={24} md={13} style={{ padding: "2%" }}>
                  <h1> How do I Publish Blog? </h1>
                  <h3> You Must Login to Read Other Blogs. </h3>

                  <Timeline mode="left">
                    {timelineItems.map((item, index) => (
                      <Timeline.Item key={index} style={{ fontSize: "1rem" }}>
                        {item.children}
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Col>

                <Col xs={24} md={11} style={{ padding: "2%" }}>
                  {totalBlogsPosted && totalBlogsPosted > 0 ? (
                    <h1 style={{ fontSize: "40px" }}>
                      {" "}
                      Total Blogs Count:{" "}
                      <span style={{ fontSize: "5rem" }}>
                        {" "}
                        {totalBlogsPosted}
                        <span
                          style={{ fontSize: "64px", margin: 0, padding: 0 }}
                        >
                          +
                        </span>{" "}
                      </span>
                    </h1>
                  ) : (
                    <div>
                      <p> No Count Available! Loading...</p>
                      <Spin size="small" />
                    </div>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Layout>

        <AppFooter />

        <div style={{ display: "none", opacity: 0 }}>
          <NewsFeed
            fetchTotalBlogsData={fetchTotalBlogsData}
            totalBlogsPosted={totalBlogsPosted}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;
