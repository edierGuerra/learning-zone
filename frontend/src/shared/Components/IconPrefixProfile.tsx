import { useUser } from "../../modules/auth/Hooks/useAuth"
export default function IconPrefixProfile() {
    const {student} = useUser()
  return (
    <div style={{'backgroundColor':'#100012', 'color':'#fff',  'height':'62px', 'width':'62px','borderRadius':'50%',  'alignContent':'center', 'justifyItems':'center', 'textAlign':'center'}}>
        <p style={{'color':'fff', 'fontSize':'26px'}}>{student?.prefixProfile}</p>
    </div>
  )
}
