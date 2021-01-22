/**
   Displays a summary of the data in the database. 
 */

window.addEventListener("load", function(event) {
    try {
        // the api is instatiated in SummaryBlock.php
        var results = api.summary()[0];
        var output_html = renderSummary(results);
        document.getElementById("summary").innerHTML = output_html;
    }
    catch(err) {
        console.log(err);
        document.getElementById("messages").innerHTML += "Script error";
    }
});

function renderSummary(results) {
    var resp = `
    <a href="/audiogrambase">In total, ${results['in_water']} underwater audiograms of ${results['in_water_species']} animal species and ${results['in_air']} above-water audiograms of ${results['in_air_species']} animal species are displayed here.</a>
    `;
    return(resp);
}
