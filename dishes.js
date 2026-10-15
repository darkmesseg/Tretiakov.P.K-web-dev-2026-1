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
    { key: "soup", title: "Суп", emptyMessage: "Блюдо не выбрано", formField: "soup" },
    { key: "main", title: "Главное блюдо", emptyMessage: "Блюдо не выбрано", formField: "main_dish" },
    { key: "salad", title: "Салат или стартер", emptyMessage: "Салат не выбран", formField: "salad" },
    { key: "drink", title: "Напиток", emptyMessage: "Напиток не выбран", formField: "drink" },
    { key: "dessert", title: "Десерт", emptyMessage: "Десерт не выбран", formField: "dessert" }
];

// Полный массив блюд (ровно по 6 штук на каждую категорию)
const dishes = [
    // --- СУПЫ ---
    { keyword: "borsch", name: "Борщ Украинский с ароматными пампушками", price: 240, category: "soup", count: "350 г", image: "images/borsh.jpg", kind: "meat" },
    { keyword: "chicken", name: "Домашний куриный суп с лапшой", price: 190, category: "soup", count: "350 г", image: "images/sup_kur.jpg", kind: "meat" },
    { keyword: "mushroom", name: "Грибной крем-суп с гренками", price: 210, category: "soup", count: "300 г", image: "images/sum_grib.jpg", kind: "veg" },
    { keyword: "tomato_soup", name: "Томатный суп Гаспачо", price: 195, category: "soup", count: "300 г", image: "images/gaspacho.jpg", kind: "veg" },
    { keyword: "fish_soup", name: "Уха Норвежская со сливками", price: 270, category: "soup", count: "350 г", image: "images/fish_soup.jpg", kind: "fish" },
    { keyword: "salmon_soup", name: "Сливочный суп с лососем", price: 290, category: "soup", count: "350 г", image: "images/salmon_soup.jpg", kind: "fish" },

    // --- ГЛАВНЫЕ БЛЮДА ---
    { keyword: "kiev_cutlet", name: "Котлета по-киевски с нежным пюре", price: 320, category: "main", count: "400 г", image: "images/kiev_bulba.jpg", kind: "meat" },
    { keyword: "tyahan", name: "Тяхан с сезонными овощами и сочной курицей", price: 290, category: "main", count: "300 г", image: "images/tiahan.jpg", kind: "meat" },
    { keyword: "salmon_steak", name: "Стейк из горбуши на пару с рисом жасмин", price: 390, category: "main", count: "350 г", image: "images/gorbush.jpg", kind: "fish" },
    { keyword: "cod_fillet", name: "Запеченное филе трески с брокколи", price: 340, category: "main", count: "300 г", image: "images/cod.jpg", kind: "fish" },
    { keyword: "potato_balls", name: "Картофельные крокеты с грибным соусом", price: 220, category: "main", count: "250 г", image: "images/croquettes.jpg", kind: "veg" },
    { keyword: "vegetable_lasagna", name: "Овощная лазанья со шпинатом", price: 280, category: "main", count: "300 г", image: "images/lasagna.jpg", kind: "veg" },

    // --- САЛАТЫ И СТАРТЕРЫ ---
    { keyword: "caesar_salad", name: "Салат Цезарь с курицей", price: 250, category: "salad", count: "250 г", image: "images/caesar.jpg", kind: "meat" },
    { keyword: "tuna_salad", name: "Салат с тунцом и стручковой фасолью", price: 270, category: "salad", count: "220 г", image: "images/tuna_salad.jpg", kind: "fish" },
    { keyword: "greek_salad", name: "Классический Греческий салат", price: 210, category: "salad", count: "200 г", image: "images/greek.jpg", kind: "veg" },
    { keyword: "caprese", name: "Капрезе с томатами и моцареллой", price: 230, category: "salad", count: "180 г", image: "images/caprese.jpg", kind: "veg" },
    { keyword: "olivier_veg", name: "Вегетарианское оливье со свежим огурцом", price: 180, category: "salad", count: "200 г", image: "images/olivier.jpg", kind: "veg" },
    { keyword: "baked_veggies", name: "Овощи гриль с бальзамическим кремом", price: 240, category: "salad", count: "220 г", image: "images/grilled_veg.jpg", kind: "veg" },

    // --- НАПИТКИ ---
    { keyword: "currant_mors", name: "Домашний морс из спелой черной смородины", price: 110, category: "drink", count: "500 мл", image: "images/mors.jpg", kind: "cold" },
    { keyword: "compote", name: "Компот из сухофруктов традиционный", price: 100, category: "drink", count: "500 мл", image: "images/cumpot.jpg", kind: "cold" },
    { keyword: "apple_juice", name: "Свежевыжатый яблочный сок", price: 140, category: "drink", count: "300 мл", image: "images/apple_juice.jpg", kind: "cold" },
    { keyword: "green_tea", name: "Освежающий зеленый чай с лимоном и мятой", price: 90, category: "drink", count: "400 мл", image: "images/tea.jpg", kind: "hot" },
    { keyword: "black_coffee", name: "Американо из свежеобжаренных зерен", price: 120, category: "drink", count: "200 мл", image: "images/coffee.jpg", kind: "hot" },
    { keyword: "cappuccino", name: "Нежный капучино с плотной пенкой", price: 150, category: "drink", count: "300 мл", image: "images/cappuccino.jpg", kind: "hot" },

    // --- ДЕСЕРТЫ ---
    { keyword: "macarons", name: "Набор макаронс (3 шт)", price: 150, category: "dessert", count: "45 г", image: "images/macarons.jpg", kind: "small" },
    { keyword: "panna_cotta", name: "Ванильная панна-котта с малиной", price: 180, category: "dessert", count: "90 г", image: "images/panna_cotta.jpg", kind: "small" },
    { keyword: "truffle", name: "Шоколадный трюфель ручной работы", price: 90, category: "dessert", count: "30 г", image: "images/truffle.jpg", kind: "small" },
    { keyword: "cheesecake", name: "Классический Нью-Йорк Нью-Йорк", price: 240, category: "dessert", count: "150 г", image: "images/cheesecake.jpg", kind: "medium" },
    { keyword: "apple_tart", name: "Яблочный тарт со слоеным тестом", price: 210, category: "dessert", count: "130 г", image: "images/apple_tart.jpg", kind: "medium" },
    { keyword: "waffles_large", name: "Бельгийские вафли с ягодами и мороженым", price: 310, category: "dessert", count: "280 г", image: "images/waffles.jpg", kind: "large" }
];