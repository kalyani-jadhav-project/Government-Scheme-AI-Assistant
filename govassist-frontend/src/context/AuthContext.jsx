import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('govassist_token')
    const savedUser = localStorage.getItem('govassist_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (authData) => {
    setToken(authData.token)
    setUser({
      id: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      profileCompleted: authData.profileCompleted,
    })
    localStorage.setItem('govassist_token', authData.token)
    localStorage.setItem('govassist_user', JSON.stringify({
      id: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      profileCompleted: authData.profileCompleted,
    }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('govassist_token')
    localStorage.removeItem('govassist_user')
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('govassist_user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
