import React, { useState, useEffect, forwardRef } from 'react';
import '../styles/board.scss';

const Board = forwardRef((props, ref) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [editPostId, setEditPostId] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('https://koreanjson.com/posts/')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const addPost = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const newEntry = { id: Date.now(), title: newPost };
      setPosts([newEntry, ...posts]);
      setNewPost('');
    }
  };

  const deletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const startEditPost = (id, content) => {
    setEditPostId(id);
    setEditPostContent(content);
  };

  const saveEditPost = () => {
    setPosts(posts.map(post => 
      post.id === editPostId ? { ...post, title: editPostContent } : post
    ));
    setEditPostId(null);
    setEditPostContent('');
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? <span key={index} style={{ backgroundColor: '#808080' }}>{part}</span> : part
    );
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(filter.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i <= 10) {
      pageNumbers.push(i);
    }
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section id='Board' ref={ref}>
      <div className='board-inner'>
        <h2>Board</h2>
        <div className='board-input'>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="검색"
          />
          <form onSubmit={addPost}>
            <input
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="새 글 작성"
            />
            <button type="submit">추가</button>
          </form>
        </div>
        <ul className='board-list'>
          {currentPosts.map((post, index) => (
            <li key={post.id}>
              {editPostId === post.id ? (
                <>
                  <input
                    type="text"
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                  />
                  <button onClick={saveEditPost}>저장</button>
                </>
              ) : (
                <>
                  <div className='board-list-title'>
                    <span>{indexOfFirstPost + index + 1}. </span>
                    {highlightText(truncateText(post.title, 45), filter)}
                  </div>
                  <div className='board-list-btn'>
                    <button onClick={() => startEditPost(post.id, post.title)}>수정</button>
                    <button onClick={() => deletePost(post.id)}>삭제</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className='pagination'>
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={number === currentPage ? 'active' : ''}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Board;