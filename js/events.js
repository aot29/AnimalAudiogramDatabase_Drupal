

// Display button handler
document.addEventListener('DOMContentLoaded', function() {
    button = document.getElementById("display_button");
    button.addEventListener("click", function(){
        vals = [];
        var checkboxes = document.getElementsByName('display');
        for (i in checkboxes) {
            box = checkboxes[i];
            if (box.checked) {
                vals.push(box.value);
            }
        }
        if (vals.length != 0) {
            window.location.href = "/audiogram?ids=" + vals.toString();
        }
    });
});

// Display all button handler
document.addEventListener('DOMContentLoaded', function() {
    button = document.getElementById("all_button");
    // enable button for filtered results only
    var urlParams = new URLSearchParams(window.location.search)
    if ( urlParams.get('species') || urlParams.get('method') || urlParams.get('publication') || urlParams.get('measurement_type') ) {
        button.removeAttribute('disabled');
        button.classList.remove('disabled');
    } else {
        return;
    }
    button.addEventListener("click", function(){
        vals = [];
        var checkboxes = document.getElementsByName('display');
        for (i in checkboxes) {
            box = checkboxes[i];
            if (box.value) {
                vals.push(box.value);
            }
        }
        if (vals.length != 0) {
            window.location.href = "/audiogram?ids=" + vals.toString();
        }
    });
});

// add event handlers to previous and next buttons
document.addEventListener('DOMContentLoaded', function() {
    button = document.getElementById("previous_button");
    button.addEventListener("click", function(){
        var output_el = formatter.previousPage();
        switchFirstChild("browse_result", output_el)
        checkButtons();
        updatePaginationInfo();
        updateSortingMark()
        updateTableHeaderLinks();
    });

    button = document.getElementById("next_button");
    button.addEventListener("click", function(){
        var output_el = formatter.nextPage();
        switchFirstChild("browse_result", output_el)
        checkButtons();
        updatePaginationInfo();
        updateSortingMark()
        updateTableHeaderLinks();
    });
});

/** Hide all buttons from browse screen, when no results found */
function hideButtons() {
    button = document.getElementById("previous_button");
    button.style.visibility = "hidden";
    button = document.getElementById("next_button");
    button.style.visibility = "hidden";
    button = document.getElementById("display_button");
    button.style.visibility = "hidden";    
    button = document.getElementById("all_button");
    button.style.visibility = "hidden";    
}

/** enable pager buttons */
function checkButtons() {
    button = document.getElementById("previous_button");
    if (formatter.currentPage == 1) {
        button.setAttribute('disabled', true);
        button.classList.add('disabled');
    } else {
        button.removeAttribute('disabled');
        button.classList.remove('disabled');
    }

    button = document.getElementById("next_button");
    if (formatter.currentPage == formatter.numberOfPages) {
        button.setAttribute('disabled', true);
        button.classList.add('disabled');
    } else {
        button.removeAttribute('disabled');
        button.classList.remove('disabled');
    }
}

/** output which page from total pages is displayed */
function updatePaginationInfo() {
    infoEl = document.getElementById("pagination_info");
    infoEl.innerHTML = `Page ${formatter.currentPage} of ${formatter.numberOfPages}`;
}

/** mark which column is used for sorting the table */
function updateSortingMark() {
    var order = filter._getSelectedOption('order_by');
    if (order != null) {
        // list all table header cells
        var th = document.querySelectorAll('#browse_result .browse th');
        var selectedHeader = null;
        if (order == 'vernacular_name_english') {
            selectedHeader = th[2];
        } else if (order == 'species_name') {
            selectedHeader = th[3];
        } else if (order == 'measurement_method') {
            selectedHeader = th[4];
        } else if (order == 'citation_short') {
            selectedHeader = th[5];
        } else {
            selectedHeader = th[2];
        }
        selectedHeader.textContent = `\u25bc ${selectedHeader.textContent}`; // add down triangle
    }
}
