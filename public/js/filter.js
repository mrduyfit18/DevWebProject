function param(object)
{
    var parameters = [];
    for (let property of object) {
        if (object.hasOwnProperty(property)) {
            parameters.push(encodeURI(property + '=' + object[property]));
        }
    }
    return parameters.join('&');
}



function getSelectedCheckboxValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    return values;
}

function filterChange(){
    const selectedFilter = getSelectedCheckboxValues('Display');
    console.log(selectedFilter);
    let queryString='';
    for (let query of selectedFilter) {
        queryString+="display="+query+'&';
    }
    $.getJSON('/api/products?'+queryString, (data) =>{
        relatedProducts(data);
    })
}

function relatedProducts(data)
{
    const template = Handlebars.compile($('#products-template').html());
    const productsHtml = template({products: data.products, pagingButtons: data.pagingButtons, totalPages: data.totalPages, pagination: data.pagination});
    $('#products').html(productsHtml);
}


