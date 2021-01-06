$('#add-new-comment').on("click", async  function (){
    let name;
    /*if(window.location.session._id){
        name = window.location.session.name;
    }
    else{*/
        name = $('#new-comment-name').val();
    //}

    await $.ajax({
        url: '/api/addComment',
        type: 'POST',
        method: 'POST',
        data:{
            name: name,
            content: $('#new_comment_text').val()
        }
    })

})