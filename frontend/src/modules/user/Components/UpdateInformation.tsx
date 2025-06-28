import useFormUpdate from "../Hooks/useFormUpdate"
import '../Styles/UpdateInformation.css'
export default function UpdateInformation() {
    const { newNIdentification,newName,newLastNames,newEmail,setNewNIdentification,setNewName,setNewLastNames,setNewEmail,handleSubmitUpdate,errors} = useFormUpdate()
  return (
     <form className='form-update' onSubmit={(e)=>handleSubmitUpdate(e)}>
        <h3 className="title-form-update">Actualizate Aqui!</h3>
      
        <div className="container-label-input-u">
          <label htmlFor="nIdentification">N identificación</label>
          <input 
            type="text" 
            id="nIdentification" 
            value={newNIdentification}
            className={newNIdentification? 'has-content':''}
            onChange={(e)=>setNewNIdentification(Number(e.target.value))}/>
          {errors.numIdentification && <span className="error">{errors.numIdentification}</span>}
        </div>
      
       <div className="container-label-input-u">
         <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            value={newName}
            className={newName? 'has-content':''}
            onChange={(e)=>setNewName(e.target.value)}/>
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

       <div className="container-label-input-u">
         <label htmlFor="lastName">lastName</label>
          <input 
            type="text" 
            id="lastName" 
            value={newLastNames}
            className={newLastNames? 'has-content':''}
            onChange={(e)=>setNewLastNames(e.target.value)}/>
          {errors.lastNames && <span className="error">{errors.lastNames}</span>}
        </div>
       <div className="container-label-input-u">
         <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={newEmail}
            className={newEmail? 'has-content':''}
            onChange={(e)=>setNewEmail(e.target.value)}/>
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <input className="btn-update" type="submit" value={'Update'} />
      
    </form>
  )
}
