import { useUser } from "../../auth/Hooks/useAuth"

export default function UserProfilePage() {
  const {id} = useUser()
  console.log('eeee ',id)
  return (
    <div>
        Page config User (update, edit ...)
      
    </div>
  )
}
