import Cookies from 'js-cookie'

interface UserData {
  _id: string
  name: string
  email: string
  role: string
  hotelId: string
}

export const AuthUtils = {
  // Set user data in cookies
  setUserData(userData: UserData) {
    Cookies.set('userData', JSON.stringify(userData), { 
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  },

  // Get user data from cookies
  getUserData(): UserData | null {
    const userDataCookie = Cookies.get('userData')
    return userDataCookie ? JSON.parse(userDataCookie) : null
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const accessToken = Cookies.get('accessToken')
    const refreshToken = Cookies.get('refreshToken')
    return !!(accessToken && refreshToken)
  },

  // Get user role
  getUserRole(): string | null {
    const userData = this.getUserData()
    return userData ? userData.role : null
  },

  // Logout user
  logout() {
    // Remove all authentication-related cookies
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('userData')
    
    // Redirect to login page
    window.location.href = '/'
  },

  // Check if user has specific role
  hasRole(role: string): boolean {
    return this.getUserRole() === role
  }
}

// Export as default for easier importing
export default AuthUtils