/* Vista de notificaciones */
import { IoMdNotifications } from 'react-icons/io'
import { useUser } from '../../../modules/auth/Hooks/useAuth'

export default function IconNotifications() {
  const {numberNotifications} = useUser()
  return (
    <>
      <IoMdNotifications />
      {numberNotifications > 0 && (
        <span 
        style={{
          marginLeft: "-10px",
          textAlign: "center",
          borderRadius: "20px",
          backgroundColor: "#48e",
          width: "20px",
          height: "20px",
          fontSize: "12px",
          alignSelf: "start",
          animation: "bounce 0.6s ease-in-out infinite",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}>+{numberNotifications}</span>
      )}
    </>
  );
}
