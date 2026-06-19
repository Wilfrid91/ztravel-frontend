const initialState = {
  isAuthenticated: false,
  user: null,
  // stocke l'uri avant la redirection de connexion
  originalUri: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, user: action.payload }
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null }
    case 'SET_ORIGINAL_URI':
      return { ...state, originalUri: action.payload }
    default:
      return state
  }
}
export default authReducer
