import { IonAlert, IonButton, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import { receipt } from 'ionicons/icons';
import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { convertPDFToPNG } from '../utilities/ImageConverter';
import LoadingDots from '../components/LoadingDots';
import ItemContainer from '../components/ItemContainer';
import InstructionsModal from '../components/InstructionsModal';
import InstallButton from '../components/InstallButton';

const Home = () => {
  const [imageText, setImageText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleImageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = event.target.files?.[0];

    const handlePDF = async (file: File) => {
      try {
        const outputFileUrl = await convertPDFToPNG(file);
        const worker = await createWorker('eng', 1, {
          logger: (m) => console.log(m),
        });
        const ret = await worker.recognize(outputFileUrl);
        setLoading(false);
        setImageText(ret.data.text);
        await worker.terminate();
      }
      catch (error) {
        console.error('Error recognizing text from image:', error);
        setLoading(false);
        setIsError(true);
        setErrorMessage(`Error recognizing text from image: ${file?.name}.`)
        throw error;
      }
    };

    const handleImage = async (file: File) => {
      console.log(`Selected Image: ${file.name}`); // Sets the image name before rendering text from image
      try {
        const worker = await createWorker('eng', 1, {
          logger: (m) => console.log(m),
        });
        const ret = await worker.recognize(file);
        setLoading(false);
        setImageText(ret.data.text);
        await worker.terminate();
      } catch (error) {
        console.error('Error recognizing text from image:', error);
        setLoading(false);
        setIsError(true);
        setErrorMessage(`Error recognizing text from image: ${file?.name}.`)
        throw error;
      }
    };

    if (file?.type === 'application/pdf') {
      handlePDF(file);
    } else if (file?.type) {
      handleImage(file)
        .catch(error => {
          setIsError(true);
          console.error('Error handling image file:', error);
          setErrorMessage(`Error handling image file: ${file?.name}.`)
        });
    } else {
      setIsError(true);
      console.error(`Invalid: file type ${file?.type} not supported yet.`);
      setErrorMessage(`Invalid: file type ${file?.type} not supported yet.`)
      setLoading(false);
    }
  };
  // Split OCR text into lines
  const lines = imageText.split('\n');
  // Remove empty lines and trim whitespace
  const cleanLines = lines.filter(line => line.trim() !== '');

  console.log(imageText, 'image text from tesseract')
  console.log(cleanLines, 'image text after trimming the empty spaces')

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"><IonRow>
              <IonCol>{imageText ? "" : "Upload Receipt"}</IonCol>
              {imageText && (
                <IonCol>
                  <IonButton size="small" color="tertiary" onClick={() => setImageText('')}>Clear Receipt</IonButton>
                </IonCol>
              )}
            </IonRow></IonTitle>
          </IonToolbar>
        </IonHeader>
        {imageText === '' && !isError && (
          <InstructionsModal />
        )}

        {loading && <LoadingDots />}
        <ItemContainer lines={cleanLines} />

        {imageText === '' && !isError && (
          <IonFab className="ion-text-center ion-activatable ripple-parent circle" vertical="bottom" horizontal="center" slot="fixed">
            <IonFabButton color="tertiary">
              <label className="imageUploadfLabel" htmlFor="imageInput">
                <IonIcon icon={receipt} size="large">
                  <input id="imageInput" type="file" onChange={handleImageInput} style={{ display: 'none' }} />
                </IonIcon>
              </label>
            </IonFabButton>
          </IonFab>
        )}

      </IonContent>
      <IonAlert
        isOpen={isError}
        header="ERROR"
        message={errorMessage}
        buttons={['OK']}
        onDidDismiss={() => setIsError(false)}
      ></IonAlert>
    </IonPage>
  );
};

export default Home;
