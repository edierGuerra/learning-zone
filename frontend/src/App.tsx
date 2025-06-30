import './App.css'
import { SitePolicies } from './pages/info/SitePolicies';
import RoutersPrivates from './routers/private';
/* import Help from './pages/Help'; */
/* import Home from './modules/dashboard/pages/Home'; */
/* import RoutersPrivates from './routers/private';
 */import RoutersPublic from './routers/public';
/* import RoutersPrivates from './routers/private';
import PrivateRouters from './routers/PrivateRouters'; */
/* import UserProfilePage from './modules/users/pages/UserProfilePage' */

/* import PublicLayout from './shared/Layouts/PublicLayout'  */

function App() {
  return (
    <div>
      <RoutersPublic/>
    </div>
  );
}

export default App;
