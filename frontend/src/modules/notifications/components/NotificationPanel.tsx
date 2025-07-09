import { useUser } from '../../auth/Hooks/useAuth'
import useNotifications from '../hooks/useNotifications'
import '../styles/NotificationPanel.css'
import NotificationItem from './NotificationItem'
export default function NotificationPanel() {
  const {notifications} = useUser()
  const {deleteAllNotification} = useNotifications()
  return (
    <div className='container-panel-notifications'> 
      {notifications.length >0?<>
      <h2 className='title-container-notifications'>Bandeja de notificaciones</h2>
        {notifications.map((notification)=>(
          <NotificationItem key={notification.id} notification={notification}/>
        ))}
        <button className='btn-delete-all' onClick={()=>deleteAllNotification()}>Eliminar todo</button>
      </>:
      <h2>No hay notificaciones</h2>}
    </div>
  )
}
