import { useEffect, useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function NotifDropdown(props) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([])
  const [singleNotif, setSingleNotif] = useState("")
  useEffect(()=>{
    console.log(singleNotif)
  },[singleNotif])
  useEffect(()=>{
    const GetNotifications = async() => {
      const response = await axios.get('/notification',
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      withCredentials: true,
    })
    setNotifications(response.data)
    }
    GetNotifications()
  },[])
  useEffect(()=>{
    console.log("new notifs")
    console.log(notifications)
  },[notifications])
  const notifs = notifications.notifications && notifications.notifications.map((notif) => (
    <Dropdown.Item
      key={notif.id}
      className="list-group-item secondary text-center"
      onClick={() => navigate(`/notifications/${notif.id}`)}
    >
      {notif.text}
    </Dropdown.Item>
  ));
  useEffect(()=>{
    if(notifications.notifications && props.removeId !== ''){
      console.log("success")
      const updatedNotifications = notifications.notifications.filter((notification) => notification.id !== props.removeId);
  setNotifications(prevState => ({
  ...prevState,
  notifications: updatedNotifications
}));
    }
  
  },[props])
  return (
    <>
      <DropdownButton
        style={{ maxWidth: "35vw" }}
        data-bs-theme="dark"
        title="Notifications"
        className="dropdown-button dropdown-button-size my-2 mx-2" /*onSelect={(eventKey) => console.log(eventKey)} use eventkey to set function*/
      >
        {notifs}
        <Dropdown.Divider />
        <Dropdown.Item
          eventKey="4"
          onClick={() =>
            navigate("/notifications?page=1")
          }
          onMouseEnter={() =>
            (document.getElementById("notification").className =
              "my-auto filter-black")
          }
          onMouseLeave={() =>
            (document.getElementById("notification").className =
              "my-auto filter-gold")
          }
        >
          See more ({(notifications.notifications && notifications.notifications.length) || 0}){" "}
          <img
            id="notification"
            src="/src/assets/icons/envelope_16.png"
            alt="notifications"
            className="my-auto filter-gold"
          />
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
}

export default NotifDropdown;
