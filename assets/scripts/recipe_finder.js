var recipes;
var currentRecipe = 0;

// Holds the current card so it can track the mouse position for swiping cards on/off
var cardIsDragging = false;

// The initial card position
var initialCardPos = {};

var currentCard = 1;

// The minimun amount the card must be moved to trigger the "next recipe" handler
var MIN_MOVE = 10;

var menuOpenTimeout = null;



/*
*   Gets the query string for a recipe card
*
*   @param {string}: what card you want, the front or back
*
*/
function getCardAsString(card = "front"){
    if(card == "front"){
        if(currentCard == 1){
            return '.card-1'
        }
        return '.card-2'
    }else{
        if(currentCard == 1){
            return '.card-2'
        }
        return '.card-1'
    }

}



$(document).ready(function() {

    $(".help-overlay").hide();
    var cookie = getCookie();
    console.log(cookie);

    if (!cookie.seen_instructions) {

        $(".help-overlay").fadeIn(100);

        $(".help-overlay").on('click', "", function(e) {
            $(this).fadeOut();
        })

        cookie.seen_instructions = true;
        updateCookie(cookie);
    }

    $.getJSON("../assets/json/recipes.json", function(data) {
        // Ensure the recipe is loaded
        recipes = data;

        cycleCurrentRecipe();
        updateFrontCard();
        cycleCurrentRecipe();
        updateBackCard();
        updateFakeCard();
    });

    $(".recipe-jumbo").bind('mousedown touchstart', '.recipe-card', function(e) {
        //If we have a touch or a click and the card isn't already being dragged, start doing so
        if ((e.button == 0 || e.type == "touchstart") && !cardIsDragging) {
            console.log("Dragging card");
            cardIsDragging = true;
            initialCardPos.x = $(getCardAsString()).position().left;
            initialCardPos.y = $(getCardAsString()).position().top;
        }

        //If we hold a tap for more than 3/4 of a second without moving or letting go
        //open the radial menu
        if(e.type == "touchstart"){
            menuOpenTimeout = setTimeout(showRadialMenuWithTouch, 500, e);
        }
    });

    $(".recipe-jumbo").on('mouseup touchend', '.recipe-card', function(e) {
        //If we have started the timeout for the user opening the radial menu, stop it
        clearTimeout(menuOpenTimeout);

        //If we're dragging
        if(cardIsDragging){
            var offset = $(getCardAsString()).offset();
            var direction_moved = 0 < (offset.left - initialCardPos.x) ? 1 : -1;
            console.log(offset.left - initialCardPos.x);
            cardIsDragging = false;

            // If we've moved far enough
            if (Math.abs(offset.left - initialCardPos.x) > MIN_MOVE) {
                console.log("Moved achieved, doing animation");
                //Determine if we swiped right or left to figure out what way we need to animate
                if(offset.left - initialCardPos.x < 0){
                    //Reset the y position
                    $(getCardAsString()).offset({
                        top: initialCardPos.y
                    },10).animate({
                        left : 0
                    },250);
                }else{
                    //Reset the y position
                    $(getCardAsString()).offset({
                        top: initialCardPos.y
                    },10).animate({
                        left : '60%'
                    },250);
                }


                //Swap the two card z-indexes
                $(getCardAsString()).removeClass("card-front").addClass("card-back");
                $(getCardAsString("back")).removeClass("card-back").addClass("card-front");
                $(getCardAsString()).animate({
                    top: initialCardPos.y,
                    left: initialCardPos.x
                }, 250, function(){
                    swapTopCard();
                    cycleCurrentRecipe();
                    updateBackCard();
                })
            }else{
                console.log("Min moved not acheived")
                $(getCardAsString()).offset({
                    left: initialCardPos.x,
                    top: initialCardPos.y
                })
            }
        }

    });

    $(".recipe-jumbo").on('mousemove touchmove', '.recipe-card', function(e) {
        clearTimeout(menuOpenTimeout);

        var card = $(getCardAsString());
        if (cardIsDragging) {
            if(e.originalEvent.touches){
                $(getCardAsString()).offset({
                    left: e.originalEvent.touches[0].clientX - (card.width()  / 2),
                    top:  e.originalEvent.touches[0].clientY - (card.height() / 2)
                });
            }else{
                $(getCardAsString()).offset({
                    left: e.clientX - (card.width()  / 2),
                    top:  e.clientY - (card.height() / 2)
                });
            }
        }
    });
});


