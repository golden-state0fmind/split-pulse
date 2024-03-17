
function buildReceiptList(inputData: { generated_text: string }[]): string {
    // Placeholder for extracted items string
    let itemsString: string = '';

    // Accessing the generated_text property from the first element of inputData
    const parts: string[] = inputData[0].generated_text.split('<sep/>');

    parts.forEach((part: string) => {
        if (part.includes('<s_item_name>')) {
            const item_name: string = part.split('<s_item_name>')[1].split('</s_item_name>')[0];
            const item_value: string = part.split('<s_item_value>')[1].split('</s_item_value>')[0];
            const item_quantity: string = part.split('<s_item_quantity>')[1].split('</s_item_quantity>')[0];

            // Construct string representation of the item
            const itemString: string = `${item_quantity} ${item_name} - $${item_value}\n`;

            // Append the item string to the items string
            itemsString += itemString;
        }
    });
    return itemsString;
}

export { buildReceiptList }
