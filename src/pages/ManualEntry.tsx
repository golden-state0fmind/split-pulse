import { IonList, IonItem, IonInput, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar, IonButton } from "@ionic/react"
import { useState } from "react";

const ManualEntry = () => {
    const [items, setItems] = useState<{ itemName: string; numberOfItems: number; priceOfItem: number; total: number }[]>([]);

    const handleNumberOfItemsChange = (e: CustomEvent, index: number) => {
        const newValue = parseInt(e.detail.value || '0', 10);
        updateItemValue(index, { numberOfItems: newValue });
    };

    const handlePriceOfItemChange = (e: CustomEvent, index: number) => {
        const newValue = parseFloat(e.detail.value || '0');
        updateItemValue(index, { priceOfItem: newValue });
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
                                            inputMode="numeric"
                                            type="number"
                                            placeholder="0"
                                            min={0}
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
                                            value={item.priceOfItem * item.numberOfItems}
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