import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel, IonList } from '@ionic/react';
import { selectUserItems } from '../redux/assignUserSlice';
import { useAppSelector } from '../utilities/hooks';
import "./ItemContainer.css";
interface ItemContainerProps {
    lines: string[];
}

const ItemContainer: React.FC<ItemContainerProps> = ({ lines }) => {
    // Initialize state with type definition
    const filteredItems = lines.filter(line => line.includes('$') && !line.toLowerCase().includes('tip') && !line.toLowerCase().includes('tax') && !line.toLowerCase().includes('total'));
    const filteredOthers = lines.filter(line => line.includes('$') && line.toLowerCase().includes('tip') || line.includes('$') && line.toLowerCase().includes('tax') || line.includes('$') && line.toLowerCase().includes('total'));
    const [items, setItems] = useState<string[]>(filteredItems);
    const users = useAppSelector(selectUserItems);

    useEffect(() => {
        setItems(filteredItems)
    }, [lines])

    return (
        <div className="item-list-contianer">
            <br />
            {/* Items list with increment and decrement buttons */}
            <IonList className='ion-padding-horizontal' style={{ backgroundColor: 'transparent' }}>
                {items.map((line, index) => (
                    <IonItem key={index} className="item-line">
                        <IonLabel>{line}</IonLabel>
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
            {users.map(user => (
                <div key={user.id}>
                    {/* Render selected items for each user if any */}
                    {user.selectedItems.length > 0 && (
                        <>
                            <h2 className='ion-padding-horizontal'>{user.name}</h2>
                            <IonList className='ion-padding-horizontal' style={{ backgroundColor: 'transparent' }}>
                                {user.selectedItems.map((item, index) => (
                                    <IonItem key={index}>
                                        <IonLabel>{item.name}</IonLabel>
                                        <IonLabel>{item.quantity}</IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        </>
                    )}
                </div>
            ))}
            <br />
        </div>
    )
};

export default ItemContainer;