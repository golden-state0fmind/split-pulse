import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet } from '@ionic/react';
import { camera, trash, close, receipt } from 'ionicons/icons';
import { usePhotoGallery, UserPhoto } from '../utilities/usePhotoGallery';
import { createWorker } from 'tesseract.js';
import LoadingDots from '../components/LoadingDots';
import ItemContainer from '../components/ItemContainer';

const TakePhoto = () => {
    const { photos, takePhoto, deletePhoto } = usePhotoGallery();
    const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();
    const [imageText, setImageText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Split OCR text into lines
    const lines = imageText.split('\n');
    // Remove empty lines and trim whitespace
    const cleanLines = lines.filter(line => line.trim() !== '');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Take Photo</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Take Photo</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonGrid>
                    <IonRow>
                        {photos.map((photo, index: React.Key | null | undefined) => (
                            <IonCol size="6" key={index}>
                                <IonImg
                                    onClick={() => setPhotoToDelete(photo)}
                                    src={photo.webviewPath}
                                    style={{ width: '200px', height: '200px' }}
                                />
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>

                {loading && <LoadingDots />}
                <ItemContainer lines={cleanLines} />

                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton color="tertiary" onClick={() => takePhoto()}>
                        <IonIcon icon={camera}></IonIcon>
                    </IonFabButton>
                </IonFab>

                <IonActionSheet
                    isOpen={!!photoToDelete}
                    buttons={[
                        {
                            text: 'Read Receipt',
                            role: 'read',
                            icon: receipt,
                            handler: async () => {
                                setLoading(true);
                                try {
                                    const worker = await createWorker('eng', 1, {
                                        logger: (m) => console.log(m),
                                    });
                                    const ret = await worker.recognize(photoToDelete!.webviewPath!);
                                    setLoading(false);
                                    setImageText(ret.data.text);
                                    await worker.terminate();
                                } catch (error) {
                                    console.error('Error recognizing text from image:', error);
                                    setLoading(false);
                                    setImageText(`${error}`);
                                    alert(`${error}`);
                                    throw error;
                                }
                            }
                        },
                        {
                            text: 'Delete',
                            role: 'destructive',
                            icon: trash,
                            handler: () => {
                                if (photoToDelete) {
                                    deletePhoto(photoToDelete);
                                    setPhotoToDelete(undefined);
                                }
                            }
                        },
                        {
                            text: 'Cancel',
                            icon: close,
                            role: 'cancel'
                        }
                    ]}
                    onDidDismiss={() => setPhotoToDelete(undefined)}
                />
            </IonContent>
        </IonPage>
    );
};

export default TakePhoto;