
import React, { useState, useEffect } from "react";
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
import AppHeader from "../../header/header";
import AppFooter from "../../footer/footer";
import { Link } from "react-router-dom";


export default function ProfileBlog(){

    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const [blogList, setBlogList] = useState([]);
    const [isLogged, setIsLogged] = useState(false);
  
    const [userFullDetails, setUserFullDetails] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const [editUsername, setEditUsername] = useState(
      localStorage.getItem("user_name") || "username"
    );

    const fetchBlogData = async () => {
        try {
          const response = await fetch(
            "http://127.0.0.1:8000/blog/api/user-blog-list/",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          const data = await response.json();
          setInitLoading(false);
          setBlogList(data);
          setIsLogged(true);

          if (data.length > 0) {
            // console.log(data);
          } else if (response.status === 401) {
            setIsLogged(false);
          }
        } catch (error) {
          console.error(error);
          setError("Something went wrong! Failed to fetch data");
        } finally {
          setIsLoading(false);
        }
      };

    <> 
    <Col
    md={15}
    xs={24}
    style={{
      background: "#fff",
      margin: "1%",
      borderRadius: "8px",
    }}
  >
    <Row gutter={24} style={{ padding: "0 4%", margin: 0 }}>
      <br />

      <Col
        md={24}
        xs={23}
        style={{ padding: "0 0 3% 0", margin: 0 }}
      >
        <h2>
          {" "}
          Blogs {blogList.length === 0 ? 0 : blogList.length}
        </h2>
        {blogList.length === 0 ? (
          <Result
            status="404"
            title="No Blogs Found"
            subTitle="You haven't published any blogs yet."
          />
        ) : (
          <Row
            gutter={24}
            style={{
              height: "500px",
              overflow: "auto",
              margin: "0",
            }}
          >
            {blogList.map((item) => (
              <Col
                key={item.id}
                md={11}
                xs={24}
                style={{
                  height: "150px",
                  overflow: "hidden",
                  border: "1px solid #d9d9d9",
                  borderRadius: "5px",
                  margin: "1%",
                  padding: "2%",
                  boxShadow: "0 2px 0 rgba(0, 0, 0, 0.02);",
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <img
                    src={item.image}
                    alt="Blog"
                    style={{
                      width: "50px",
                      height: "auto",
                      marginBottom: 8,
                    }}
                  />
                </div>
                <div style={{ textAlign: "left" }}>
                  &nbsp;
                  <Link
                    to={`/details/${item.id}`}
                    style={{
                      fontWeight: "normal",
                      alignItems: "start",
                      color: "#000",
                    }}
                  >
                    {item.title}
                  </Link>
                </div>
                <div style={{ color: "#888", marginTop: 4 }}>
                  {item.description}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Link to={`/blogs`}>View Blogs</Link>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {blogList.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "1%" }}>
            <hr />
            <Button
              onClick={() => (window.location.href = "/blogs")}
            >
              View More
            </Button>
          </div>
        )}
      </Col>
    </Row>
  </Col>
  </>
}