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
    const selectedDisplay = getSelectedCheckboxValues('Display');
    const selectedProcessor = getSelectedCheckboxValues('Processor');
    const selectedMemory = getSelectedCheckboxValues('Memory');
    const selectedManufacturer = getSelectedCheckboxValues('Manufacturer');
    const minPrice =  $( ".filter #slider-price" ).slider( "values", 0 );
    const maxPrice =  $( ".filter #slider-price" ).slider( "values", 1 );
    console.log("abc");
    let queryString='';
    for (let query of selectedDisplay) {
        queryString+="display="+query+'&';
    }
    for (let query of selectedProcessor) {
        queryString+="processor="+query+'&';
    }
    for (let query of selectedMemory) {
        queryString+="memory="+query+'&';
    }
    for (let query of selectedManufacturer) {
        queryString+="manufacturer_id="+query+'&';
    }
    queryString += "minPrice="+minPrice+'&';
    queryString += "maxPrice="+maxPrice+'&';


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


