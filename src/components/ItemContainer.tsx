import React, { useEffect, useState } from 'react';
import { IonButton, IonCheckbox, IonItem, IonLabel, IonList } from '@ionic/react';

interface ItemContainerProps {
    lines: string[];
}

const ItemContainer: React.FC<ItemContainerProps> = ({ lines }) => {
    // Initialize state with type definition
    const filteredItems = lines.filter(line => line.includes('$') && !line.toLowerCase().includes('tip') && !line.toLowerCase().includes('tax') && !line.toLowerCase().includes('total'));
    const filteredOthers = lines.filter(line => line.includes('$') && line.toLowerCase().includes('tip') || line.includes('$') && line.toLowerCase().includes('tax') || line.includes('$') && line.toLowerCase().includes('total'))

    const [items, setItems] = useState<string[]>(filteredItems)

    // Function to process and increment/decrement numbers in a line
    const incrementNumber = (index: number, offsetIndex: number, delta: number) => {
        const updatedLine = items[index].replace(/(\d+)/, (match, number) => {
            const num = parseInt(number, 10);
            if (!isNaN(num)) {
                return String(num + delta);
            }
            return match;
        });

        // Update state with the new line
        const updatedItems = [...items];
        updatedItems[index] = updatedLine;
        setItems(updatedItems);
    };

    useEffect(() => {
        setItems(filteredItems)
    }, [lines])

    return (
        <>
            <br />
            <IonList style={{ backgroundColor: 'transparent' }}>
                {/* Render items with logic for increment/decrement buttons */}
                {items.map((line, index) => (
                    <IonItem key={index}>
                        <IonCheckbox slot="start" />
                        <IonLabel>
                            {line}
                            {/* Example buttons for incrementing/decrementing */}
                            <IonButton onClick={() => incrementNumber(index, -1, 1)}>+</IonButton>
                            <IonButton onClick={() => incrementNumber(index, -1, -1)}>-</IonButton>
                        </IonLabel>
                    </IonItem>
                ))}
            </IonList>
            <br />
            {/* Render tax, tip, and total lines */}
            {filteredOthers.map((line, index) => (
                <IonItem key={index}>
                    <IonLabel>{line}</IonLabel>
                </IonItem>
            ))}
            <br />
        </>
    );
};

export default ItemContainer;