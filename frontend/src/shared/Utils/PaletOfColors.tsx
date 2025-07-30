import { educationalPalettes } from '../theme/ColorPalettesCourses'

export default function PaletOfColors() {

    
  return (
    <div className='containet-palet-colors'>
       { 
    // Recorremos el objeto `educationalPalettes` convirtiéndolo en un array de [clave, valor]
    Object.entries(educationalPalettes).map(([name, palette]) => (
    // Cada iteración devuelve un bloque <div> que representa una paleta

    <div
      key={name} // Clave única para React (usa el nombre de la paleta)
      // Asignamos estilos en línea: fondo con el color "brand" y texto con el color "text
      style={{'display':'flex','flexDirection':'row', 'gap':'20px'}}
    >
      {/* Muestra el nombre de la paleta (por ejemplo "vibrantLearning") */}
      <h3 style={{'color':'#111'}}>{name}</h3>

      {/* Muestra cada uno de los valores de color de la paleta */}
      <div style={{'display':'flex'}}>
        <span style={{'backgroundColor':palette.accent, 'width':'30px', 'height':'30px','content':' '}}></span>     {/* Color principal de la marca */}
        <span style={{'backgroundColor':palette.brand, 'width':'30px', 'height':'30px','content':' '}}></span> {/* Color para fondos o superficies */}
        <span style={{'backgroundColor':palette.surface, 'width':'30px', 'height':'30px','content':' '}}></span>       {/* Color para texto principal */}
        <span style={{'backgroundColor':palette.text, 'width':'30px', 'height':'30px','content':' '}}></span>   {/* Color para acentos o elementos destacados */}
      </div>
    </div>
  ))
}

      
    </div>
  )
}
