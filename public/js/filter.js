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
let sort = 1;

function filterChange(sortOption) {
    const selectedDisplay = getSelectedCheckboxValues('Display');
    const selectedProcessor = getSelectedCheckboxValues('Processor');
    const selectedMemory = getSelectedCheckboxValues('Memory');
    const selectedManufacturer = getSelectedCheckboxValues('Manufacturer');
    const minPrice = $(".filter #slider-price").slider("values", 0);
    const maxPrice = $(".filter #slider-price").slider("values", 1);
    const page = $('input[name="Page"]:checked').val();
    // if(!page){
    //     return;
    // }
    const type = $('input[name="Type"]:checked').val();
    let queryString = '?';
    name = document.getElementById('textSearch').value;
    if(name !== '') {
        queryString += 'name=' + name + '&';
    }
    sort = sortOption || sort;
    queryString += 'sort=' + sort + '&';
    if (Array.isArray(selectedDisplay)) {
        for (let query of selectedDisplay) {
            queryString += "display=" + query + '&';
        }
    }

    if (Array.isArray(selectedProcessor)) {
        for (let query of selectedProcessor) {
            queryString += "processor=" + query + '&';
        }
    }

    if (Array.isArray(selectedMemory)) {
        for (let query of selectedMemory) {
            queryString += "memory=" + query + '&';
        }
    }

    if (Array.isArray(selectedManufacturer)) {
        for (let query of selectedManufacturer) {
            queryString += "manufacturer=" + query + '&';
        }
    }
    if (type !== '') {
        queryString += "type=" + type + '&';
    }

    if (minPrice > 0) {
        queryString += "minPrice=" + minPrice + '&';
    }

    if (maxPrice < 100) {
        queryString += "maxPrice=" + maxPrice + '&';
    }
    queryString += "page="+page;

    $.getJSON('/api/products'+queryString, (data) =>{
        renderProducts(data);
        window.scrollTo(0, 20);
        window.history.pushState("object or string", "Title", queryString);
    })
}

function renderProducts(data)
{
    const template = Handlebars.compile($('#products-template').html());
    const productsHtml = template({products: data.products, pagingButtons: data.pagingButtons, totalPages: data.totalPages, pagination: data.pagination});
    $('#products').html(productsHtml);
}

const input = document.getElementById("textSearch");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        filterChange()
    }
    if(event.keyCode === 27) {
        $('#searchDiv').addClass('hidden');
    }
});


