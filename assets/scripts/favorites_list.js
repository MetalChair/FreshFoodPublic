$(document).ready(function() {
    //Get the cookie and see if the favorites are empty
    var cookie = getCookie();

    if (!cookie.favorites || cookie.favorites.length == 0) {
        $(".list-container").append(`<div class="alert alert-primary mt-3" role="alert">You don't have any favorite recipes! <a href="/recipe_finder">Find some</a>?</div>`);
    }
    else {
        getRecipeByIdAndUpdateList();
    }
});

function getRecipeByIdAndUpdateList() {
    
    $.getJSON("../assets/json/recipes.json", function(data) {
        var cookie = getCookie();
        var recipeToAppend = null;
        
        //For all the recipes in our favorites
        for (var i = 0; i < cookie.favorites.length; ++i) {
            for (var j = 0; j < data.length; ++j) {
                if (data[j].id == cookie.favorites[i]) {    
                    recipeToAppend = data[j];
                    var item = $('<li class = "list-group-item btn-light" onclick="navigateTo(' + recipeToAppend.id + ')" > <div class = "row align-items-center"><div class = "recipe-preview"></div>&nbsp;&nbsp;<h3 class="mt-3"><b>'  + recipeToAppend.name + '</h3></b></div></li>')
                    $(".favorites-list").append(item);
                    $(item).find(".recipe-preview").html(`<img src="${recipeToAppend.image_url}" class="img-fluid rounded" alt="${recipeToAppend.name}">`);
                }
            }
        }
    });

}

function navigateTo(id) {
    window.location.href = "/recipe?id=" + id;
}
