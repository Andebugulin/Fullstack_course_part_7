import React, { useState, useRef } from 'react'
import BlogItem from './blog'
import BlogForm from './blogForm'
import Togglable from './toggle'
import { useCreateBlog, useDeleteBlog, useUpdateBlog } from '../hooks/useBlogQueries'
import { useNotification } from '../contexts/notificationContext'

const BlogList = ({ 
  blogs, 
  currentUser
}) => {
  const createBlog = useCreateBlog()
  const updateBlog = useUpdateBlog()
  const deleteBlog = useDeleteBlog()
  const { showNotification } = useNotification()
  const blogFormRef = useRef()
  const [sortBy, setSortBy] = useState('title')
  const [filterAuthor, setFilterAuthor] = useState('')

  const addBlog = async (blogObject) => {
    try {
      await createBlog.mutate(blogObject)
      blogFormRef.current.toggleVisibility()
      showNotification(`Added blog: ${blogObject.title}`, 'success')
    } catch (error) {
      console.error('Create blog error:', error)
      showNotification('Error creating blog', 'error')
    }
  }

  const updateLikes = async (id, currentLikes) => {
    try {
      await updateBlog.mutateAsync({ 
        id, 
        updatedBlog: { likes: currentLikes + 1 }
      })
      showNotification('Liked!', 'success')
    } catch (error) {
      console.error('Update likes error:', error)
      showNotification('Error updating likes', 'error')
    }
  }

  const handleDeleteBlog = async (id, title) => {
    try {
      await deleteBlog.mutateAsync(id)
      showNotification(`Deleted blog: ${title}`, 'success')
    } catch (error) {
      console.error('Delete blog error:', error)
      showNotification('Error deleting blog', 'error')
    }
  }

  // Filter and sort blogs
  const filteredAndSortedBlogs = blogs
    .filter(blog => 
      filterAuthor === '' || 
      blog.author.toLowerCase().includes(filterAuthor.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return (b.likes || 0) - (a.likes || 0)
        case 'author':
          return (a.author || '').localeCompare(b.author || '')
        default:
          return (a.title || '').localeCompare(b.title || '')
      }
    })

  return (
    <div>
      <h1>Blog List</h1>
      
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <div style={{ margin: '20px 0' }}>
        <div style={{ margin: '10px 0' }}>
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="likes">Likes</option>
          </select>
        </div>
        
        <div style={{ margin: '10px 0' }}>
          <label>Filter by author: </label>
          <input
            type="text"
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            placeholder="Enter author name..."
          />
        </div>
      </div>

      <h2>Blogs ({filteredAndSortedBlogs.length})</h2>
      
      {filteredAndSortedBlogs.length === 0 ? (
        <p>No blogs found. Add some blogs!</p>
      ) : (
        filteredAndSortedBlogs.map(blog => (
          <BlogItem 
            key={blog.id} 
            blog={blog} 
            updateLikes={updateLikes} 
            deleteBlog={handleDeleteBlog}
            currentUser={currentUser}  
          />
        ))
      )}
    </div>
  )
}

export default BlogList