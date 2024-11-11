import React, { useEffect, useState } from "react";
import UserCard from "../UserCard/UserCard";
import "../../assets/styles/UserCardList.scss";

const UserCardList = () => {
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    fetch("/src/assets/data/userData.json")
      .then((response) => response.json())
      .then((data) => setUsers(data.users));
  }, []);

  const handleExpandUser = (user) => {
    setExpandedUser(user);
  };

  const handleCollapseUser = () => {
    setExpandedUser(null);
  };

  return (
    <div className={`user-card-list-container ${expandedUser ? "dimmed" : ""}`}>
      {users.map((user, index) => (
        <UserCard
          key={index}
          user={user}
          isExpanded={expandedUser === user}
          onExpand={() => handleExpandUser(user)}
          onCollapse={handleCollapseUser}
        />
      ))}
    </div>
  );
};

export default UserCardList;
