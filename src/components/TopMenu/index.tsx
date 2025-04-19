import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';

interface TopMenuBarProps {
  onSearchChange: (searchText: string) => void;
}

function TopMenuBar({ onSearchChange }: TopMenuBarProps) {
  // const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(['auth']);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error: ', error);
      }
    };

    if (cookies.auth) {
      fetchUserProfile();
    }
  }, [cookies.auth]);

  // const toggleDropdown = () => {
  //   setDropdownOpen((prev) => !prev);
  // };

  const signOutHandler = () => {
    removeCookie('auth', { path: '/' });
    navigate('/login');
  };

  return (
    <div className="h-16 flex items-center justify-between pr-4 relative">
      <div className="flex items-center">
        <div className="border-l border-gray-300 h-8 mr-2"></div>
        <div className="relative">
          <img
            src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/24/external-search-logistic-delivery-kiranshastry-solid-kiranshastry.png"
            alt="Search icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="جستجو"
            className="pl-10 pr-4 py-2 focus:outline-none"
            maxLength={25}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center">
        <img
          width="26"
          height="26"
          src="https://img.icons8.com/puffy-filled/32/user.png"
          alt="user"
          className="mr-2"
        />
        <p className="pr-4 pl-1 font-nunito_Sans">{userName}</p>
        <button onClick={signOutHandler} className="text-red-500">
          Logout
        </button>
      </div>
    </div>
  );
}

export default TopMenuBar;
