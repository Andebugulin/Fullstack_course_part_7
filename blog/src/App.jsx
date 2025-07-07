import React, { useState, useEffect, useRef } from 'react'
import loginService from './services/login' 
import blogService from './services/blog'
import LoginForm from './components/loginForm'
import Togglable from './components/toggle'
import BlogForm from './components/blogForm' 
import BlogItem from './components/blog'
import { useNotification } from './contexts/notificationContext'
import Notification from './components/notification'
import { useBlogs, useCreateBlog, useDeleteBlog, useUpdateBlog } from './hooks/useBlogQueries'
import { useUser } from './contexts/userContext'

const App = () => {
  const blogsQuery = useBlogs()
  const createBlog = useCreateBlog()
  const updateBlog = useUpdateBlog()
  const deleteBlog = useDeleteBlog()
  const { user, loginUser, logoutUser } = useUser()

  const blogs = blogsQuery.data || []
  const {showNotification} = useNotification()
  const [sortBy, setSortBy] = useState('title')
  const [filterAuthor, setFilterAuthor] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  // Check for existing user token on mount
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      loginUser(user, user.token)
      blogService.setToken(user.token)
    }
  }, [])



  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, 
        password
      })

      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
      blogService.setToken(user.token)
      console.log('token set:', user.token)
      loginUser(user, user.token)
      setUsername('')
      setPassword('')
      showNotification('Login successful!', 'success')

      blogsQuery.refetch()
    }
    catch (error) {
      console.error('Login error:', error)
      showNotification('Invalid username or password', 'error') 
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    logoutUser()
    blogService.setToken(null)
    showNotification('Logged out successfully', 'success')

    blogsQuery.refetch()
  }

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

  // Update blog likes - you'll need to add this to your blog service
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

  // Delete blog - you'll need to add this to your blog service
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {user === null ? (
        <Togglable buttonLabel='login'>
          <Notification />
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
       </Togglable>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p>{user.name} logged-in</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <Notification />
          
          <h1>Blog List</h1>
          
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm
              createBlog={addBlog}
            />
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
              currentUser={user}  
            />            ))
          )}
        </div>
      )}
    </div>
  )
}

export default App