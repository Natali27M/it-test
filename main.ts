import {Sales} from './data';
import {inspect} from 'node:util';

// THIS IS ONLY FOR REFERENCE. DO NOT MODIFY
// THIS IS ONLY FOR REFERENCE. DO NOT MODIFY
// THIS IS ONLY FOR REFERENCE. DO NOT MODIFY

const TARGET_FORMAT = {
    //  unique id
    "id": "cc285f2b-567f-5121-89c8-0b0df50c3689",
    // product categories. Avoid duplicates
    "categories": [
      "Chips",
      "Gloves"
    ],
    "name": "Awesome Soft Shirt",
     // from data:
    "authors":[86154,77938,82114],
    // from data:
    "images": [
        'https://picsum.photos/id/727/300/300',
        'https://picsum.photos/id/94/300/300',
        '...'
    ],
    // from data:
    "vendor":{
        "street":"Beatty Falls",
        "city":"2632 Bechtelar Turnpike",
        "country":"Tajikistan"
    },
    // the data is no longer necessary (remove)
    // "data": "86154;77938;82114#https://picsum.photos/id/727/300/300;https://picsum.photos/id/94/300/300;https://picsum.photos/id/642/300/300#Beatty Falls;2632 Bechtelar Turnpike;Tajikistan",
    // convert the prices to an object
    "price":{
        "de": 275,
        "fr": 721,
        "en": 391,
        "default": 624,
    },
    // convert to Date
    "lastPurchase": "2018-06-25T03:40:13.793Z",
    // convert rgb to hex
    "color": "#ff0000"
}

// Convert the sales data (import {Sales} from './data') into the TARGET_FORMAT.
// Filter out and report invalid data.
// Use higher order function when possible.
console.log("TASK 1) CONVERT SALES");


// You can edit this function. This is only a suggestion.
const convertedSales = Sales.map((item)=>{
    const {
        id,
        categories,
        name,
        data,
        price,
        'price.de': de,
        'price.fr': fr,
        'price.en': en,
        lastPurchase,
        color
    } = item;
    const [authors, images, vendorData] = data.split('#');
    const [street, city, country] = vendorData.split(';');

    return {
        id,
        categories,
        name,
        authors: authors.split(';').map(Number),
        images: images.split(';'),
        vendor: {
            street,
            city,
            country,
        },
        price: {
            de,
            fr,
            en,
            default: price,
        },
        lastPurchase: new Date(lastPurchase),
        color: rgbToHex(color),
    };
});

function rgbToHex(rgb: string): string{
    const matches = rgb.match(/\d+/g);

    if (matches) {
        const [r, g, b] = matches.map(Number);
        const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
        return `#${hex}`;
    } else {
        return '#000000';
    }
}

console.log("RESULTS 1)", inspect(convertedSales.slice(0,10),false,null,true));

console.log("TASK 2) LIST INVALID SALES ITEMS");

function isValidDateFormat(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

    return regex.test(dateString);
}

function isValidColorFormat(colorString: string): boolean {
    const regex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;

    return regex.test(colorString);
}

function findInvalidSalesItems(items: any[]) {
    const seenIds = new Set();
    const seenCategories = new Set();
    const invalidItems = [];

    for (const item of items) {
        // Checking uniqueness of id
        if (seenIds.has(item.id)) {
            invalidItems.push({ item, reason: 'Duplicate ID' });
        } else {
            seenIds.add(item.id);
        }

        // Checking uniqueness of categories for each item
        if (item.categories && item.categories.length > 0) {
            for (const category of item.categories) {
                if (seenCategories.has(category)) {
                    invalidItems.push({ item, reason: 'Duplicate Category - ' + category });
                } else {
                    seenCategories.add(category);
                }
            }
        } else {
            invalidItems.push({ item, reason: 'No categories' });
        }

        // Checking if 'name' is not an empty string
        if (typeof item.name !== 'string' || item.name.trim() === '') {
            invalidItems.push({ item, reason: 'Invalid Name' });
        }

        // Checking if 'price' property exists
        if (!item.hasOwnProperty('price')) {
            invalidItems.push({ item, reason: 'No Price' });
        }

        // Checking if 'lastPurchase' is a valid date
        if (!isValidDateFormat(item.lastPurchase)) {
            invalidItems.push({ item, reason: 'Invalid Date Format in lastPurchase' });
        }

        // Checking if 'color' is a valid RGB format
        if (!isValidColorFormat(item.color)) {
            invalidItems.push({ item, reason: 'Invalid Color Format' });
        }
    }

    return invalidItems;
}

const invalidSalesItems = findInvalidSalesItems(Sales);
console.log("RESULTS 2", invalidSalesItems);


console.log("TASK 3) LIST THE 10 LAST PURCHASED ITEMS");
const lastPurchasedItems = Sales
    .map(item => ({
        ...item,
        lastPurchase: typeof item.lastPurchase === 'string' ? new Date(item.lastPurchase) : item.lastPurchase
    }))
    .sort((a, b) => (b.lastPurchase as Date).getTime() - (a.lastPurchase as Date).getTime())
    .slice(0, 10);

console.log("RESULT 3", lastPurchasedItems);


