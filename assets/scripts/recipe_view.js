
$(document).ready(function() {
    // Get the id parameter
    var id = getUrlParameter('id');
    getRecipeByID(id);
});

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; ++i) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function getRecipeByID(id) {
    
    $.getJSON("../assets/json/recipes.json", function(data) 
    {
        var i = 0;
        while (data[i].id != id) {
            ++i;
            if (i == data.length) {
                break;
            }
        }
        var recipe = data[i];
        if (recipe == null) {
            $(".recipe-alert").show();
        }
        else
        {
            for (var i = 0; i < recipe.grocery_list.length; ++i) {
                $(".recipe-items").append('<li onClick = "toggleStrikethrough(this)" class="btn-light list-group-item">' + recipe.grocery_list[i]+ '</li>');
            }
            
            $(".recipe-preview").html(`<img src="${recipe.image_url}" class="img-fluid rounded" alt="${recipe.name}">`);
            $(".recipe-title").html(recipe.name)

            for (var i = 0; i < recipe.cooking_instructions.length; ++i) {
                $(".recipe-instructions").append('<li onClick = "toggleStrikethrough(this)" class="btn-light list-group-item">' + recipe.cooking_instructions[i]+ '</li>');
            }
            
            // Get cookie
            var cookie = getCookie();
            
            if (cookie.favorites && cookie.favorites.includes(getUrlParameter('id'))) {
                $(".favorite-container").append('<i onclick = "unfavoriteRecipe()" class="fas fa-star ml-2 mr-2 favorite-button favorited"></i>')
            }
            else
            {
                $(".favorite-container").append('<i onclick = "favoriteRecipe()" class="far fa-star ml-2 mr-2 favorite-button not-favorite"></i>')
            }
        }
    });

}

function favoriteRecipe() {
    // Get and update the cookies
    var cookie = getCookie();

    // If favorites isn't already setup, set it up
    if (!cookie.favorites) {
       cookie.favorites = [];
    }

    cookie.favorites.push(getUrlParameter('id'));

    updateCookie(cookie);

    $(".favorite-button").removeClass("far");
    $(".favorite-button").removeClass("not-favorite");

    $(".favorite-button").addClass("fas favorited");
    $(".favorite-button").attr("onclick", "unfavoriteRecipe()");
    
    if (!$('.favorite-alert').length) {
        $(".favorite-container").append('<div class="alert alert-info ml-2 mr-2 favorite-alert" role="alert">Added to favorites!</div>');
    }
    else {
        $('.favorite-alert').empty().html("Added to favorites!");
    }
}

function toggleStrikethrough(e) {
    if ($(e).hasClass("strikethrough")) {
        $(e).removeClass("strikethrough");
    }
    else {
        $(e).addClass("strikethrough");
    }
}

function unfavoriteRecipe() {
    //get and update the cookies
    var cookie = getCookie();

    //If favorites isn't already setup, set it up
    if (!cookie.favorites) {
        cookie.favorites = [];
    }

    var id = getUrlParameter('id');
    cookie.favorites.splice(cookie.favorites.indexOf(id));
    updateCookie(cookie);

    $(".favorite-button").removeClass("fas");
    $(".favorite-button").removeClass("favorited");

    $(".favorite-button").addClass("far not-favorite");
    $(".favorite-button").attr("onclick", "favoriteRecipe()");

    if (!$('.favorite-alert').length) {
        $(".favorite-container").append('<div class="alert alert-info ml-2 mr-2 favorite-alert" role="alert">Removed from favorites!</div>');
    }
    else {
        $('.favorite-alert').empty().html("Removed from favorites!");
    }

}
