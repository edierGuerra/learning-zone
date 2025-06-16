import Magnet from '../../../shared/animations/AnimationMagnet'
import Stepper, { Step } from '../../../shared/animations/AnimationStepper';
import './styles/StepsToRegister.css'


export default function StepsToRegister() {
  return (
    <div className='section-steps-register'>
        <section className='title-section-steps'>
            <h2>¿ Aun no tienes Cuenta?</h2>
            <p className='paragrap-steps-title'>Y estas en el grado 11°</p>
        </section>
            <Stepper
            initialStep={1}
            onStepChange={(step) => {
                console.log(step);
            }}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Previous"
            nextButtonText="Next"
            >
                <Step>
                    <Magnet padding={50} disabled={false} magnetStrength={50}>
                            <h3 className='description-step'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa unde pariatur quia? Et nam numquam optio consequuntur architecto nulla soluta iste quis, commodi ullam doloremque quibusdam distinctio libero exercitationem reiciendis.</h3>
                    </Magnet>
                </Step>
                <Step>
                    <Magnet padding={50} disabled={false} magnetStrength={50}>
                            <h3 className='description-step'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa unde pariatur quia? Et nam numquam optio consequuntur architecto nulla soluta iste quis, commodi ullam doloremque quibusdam distinctio libero exercitationem reiciendis.</h3>
                    </Magnet>
                </Step>
                <Step>
                    <Magnet padding={50} disabled={false} magnetStrength={50}>
                            <h3 className='description-step'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa unde pariatur quia? Et nam numquam optio consequuntur architecto nulla soluta iste quis, commodi ullam doloremque quibusdam distinctio libero exercitationem reiciendis.</h3>
                    </Magnet>
                </Step>
                
            </Stepper>












           
      
    </div>
  )
}
