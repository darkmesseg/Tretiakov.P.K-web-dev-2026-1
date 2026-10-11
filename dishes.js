// Массив объектов со всеми блюдами меню.
// keyword  — уникальное название блюда на латинице (отправляется на сервер),
// name     — название блюда,
// price    — цена в рублях,
// category — категория на английском ("soup", "main", "drink"),
// count    — вес/объем порции,
// image    — путь к изображению.
const dishes = [
    // Супы
    {
        keyword: "borsch",
        name: "Борщ Украинский с ароматными пампушками",
        price: 240,
        category: "soup",
        count: "350 г",
        image: "images/borsh.jpg"
    },
    {
        keyword: "mushroom",
        name: "Грибной крем-суп с гренками",
        price: 210,
        category: "soup",
        count: "300 г",
        image: "images/sum_grib.jpg"
    },
    {
        keyword: "chicken",
        name: "Домашний куриный суп с лапшой",
        price: 190,
        category: "soup",
        count: "350 г",
        image: "images/sup_kur.jpg"
    },
    // Главные блюда
    {
        keyword: "kiev_cutlet",
        name: "Котлета по-киевски с нежным картофельным пюре",
        price: 320,
        category: "main",
        count: "400 г",
        image: "images/kiev_bulba.jpg"
    },
    {
        keyword: "tyahan",
        name: "Тяхан с сезонными овощами и сочной курицей",
        price: 290,
        category: "main",
        count: "300 г",
        image: "images/tiahan.jpg"
    },
    {
        keyword: "salmon_steak",
        name: "Стейк из горбуши на пару с рисом жасмин",
        price: 390,
        category: "main",
        count: "350 г",
        image: "images/gorbush.jpg"
    },
    // Напитки
    {
        keyword: "currant_mors",
        name: "Домашний морс из спелой черной смородины",
        price: 110,
        category: "drink",
        count: "500 мл",
        image: "images/mors.jpg"
    },
    {
        keyword: "compote",
        name: "Компот из сухофруктов традиционный",
        price: 100,
        category: "drink",
        count: "500 мл",
        image: "images/cumpot.jpg"
    },
    {
        keyword: "green_tea",
        name: "Освежающий зеленый чай с лимоном и мятой",
        price: 90,
        category: "drink",
        count: "400 мл",
        image: "images/tea.jpg"
    }
];
