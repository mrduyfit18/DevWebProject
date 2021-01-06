$('#add-new-comment').on("click", async  function (){
    let name;
    /*if(window.location.session._id){
        name = window.location.session.name;
    }
    else{*/
        name = $('#new-comment-name').val();
    //}
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
        success:function (){

        }
    })

})