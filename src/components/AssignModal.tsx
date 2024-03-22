import { useEffect, useRef, useState } from 'react';
import {
    createAnimation,
    IonButtons,
    IonButton,
    IonModal,
    IonContent,
    IonToolbar,
    IonCheckbox,
    IonItem,
    IonLabel,
    IonList,
    IonInput,
} from '@ionic/react';
import { updateUserSelectedItems } from '../redux/assignUserSlice';
import { useAppDispatch } from '../utilities/hooks';

interface AssignModalProps {
    lines: string[];
}

interface Item {
    name: string;
    quantity: number;
}

type PricePerItemStore = {
    [key: number]: number;
};

const AssignModal: React.FC<AssignModalProps> = ({ lines }) => {
    // Initialize state with type definition
    const filteredItems = lines.filter(line => line.includes('$') && !line.toLowerCase().includes('tip') && !line.toLowerCase().includes('tax') && !line.toLowerCase().includes('total'));
    // const filteredOthers = lines.filter(line => line.includes('$') && line.toLowerCase().includes('tip') || line.includes('$') && line.toLowerCase().includes('tax') || line.includes('$') && line.toLowerCase().includes('total'));
    const [items, setItems] = useState<string[]>(filteredItems);
    const [checkedItems, setCheckedItems] = useState<Item[]>([]);
    // State to cache the original max numbers for each line
    const [maxAllowedNumbers, setMaxAllowedNumbers] = useState<number[]>([]);
    const [userName, setUserName] = useState<string>('');
    const dispatch = useAppDispatch();
    const modal = useRef<HTMLIonModalElement>(null);

    const handleInputChange = (event: CustomEvent) => {
        setUserName(event.detail.value as string);
    };

    function dismiss() {
        modal.current?.dismiss();
    }

    const enterAnimation = (baseEl: HTMLElement) => {
        const root = baseEl.shadowRoot;

        const backdropAnimation = createAnimation()
            .addElement(root?.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(root?.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' },
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: HTMLElement) => {
        return enterAnimation(baseEl).direction('reverse');
    };

    const handleUpdateSelectedItems = (userId: number, selectedItems: { name: string; quantity: number }[], userName: string) => {
        dispatch(updateUserSelectedItems({ userId, selectedItems, userName }));
    };

    const pricePerItemStore: PricePerItemStore = {};

    const handleNumberOfItems = (index: number, offsetIndex: number, delta: number) => {
        // const originalLine = items[index]; // Get the original line
        // const originalNumberMatch = originalLine.match(/\d+/); // Match the original number
        // if (!originalNumberMatch) return; // Return if the original number is not found
        // const originalNumber = parseInt(originalNumberMatch[0], 10); // Parse the original number
        // // Retrieve the original max number from the cache if available, otherwise use the original number
        // const maxAllowedNumber = maxAllowedNumbers[index] ?? originalNumber;
        // // Calculate the updated number (limited between 0 and the maximum allowed value)
        // const updatedNumber = Math.min(Math.max(originalNumber + delta, 0), maxAllowedNumber);
        // // Replace the original number with the updated number in the line
        // const updatedLine = originalLine.replace(/\d+/, updatedNumber.toString());
        // // Update state with the new line

        // const updatedItems = [...items];
        // updatedItems[index] = updatedLine;
        // setItems(updatedItems);
        const originalLine = items[index];
        const originalNumberMatch = originalLine.match(/\d+/);
        const originalPriceMatch = originalLine.match(/\$\d+(\.\d{2})?/);

        if (!originalNumberMatch || !originalPriceMatch) return;

        const originalNumber = parseInt(originalNumberMatch[0], 10);
        let originalPrice = parseFloat(originalPriceMatch[0].substring(1));


        if (!pricePerItemStore.hasOwnProperty(index)) {
            pricePerItemStore[index] = originalPrice / originalNumber;
        }

        const maxAllowedNumber = maxAllowedNumbers[index] ?? originalNumber;
        const updatedNumber = Math.min(Math.max(originalNumber + delta, 0), maxAllowedNumber);

        let finalPrice = originalPrice;
        if (updatedNumber !== maxAllowedNumber) {

            const pricePerItem = pricePerItemStore[index];
            finalPrice = pricePerItem * updatedNumber;
        } else {

            finalPrice = pricePerItemStore[index] * maxAllowedNumber;
        }

        const updatedLine = originalLine
            .replace(/\d+/, updatedNumber.toString())
            .replace(/\$\d+(\.\d{2})?/, `$${finalPrice.toFixed(2)}`);

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
        if (lines.length === 0) {
            setCheckedItems([])
        }
    }, [lines])

    return (
        <>
            <IonButton size="small" color="tertiary" id="open-assign-modal">
                Assign Items
            </IonButton>
            <IonModal
                id="assign-modal"
                ref={modal}
                trigger="open-assign-modal"
                enterAnimation={enterAnimation}
                leaveAnimation={leaveAnimation}
            >
                <IonContent>
                    <IonToolbar>
                        <IonInput
                            value={userName}
                            onIonChange={handleInputChange}
                            label="Assign Items to:"
                            placeholder="Enter Name"
                            className='ion-padding-horizontal'
                        >
                        </IonInput>
                        <IonButtons slot="end">
                            <IonButton
                                onClick={() => dismiss()}>
                                Close
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>

                    {/* Items list with increment and decrement buttons */}
                    <IonList className='ion-padding-horizontal' style={{ paddingBottom: '25px' }}>
                        {items.map((line, index) => (
                            <IonItem key={index} className="item-line">
                                <IonCheckbox
                                    slot="start"
                                    aria-label="label"
                                    onIonChange={(e) => {
                                        const newCheckedItems = [...checkedItems];
                                        const originalLine = items[index]; // Get the original line
                                        const originalNumberMatch = originalLine.match(/\d+/); // Match the original number
                                        if (!originalNumberMatch) return; // Return if the original number is not found
                                        const originalNumber = parseInt(originalNumberMatch[0], 10); // Parse the original number
                                        // Retrieve the original max number from the cache if available, otherwise use the original number
                                        const maxAllowedNumber = maxAllowedNumbers[index] ?? originalNumber;
                                        // Calculate the updated number (limited between 0 and the maximum allowed value)
                                        const updatedNumber = Math.min(Math.max(originalNumber, 0), maxAllowedNumber);
                                        // Replace the original number with the updated number in the line
                                        const updatedLine = originalLine.replace(/\d+/, updatedNumber.toString());
                                        const isItemIncluded = newCheckedItems.some(item => item.name === updatedLine);
                                        if (e.detail.checked) {
                                            if (!isItemIncluded) {
                                                newCheckedItems.push({ name: updatedLine, quantity: updatedNumber });
                                            }
                                        } else {
                                            const itemIndex = newCheckedItems.findIndex(item => item.name === updatedLine);
                                            if (itemIndex !== -1) {
                                                newCheckedItems.splice(itemIndex, 1);
                                            }
                                        }
                                        setCheckedItems(newCheckedItems);
                                    }}
                                />
                                <IonLabel>{line}</IonLabel>
                                <div className="ion-text-end">
                                    <IonButton style={{ paddingRight: '10px' }} onClick={() => handleNumberOfItems(index, -1, 1)}>+</IonButton>
                                    <IonButton onClick={() => handleNumberOfItems(index, -1, -1)}>-</IonButton>
                                </div>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
                <IonButton size="small" color="tertiary" onClick={() => {
                    handleUpdateSelectedItems(1, checkedItems, userName);
                    dismiss();
                }}>
                    Confirm Assigned Items
                </IonButton>
            </IonModal>
        </>
    );
};

export default AssignModal;