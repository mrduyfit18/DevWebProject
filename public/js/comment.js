$('#add-new-comment').on("click", async  function (){
    event.preventDefault();
    const name = $('#new-comment-name').val();
    const content = $('#new_comment_text').val();
    let id = $('#productId').val();
    const date = new Date();
    const template = Handlebars.compile($('#new-comment-template').html());
    const cmt = template({name: name, content: content, date});
    $('#comment-content').append(cmt);
    await $.ajax({
        url: '/api/addComment',
        type: 'POST',
        method: 'POST',
        data:{
            productID: id,
            name: name,
            content: content
        }
    });
});