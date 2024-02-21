import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ReceiptContainer from '../components/ReceiptContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Split Pulse</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Split Pulse</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ReceiptContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
