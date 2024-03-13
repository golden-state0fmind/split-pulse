import { IonList, IonItem, IonInput, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, IonButton } from "@ionic/react"
import { useState } from "react";

const ManualEntry = () => {
    const [items, setItems] = useState<{ itemName: string; numberOfItems: number; priceOfItem: number | string; total: number }[]>([]);

    const handleNumberOfItemsChange = (e: CustomEvent, index: number) => {
        const newValue = parseInt(e.detail.value || '0', 10);
        updateItemValue(index, { numberOfItems: newValue });
    };

    const handlePriceOfItemChange = (e: CustomEvent, index: number) => {
        let newValue = e.detail.value || '0';
        // Ensure input is treated as a decimal number
        const numericInput = newValue.replace(/[^\d]/g, '');
        // Pad the string to ensure it has at least 3 characters (to properly insert a decimal point)
        const paddedInput = numericInput.padStart(3, '0');
        // Insert the decimal point two places from the end
        const formattedInput = paddedInput.slice(0, -2) + '.' + paddedInput.slice(-2);
        updateItemValue(index, { priceOfItem: formattedInput });
    };

    const updateItemValue = (index: number, updatedValues: Partial<typeof items[number]>) => {
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[index] = { ...updatedItems[index], ...updatedValues };
            return updatedItems;
        });
    };

    const addNewItem = () => {
        setItems(prevItems => [
            ...prevItems,
            { itemName: '', numberOfItems: 0, priceOfItem: 0, total: 0 }
        ]);
    };

    const deleteItem = (index: number) => {
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems.splice(index, 1);
            return updatedItems;
        });
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Enter Items</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Enter Items</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonGrid>
                    <IonRow>
                        <IonList>
                            {items.map((item, index) => (
                                <div key={index}>
                                    <IonItem>
                                        <IonInput
                                            label="Item Name"
                                            placeholder="Enter Item Name"
                                            value={item.itemName}
                                            onIonChange={(e) => updateItemValue(index, { itemName: e.detail.value || '' })}
                                        ></IonInput>
                                    </IonItem>

                                    <IonItem>
                                        <IonInput
                                            label="Number of Item"
                                            inputMode="numeric"
                                            type="number"
                                            placeholder="0"
                                            min={0}
                                            value={item.numberOfItems}
                                            onIonChange={(e) => handleNumberOfItemsChange(e, index)}
                                        ></IonInput>
                                    </IonItem>

                                    <IonItem>
                                        <IonInput
                                            label="Price of Item"
                                            inputMode="decimal" // Changed to "decimal" for more appropriate soft keyboard
                                            type="text" // Changed to text to allow for manual control over formatting
                                            placeholder="0.00"
                                            value={item.priceOfItem}
                                            onIonChange={(e) => handlePriceOfItemChange(e, index)}
                                        ></IonInput>
                                    </IonItem>

                                    <IonItem>
                                        <IonInput
                                            label="Total"
                                            type="number"
                                            placeholder="0"
                                            min={0}
                                            value={Number(item.priceOfItem) * item.numberOfItems}
                                            readonly
                                        ></IonInput>
                                    </IonItem>
                                    <IonButton
                                        color="danger"
                                        shape="round"
                                        size="small"
                                        onClick={() => deleteItem(index)}>
                                        {`Delete ${item.itemName}`}
                                    </IonButton>
                                </div>
                            ))}
                            <IonButton
                                color="tertiary"
                                shape="round"
                                size="small"
                                onClick={addNewItem}>
                                Add New Item
                            </IonButton>
                        </IonList>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default ManualEntry;