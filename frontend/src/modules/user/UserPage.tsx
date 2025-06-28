import UpdateInformation from "./Components/UpdateInformation";
import './Styles/UserPage.css'
export default function UserPage() {
  return (
    /* Reemplazar campos por lo del backend */
    <div className="container-profile-user">
        <h2 className="title-profile-user">Que te trae por aqui Junior Herrera</h2>
        <div className="container-about-user">
            <section className="section-process">
              <h2 className="title-process">Proceso</h2>
              <p className="process-course-PowerPoint">PowerPoint <span className="number-process">40/100</span></p>
              <p className="process-course-excel">Excel <span className="number-process">40/100</span></p>
              <p className="process-course-word">Word <span className="number-process">40/100</span></p>
              <p className="process-main">Proceso General <span className="number-process">50/100</span></p>
            </section>
            <section className="section-info-user">
                
                <UpdateInformation/>
            </section>


        </div>
      
    </div>
  )
}
