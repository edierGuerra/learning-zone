import './App.css'
import Home from './modules/dashboard/pages/Home';
import RoutersPrivates from './routers/private';
import PrivateRouters from './routers/PrivateRouters';
/* import UserProfilePage from './modules/users/pages/UserProfilePage' */
import RoutersPublic from './routers/public'
/* import PublicLayout from './shared/Layouts/PublicLayout' */

function App() {
  return (
    <div>
      <RoutersPrivates/>
    </div>
  );
}

export default App;