function swapTopCard(){
    if(currentCard == 1){
        currentCard = 2;
    }else{
        currentCard = 1;
    }
}
function updateFrontCard(){
   // Update card data
   $(getCardAsString()).find(".recipe-title").html(recipes[currentRecipe].name);
   $(getCardAsString()).find(".recipe-preview").html(`<img src="${recipes[currentRecipe].image_url}" class="img-fluid rounded" alt="${recipes[currentRecipe].name}">`);
   $(getCardAsString()).find(".recipe-time").html(recipes[currentRecipe].time);
   $(getCardAsString()).find(".recipe-serves").html("Serves "+recipes[currentRecipe].serves);
   $(getCardAsString()).find(".recipe-difficulty").html(recipes[currentRecipe].difficulty);
   $(getCardAsString()).find(".recipe-soy").empty();

   // Append emojis corresponding to the meal's dietary restrcitions
   var container = $(getCardAsString()).find(".recipe-dietary");
   var restrictions = recipes[currentRecipe].restrictions;

   if (restrictions.dairy) {
       container.append('<div>🧀</div>');
   }
   if (restrictions.fish) {
       container.append('<div>🐟</div>');
   }
   if (restrictions.nuts) {
       container.append('<div>🥜</div>');
   }
   if (restrictions.soy) {
       $(getCardAsString()).find(".recipe-soy").append("Contains soy");
   }

   $(getCardAsString()).find(".recipe-button").attr('href', "/recipe?id=" + recipes[currentRecipe].id);

}
function updateBackCard(){
    console.log("Updated back card");
    // Update card data
    $(getCardAsString("back")).find(".recipe-title").html(recipes[currentRecipe].name);
    $(getCardAsString("back")).find(".recipe-preview").html(`<img src="${recipes[currentRecipe].image_url}" class="img-fluid rounded" alt="${recipes[currentRecipe].name}">`);
    $(getCardAsString("back")).find(".recipe-time").html(recipes[currentRecipe].time);
    $(getCardAsString("back")).find(".recipe-serves").html("Serves "+recipes[currentRecipe].serves);
    $(getCardAsString("back")).find(".recipe-difficulty").html(recipes[currentRecipe].difficulty);
    $(getCardAsString("back")).find(".recipe-soy").empty();

    // Append emojis corresponding to the meal's dietary restrcitions
    var container = $(getCardAsString("back")).find(".recipe-dietary");
    var restrictions = recipes[currentRecipe].restrictions;
    container.empty();

    if (restrictions.dairy) {
        container.append('<div>🧀</div>');
    }
    if (restrictions.fish) {
        container.append('<div>🐟</div>');
    }
    if (restrictions.nuts) {
        container.append('<div>🥜</div>');
    }
    if (restrictions.soy) {
        console.log("Added soy notice");
        $(getCardAsString("back")).find(".recipe-soy").append("Contains soy");
    }

    $(getCardAsString("back")).find(".recipe-button").attr('href', "/recipe?id=" + recipes[currentRecipe].id);
}

function updateFakeCard(){
    $(".card-fake").find(".recipe-title").html(recipes[currentRecipe].name);
    $(".card-fake").find(".recipe-preview").html(`<img src="${recipes[currentRecipe].image_url}" class="img-fluid rounded" alt="${recipes[currentRecipe].name}">`);
    $(".card-fake").find(".recipe-time").html(recipes[currentRecipe].time);
    $(".card-fake").find(".recipe-serves").html("Serves "+recipes[currentRecipe].serves);
    $(".card-fake").find(".recipe-difficulty").html(recipes[currentRecipe].difficulty);

    // Append emojis corresponding to the meal's dietary restrcitions
    var container = $(".card-fake").find(".recipe-dietary");
    var restrictions = recipes[currentRecipe].restrictions;
    container.empty();

    if (restrictions.dairy) {
        container.append('<div>🧀</div>');
    }
    if (restrictions.fish) {
        container.append('<div>🐟</div>');
    }
    if (restrictions.nuts) {
        container.append('<div>🥜</div>');
    }
    if (restrictions.soy) {
        $(".card-fake").find(".recipe-soy").append("Contains soy");
    }

    $(".card-fake").find(".recipe-button").attr('href', "/recipe?id=" + recipes[currentRecipe].id);

}

