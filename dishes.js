// Массив объектов со всеми блюдами меню.
// keyword  — уникальное название блюда на латинице (отправляется на сервер),
// name     — название блюда,
// price    — цена в рублях,
// category — категория на английском ("soup", "main", "count", "drink", "dessert"),
// count    — вес/объем порции,
// image    — путь к изображению.
// kind     — тип блюда

// Расширенный список категорий
const categories = [
    { key: "soup",            title: "Суп",               emptyMessage: "Блюдо не выбрано"},
    { key: "main_course",     title: "Главное блюдо",     emptyMessage: "Блюдо не выбрано"},
    { key: "salads_starters", title: "Салат или стартер", emptyMessage: "Салат не выбран"},
    { key: "beverage",        title: "Напиток",           emptyMessage: "Напиток не выбран"},
    { key: "dessert",         title: "Десерт",            emptyMessage: "Десерт не выбран"}
];