import { useUser } from "../../modules/auth/Hooks/useAuth"
import GenerateColorFromName from "../Utils/GenerateColorFromName";
export default function IconPrefixProfile() {
  const { user } = useUser();
  // Use a fallback value for numIdentification when it doesn't exist (teacher profiles)
  const numId =
    user && "numIdentification" in user ? user.numIdentification : 0;
  const color = GenerateColorFromName(user?.name ?? "", numId);
  return (
    <div
      style={{
        backgroundColor: color,
        color: "#fff",
        height: "62px",
        width: "62px",
        borderRadius: "50%",
        alignContent: "center",
        justifyItems: "center",
        textAlign: "center",
      }}
    >
      <p style={{ color: "#fff", fontSize: "26px" }}>{user?.prefixProfile}</p>
    </div>
  );
}
