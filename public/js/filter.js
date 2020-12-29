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

function filterChange(sortOption) {
    const selectedDisplay = getSelectedCheckboxValues('Display');
    const selectedProcessor = getSelectedCheckboxValues('Processor');
    const selectedMemory = getSelectedCheckboxValues('Memory');
    const selectedManufacturer = getSelectedCheckboxValues('Manufacturer');
    const minPrice =  $( ".filter #slider-price" ).slider( "values", 0 );
    const maxPrice =  $( ".filter #slider-price" ).slider( "values", 1 );
    const page = $('input[name="Page"]:checked').val();
    const type = $('input[name="Type"]:checked').val();
    let queryString='?';
    queryString += 'sort=' + (sortOption || "1") + '&';
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
        queryString+="manufacturer="+query+'&';
    }
    queryString += "type="+type+'&';
    queryString += "minPrice="+minPrice+'&';
    queryString += "maxPrice="+maxPrice+'&';
    queryString += "page="+page;

    $.getJSON('/api/products'+queryString, (data) =>{
        renderProducts(data);
        window.scrollTo(0, 250);
        window.history.pushState("object or string", "Title", queryString);
    })
}

function renderProducts(data)
{
    const template = Handlebars.compile($('#products-template').html());
    const productsHtml = template({products: data.products, pagingButtons: data.pagingButtons, totalPages: data.totalPages, pagination: data.pagination});
    $('#products').html(productsHtml);
}


