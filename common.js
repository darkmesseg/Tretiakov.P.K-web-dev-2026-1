// ====== КОНФИГУРАЦИЯ API ======
const API_KEY = "bea5c579-8070-4787-af76-414b3182e6a7";
const API_BASE = "https://api.rozetkaimg.me/labs/api";
const API_DISHES = API_BASE + "/dishes";
const API_ORDERS = API_BASE + "/orders";

// Ключ localStorage
const STORAGE_KEY = "selectedDishes";

// Доступные комбо (dessert — опционально к любому)
const LUNCH_COMBOS = [
    ["soup", "main_course", "salads_starters", "beverage"],
    ["soup", "main_course", "beverage"],
    ["soup", "salads_starters", "beverage"],
    ["main_course", "salads_starters", "beverage"],
    ["main_course", "beverage"]
];

// Маппинг: категория -> поле в POST /orders
const CATEGORY_TO_ORDER_FIELD = {
    soup: "soup_id",
    main_course: "main_course_id",
    salads_starters: "salad_id",
    beverage: "drink_id",
    dessert: "dessert_id"
};

// ====== localStorage ======
function getSelectedIds() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
}

function setSelectedIds(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function clearSelectedIds() {
    localStorage.removeItem(STORAGE_KEY);
}

// {category: dish} из массива всех блюд и массива id
function buildSelectionMap(dishes, ids) {
    const idSet = new Set(ids);
    const map = {};
    dishes.forEach(d => {
        if (idSet.has(d.id)) map[d.category] = d;
    });
    return map;
}

// ====== Проверка комбо ======
function isLunchValid(selectionMap) {
    const selectedKeys = ["soup", "main_course", "salads_starters", "beverage"]
        .filter(k => selectionMap[k]);

    return LUNCH_COMBOS.some(combo => {
        if (combo.length !== selectedKeys.length) return false;
        return combo.every(k => !!selectionMap[k]);
    });
}

// ====== Загрузка блюд ======
async function loadDishesApi() {
    const res = await fetch(API_DISHES);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
}