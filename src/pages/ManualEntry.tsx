import { IonList, IonItem, IonInput, IonContent, IonGrid, IonHeader, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react"
import { useState } from "react";

const ManualEntry = () => {
    const [numberOfItems, setNumberOfItems] = useState<number | string>(0);
    const [priceOfItem, setPriceOfItem] = useState<number | string>(0);
    const [total, setTotal] = useState<number | string>(0);

    const handleNumberOfItemsChange = (e: CustomEvent) => {
        const newValue = e.detail.value || '0';
        setNumberOfItems(newValue);
        calculateTotal(parseFloat(newValue), parseFloat(priceOfItem as string));
    };

    const handlePriceOfItemChange = (e: CustomEvent) => {
        const newValue = e.detail.value || '0';
        setPriceOfItem(newValue);
        calculateTotal(parseFloat(numberOfItems as string), parseFloat(newValue));
    };

    const calculateTotal = (numberOfItems: number, priceOfItem: number) => {
        const newTotal = numberOfItems * priceOfItem;
        console.log(newTotal)
        setTotal(newTotal);
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
                            <IonItem>
                                <IonInput label="Item Name" placeholder="Enter Item Name"></IonInput>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    label="Number of Item"
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    onIonChange={handleNumberOfItemsChange}
                                ></IonInput>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    label="Price of Item"
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    onIonChange={handlePriceOfItemChange}
                                ></IonInput>
                            </IonItem>

                            <IonItem>
                                <IonInput
                                    label="Total"
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    value={total}
                                    readonly
                                ></IonInput>
                            </IonItem>

                        </IonList>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default ManualEntry;