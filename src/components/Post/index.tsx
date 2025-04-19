import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';
import Comment from '../Comments';
import Input from '../Input';

interface PostProps {
  id: string;
  author: {
    _id: string;
    username: string;
  };
  content: string;
  createdAt: string;
  onPostUpdate?: (action: 'edit' | 'delete', postId: string, newContent?: string) => void;
  isMyPost?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
}

interface DecodedToken {
  id: string;
}

interface CommentType {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
  };
  createdAt: string;
  parentComment: string | null;
  replies?: CommentType[];
}

const Post = ({ id, author, content, createdAt, onPostUpdate, isMyPost, ref }: PostProps) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [cookies] = useCookies(['auth']);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    if (cookies.auth) {
      const decodedToken = jwtDecode<{ id: string }>(cookies.auth);
      setCurrentUserId(decodedToken.id);
    }
  }, [cookies.auth]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        if (!id || !cookies.auth) {
          return;
        }

        const decodedToken = jwtDecode<DecodedToken>(cookies.auth);
        const userId = decodedToken.id;

        const response = await axios.get(`http://localhost:5000/api/likes/${id}`);
        setLikes(response.data.length);
        
        const userLiked = response.data.some((like: any) => like.user._id === userId);
        setLiked(userLiked);
      } catch (error) {
        console.error('Error: ', error);
      }
    };

    fetchLikes();
  }, [id, cookies.auth]);

  const handleLike = async () => {
    try {
      if (!id) {
        console.error('Post ID is missing');
        return;
      }

      if (liked) {
        await axios.delete('http://localhost:5000/api/likes', {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
          data: { postId: id },
        });
        setLikes((prev) => prev - 1);
      } else {
        const response = await axios.post(
          'http://localhost:5000/api/likes',
          { postId: id },
          {
            headers: {
              Authorization: `Bearer ${cookies.auth}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(response.data);
        setLikes((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/post/${id}?sort=createdAt`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    try {
      if (!newComment.trim()) return;
      
      await axios.post(
        'http://localhost:5000/api/comments',
        {
          postId: id,
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
        }
      );
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleCommentChange = (value: string) => {
    setNewComment(value);
  };

  const handleEditPost = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/posts/${id}`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
        }
      );
      setIsEditing(false);
      if (onPostUpdate) {
        onPostUpdate('edit', id, editedContent);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.auth}`,
        },
      });
      if (onPostUpdate) {
        onPostUpdate('delete', id);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleEditChange = (value: string) => {
    setEditedContent(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col" ref={ref}>
      <div className="flex items-start">
        <img 
          src="https://img.icons8.com/ios/50/user-male-circle--v1.png" 
          alt="user-male-circle--v1" 
          className="w-12 h-12 rounded-full mr-4"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between relative">
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{author.username}</h2>
              <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
            </div>
            <span className="absolute -top-3 right-0 bg-[#F8F7F1] text-greenish-hold text-sm font-semibold py-2 px-3 rounded-full mt-2">
              خرید و فروش
            </span>
          </div>

          {isEditing ? (
            <Input
              name="edit-post"
              type="text"
              inputText={editedContent}
              onChange={handleEditChange}
              id={`edit-post-${id}`}
              maxLength={1000}
              required={true}
            />
          ) : (
            <p className="text-gray-700 mt-3">{content}</p>
          )}

          <div className="flex justify-end mt-4 space-x-5">
            <button onClick={handleLike} className="flex items-center gap-1">
              <img 
                src={liked ? "https://img.icons8.com/ios-filled/50/like.png" : "https://img.icons8.com/ios/50/like.png"} 
                alt="like" 
                className="w-6 h-6"
              />
              <span>{likes}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1">
              <img 
                src="https://img.icons8.com/ios/50/comments.png"
                alt="comments" 
                className="w-6 h-6"
              />
              <span>{comments.length}</span>
            </button>
            <button>
              <img 
                src="https://img.icons8.com/material-outlined/50/bookmark-ribbon--v1.png" 
                alt="bookmark-ribbon--v1" 
                className="w-6 h-6"
              />
            </button>
            {isMyPost && currentUserId === author._id && (
              <>
                {isEditing ? (
                  <>
                    <button onClick={handleEditPost} className="text-blue-500">
                      Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="text-gray-500">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="text-blue-500">
                    Edit
                  </button>
                )}
                <button onClick={handleDeletePost} className="text-red-500">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 border-t pt-4">
          <div className="mb-4">
            <Input
              name="comment"
              type="text"
              inputText={newComment}
              label="Write a comment..."
              id={`comment-input-${id}`}
              maxLength={1000}
              required={true}
              onChange={handleCommentChange}
            />
            <button
              onClick={handleAddComment}
              className="mt-2 bg-greenish hover:bg-greenish-hold text-white px-4 py-2 rounded-lg transition-colors"
              disabled={!newComment.trim()}
            >
              Add Comment
            </button>
          </div>

          <div className="space-y-4">
            {comments.map(comment => (
              <Comment
                key={comment._id}
                id={comment._id}
                content={comment.content}
                author={comment.user.username}
                authorId={comment.user._id}
                createdAt={comment.createdAt}
                parentId={comment.parentComment}
                postId={id}
                onCommentUpdate={fetchComments}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
