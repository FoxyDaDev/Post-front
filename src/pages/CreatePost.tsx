import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

function CreatePost() {
  const [content, setContent] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [cookies] = useCookies(['auth']);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
        });
        setUserName(response.data.username);
      } catch (error) {
        console.error('Error: ', error);
      }
    };

    if (cookies.auth) {
      fetchUserProfile();
    }
  }, [cookies.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/posts', {
        author: userName,
        content,
      }, {
        headers: {
          Authorization: `Bearer ${cookies.auth}`,
        },
      });

      if (response.status === 201) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error: ', error);
      alert('Failed to create the post.');
    }
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 flex justify-center items-center bg-backgroundish">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4">
          <h1 className="text-2xl font-semibold mb-4">Create a post</h1>
          <div className="flex items-start mb-4">
            <img
              width="32"
              height="32"
              src="https://img.icons8.com/puffy-filled/32/user.png"
              alt="user"
            />
            <p className="text-l font-semibold ml-2">{userName}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label
              htmlFor="postContent"
              className="block text-sm font-medium text-gray-500 pl-1"
            >
              Write your post
            </label>
            <textarea
              id="postContent"
              name="postContent"
              rows={4}
              className="block w-full p-2 border border-gray-300 rounded-md"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full text-white bg-greenish hover:bg-greenish-hold focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;