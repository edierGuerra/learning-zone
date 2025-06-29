import { useState } from 'react';
import HelpSlide from './components/help/HelpSlide';
import './components/help/styles/Help.css';
import { useNavigationHandler } from '../hooks/useNavigationHandler';

export default function Help() {
  const [index, setIndex] = useState(0);
  const handleBtnNavigate = useNavigationHandler(); 

  const handleSkip = () => {
    console.log('Finalizó o saltó la ayuda');
    handleBtnNavigate('/home'); 
  };

  return (
    <div
      className="help-container"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      <HelpSlide index={index} setIndex={setIndex} onSkip={handleSkip} />
    </div>
  );
}
