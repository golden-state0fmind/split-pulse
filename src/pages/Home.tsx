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
import { buildReceiptList } from '../utilities/ReceiptBuilder';
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const HF_ENDPOINT = import.meta.env.VITE_HF_ENDPOINT;

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
      console.log(`Selected Image: ${file.name}`); // Logs the selected image name
      setLoading(true); // Assuming you have a setLoading function to handle UI loading state

      const worker = await createWorker('eng', 1, {
        logger: (m) => console.log(m),
      });

      try {
        const { data: { text } } = await worker.recognize(file);
        // Here, we need to define the condition to check for non-English words.
        // This is a placeholder condition.
        const containsNonEnglish = text.match(/[^\x00-\x7F]+/); // Simple regex to find non-ASCII characters
        const containsDollarSign = text.includes('$');

        if (!containsDollarSign) {
          console.log('Running HF query...');
          try {
            const response = await hf_AI(file);
            console.log(response, '<<-------');
            const hf_list = buildReceiptList(response);
            setImageText(hf_list);
            setLoading(false); // Reset loading state
          } catch (error) {
            // Handle the error gracefully
            console.error('Error running HF query:', error);
            setLoading(false);
            setIsError(true);
            // Handle error state or provide user feedback
            setErrorMessage(`Error recognizing text from image: ${error}.`);
          }
        }
        if (containsDollarSign && !containsNonEnglish) {
          console.log('Running Tesseract...')
          setImageText(text);
          setLoading(false); // Reset loading state
        }
      } catch (error) {
        console.error('Error recognizing text from image:', error);
        setIsError(true); // Assuming you have an setIsError function to handle error states
        setErrorMessage(`Error recognizing text from image: ${file?.name}.`);
      } finally {
        await worker.terminate(); // Ensure the worker is terminated after processing
      }
    };

    async function hf_AI(file: any) {
      const response = await fetch(
        HF_ENDPOINT,
        {
          headers: { Authorization: `Bearer ${HF_API_KEY}` },
          method: "POST",
          body: file,
        }
      );
      const result = await response.json();
      return JSON.parse(JSON.stringify(result));
    }


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

  console.log(imageText, 'image text')
  console.log(cleanLines, 'image text after trimming the empty spaces')

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonRow class="ion-justify-content-between">
            <IonTitle>
              <IonRow>
                <IonCol>{imageText ? "" : "Upload Receipt"}</IonCol>
                {imageText && (
                  <IonCol>
                    <IonButton size="small" color="tertiary" onClick={() => setImageText('')}>Clear Receipt</IonButton>
                  </IonCol>
                )}
              </IonRow>
            </IonTitle>
            <InstallButton />
          </IonRow>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              <IonRow>
                <IonCol>{imageText ? "" : "Upload Receipt"}</IonCol>
                {imageText && (
                  <IonCol>
                    <IonButton size="small" color="tertiary" onClick={() => setImageText('')}>Clear Receipt</IonButton>
                  </IonCol>
                )}
              </IonRow>
            </IonTitle>
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
        onDidDismiss={() => {
          setIsError(false)
          setImageText('')
        }}
      ></IonAlert>
    </IonPage>
  );
};

export default Home;
