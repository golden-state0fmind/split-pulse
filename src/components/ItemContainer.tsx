import React, { useEffect, useState } from 'react';
import { IonButton, IonCheckbox, IonContent, IonItem, IonLabel, IonList } from '@ionic/react';
import "./ItemContainer.css";

interface ItemContainerProps {
    lines: string[];
}

const ItemContainer: React.FC<ItemContainerProps> = ({ lines }) => {
    // Initialize state with type definition
    const filteredItems = lines.filter(line => line.includes('$') && !line.toLowerCase().includes('tip') && !line.toLowerCase().includes('tax') && !line.toLowerCase().includes('total'));
    const filteredOthers = lines.filter(line => line.includes('$') && line.toLowerCase().includes('tip') || line.includes('$') && line.toLowerCase().includes('tax') || line.includes('$') && line.toLowerCase().includes('total'));
    const [items, setItems] = useState<string[]>(filteredItems);
    // State to cache the original max numbers for each line
    const [maxAllowedNumbers, setMaxAllowedNumbers] = useState<number[]>([]);

    const handleNumberOfItems = (index: number, offsetIndex: number, delta: number) => {
        const originalLine = items[index]; // Get the original line
        const originalNumberMatch = originalLine.match(/\d+/); // Match the original number
        if (!originalNumberMatch) return; // Return if the original number is not found

        const originalNumber = parseInt(originalNumberMatch[0], 10); // Parse the original number

        // Retrieve the original max number from the cache if available, otherwise use the original number
        const maxAllowedNumber = maxAllowedNumbers[index] ?? originalNumber;

        // Calculate the updated number (limited between 0 and the maximum allowed value)
        const updatedNumber = Math.min(Math.max(originalNumber + delta, 0), maxAllowedNumber);

        // Replace the original number with the updated number in the line
        const updatedLine = originalLine.replace(/\d+/, updatedNumber.toString());

        // Update state with the new line
        const updatedItems = [...items];
        updatedItems[index] = updatedLine;
        setItems(updatedItems);
    };

    useEffect(() => {
        setItems(filteredItems)
        // Extract and set the original max numbers
        const originalMaxNumbers = filteredItems.map((line) => {
            const originalNumberMatch = line.match(/\d+/);
            return originalNumberMatch ? parseInt(originalNumberMatch[0], 10) : 0;
        });
        setMaxAllowedNumbers(originalMaxNumbers);
    }, [lines])

    return (
        <div className="item-list-contianer">
            <br />
            {/* Items list with increment and decrement buttons */}
            <IonList className='ion-padding-horizontal' style={{ backgroundColor: 'transparent' }}>
                {items.map((line, index) => (
                    <IonItem key={index} className="item-line" >
                        <IonCheckbox aria-label="label" slot="start" />
                        <IonLabel>
                            {line}
                            <IonButton onClick={() => handleNumberOfItems(index, -1, 1)}>+</IonButton>
                            <IonButton onClick={() => handleNumberOfItems(index, -1, -1)}>-</IonButton>
                        </IonLabel>
                    </IonItem>
                ))}
            </IonList>
            <br />
            <IonList className='ion-padding-horizontal' style={{ backgroundColor: 'transparent' }}>
                {/* Render tax, tip, and total lines */}
                {filteredOthers.map((line, index) => (
                    <IonItem key={index}>
                        <IonLabel>{line}</IonLabel>
                    </IonItem>
                ))}
            </IonList>
            <br />
        </div>
    );
};

export default ItemContainer;