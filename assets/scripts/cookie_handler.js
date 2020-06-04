$(document).ready(function(){
    //Get the cookie
    try {
        var cookie = getCookie();
    }
    catch {
        cookie = {};
    }

    // If we have no username, prompt for it
    if (!cookie.username) {
        
        cookie.username = ""; // remnant from when we prompted for usernames
        // Store it
        updateCookie(cookie);
    }

    // Find all the divs that need our username replaced
    $(".user-name").each(function() {
        $(this).html(cookie.username);
    })

    // Handler for logout button
    $(".logout").click(function() {
        // Clear the cookie to pseudologout
        document.cookie = "";
        // Refresh the page so it resets data
        location.reload();
    })
});

function getCookie(){
    return JSON.parse(document.cookie);
}

function updateCookie(cookie){
    document.cookie = JSON.stringify(cookie);
}
