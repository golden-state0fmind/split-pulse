import { IonButton, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import { receipt } from 'ionicons/icons';
import { useState } from 'react';
import { createWorker } from 'tesseract.js';
import { convertPDFToPNG } from '../utilities/ImageConverter';
import LoadingDots from '../components/LoadingDots';
import ItemContainer from '../components/ItemContainer';

const Home = () => {
  const [imageText, setImageText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
        setImageText(`${error}`);
        alert(`${error}`);
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
        setImageText(`${error}`);
        alert(`${error}`);
        throw error;
      }
    };

    if (file?.type === 'application/pdf') {
      handlePDF(file);
    } else if (file?.type === 'image/png') {
      handleImage(file).catch(error => {
        console.error('Error handling image file:', error);
      });
    } else {
      console.error('Invalid file type. Please select a PDF file or an image.');
      setLoading(false);
    }
  };
  // Split OCR text into lines
  const lines = imageText.split('\n');
  // Remove empty lines and trim whitespace
  const cleanLines = lines.filter(line => line.trim() !== '');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Upload Receipt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Upload Receipt</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading && <LoadingDots />}
        <ItemContainer lines={cleanLines} />

        <IonFab className="ion-text-center ion-activatable ripple-parent circle" vertical="bottom" horizontal="center" slot="fixed">
          <label className="imageUploadfLabel" htmlFor="imageInput">
            <IonFabButton color="tertiary">
              <IonIcon icon={receipt}>
              </IonIcon>
              <input id="imageInput" type="file" onChange={handleImageInput} style={{ display: 'none' }} />
            </IonFabButton>
          </label>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default Home;
