import { IonCheckbox, IonItem, IonLabel, IonList } from '@ionic/react';

function ItemContainer({ lines }: { lines: string[] }) {
    // Filter the lines
    const filteredItems = lines.filter(line => line.includes('$') && !line.toLowerCase().includes('tip') && !line.toLowerCase().includes('tax') && !line.toLowerCase().includes('total'));
    const filteredOthers = lines.filter(line => line.includes('$') && line.toLowerCase().includes('tip') || line.includes('$') && line.toLowerCase().includes('tax') || line.includes('$') && line.toLowerCase().includes('total'));

    return (
        <IonList>
            <br />
            {/* Render items with a dollar sign */}
            {filteredItems.map((line, index) => (
                <IonItem key={index}>
                    <IonCheckbox slot="start" />
                    <IonLabel>{line}</IonLabel>
                </IonItem>
            ))}
            <br />
            {/* Render tax, tip and total lines at the bottom */}
            {filteredOthers.map((line, index) => (
                <IonItem key={index}>
                    <IonLabel>{line}</IonLabel>
                </IonItem>
            ))}
            <br />
        </IonList>
    );
}

export default ItemContainer;