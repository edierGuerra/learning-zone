/* Componente que renderiza la ventana donde se ve excel word y power Point */
import { useNavigationHandler } from '../../../hooks/useNavigationHandler'
import './Styles/ViewCategories.css'

export default function ViewCategories() {
  const handleBtnNavigate = useNavigationHandler()


  return (
    <div className='container-view-categories'>
        <button className='btn-powerPoint' onClick={()=> handleBtnNavigate('/powerpoint')}>Power Point</button>
        <button className='btn-excel' onClick={()=> handleBtnNavigate('/excel')}>Excel</button>
        <button className='btn-word' onClick={()=> handleBtnNavigate('/word')}>Word</button>

    </div>
  )
}
