$('#add-new-comment').on("click", async  function (){
    event.preventDefault();
    const name = $('#new-comment-name').val();
    const content = $('#new_comment_text').val();
    let id = $('#productId').val();
    const date = new Date();

    await $.ajax({
        url: '/api/addComment',
        type: 'POST',
        method: 'POST',
        data:{
            productID: id,
            name: name,
            content: content
        },
        success:function(result) {
            $('#new_comment_text').val('');
            $('#comment-container').html(result);
        }
    });
});

function nextCmts_Click(){
    const nextPage = $('#next').data('id');
    const productID = $('#productId').val();
    $.ajax({
        url: '/api/change-page',
        type: 'GET',
        data:{
            productID: productID,
            page: nextPage
        },
        success: function (result){
            $('#comment-container').html(result);
        }
    });
}

function prevCmts_Click(){
    const prevPage = $('#prev').data('id');
    const productID = $('#productId').val();
    $.ajax({
        url: '/api/change-page',
        type: 'GET',
        data:{
            productID: productID,
            page: prevPage
        },
        success: function (result){
            $('#comment-container').html(result);
        }
    });
}

const myVar = setInterval(myTimer, 20000);

function myTimer() {
    const Page = $('#curPage').data('id');
    const productID = $('#productId').val();
    $.ajax({
        url: '/api/change-page',
        type: 'GET',
        data:{
            productID: productID,
            page: Page
        },
        success: function (result){
            $('#comment-container').html(result);
        }
    });
}