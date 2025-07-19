// src/components/UserList.tsx

// Se importa el archivo de estilos que aplica estilos visuales a este componente.
import GenerateColorFromName from '../../../shared/Utils/GenerateColorFromName';
import './styles/userList.css';
import type { TStudentAllComents } from './types';

// Se define la interfaz para las props que recibe este componente.
// En este caso, se espera un array de strings, cada uno representando un usuario conectado.
interface UserListProps {
  students: TStudentAllComents[];
}

// Este es el componente funcional principal que renderiza la lista de usuarios conectados.
export default function UserList({ students }: UserListProps) {
  let connectStudent = 0;
  for (let index = 0; index < students.length; index++) {
    if (students[index].stateConnect) {
      connectStudent += 1;
    }
  }
  const cantStudents = students.length;

  // Ordena los estudiantes: primero los conectados (stateConnect: true), luego los desconectados
  const sortedStudents = [...students].sort((a, b) => {
    // Si a está conectado y b no, a va antes (-1)
    if (a.stateConnect && !b.stateConnect) return -1;
    // Si a no está conectado y b sí, b va antes (1)
    if (!a.stateConnect && b.stateConnect) return 1;
    // Si ambos tienen el mismo estado, no cambia el orden
    return 0;
  });

  return (
    // Contenedor principal del componente con clase CSS para aplicar estilos.
    <div className="user-list">
      <h3>Usuarios conectados</h3>

      {/* Muestra cuántos usuarios están conectados en tiempo real */}
      <p>{connectStudent} / {cantStudents} estudiantes</p>

      {/* Lista de usuarios conectados */}
      <ul>
        {/* Se recorre el array de usuarios ya ordenado */}
        {sortedStudents.map((student) => {
          // Se toma la segunda letra del nombre del usuario como inicial.
          // Si no existe, se muestra un "?" por defecto.
          const initials = student.prefixProfile;
          // Genera un color único para el avatar usando el nombre y número de identificación
          const color = GenerateColorFromName(student?.name ?? "", student?.numIdentification ?? 0);
          // Se retorna un elemento de la lista para cada usuario.
          return (
            <li key={student.id}>
              {/* Se muestra un avatar con fondo de color y la inicial del usuario */}
              <div style={{ backgroundColor: color }} className={`avatar`}>{initials}</div>
              {/* Indicador de conexión */}
              <span>{student.stateConnect ? '🟢' : '🔴'}</span>
              <span>{student.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
