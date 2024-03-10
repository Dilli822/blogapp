import React, { useState, useEffect } from "react";
import { Layout, Menu, Modal } from "antd";
import { Link } from "react-router-dom";
// import logoImage from "../img/logo/bloglogo1.jpg"
// import logoImage from "../img/logo/B-logo.png"
// import logoImage from "../img/logo/BlogLogo.png"
// import logoImage from "../img/logo/BlogApp.jpg"
import logoImage from "../img/logo/blogCofffee.jpg";

const { Header } = Layout;

const AppHeader = () => {
  const [userBasicData, setUserBasicData] = useState([]);
  const [userBasicInfo, setUserBasicInfo] = useState({});
  const [username, setUserName] = useState(null);
  const [user, setUser] = useState("");

  const [authorId, setAuthorId] = useState("");
  const [userId, setUserId] = useState("");

  const [totalBlogsCount, setTotalBlogsCount] = useState(null);
  const currentDate = new Date().toLocaleDateString();
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = new Date(currentDate).toLocaleDateString(
    undefined,
    options
  );
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const isLoggedIn = [
    "/profile",
    "/feed",
    "/create",
    `/update/\\d+`, // Matches /update/:id where :id is a number
    "/blogs",
    "/todoList",
    "/details/\\d+", // Matches /details/:id where :id is a number
  ].some((pattern) => new RegExp(pattern).test(window.location.pathname));

  const [menuLoggedItems, setMenuLoggedItems] = useState([
    { key: "home", label: "Home", path: "/feed" },
    { key: "todo", label: "ToDo", path: "/todoList" },
    { key: "blog post", label: "Post", path: "/create" },
    { key: "blogs", label: "Blogs", path: "/blogs" },
    { key: "profile", label: "Profile", path: "/profile" },
    { key: "logout", label: "Logout" },
  ]);

  const menuNotLoggedItems = [
    { key: "home", label: "Home", path: "/" },
    { key: "login", label: "Login", path: "/login" },
    { key: "signup", label: "Signup", path: "/signup" },
    { key: "about", label: "About Us", path: "/about" },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/api/usersList/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await response.json();

      if (data.length > 0) {
        setUserName(data[0].username);
        // localStorage.setItem('user_image', imgData.image);
        localStorage.setItem("user_id", data[0].id);
        localStorage.setItem("user_name", data[0].username);
        localStorage.setItem("user_email", data[0].email);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // fetchImageData();

  const fetchTotalBlogsCount = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/blog/api/total-blogs-count/"
      );
      if (response.ok) {
        const data = await response.json();
        setTotalBlogsCount(data.total_blogs_count);
        localStorage.setItem("total_blogs_count", data.total_blogs_count);
      } else {
        console.error("Error fetching total blogs count");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onMenuItemClick = (label, path) => {
    if (label === "Logout") {
      // Display confirmation using window.confirm
      Modal.confirm({
        title: "Logout",
        content: "Are you sure you want to logout?",
        okText: "Yes",
        cancelText: "No",
        okType: "danger", // Set OK button color to red
        onOk() {
          // Handle logout action
          // used localstorage instead of session for now
          localStorage.removeItem("user_id");
          localStorage.removeItem("user_name");
          localStorage.removeItem("user_email");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user_image");

          // Remove the 'path' property from the 'menuLoggedItems' array
          const updatedMenuLoggedItems = menuLoggedItems.map((item) => {
            const { path, ...rest } = item;
            return rest;
          });
          setMenuLoggedItems(updatedMenuLoggedItems);
          // Redirect to '/'
          window.location.href = "/";
        },
        onCancel() {
          console.log("Cancel logout");
        },
      });
    } else {
      // Handle other menu item clicks (e.g., navigation)
      console.log(`Clicked on menu item ${label}`);
      // Redirect to the specified path
      window.location.href = window.location;
    }
  };

  useEffect(() => {
    fetchData(); // Call the async function when the component mounts
    fetchTotalBlogsCount();
  }, []);

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "5px 0",
      }}
    >
      {/* Your Logo Component Here */}
      <div className="demo-logo" style={{ width: "50%", padding: "2%" }}>
        {/* Add your logo component or image here */}
        <img
          src={logoImage}
          alt="Logo"
          style={{
            width: "50px",
            verticalAlign: "middle",
            borderRadius: "10px",
          }}
        />
      </div>

      {/* Menu component */}
      {isLoggedIn ? (
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["nav2"]}
          style={{
            width: "50%",
            justifyContent: "end",
          }}
          onClick={({ key }) =>
            onMenuItemClick(
              menuLoggedItems.find((item) => item.key === key)?.label,
              menuLoggedItems.find((item) => item.key === key)?.path
            )
          }
        >
          {menuLoggedItems.map(({ key, label }) => (
            <Menu.Item key={key}>
              <Link to={menuLoggedItems.find((item) => item.key === key)?.path}>
                {label}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      ) : (
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["nav2"]}
          style={{
            width: "50%",
            justifyContent: "end",
          }}
          onClick={({ key }) =>
            onMenuItemClick(
              menuNotLoggedItems.find((item) => item.key === key)?.path
            )
          }
        >
          {menuNotLoggedItems.map(({ key, label }) => (
            <Menu.Item key={key}>
              <Link
                to={menuNotLoggedItems.find((item) => item.key === key)?.path}
              >
                {label}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      )}
    </Header>
  );
};

export default AppHeader;
