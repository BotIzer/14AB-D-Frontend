import { useEffect, useState } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotifDropdown(props) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([])
  // const dummyNotifs = {
  //   count: 3,
  //   data: [
  //     {
  //       id: 1,
  //       message: "frontend is kil",
  //       image: "imgurLink",
  //       source: "user",
  //     },
  //     {
  //       id: 2,
  //       message: "backend is kil",
  //       image: "imgurLink",
  //       source: "user",
  //     },
  //     {
  //       id: 3,
  //       message: "dorito",
  //       image: "imgurLink",
  //       source: "forum",
  //     },
  //   ],
  // };
  useEffect(()=>{
    if (!props.notificationData.hasSent && props.notificationData.updateMessage !== "") {
      setNotifications([props.notificationData.updateMessage])
      props.setForumData()
    }
  },[props])
  useEffect(()=>{
    console.log(notifications)
  },[notifications])
  const notifs = notifications && notifications.map((notif) => (
    <Dropdown.Item
      key={notif.id}
      className="list-group-item secondary text-center"
      onClick={() => navigate(`/${notif.source}/${notif.id}`)}
    >
      {notif}
    </Dropdown.Item>
  ));

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
          /*<--TODO: set this to dynamic*/ onClick={() =>
            navigate("/notifications?page=0")
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
          See more ({notifications.length}){" "}
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
