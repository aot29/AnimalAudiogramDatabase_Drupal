class Controls {
    /**
     * @param api instance of API_Client
     */
    constructor(api) {
        this.api = api;
    }

    /**
     * Render the controls block.
     * Add the controls block (e.g. to the content) in Structure -> Block Layout
     * Called from inside the details-template.
     */
    render() {
        var displays_layers = location.search.includes("layers=true");
        var controlsEl = document.getElementById("controls");
        
        /* Displaying layers */
        if (displays_layers == true) {
            controlsEl.innerHTML = `
                <div class="button" id="details_button" onclick="controls.details()" style="margin-right: 2em;">Display details</div>
            `            
        /* Displaying details */
        } else {
            var ids = decodeURI(location.search.split(`ids=`)[1].split("&")[0]);
            var idCount = ids.split(',').length;
            if (idCount > 1) {
                var compat = this.api.is_compatible(ids);
                if (compat == true) {
                    controlsEl.innerHTML = `
                    <div class="button" id="layers_button" onclick="controls.layers()" style="margin-right: 2em;">Display audiogram overlay</div>
                `
                    /* Cannot display layers */
                } else {
                    controlsEl.innerHTML = `
                   Overlay of the selected audiograms not available as they involve incompatible units of measurement.
                `            
                }
            }
        }
    }

    /** Display requested audiograms as layers in one diagram */
    layers() {
        var ids = location.search.split('?')[1];
        var url = `${location.pathname}?layers=true&${ids}`;
        window.location.href = url;
    }
    
    /** Display requested audiograms as one diagram each */
    details() {
        var ids = location.search.split('?layers=true&')[1];
        var url = `${location.pathname}?${ids}`;
        window.location.href = url;
    }
}
