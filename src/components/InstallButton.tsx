import { IonButton } from '@ionic/react';
import React, { useState, useEffect } from 'react';

const InstallButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: Event) => {
            // Prevent the browser's default install prompt
            event.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(event);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            // Prompt the user to install the PWA
            (deferredPrompt as any).prompt();
            // Wait for the user to respond to the prompt
            (deferredPrompt as any).userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                // Reset the deferredPrompt variable
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <div className='ion-padding-horizontal'>
            <IonButton
                id="installButton"
                onClick={handleInstallClick}
                style={{
                    display: deferredPrompt ? 'block' : 'none',
                    maxWidth: '100px'
                }}
                className="ion-text-center ion-activatable ripple-parent circle "
                color="tertiary"
                shape="round"
                size="small"
            >
                Install App
            </IonButton>
        </div>
    );
}

export default InstallButton;