/**
 * Selects the next recipe and assigns it to the current recipe variable.
 *
 * @param {number} direction 1 = next meal in the list, -1 = previous meal in the list.
 * @return {void}
 */
function cycleCurrentRecipe(direction = 1) {

    var filters = getCookie().dietary_filters;
    var t_filters = getCookie().time_filters; //loads time filters applied
    var d_filters = getCookie().difficulty_filters; //loads difficulty filters applied

    // 'circular-array' lookup (allows for currentRecipe to loop around)
    currentRecipe = ((currentRecipe + direction) % recipes.length) < 0 ? recipes.length - 1 : ((currentRecipe + direction) % recipes.length);

    var diet_restrictions = recipes[currentRecipe].restrictions;
    var time_restrictions = recipes[currentRecipe].time_restrictions;
    var difficulty_restrictions = recipes[currentRecipe].difficulty_restrictions;

    // If any of our filters match
    while
    (
        ((diet_restrictions.soy   && filters.soy)  ||
        (diet_restrictions.fish  && filters.fish) ||
        (diet_restrictions.nuts  && filters.nuts) ||
        (diet_restrictions.dairy && filters.dairy))||
        ((difficulty_restrictions.easy && d_filters.easy) ||
        (difficulty_restrictions.medium && d_filters.medium) ||
        (difficulty_restrictions.hard && d_filters.hard) ||
        (difficulty_restrictions.very_hard && d_filters.very_hard)) ||
       ((time_restrictions.ten_to_thirty && t_filters.ten_to_thirty)||
        (time_restrictions.thirty_to_sixty && t_filters.thirty_to_sixty) ||
        (time_restrictions.sixty_to_ninety && t_filters.sixty_to_ninety) ||
        (time_restrictions.ninety_plus && t_filters.ninety_plus))
    )
    {
        currentRecipe = ((currentRecipe + direction) % recipes.length) < 0 ? recipes.length - 1 : ((currentRecipe + direction) % recipes.length);
        diet_restrictions = recipes[currentRecipe].restrictions;
        time_restrictions = recipes[currentRecipe].time_restrictions;
        difficulty_restrictions = recipes[currentRecipe].difficulty_restrictions;

    }
}

/**
 * Selects the next recipe in the list and returns it as a js objet
 *
 * @param {number} direction 1 = next meal in the list, -1 = previous meal in the list.
 * @return {recipe_object}
 */
function getNextRecipe(direction = 1){
    var recipe = null;
    var filters = getCookie().dietary_filters;

    // 'circular-array' lookup (allows for currentRecipe to loop around)
    recipe = ((currentRecipe + direction) % recipes.length) < 0 ? recipes.length - 1 : ((currentRecipe + direction) % recipes.length);

    var diet_restrictions = recipes[currentRecipe].restrictions;
    var t_filters = getCookie().time_filters; //loads time filters applied
    var d_filters = getCookie().difficulty_filters; //loads difficulty filters applied


    // If any of our filters match
    while
    (
      ((diet_restrictions.soy   && filters.soy)  ||
      (diet_restrictions.fish  && filters.fish) ||
      (diet_restrictions.nuts  && filters.nuts) ||
      (diet_restrictions.dairy && filters.dairy))||
      ((difficulty_restrictions.easy && d_filters.easy) ||
      (difficulty_restrictions.medium && d_filters.medium) ||
      (difficulty_restrictions.hard && d_filters.hard) ||
      (difficulty_restrictions.very_hard && d_filters.very_hard)) ||
     ((time_restrictions.ten_to_thirty && t_filters.ten_to_thirty)||
      (time_restrictions.thirty_to_sixty && t_filters.thirty_to_sixty) ||
      (time_restrictions.sixty_to_ninety && t_filters.sixty_to_ninety) ||
      (time_restrictions.ninety_plus && t_filters.ninety_plus))
    )
    {
        recipe = ((currentRecipe + direction) % recipes.length) < 0 ? recipes.length - 1 : ((currentRecipe + direction) % recipes.length);
        diet_restrictions = recipes[currentRecipe].restrictions;
        time_restrictions = recipes[currentRecipe].time_restrictions;
        difficulty_restrictions = recipes[currentRecipe].difficulty_restrictions;
    }

    return recipes[recipe];
}
