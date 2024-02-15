import { DropdownButton, Dropdown } from "react-bootstrap";

function NotifDropdown() {

  const dummyNotifs = 
    {
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
      href={"/" + notif.source + "/" + notif.id}
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
        className="dropdown-button" /*onSelect={(eventKey) => console.log(eventKey)} use eventkey to set function*/
      >
        {notifs}
        <Dropdown.Divider />
        <Dropdown.Item eventKey="4" href="/notifications">
          See more ({dummyNotifs.count})
        </Dropdown.Item>
      </DropdownButton>
    </>
  );
}

export default NotifDropdown;
