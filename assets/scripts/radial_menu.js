// Whether or not the radial menu is open
var isOpen = false;

$(document).ready(function() {
    
    // Setup all our restrictions in the cookie
    var cookie = getCookie();
    
    if (!cookie.dietary_filters) {
        cookie.dietary_filters = {
            nuts: false,
            soy: false,
            dairy: false,
            fish: false
        }
    
        // Update the filters
        updateCookie(cookie);
    }

    if (!cookie.difficulty_filters) {
        cookie.difficulty_filters = {
            easy: false,
            medium: false,
            hard: false,
            very_hard: false
        }

        updateCookie(cookie);
    }

    if (!cookie.time_filters) {
        cookie.time_filters = {
            ten_to_thirty: false,
            thirty_to_sixty: false,
            sixty_to_ninety: false,
            ninety_plus: false
        }

        updateCookie(cookie);
    }

    // TODO: consider better ways to bring this up contextually
    // Optimally I would overrite right click but that's really gross
    // For now, I'll just do it and if it gets too annoying we can work
    // Something else out
    document.oncontextmenu = function() { return false; }

    // Handle right click of mouse   
    $(document).mousedown(function(e) { 
        // If we have an open menu, prevent the default event and close if
        if (isOpen) {
            e.preventDefault();
            
            // If a click registers outside the radial wheel, close the radial wheel
            if ($(e.target).parents(".radial-container").length == 0 || e.button == 2) {                
                $(".radial-container").fadeOut(100, function() { // Fade it out
                    $(".radial-container").remove();
                    isOpen = false;
                    console.log("closed");
                });
            }
        }

        if ( e.button == 2 ) { 
            showMenu(e.pageX, e.pageY);
        } 
    }); 
});

function showRadialMenuWithTouch(e){
    showMenu(e.originalEvent.touches[0].clientX,e.originalEvent.touches[0].clientY)
}

function showMenu(xPos, yPos){
    $('body').append(
        "<div class='radial-container bg-dark'></div>"  
    );
    $(".radial-container").append(
        "<div class='radial-rotate-container'></div>"
    );

    //Get the width/height of the container
    let width = $(".radial-container").height();

    // Account for height and width of element
    console.log(width);
    xPos -= width / 2;
    yPos -= width / 2;


    // Load external html
    $.get("../assets/html/radial_menu.html", function(data) {
        var orig_data = data;
        
        // If one is already open, remove it
        if (isOpen)
            $(".radial-container").remove();

        $(".radial-rotate-container").append(data);
        $(".radial-container").offset({ top: yPos, left: xPos}).show();
        isOpen = true;

        // Close functionality
        $(".radial-container").on('click touchstart', ".item-hover-close", function(e) {
            $(".radial-container").fadeOut(100, function() {
                $(".radial-container").remove();
                isOpen = false;
            });
        });

        // Close functionality (middle navi)
        $(".radial-container").on('click touchstart', ".exit-navi", function(e) {
            $(".radial-container").fadeOut(100, function() {
                $(".radial-container").remove();
                isOpen = false;
            });
        });

        // Navigate to the previous menu
        $(".radial-container").on('click touchstart', ".rev-navi", function(e) {
            $(".radial-rotate-container").fadeOut(100, function(ev) {
                $(".radial-rotate-container").empty();
                $(".radial-rotate-container").append(orig_data).fadeIn(100);
                // updateItems();
            });
        });

        // Implements functionality of other buttons
        $(".radial-container").on('click touchstart', ".item-hover-content", function(e) {
            
            // If we have the submenu class, it means we need to open a submenu
            if ($(e.target).parents(".item-hover-content").hasClass("sub-menu")) {
                
                // Update navigation element
                $(".radial-navigation").fadeOut(100, function() {
                    
                    $(".middle-buffer").removeClass("exit-navi");
                    $(".middle-buffer").addClass("rev-navi");

                    ($(this)).html(`<i class="fa " style="font-size:32px;"></i>`).fadeIn(100); 
                });


                $(".radial-rotate-container").fadeOut(100, function() {    
                    // TODO: handle cases for each different clicked element
                    $(".radial-rotate-container").empty();
                    console.log($(e.target).parents(".difficulty").length);
                    
                    // Cases for different menus
                    if ($(e.target).parents(".dietary").length != 0) {
                        // Load external html
                        $.get("../assets/html/radial_dietary.html", function(data) {
                            $(".radial-rotate-container").append(data).fadeIn(100);
                            updateItems();
                        });
                    } 
                    else if ($(e.target).parents(".difficulty").length != 0) {
                        // Load external html
                        $.get("../assets/html/radial_difficulty.html", function(data) {
                            $(".radial-rotate-container").append(data).fadeIn(100);
                            updateItems();
                        });
                    } 
                    else if ($(e.target).parents(".time").length != 0) {
                        // Load external html
                        $.get("../assets/html/radial_time.html", function(data) {
                            $(".radial-rotate-container").append(data).fadeIn(100);
                            updateItems();
                        });
                    }
                });
            }
            else 
            {
                var cookie = getCookie();
                
                // We get the parent item container
                // This will have the a class on it
                var container = $(e.target).parents('.item');

                // Cases for checking what we clicked
                if (container.hasClass('nuts')) {
                    cookie.dietary_filters.nuts = !cookie.dietary_filters.nuts;
                } else if (container.hasClass('soy')) {
                    cookie.dietary_filters.soy = !cookie.dietary_filters.soy;
                } else if (container.hasClass('dairy')) {
                    cookie.dietary_filters.dairy = !cookie.dietary_filters.dairy;
                } else if (container.hasClass('fish')) {
                    cookie.dietary_filters.fish = !cookie.dietary_filters.fish;
                } else if (container.hasClass('easy')) {
                    cookie.difficulty_filters.easy = !cookie.difficulty_filters.easy;
                } else if (container.hasClass('medium')) {
                    cookie.difficulty_filters.medium = !cookie.difficulty_filters.medium;
                } else if (container.hasClass('hard')) {
                    cookie.difficulty_filters.hard = !cookie.difficulty_filters.hard;
                } else if (container.hasClass('very-hard')) {
                    cookie.difficulty_filters.very_hard = !cookie.difficulty_filters.very_hard;
                } else if (container.hasClass('ten-to-thirty')) {
                    cookie.time_filters.ten_to_thirty = !cookie.time_filters.ten_to_thirty;
                } else if (container.hasClass('thirty-to-sixty')) {
                    cookie.time_filters.thirty_to_sixty = !cookie.time_filters.thirty_to_sixty;
                } else if (container.hasClass('sixty-to-ninety')) {
                    cookie.time_filters.sixty_to_ninety = !cookie.time_filters.sixty_to_ninety;
                } else if (container.hasClass('ninety-plus')) {
                    cookie.time_filters.ninety_plus = !cookie.time_filters.ninety_plus;
                }

                updateCookie(cookie);
                updateItems();
            }
        });
    })
}

