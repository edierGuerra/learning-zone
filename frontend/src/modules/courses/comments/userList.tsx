// src/components/UserList.tsx

// Se importa el archivo de estilos que aplica estilos visuales a este componente.
import '../components/styles/commentPage.css';
import './styles/userList.css';
import type { TStudentAllComents } from './types';

// Se define la interfaz para las props que recibe este componente.
// En este caso, se espera un array de strings, cada uno representando un usuario conectado.
interface UserListProps {
  students: TStudentAllComents[];
}

// Este es el componente funcional principal que renderiza la lista de usuarios conectados.
export default function UserList({ students }: UserListProps) {
  let connectStudent =0;
  for (let index = 0; index < students.length; index++) {
    if(students[index].stateConnect){
        connectStudent += 1;

    }
    
  }
  const cantStudents = students.length;
  return (
    // Contenedor principal del componente con clase CSS para aplicar estilos.
    <div className="user-list">
      <h3>Usuarios conectados</h3>

      {/* Muestra cuántos usuarios están conectados en tiempo real */}
      <p>{connectStudent} / {cantStudents} estudiantes</p>

      {/* Lista de usuarios conectados */}
      <ul>
        {/* Se recorre el array de usuarios usando map() */}
        {students.map((student,i) => {
          // Se toma la segunda letra del nombre del usuario como inicial.
          // Si no existe, se muestra un "?" por defecto.
          const initials = student.prefixProfile;

          // Lista de colores disponibles para los avatares.
          const colors = ['red', 'lime', 'yellow', 'blue', 'magenta'];

          // Se selecciona un color basado en el índice del usuario para alternar entre colores.
          const color = colors[i % colors.length];

          // Se retorna un elemento de la lista para cada usuario.
          return (
            <li key={student.id}>
              {/* Se muestra un avatar con fondo de color y la inicial del usuario */}
              <div className={`avatar ${color}`}>{initials}</div>

              {/* Se muestra el nombre del usuario con @ */}
              <span>{student.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
