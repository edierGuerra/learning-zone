/* Page de recuperacion de contraseña */

import '../Styles/RecoverPassword.css'
import RequestEmail from '../Components/RequestEmail';
import Requestpasswords from '../Components/Requestpasswords';
type TPropsRecoverPassword ={
  viewFormNewPassword: true | false
}
export default function RecoverPassword({viewFormNewPassword}:TPropsRecoverPassword) {

  return (
    <div className="container-recover-password">
      {/* En caso tal de que sea true habilitar el formulario de nueva contraseña, en caso contrario mostrar formulario de email */}
      {viewFormNewPassword?
      <Requestpasswords/>:
      <RequestEmail/>
    }
    </div>
  )
}
