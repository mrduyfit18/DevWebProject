const querystring = require('querystring');
const mongoose = require('mongoose');
const buildUrl = require('build-url');

const productsModel = require('../models/productsModel');
const manufacturerModel = require('../models/manufacturerModel');
const commentModel = require('../models/commentModel');



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



exports.Show = async (req, res, next) => {
    const productID = req.params._id;
    const product = await productsModel.getProduct(productID);
    const relatedProducts = await productsModel.getProductByTypeAndNumber(product.type, 4);
    const imageCount = product.productImages.length + 1;
    const comments = await commentModel.listCmt(productID);
    res.render('store/productDetail', {product, Products: relatedProducts, imageCount, cmts : comments});
};

async function getProducts (req) {
    let result = {};
    const textSearch =  req.query.name || '';
    const type = req.query.type || '';
    const minPrice = (Number(req.query.minPrice) * 1000000) || 0;
    const maxPrice = (Number(req.query.maxPrice) * 1000000) ||100000000;
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
    if(!req.query.manufacturer){
        const manufacturers = await manufacturerModel.list();
        for(let manufacturer of manufacturers){
            manufacturer_id.push(manufacturer._id);
        }
    }
    else if(typeof req.query.manufacturer === 'string'){
        manufacturer_id.push(req.query.manufacturer);
    }
    else{
        manufacturer_id=req.query.manufacturer;
    }

    for(let i=0; i<manufacturer_id.length; i++) {
        manufacturer_id[i] = mongoose.Types.ObjectId(manufacturer_id[i]);
    }
    let sortOption={};
    switch(req.query.sort) {
        case '1':
            sortOption.name = 1;
            break;
        case '2':
            sortOption.name = -1;
            break;
        case '3':
            sortOption.basePrice = 1;
            break;
        case '4':
            sortOption.basePrice = -1;
            break;
        default:
            sortOption.name = 1;
            break;
    }

    switch(type){
        case 'Desktops':
            result.Desktopscheck = 1;
            break;
        case 'Laptops':
            result.Laptopscheck = 1;
            break;
        default:
            result.Allcheck = 1;
            break;
    }
    const pagination = await productsModel.list( {'name': { "$regex": textSearch, "$options": "i" },
            'type': { "$regex": type, "$options": "i" }, 'display': {"$in": display }, 'processor': {"$in": processor },
            'memory': {"$in": memory }, 'manufacturer_id': {"$in": manufacturer_id },
            $and: [{ 'basePrice': { $gte: minPrice } }, { 'basePrice': { $lte: maxPrice } }], 'state': {$not: /hide/i}   },
        req.query.page, sortOption);
    //Create Paging Information
    createPagination(pagination, req);
    result.pagination = pagination;
    return result;
}

exports.index = async (req, res, next) => {
    const result = await getProducts(req);
    const manufacturers = await manufacturerModel.list();
    res.render( 'store/products',{ products: result.pagination.docs, pagingButtons , pagination: result.pagination,
        totalPage: result.pagination.totalPages ,onStore: 'active', Manufacturers: manufacturers,
        Allcheck: result.Allcheck, Desktopscheck: result.Desktopscheck, Laptopscheck: result.Laptopscheck});
};


exports.indexAPI = async (req, res, next) => {
    const result = await getProducts(req);
    const manufacturers = await manufacturerModel.list();
    res.json( { products: result.pagination.docs, pagingButtons , pagination: result.pagination,
        totalPage: result.pagination.totalPages ,onStore: 'active', Manufacturers: manufacturers,
        Allcheck: result.Allcheck, Desktopscheck: result.Desktopscheck, Laptopscheck: result.Laptopscheck});
};