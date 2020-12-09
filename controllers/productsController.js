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

function createPagination(pagination, req){
    let i  = 0;
    //Reset last selected button
    for (i = 0; i < 7; i++) {
        pagingButtons[i].active = false;
        pagingButtons[i].link = '';
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
    for(i = 0; i < 7; i++){
        let x;
        pagingButtons[i].link +='/store?'
        for(x in req.query){
            if(x !== 'page'){
                pagingButtons[i].link = pagingButtons[i].link + x + '=' + req.query[x]+'&';
            }
        }
        pagingButtons[i].link = pagingButtons[i].link + 'page='+ pagingButtons[i].value;
    }

}


exports.index = async (req, res, next) => {
    // Get products from model
    const textSearch =  req.query.name || '';
    const type = req.query.type || '';
    let Desktopscheck, Allcheck, Laptopscheck, Tabletscheck, Hybridscheck;

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
        case 'Tablets':
            Tabletscheck = 1;
            break;
        case 'Hybrids':
            Hybridscheck = 1;
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
    // Pass data to view to display list of products
    res.render('store/products', { products, pagingButtons , pagination,
        totalPage ,onStore: 'active', Allcheck, Desktopscheck, Laptopscheck, Tabletscheck, Hybridscheck});
};

exports.Show = async (req, res, next) => {
    // Get product from model
    //await console.log(req.params._id);
    const product = await productsModel.getProduct(await req.params._id);
    const relatedProducts = await productsModel.getProductByTypeAndNumber(product.type, 4);
    res.render('store/productDetail', {product, Products: relatedProducts});
};
