const querystring = require('querystring');
const mongoose = require('mongoose');
const buildUrl = require('build-url');

const productsModel = require('../models/productsModel');
const manufacturerModel = require('../models/manufacturerModel');



/* Paginate buttons to render*/
const pagingButtons = [
    {
        value: 0,
        active: false
    },
    {
        value: 0,
        active: false
    },
    {
        value: 0,
        active: false
    },
    {
        value: 0,
        active: false
    },
    {
        value: 0,
        active: false

    },
    {
        value: 0,
        active: false
    },
    {
        value: 0,
        active: false
    }
]

function createPagination(pagination, req){
    let i  = 0;
    //Reset last selected button
    for (i = 0; i < 7; i++) {
        pagingButtons[i].active = false;
    }
    if(pagination.page < 4) {
        pagingButtons[0].value = 1;
        pagingButtons[1].value = 2;
        pagingButtons[2].value = 3;
        pagingButtons[3].value = 4;
        pagingButtons[4].value = 5;
        if(pagination.totalPages > 5) {
            pagingButtons[5].value = pagination.totalPages;
        }
        else {
            pagingButtons[5].value = 0;
        }
        pagingButtons[6].value = 0;
        pagingButtons[pagination.page - 1].active = true;
    }
    else if (pagination.page >= pagination.totalPages - 2 && pagination.totalPages >= 6){
        pagingButtons[0].value = 1;
        pagingButtons[1].value = pagination.totalPages - 4;
        pagingButtons[2].value = pagination.totalPages - 3;
        pagingButtons[3].value = pagination.totalPages - 2;
        pagingButtons[4].value = pagination.totalPages -1;
        pagingButtons[5].value = pagination.totalPages;
        pagingButtons[6].value = 0;
        pagingButtons[5 - (pagination.totalPages - pagination.page)].active = true;
    }
    else {
        pagingButtons[0].value = 1;
        pagingButtons[1].value = pagination.secondPrevPage;
        pagingButtons[2].value = pagination.prevPage;
        pagingButtons[3].value = pagination.page;
        pagingButtons[4].value = pagination.nextPage;
        pagingButtons[5].value = pagination.secondNextPage;
        if(pagination.totalPages >=6) {
            pagingButtons[6].value = pagination.totalPages;
        }
        else{
            pagingButtons[6].value = 0;
        }
        pagingButtons[3].active = true;
    }

}


exports.index = async (req, res, next) => {
    // Get products from model
    const textSearch =  req.query.name || '';
    const type = req.query.type || '';
    let Desktopscheck, Allcheck, Laptopscheck;

    switch(type){
        case "":
            Allcheck = 1;
            break;
        case 'Desktops':
            Desktopscheck = 1;
            break;
        case 'Laptops':
            Laptopscheck = 1;
            break;
        default:
            Allcheck = 1;
            break;
    }
    const pagination = await productsModel.list( {'name': { "$regex": textSearch, "$options": "i" }, 'type': { "$regex": type, "$options": "i" } },
        req.query.page);
    const products = pagination.docs;
    //Create Paging Information
    createPagination(pagination, req);
    const totalPage = pagination.totalPages;
    const Manufacturers = await manufacturerModel.list();
    // Pass data to view to display list of products
    res.render('store/products', { products, pagingButtons , pagination,
        totalPage ,onStore: 'active', Allcheck, Desktopscheck, Laptopscheck, Manufacturers});
};

exports.Show = async (req, res, next) => {
    // Get product from model
    //await console.log(req.params._id);
    const product = await productsModel.getProduct(await req.params._id);
    const relatedProducts = await productsModel.getProductByTypeAndNumber(product.type, 4);
    const imageCount = product.productImages.length + 1;
    res.render('store/productDetail', {product, Products: relatedProducts, imageCount});
};

exports.listAPI = async (req, res, next) => {
    // Get products from model
    // Get products from model
    const textSearch =  req.query.name || '';
    const type = req.query.type || '';
    const minPrice = Number(req.query.minPrice) * 1000000;
    const maxPrice = Number(req.query.maxPrice) * 1000000;
    let display = [];
    if(!req.query.display){
        display.push('');
    }
    else if(typeof req.query.display === 'string'){
        display.push(req.query.display);
    }
    else{
        display=req.query.display;
    }

    for(let i=0; i<display.length; i++) {
        display[i] = new RegExp(display[i], "i");
    }

    let processor= [];
    if(!req.query.processor){
        processor.push('');
    }
    else if(typeof req.query.processor === 'string'){
        processor.push(req.query.processor);
    }
    else{
        processor=req.query.processor;
    }

    for(let i=0; i<processor.length; i++) {
        processor[i] = new RegExp(processor[i], "i");
    }

    let memory = [];
    if(!req.query.memory){
        memory.push('');
    }
    else if(typeof req.query.memory === 'string'){
        memory.push(req.query.memory);
    }
    else{
        memory=req.query.memory;
    }

    for(let i=0; i<memory.length; i++) {
        memory[i] = new RegExp(memory[i], "i");
    }

    let manufacturer_id= [];
    if(!req.query.manufacturer_id){
        const manufacturers = await manufacturerModel.list();
        for(let manufacturer of manufacturers){
            manufacturer_id.push(manufacturer._id);
        }
    }
    else if(typeof req.query.manufacturer_id === 'string'){
        manufacturer_id.push(req.query.manufacturer_id);
    }
    else{
        manufacturer_id=req.query.manufacturer_id;
    }

    for(let i=0; i<manufacturer_id.length; i++) {
        manufacturer_id[i] = mongoose.Types.ObjectId(manufacturer_id[i]);
    }

    let Desktopscheck, Allcheck, Laptopscheck;

    switch(type){
        case "":
            Allcheck = 1;
            break;
        case 'Desktops':
            Desktopscheck = 1;
            break;
        case 'Laptops':
            Laptopscheck = 1;
            break;
        default:
            Allcheck = 1;
            break;
    }
    const pagination = await productsModel.list( {'name': { "$regex": textSearch, "$options": "i" },
            'type': { "$regex": type, "$options": "i" }, 'display': {"$in": display },
            'processor': {"$in": processor }, 'memory': {"$in": memory }, 'manufacturer_id': {"$in": manufacturer_id },
            $and: [{ 'basePrice': { $gte: minPrice } }, { 'basePrice': { $lte: maxPrice } }]  },
        req.query.page);
    const products = pagination.docs;
    //Create Paging Information
    createPagination(pagination, req);
    const totalPage = pagination.totalPages;
    res.json( { products, pagingButtons , pagination,
        totalPage ,onStore: 'active', Allcheck, Desktopscheck, Laptopscheck});
};