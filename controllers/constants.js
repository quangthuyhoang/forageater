// USDA API constants

// database sources (ds)
const bl = "Branded Food Products";
const sr = "Standard Release"

// Food Groups
const poultry = "0500";

https://api.nal.usda.gov/ndb/list?format=json&lt=g&sr=0&sort=n&api_key=DEMO_KEY
const fg = [
    {
        "offset": 0,
        "id": "3500",
        "name": "American Indian/Alaska Native Foods"
    },
    {
        "offset": 1,
        "id": "0300",
        "name": "Baby Foods"
    },
    {
        "offset": 2,
        "id": "1800",
        "name": "Baked Products"
    },
    {
        "offset": 3,
        "id": "1300",
        "name": "Beef Products"
    },
    {
        "offset": 4,
        "id": "1400",
        "name": "Beverages"
    },
    {
        "offset": 5,
        "id": "0800",
        "name": "Breakfast Cereals"
    },
    {
        "offset": 6,
        "id": "2000",
        "name": "Cereal Grains and Pasta"
    },
    {
        "offset": 7,
        "id": "0100",
        "name": "Dairy and Egg Products"
    },
    {
        "offset": 8,
        "id": "2100",
        "name": "Fast Foods"
    },
    {
        "offset": 9,
        "id": "0400",
        "name": "Fats and Oils"
    },
    {
        "offset": 10,
        "id": "1500",
        "name": "Finfish and Shellfish Products"
    },
    {
        "offset": 11,
        "id": "0900",
        "name": "Fruits and Fruit Juices"
    },
    {
        "offset": 12,
        "id": "1700",
        "name": "Lamb, Veal, and Game Products"
    },
    {
        "offset": 13,
        "id": "1600",
        "name": "Legumes and Legume Products"
    },
    {
        "offset": 14,
        "id": "2200",
        "name": "Meals, Entrees, and Side Dishes"
    },
    {
        "offset": 15,
        "id": "1200",
        "name": "Nut and Seed Products"
    },
    {
        "offset": 16,
        "id": "1000",
        "name": "Pork Products"
    },
    {
        "offset": 17,
        "id": "0500",
        "name": "Poultry Products"
    },
    {
        "offset": 18,
        "id": "3600",
        "name": "Restaurant Foods"
    },
    {
        "offset": 19,
        "id": "0700",
        "name": "Sausages and Luncheon Meats"
    },
    {
        "offset": 20,
        "id": "2500",
        "name": "Snacks"
    },
    {
        "offset": 21,
        "id": "0600",
        "name": "Soups, Sauces, and Gravies"
    },
    {
        "offset": 22,
        "id": "0200",
        "name": "Spices and Herbs"
    },
    {
        "offset": 23,
        "id": "1900",
        "name": "Sweets"
    },
    {
        "offset": 24,
        "id": "1100",
        "name": "Vegetables and Vegetable Products"
    }
]