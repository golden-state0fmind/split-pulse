import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ReceiptContainer from '../components/ReceiptContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Upload Receipt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Upload Receipt</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ReceiptContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
