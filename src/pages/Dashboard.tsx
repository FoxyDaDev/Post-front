import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopMenuBar from '../components/TopMenu';
import Post from '../components/Post';
import axios from 'axios';

interface PostType {
  _id: string;
  author: { 
    _id: string;
    username: string 
  };
  content: string;
  createdAt: string;
  likes?: Array<{
    user: {
      _id: string;
      username: string;
    };
  }>;
}

function Dashboard() {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState<PostType[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const limit = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      if (!hasMore || isLoading) return;

      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/posts', {
          params: {
            limit,
            offset,
            search: searchText,
          },
        });

        const newPosts = response.data.posts;
        setPosts(prev => offset === 0 ? newPosts : [...prev, ...newPosts]);
        setHasMore(response.data.hasMore);
      } catch (error) {
        console.error('Error: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [offset, searchText]);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
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

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <TopMenuBar onSearchChange={setSearchText} />
        <div 
          className="h-full overflow-y-scroll p-4 bg-backgroundish pb-6"
          ref={postsContainerRef}
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post._id}
                id={post._id}
                author={post.author}
                content={post.content}
                createdAt={post.createdAt}
                isMyPost={false}
              />
            ))
          ) : (
            <p>No Posts found.</p>
          )}
          {isLoading && <p>Loading more posts...</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;