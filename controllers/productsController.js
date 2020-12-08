const productsModel = require('../models/productsModel');
const querystring = require('querystring');
const mongoose = require('mongoose');
const buildUrl = require('build-url');



/* Paginate buttons to render*/
const pagingButtons = [
    {
        value: 0,
        active: false,
        link:''
    },
    {
        value: 0,
        active: false,
        link:''
    },
    {
        value: 0,
        active: false,
        link:''
    },
    {
        value: 0,
        active: false,
        link:''
    },
    {
        value: 0,
        active: false,
        link:''
    },
    {
        value: 0,
        active: false,
        link:''
    },
    {
        value: 0,
        active: false,
        link:''
    }
]

function createPagination(pagination){
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

    //Tạo link cho từng nút

}


exports.index = async (req, res, next) => {
    // Get products from model
    const textSearch =  req.query.name || '';
    const type = req.body.options || '';


    const pagination = await productsModel.list( {'name': { "$regex": textSearch, "$options": "i" }, 'type': { "$regex": type, "$options": "i" } },
        req.query.page);
    const products = pagination.docs;
    //Create Paging Information
    createPagination(pagination);
    const totalPages = pagination.totalPages;
    // Pass data to view to display list of products
    res.render('store/products', { products, pagingButtons , pagination, onStore: 'active'});
};

exports.Show = async (req, res, next) => {
    // Get product from model
    //await console.log(req.params._id);
    const product = await productsModel.getProduct(await req.params._id);
    const relatedProducts = await productsModel.getProductByTypeAndNumber(product.type, 4);
    res.render('store/productDetail', {product, Products: relatedProducts});
};
