import { Link } from "react-router-dom";

function RecentList(props) {
    const dummyForums =     
    {
        forums: [
          {
            id: 1,
            title: "forum1"
          },
          {
            id: 2,
            title: "forum2"
          },
          {
            id: 3,
            title: "forum2"
          },
        ],
    };
    const forums = dummyForums.forums.map((forum) => (
        <Link className="list-group-item secondary text-end" key={forum.id} to={"/forums/" + forum.title}>{forum.title}</Link>
    ))

        return(
            <div data-bs-theme="dark" className="list-group list-group-flush p-2 h-100 overflow-auto">
                <p className="text-center">Recently visited:</p>
                {forums}
            </div>
        )
    }

    export default RecentList;