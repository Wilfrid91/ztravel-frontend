import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../reducers/authReducer'
/* The callback (getDefaultMiddleware) => getDefaultMiddleware() ensures that default middlewares like redux-thunk are included. You can then append custom middlewares like logger using .concat().*/
export default configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})
