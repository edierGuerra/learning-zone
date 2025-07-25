/* Page donde se renderiza el contenido de una leccion */
import { IoArrowBackCircleSharp } from 'react-icons/io5'
import { HiDownload } from "react-icons/hi";
import { useCourseContext } from '../hooks/useCourse'
import '../styles/ContentPage.css'
import { useNavigationHandler } from '../../../hooks/useNavigationHandler'
export default function ContentPage() {
    const {content, renderEvaluation,currentLesson} = useCourseContext()
        const handleBtnNavigate = useNavigationHandler()
    

    
  return (
    <div className='container-content-lesson'>
        <button className="btn-back-content" onClick={()=>handleBtnNavigate('/back')}>{<IoArrowBackCircleSharp/>}</button>

        <h2 className='title-content'>{content?.title}</h2>
        <p className='text-content'>{content?.text}</p>
        {content?.contentType === 'image'?
            <img className='image-content' src={content.content} alt="contenido" />:
        content?.contentType === 'text'?
        <p className='content-content'>{content.content}</p>:
        <video src={content?.content} controls></video>
    }
        {/* Botón de descarga justo después del recurso, solo si no es texto */}
        {content?.contentType !== 'text' &&
            <a className='btn-downloand-content' href={content?.content} download ><HiDownload/></a>
        }
        <button className='btn-content-next' onClick={()=>renderEvaluation(currentLesson?.idCourse,currentLesson!.id)}>Continuar</button>
    </div>
  )
}
