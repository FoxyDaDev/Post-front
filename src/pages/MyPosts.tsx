import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopMenuBar from '../components/TopMenu';
import Post from '../components/Post';

interface PostType {
  _id: string;
  author: { 
    _id: string;
    username: string 
  };
  content: string;
  createdAt: string;
}


function MyPosts() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [cookies] = useCookies(['auth']);
  const [userId, setUserId] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const limit = 10;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
        });
        setUserId(response.data._id);
      } catch (error) {
        console.error('Error: ', error);
      }
    };

    if (cookies.auth) {
      fetchUserProfile();
    }
  }, [cookies.auth]);

  const fetchUserPosts = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/posts', {
        headers: {
          Authorization: `Bearer ${cookies.auth}`,
        },
        params: {
          limit,
          offset,
          search: searchText,
        },
      });
      
      const userPosts = response.data.posts.filter((post: PostType) => 
        post.author && post.author._id === userId
      );
      
      setPosts(prev => offset === 0 ? userPosts : [...prev, ...userPosts]);
      setHasMore(userPosts.length === limit);
    } catch (error) {
      console.error('Error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserPosts();
    }
  }, [userId, offset, searchText]);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setPosts([]);
  }, [searchText]);

  useEffect(() => {
    const container = postsContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - (scrollTop + clientHeight) < 100 && hasMore && !isLoading) {
        setOffset(prev => prev + limit);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading]);

  const handlePostUpdate = (action: 'edit' | 'delete', postId: string, newContent?: string) => {
    setPosts(prevPosts => {
      if (action === 'delete') {
        return prevPosts.filter(post => post._id !== postId);
      } else if (action === 'edit' && newContent) {
        return prevPosts.map(post => 
          post._id === postId ? { ...post, content: newContent } : post
        );
      }
      return prevPosts;
    });
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <TopMenuBar onSearchChange={setSearchText} />
        <div className="h-full overflow-y-scroll p-4 bg-backgroundish" ref={postsContainerRef}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post._id}
                id={post._id}
                author={post.author}
                content={post.content}
                createdAt={post.createdAt}
                onPostUpdate={handlePostUpdate}
                isMyPost={true}
              />
            ))
          ) : (
            <p className="text-gray-500">No posts found.</p>
          )}
          {isLoading && <p>Loading more posts...</p>}
        </div>
      </div>
    </div>
  );
}

export default MyPosts;