import { useRef } from 'react';
import {
    createAnimation,
    IonButtons,
    IonButton,
    IonModal,
    IonContent,
    IonToolbar,
    IonTitle,
    IonImg,
} from '@ionic/react';

const InstructionsModal = () => {
    const modal = useRef<HTMLIonModalElement>(null);

    function dismiss() {
        modal.current?.dismiss();
    }

    const enterAnimation = (baseEl: HTMLElement) => {
        const root = baseEl.shadowRoot;

        const backdropAnimation = createAnimation()
            .addElement(root?.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(root?.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' },
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: HTMLElement) => {
        return enterAnimation(baseEl).direction('reverse');
    };

    return (
        <div className="ion-padding">
            <IonButton color="tertiary" id="open-modal" expand="block">
                Instructions
            </IonButton>
            <IonModal
                id="instructions-modal"
                ref={modal}
                trigger="open-modal"
                enterAnimation={enterAnimation}
                leaveAnimation={leaveAnimation}
            >
                <IonContent>
                    <IonToolbar>
                        <IonTitle>Instructions</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => dismiss()}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                    <div className='ion-padding-horizontal'>
                        <h2>Important: Image Upload Guidelines</h2>
                        <p>To ensure the highest accuracy in processing your image, please adhere to the following guidelines:</p>

                        <h3>Accepted Formats:</h3>
                        <p>Only upload images in <strong>PNG, JPG, or PDF</strong> format.</p>

                        <h3>Content Requirements:</h3>
                        <ul>
                            <li>
                                <strong>Items Only:</strong> Your image should strictly contain the items, with no unrelated background or extraneous elements.
                            </li>
                            <li>
                                <strong>Visibility of $ Sign:</strong> Each item line must visibly include a <strong>$</strong> sign to indicate pricing.
                            </li>
                        </ul>

                        <h3>Example for Clarity:</h3>
                        <p>Ensure your image closely matches this image
                            <IonImg
                                src={`/assets/images/example_image.png`}
                                style={{ width: '200px', height: '200px' }}
                            />
                            for optimal results.</p>

                        <p><strong>Note:</strong> Adherence to these guidelines directly impacts the accuracy and effectiveness of the results.</p>

                    </div>
                </IonContent>
            </IonModal>
        </div>
    );
};

export default InstructionsModal;