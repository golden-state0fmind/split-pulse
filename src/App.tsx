import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import TakePhoto from './pages/TakePhoto';
import ManualEntry from './pages/ManualEntry';
import { camera, pencil, receipt } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          {/* <Route exact path="/takephoto">
            <TakePhoto />
          </Route> */}
          <Route exact path="/manualentry">
            <ManualEntry />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/home">
            <IonIcon color="tertiary" aria-hidden="true" icon={receipt} />
            <IonLabel color="tertiary">Upload Receipt</IonLabel>
          </IonTabButton>
          {/* <IonTabButton tab="tab2" href="/takephoto">
            <IonIcon color="tertiary" icon={camera} />
            <IonLabel color="tertiary">Take Photo</IonLabel>
          </IonTabButton> */}
          <IonTabButton tab="tab3" href="/manualentry">
            <IonIcon color="tertiary" icon={pencil} />
            <IonLabel color="tertiary">Manual Entry</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
