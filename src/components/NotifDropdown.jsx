import { DropdownButton, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotifDropdown() {
  const navigate = useNavigate();
  const dummyNotifs = {
    count: 3,
    data: [
      {
        id: 1,
        message: "frontend is kil",
        image: "imgurLink",
        source: "user",
      },
      {
        id: 2,
        message: "backend is kil",
        image: "imgurLink",
        source: "user",
      },
      {
        id: 3,
        message: "dorito",
        image: "imgurLink",
        source: "forum",
      },
    ],
  };

  const notifs = dummyNotifs.data.map((notif) => (
    <Dropdown.Item
      key={notif.id}
      className="list-group-item secondary text-center"
      onClick={() => navigate(`/${notif.source}/${notif.id}`)}
    >
      {notif.message}
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
            navigate("/notifications")
          }
          onMouseEnter={() =>
            (document.getElementById("notification").src =
              "/src/assets/icons/envelope_16.png")
          }
          onMouseLeave={() =>
            (document.getElementById("notification").src =
              "/src/assets/icons/envelope_gold_16.png")
          }
        >
          See more ({dummyNotifs.count}){" "}
          <img
            id="notification"
            src="/src/assets/icons/envelope_gold_16.png"
            alt="notifications"
            className="my-auto"
          />
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
}

export default NotifDropdown;
