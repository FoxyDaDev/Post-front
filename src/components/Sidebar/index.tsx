import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-80 h-screen flex flex-col justify-between rounded-lg">
      <div>
        <div className="p-4 justify-items-center">
          <h1 className="text-2xl font-bold text-center">Posts</h1>
        </div>
        <div className="py-8 font-nunito_Sans">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center p-5 mr-5 rounded-r transition-all duration-100 ease-in-out ${
                isActive
                  ? "bg-holdish border-l-4 border-greenish-hold text-greenish"
                  : "hover:bg-holdish hover:border-l-4 border-transparent hover:border-greenish-hold hover:text-greenish"
              }`
            }
          >
            <img
              width="24"
              height="24"
              src="src\public\images\icons8-feed-24.png"
              alt="activity-feed"
              className="mr-2"
            />
            Posts
          </NavLink>
          <NavLink
            to="/my-posts"
            className={({ isActive }) =>
              `flex items-center p-5 mr-5 rounded-r transition-all duration-100 ease-in-out ${
                isActive
                  ? "bg-holdish border-l-4 border-greenish-hold text-greenish"
                  : "hover:bg-holdish hover:border-l-4 border-transparent hover:border-greenish-hold hover:text-greenish"
              }`
            }
          >
            <img
              src="src\public\images\icons8-message-24.png"
              alt="My Posts Icon"
              className="mr-2"
            />
            My Posts
          </NavLink>
          <NavLink
            to="/create-post"
            className={({ isActive }) =>
              `flex items-center p-5 mr-5 rounded-r transition-all duration-100 ease-in-out ${
                isActive
                  ? "bg-holdish border-l-4 border-greenish-hold text-greenish"
                  : "hover:bg-holdish hover:border-l-4 border-transparent hover:border-greenish-hold hover:text-greenish"
              }`
            }
          >
            <img
              src="src\public\images\icons8-create-24.png"
              alt="Create Post Icon"
              className="mr-2"
            />
            Create Post
          </NavLink>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between mb-2">
        <div className="flex items-center">
        <img src="https://img.icons8.com/sf-ultralight/50/user-group-man-man.png" alt="user-group-man-man" className="mr-2 w-8 h-8"/>

          <p className="font-nunito_Sans">Support</p>
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-greenish shadow-lg hover:bg-greenish-hold transition-all duration-100 ease-in-out"
        >
        <img src="https://img.icons8.com/material-rounded/24/FFFFFF/right.png" alt="right" className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );
}