import './App.css'
import { ContextProvider } from './modules/auth/Context/AuthContext'
import UserProfilePage from './modules/users/pages/UserProfilePage'
/* import PublicLayout from './shared/Layouts/PublicLayout' */

function App() {

  return (
    <>
    <ContextProvider>
      <UserProfilePage/>
    </ContextProvider>

    
    </>
  )
}

export default App
