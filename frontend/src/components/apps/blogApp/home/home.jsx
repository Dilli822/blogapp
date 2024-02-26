import React, { useState, useEffect } from "react";
import AppHeader from "../header/header";
import AppFooter from "../footer/footer";
import { Card, Timeline } from "antd";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Layout, Button, theme } from "antd";
import { Col, Row } from "antd";
import { Link } from "react-router-dom";

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
  const [collapsed, setCollapsed] = useState(true);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isAdditionalVisible, setIsAdditionalVisible] = useState(false);
  const currentDate = new Date().toLocaleDateString();
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = new Date(currentDate).toLocaleDateString(
    undefined,
    options
  );

  // const currentDate = formatDate();

  const [randomBlogId, setRandomBlogId] = useState(null);

  const cardData = Array.from({ length: 14 }, (_, index) => ({
    key: index + 1,
    user: `user useruseruseruser${index + 1}`,
    title: `Card ${index + 1}`,
    description: `Description for Card sdfdssdfsdfsdfsdfsdfsdsfsdfsfsdfss Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet, reprehenderit Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet, reprehenderit${
      index + 1
    }`,
    date: `${formattedDate}`,
    imageUrl: `https://unsplash.it/500?random=${index + 1}`,
  }));

  const handleToggleVisibility = () => {
    if (isAdditionalVisible) {
      setVisibleCards(4);
    } else {
      setVisibleCards(cardData.length);
    }
    setIsAdditionalVisible(!isAdditionalVisible);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  const [blogBannerData, setBlogBannerData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/blog/api/latest-blog/"
        );
        if (response.ok) {
          const data = await response.json();
          setBlogBannerData(data);
        } else {
          console.error(
            "Error fetching blog details:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []); // The empty dependency array ensures that the effect runs only once, similar to componentDidMount

  const [randomBlogsData, setRandomBlogsData] = useState(null);

  useEffect(() => {
    const fetchRandomBlogsData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/blog/api/random-blogs/"
        );
        if (response.ok) {
          const data = await response.json();
          setRandomBlogsData(data);
          console.log(data);
        } else {
          console.error(
            "Error fetching random blogs details:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching random blogs details:", error);
      }
    };

    fetchRandomBlogsData();
  }, []);

  const [recentBlogsData, setRecentBlogsData] = useState([]);

  useEffect(() => {
    const fetchRecentBlogsData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/blog/api/random-recentBlogs/"
        );
        if (response.ok) {
          const data = await response.json();
          setRecentBlogsData(data);
        } else {
          console.error(
            "Error fetching recent blogs:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
      }
    };

    fetchRecentBlogsData();
  }, []);

  return (
    <>
      <AppHeader></AppHeader>

      <Layout style={{ padding: "0 10%" }}>
        <br />
        {/* <h1 style={{ textAlign: "left" }}> Latest Blog or Articles </h1> */}
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

        <>
          <br />

          <h1 style={{ textAlign: "left" }}> Blog & Articles </h1>
          <Row gutter={24} style={{}}>
            <Col md={17} style={{}}>
              {Array.isArray(randomBlogsData) &&
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
                        <p style={{ height: "100px", overflow: "hidden" }}>
                          {blog.description}
                        </p>
                        <span>
                        {" "}
                        <b>user_id: #{blog.user_id}, </b>{" "}
                        <b>Published By: {blog.username}</b>{" "}
                      </span>
                      <p>🗓️ {formatDate(blog.date)}</p>
                      </Link>
                    </Col>
                  </Col>
                ))}
            </Col>

            <Col
              md={7}
              style={{
                background: "#fff",
                borderRadius: "8px",
                margin: "10px 0",
                height: "calc(100vh - 300px)",
                overflow: "hidden",
              }}
            >
              <h2>Recent </h2>
              <hr />

              {Array.isArray(recentBlogsData) &&
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
                        <p style={{ height: "20px", overflow: "hidden" }}>
                          {blog.description}
                        </p>


                      </Link>
                    </Col>
                  </Col>
                ))}
            </Col>
          </Row>

          <div style={{ textAlign: "left", marginTop: "20px" }}>
            <Button
              icon={
                isAdditionalVisible ? (
                  <ArrowLeftOutlined />
                ) : (
                  <ArrowRightOutlined />
                )
              }
              onClick={handleToggleVisibility}
            >
              {isAdditionalVisible
                ? "You Must Login/Signup to view more"
                : "View More"}
            </Button>
          </div>
        </>
        <br />
        <br />
        <Row
          gutter={24}
          style={{ background: "#fff", padding: "2%", alignItems: "center" }}
        >
          <Col xs={24} md={13} style={{}}>
            <h1> How do I Publish Blog? </h1>
            <Timeline mode="left">
              {timelineItems.map((item, index) => (
                <Timeline.Item key={index} style={{ fontSize: "1rem" }}>
                  {item.children}
                </Timeline.Item>
              ))}
            </Timeline>
          </Col>

          <Col xs={24} md={11}>
            {localStorage.getItem("total_blogs_count") !== null ? (
              <h1 style={{ fontSize: "40px" }}>
                {" "}
                Total Blogs Count:{" "}
                <span style={{ fontSize: "52px" }}>
                  {" "}
                  {localStorage.getItem("total_blogs_count")}
                  <span style={{ fontSize: "64px", margin: 0, padding: 0 }}>
                    +
                  </span>{" "}
                </span>
              </h1>
            ) : (
              <p>Loading total blogs count...</p>
            )}
          </Col>
        </Row>
      </Layout>
      <AppFooter />
    </>
  );
};
export default Home;
