$('#add-new-comment').on("click", async  function (){
    let name;
    name = $('#new-comment-name').val();

    let id = $('#productId').val();
    await $.ajax({
        url: '/api/addComment',
        type: 'POST',
        method: 'POST',
        data:{
            productID: id,
            name: name,
            content: $('#new_comment_text').val()
        },
        success:function (result){
            const template = Handlebars.compile($('#new-comment-template').html());
            const cmt = template({name:result.name, content: result.content});
            $('#cmtForm').append(cmt);
        }
    })

})