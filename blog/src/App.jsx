import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import loginService from './services/login' 
import blogService from './services/blog'
import LoginForm from './components/loginForm'
import Togglable from './components/toggle'
import BlogList from './components/blogList'
import { useNotification } from './contexts/notificationContext'
import Notification from './components/notification'
import { useBlogs } from './hooks/useBlogQueries'
import { useUser } from './contexts/userContext'
import Navbar from './components/navbar'
import UsersStatisticPage from './components/userStatisticPage'

const App = () => {
  const blogsQuery = useBlogs()
  const { user, loginUser, logoutUser } = useUser()

  const blogs = blogsQuery.data || []
  const { showNotification } = useNotification()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
            <Navbar user={user} /> 
            
            <Routes>
              <Route path="/" element={
                <BlogList 
                  blogs={blogs}
                  currentUser={user}
                />
              } />
              <Route path="/blogs" element={
                <BlogList 
                  blogs={blogs}
                  currentUser={user}
                />
              } />
              <Route path="/users" element={<UsersStatisticPage />} />
            </Routes>
          </div>
      )}
    </div>
  )
}

export default App