// Updates items to reflect menu activeness
function updateItems() {
    // Get the cookie
    var cookie = getCookie();

    if (cookie.dietary_filters.soy) {
        $('.soy').addClass('bg-primary');
    } 
    else {
        $('.soy').removeClass('bg-primary');
    }

    if (cookie.dietary_filters.nuts) {
        $('.nuts').addClass('bg-primary');
    }
    else {
        $('.nuts').removeClass('bg-primary');
    }

    if (cookie.dietary_filters.dairy) {
        $('.dairy').addClass('bg-primary');
    } 
    else {
        $('.dairy').removeClass('bg-primary');
    }

    if (cookie.dietary_filters.fish) {
        $('.fish').addClass('bg-primary');
    } 
    else {
        $('.fish').removeClass('bg-primary');
    }

    if (cookie.dietary_filters.fish) {
        $('.fish').addClass('bg-primary');
    } 
    else {
        $('.fish').removeClass('bg-primary');
    }

    if (cookie.difficulty_filters.easy) {
        $('.easy').addClass('bg-primary');
    } 
    else {
        $('.easy').removeClass('bg-primary');
    }

    if (cookie.difficulty_filters.medium) {
        $('.medium').addClass('bg-primary');
    } 
    else {
        $('.medium').removeClass('bg-primary');
    }

    if (cookie.difficulty_filters.hard) {
        $('.hard').addClass('bg-primary');
    } 
    else {
        $('.hard').removeClass('bg-primary');
    }

    if (cookie.difficulty_filters.very_hard) {
        $('.very-hard').addClass('bg-primary');
    } 
    else {
        $('.very-hard').removeClass('bg-primary');
    }

    if (cookie.difficulty_filters.very_hard) {
        $('.very-hard').addClass('bg-primary');
    } 
    else {
        $('.very-hard').removeClass('bg-primary');
    }

    if (cookie.time_filters.ten_to_thirty) {
        $('.ten-to-thirty').addClass('bg-primary');
    } 
    else {
        $('.ten-to-thirty').removeClass('bg-primary');
    }

    if (cookie.time_filters.thirty_to_sixty) {
        $('.thirty-to-sixty').addClass('bg-primary');
    } 
    else {
        $('.thirty-to-sixty').removeClass('bg-primary');
    }

    if (cookie.time_filters.sixty_to_ninety) {
        $('.sixty-to-ninety').addClass('bg-primary');
    } 
    else {
        $('.sixty-to-ninety').removeClass('bg-primary');
    }

    if (cookie.time_filters.ninety_plus) {
        $('.ninety-plus').addClass('bg-primary');
    } 
    else {
        $('.ninety-plus').removeClass('bg-primary');
    }

}

