
  export default function DeleteProfile (){

const handleDeleteOk = async () => {
    const userId = localStorage.getItem("user_id");
    try {
      // Make a DELETE request to delete the user account
      const response = await fetch(
        `http://127.0.0.1:8000/account/api/user/delete/${userId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        console.log("User account deleted successfully");
        window.location.href = "/";
      } else {
        // Handle error
        console.error("Error deleting user account");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };


  return(
    <>
    </>
  )

  }