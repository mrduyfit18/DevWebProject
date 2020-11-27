const listProducts =
    [
        {
            id: 1,
            name: 'iMac 27 Retina',
            manufacturer: 'Apple',
            cover: 'img/products/apple-imac-27-retina.jpg',
            basePrice: 2099.99,
            type: 'Desktops'
        },
        {
            id: 2,
            name: 'Surface Studio',
            manufacturer: 'Microsoft',
            cover: 'img/products/microsoft-surface-studio.jpg',
            basePrice: 3749.99,
            type: 'Laptops'
        },
        {
            id: 3,
            name: 'Dell Inspiron 23',
            manufacturer: 'Dell',
            cover: 'img/products/dell-inspiron-23.jpg',
            basePrice: 2099.99,
            type: 'Laptops'
        },
        {
            id: 4,
            name: 'iPad Air',
            manufacturer: 'Apple',
            cover: 'img/products/ipad-air.jpg',
            basePrice: 449.99,
            type: 'Tablets'
        },
        {
            id: 5,
            name: 'iPad Mini',
            manufacturer: 'Apple',
            cover: 'img/products/ipad-mini.jpg',
            basePrice: 399.99,
            type: 'Tablets'
        },
        {
            id: 6,
            name: 'Mi Pad 2',
            manufacturer: 'Xiaomi',
            cover: 'img/products/mi-pad-2.jpg',
            basePrice: 2099.99,
            type: 'Tablets'
        },
        {
            id: 7,
            name: 'Surface Pro',
            manufacturer: 'Microsoft',
            cover: 'img/products/surface-pro.jpg',
            basePrice: 2099.99,
            type: 'Laptops'
        },
        {
            id: 8,
            name: 'Lenovo Yoga',
            manufacturer: 'Lenovo',
            cover: 'img/products/lenovo-yoga.jpg',
            basePrice: 2099.99,
            type: 'Tablets'
        },
        {
            id: 9,
            name: 'ASUS Transformer',
            manufacturer: 'ASUS',
            cover: 'img/products/asus-transformer.jpg',
            basePrice: 2099.99,
            type: 'Tablets'
        },
    ]

exports.list = () => {
    return listProducts;
}

exports.getProduct = () => {
    return listProducts[0];
}