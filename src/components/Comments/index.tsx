import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Input from '../Input';
import { jwtDecode } from 'jwt-decode';

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

interface CommentProps {
  id: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  parentId: string | null;
  postId: string;
  onCommentUpdate: () => void;
}

function Comment({ id, content, author, authorId, createdAt, parentId, postId, onCommentUpdate }: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [replyContent, setReplyContent] = useState('');
  const [cookies] = useCookies(['auth']);
  const [replies, setReplies] = useState<CommentType[]>([]);
  const [replyToUsername, setReplyToUsername] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    if (cookies.auth) {
      const decodedToken = jwtDecode<{ id: string }>(cookies.auth);
      setCurrentUserId(decodedToken.id);
    }
  }, [cookies.auth]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/post/${postId}?sort=createdAt`);
        const filteredReplies = response.data.filter((comment: CommentType) => comment.parentComment === id);
        setReplies(filteredReplies);
      } catch (error) {
        console.error('Error: ', error);
      }
    };

    fetchReplies();
  }, [id, postId, onCommentUpdate]);

  const handleEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/comments/${id}`,
        { content: editedContent },
        {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
        }
      );
      setIsEditing(false);
      onCommentUpdate();
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${cookies.auth}`,
        },
      });
      onCommentUpdate();
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleReply = async () => {
    try {
      if (!replyContent.trim()) return;
      
      await axios.post(
        'http://localhost:5000/api/comments',
        {
          postId,
          content: replyContent,
          parentCommentId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.auth}`,
          },
        }
      );
      setIsReplying(false);
      setReplyContent('');
      setReplyToUsername(null);
      onCommentUpdate();
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleReplyChange = (value: string) => {
    setReplyContent(value);
  };

  const handleEditChange = (value: string) => {
    setEditedContent(value);
  };

  const handleReplyClick = () => {
    setIsReplying(true);
    setReplyToUsername(author);
  };

  return (
    <div className="mb-4">
      <div className={`bg-gray-50 p-4 rounded-lg ${parentId ? 'border-l-2 border-greenish ml-8' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-800">{author}</h4>
            <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
          {currentUserId === authorId && (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-white bg-greenish hover:bg-greenish-hold rounded-lg transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-white bg-greenish hover:bg-greenish-hold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2">
            <Input
              name="edit-comment"
              type="text"
              inputText={editedContent}
              onChange={handleEditChange}
              id={`edit-comment-${id}`}
              maxLength={1000}
              required={true}
            />
            <div className="mt-2 flex gap-2">
              <button 
                onClick={handleEdit}
                className="px-4 py-2 text-white bg-greenish hover:bg-greenish-hold rounded-lg transition-colors"
              >
                Save
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-white bg-greenish hover:bg-greenish-hold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-gray-700">{content}</p>
        )}

        <div className="mt-2">
          <button 
            onClick={handleReplyClick}
            className="px-4 py-2 text-white bg-greenish hover:bg-greenish-hold rounded-lg transition-colors"
          >
            Reply
          </button>
        </div>

        {isReplying && (
          <div className="mt-2">
            <Input
              name="reply-comment"
              type="text"
              inputText={replyContent}
              onChange={handleReplyChange}
              id={`reply-comment-${id}`}
              maxLength={1000}
              required={true}
              label={`Replying to ${replyToUsername || author}`}
            />
            <div className="mt-2 flex gap-2">
              <button 
                onClick={handleReply}
                className="px-4 py-2 text-white bg-greenish hover:bg-greenish-hold rounded-lg transition-colors"
                disabled={!replyContent.trim()}
              >
                Submit
              </button>
              <button 
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                  setReplyToUsername(null);
                }}
                className="px-4 py-2 text-white bg-greenish hover:bg-greenish-hold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {replies.length > 0 && (
        <div className="ml-8">
          {replies.map(reply => (
            <Comment
              key={reply._id}
              id={reply._id}
              content={reply.content}
              author={reply.user.username}
              authorId={reply.user._id}
              createdAt={reply.createdAt}
              parentId={reply.parentComment}
              postId={postId}
              onCommentUpdate={onCommentUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;