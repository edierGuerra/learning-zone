import { useUser } from "../../modules/auth/Hooks/useAuth"
import GenerateColorFromName from "../Utils/GenerateColorFromName";
export default function IconPrefixProfile() {
    const {student} = useUser()
    const color = GenerateColorFromName(student?.name ??"", student?.id ?? 0);

  return (
    <div style={{'backgroundColor':`${color}`, 'color':'#fff',  'height':'62px', 'width':'62px','borderRadius':'50%',  'alignContent':'center', 'justifyItems':'center', 'textAlign':'center'}}>
        <p style={{'color':'fff', 'fontSize':'26px'}}>{student?.prefixProfile}</p>
    </div>
  )
}
