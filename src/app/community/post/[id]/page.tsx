"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';

export default function PostPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const toast = useToast();
  const { data: session } = useSession();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });

  const userRole = (session?.user as any)?.role;
  const isPrivileged = userRole === 'OWNER' || userRole === 'ADMIN' || userRole === 'STAFF' || userRole === 'SUB_ADMIN' ||
                  session?.user?.email === 'boysmsg832@gmail.com' || 
                  (session?.user as any)?.discordId === 'boysmsg01';

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/community/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
        setEditForm({ title: data.title || '', content: data.content || '' });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/community/${id}/comments`);
      if (res.ok) setComments(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleInteract = async (action: 'like' | 'dislike') => {
    if (!session) return toast.error("Please login to vote!");
    try {
      const res = await fetch(`/api/community/${id}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        const data = await res.json();
        setPost({ 
          ...post, 
          upvotes: data.likes, 
          downvotes: data.dislikes,
          isLiked: data.isLiked,
          isDisliked: data.isDisliked 
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFavorite = async () => {
    if (!session) return toast.error("Please login to save posts!");
    try {
      const res = await fetch(`/api/community/${id}/favorite`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setPost({ ...post, isSaved: data.isFavorited });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return toast.error("Please login to comment!");
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`/api/community/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFollow = async () => {
    if (!session) return toast.error("Please login to follow!");
    try {
      const res = await fetch(`/api/profile/${post.authorId}/follow`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setPost({ ...post, isFollowing: data.isFollowing });
        toast.success(data.isFollowing ? "You are now following this user!" : "You unfollowed this user.");
      } else {
        toast.error(data.error);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to follow.");
    }
  };

  const handleDeletePost = async () => {
    if (!isPrivileged) return;
    const reason = window.prompt("Enter reason for deletion (Leave blank for no reason):");
    if (reason === null) return; // User cancelled the prompt

    try {
      const res = await fetch(`/api/community/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        toast.success("Post deleted successfully.");
        router.push('/community');
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete post");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error deleting post.");
    }
  };

  const handleUpdatePost = async () => {
    try {
      const res = await fetch(`/api/community/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        toast.success("Post updated successfully!");
        setPost({ ...post, title: editForm.title, content: editForm.content });
        setIsEditing(false);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update post");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error updating post.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'gray' }}>Loading post...</div>;
  if (!post) return <div style={{ textAlign: 'center', marginTop: '100px', color: '#ef4444' }}>Error: Post not found!</div>;

  return (
    <div className="inner" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Back Button */}
      <Link href="/community" style={{ color: '#8b5cf6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px', marginBottom: '20px', fontWeight: 'bold' }}>
        <i className="fa-solid fa-arrow-left"></i> Back to Community
      </Link>

      {/* Main Post Card */}
      <div style={{ background: '#1f2937', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' }}>
        {post.media && (
          <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', background: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {post.mediaType === 'image' ? (
              <img src={post.media} alt="Post media" style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }} />
            ) : post.mediaType === 'youtube' ? (
              <iframe width="100%" height="500" src={post.media.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            ) : post.mediaType === 'instagram' ? (
              <iframe width="100%" height="500" src={post.media} frameBorder="0" scrolling="no" allowTransparency></iframe>
            ) : post.mediaType === 'youtube-post' ? (
              <a href={post.media} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '500px', background: 'linear-gradient(135deg, #cc0000, #ff4444)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: '20px', textAlign: 'center', textDecoration: 'none' }}>
                <i className="fa-brands fa-youtube" style={{ fontSize: '6rem', marginBottom: '20px' }}></i>
                <h4 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>YouTube Community Post</h4>
                <p style={{ margin: '10px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Click here to view this post directly on YouTube</p>
              </a>
            ) : post.mediaType === 'video' ? (
              <video src={post.media} controls style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
            ) : null}
          </div>
        )}

        <div style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.9rem', background: 'rgba(139,92,246,0.2)', color: '#c084fc', padding: '5px 12px', borderRadius: '12px', fontWeight: 600 }}>{post.category}</span>
            <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>{new Date(post.timestamp).toLocaleDateString()}</span>
          </div>

          {isEditing ? (
            <div style={{ marginBottom: '30px' }}>
              <input 
                type="text" 
                value={editForm.title} 
                onChange={(e) => setEditForm({...editForm, title: e.target.value})} 
                style={{ width: '100%', fontSize: '2rem', fontWeight: 800, marginBottom: '20px', color: '#f3f4f6', background: '#374151', border: '1px solid #4b5563', padding: '10px', borderRadius: '8px' }} 
              />
              <textarea 
                value={editForm.content} 
                onChange={(e) => setEditForm({...editForm, content: e.target.value})} 
                style={{ width: '100%', minHeight: '150px', color: '#d1d5db', fontSize: '1.1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', background: '#374151', border: '1px solid #4b5563', padding: '10px', borderRadius: '8px', fontFamily: 'inherit' }} 
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button onClick={handleUpdatePost} style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Save Changes</button>
                <button onClick={() => setIsEditing(false)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', color: '#f3f4f6' }}>{post.title}</h1>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px', whiteSpace: 'pre-wrap' }}>
                {post.content}
              </p>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', flexWrap: 'wrap', gap: '15px' }}>
            
            {/* Author Info & Follow Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={post.avatar} alt={post.author} style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #8b5cf6' }} />
              <div>
                <h4 style={{ margin: 0, color: '#f3f4f6', fontSize: '1.1rem' }}>{post.author}</h4>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <button onClick={handleFollow} style={{ background: post.isFollowing ? '#3b82f6' : '#10b981', color: 'white', border: 'none', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                    <i className={`fa-solid ${post.isFollowing ? 'fa-user-check' : 'fa-user-plus'}`}></i> {post.isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <Link href="/messages" style={{ background: '#3b82f6', color: 'white', textDecoration: 'none', padding: '3px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    <i className="fa-solid fa-comment-dots"></i> Message
                  </Link>
                </div>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', color: '#9ca3af', fontSize: '2rem', flexWrap: 'wrap' }}>
              {(isPrivileged || (session?.user?.email && (post.authorId === session.user.email || post.authorId === (session.user as any).username))) && (
                <button onClick={() => setIsEditing(!isEditing)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold' }}>
                  <i className="fa-solid fa-pen"></i> Edit Post
                </button>
              )}
              {isPrivileged && (
                <button onClick={handleDeletePost} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 'bold' }} onMouseOver={e => e.currentTarget.style.color = '#dc2626'} onMouseOut={e => e.currentTarget.style.color = '#ef4444'}>
                  <i className="fa-solid fa-trash"></i> Delete Post
                </button>
              )}
              <button onClick={() => handleInteract('like')} style={{ background: 'transparent', border: 'none', color: post.isLiked ? '#ef4444' : '#9ca3af', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onMouseOver={e => !post.isLiked && (e.currentTarget.style.color = '#ef4444')} onMouseOut={e => !post.isLiked && (e.currentTarget.style.color = '#9ca3af')}>
                <i className="fa-solid fa-thumbs-up"></i> {post.upvotes}
              </button>
              <button onClick={() => handleInteract('dislike')} style={{ background: 'transparent', border: 'none', color: post.isDisliked ? '#3b82f6' : '#9ca3af', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onMouseOver={e => !post.isDisliked && (e.currentTarget.style.color = '#3b82f6')} onMouseOut={e => !post.isDisliked && (e.currentTarget.style.color = '#9ca3af')}>
                <i className="fa-solid fa-thumbs-down"></i> {post.downvotes}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', cursor: 'default' }} title="Reach / Views">
                <i className="fa-solid fa-eye"></i> {post.views || 0}
              </div>
              <button onClick={handleFavorite} style={{ background: 'transparent', border: 'none', color: post.isSaved ? '#fbbf24' : '#9ca3af', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onMouseOver={e => !post.isSaved && (e.currentTarget.style.color = '#fbbf24')} onMouseOut={e => !post.isSaved && (e.currentTarget.style.color = '#9ca3af')} title={post.isSaved ? "Remove from Favorites" : "Save to Favorites"}>
                <i className={post.isSaved ? "fa-solid fa-star" : "fa-regular fa-star"}></i> {post.isSaved ? "Saved" : "Save"}
              </button>
              <button style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                <i className="fa-solid fa-share"></i> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div style={{ background: '#111827', borderRadius: '16px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h3 style={{ fontSize: '1.5rem', color: '#f3f4f6', marginBottom: '20px' }}>Comments ({comments.length})</h3>
        
        {/* Write a comment */}
        <form onSubmit={handleComment} style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #374151', background: '#1f2937', color: 'white', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '0 25px', borderRadius: '10px', border: 'none', background: '#8b5cf6', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            Post
          </button>
        </form>

        {/* Comment List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {comments.map((comment: any) => (
            <div key={comment.id} style={{ display: 'flex', gap: '15px' }}>
              <img src={comment.avatar} alt={comment.author} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold', color: '#f3f4f6' }}>{comment.author}</span>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{new Date(comment.timestamp).toLocaleDateString()}</span>
                </div>
                <p style={{ color: '#d1d5db', margin: 0, lineHeight: '1.4' }}>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
