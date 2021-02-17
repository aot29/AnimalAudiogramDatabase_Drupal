/**
   Class to render and control the basic filter on the "browse" page.
   * render(): reads the GET parameters and renders the filter as html
   * apply(): reads the selected values and reloads the "browse" page
   * reset() drops the selected the filter values and reloads the "browse" page 

   Called from inside templates/browse-template.html.twig
   Add the filter block in Drupal (e.g. to the sidebar) in Structure -> Block Layout
*/

$( function() {
    $( "#species_filter" ).selectmenu();
});

class Filter {

    /**
     * @param api instance of API_Client
     */
    constructor(api) {
        this.api = api;
    }
    
    /**
     * Render the filters of the filter block.
     */
    render() {
        var filterEl = document.getElementById("filters");
        var vernacularFilterMarkup = this._renderFilterByVernacularName();
        var methodFilterMarkup = this._renderFilterByMeasurementMethod();
        var publicationFilterMarkup = this._renderFilterByPublication();
        var measurementTypeFilterMarkup = this._renderFilterByMeasurementType();
        filterEl.innerHTML = `
            ${vernacularFilterMarkup}
            ${methodFilterMarkup}
            ${publicationFilterMarkup}
            ${measurementTypeFilterMarkup}
            <p>
                <div class="button main_button" id="apply_button" onclick="filter.apply()">Apply filter</div>
                <div class="button" id="reset_button" onclick="filter.reset()">Clear filter</div>
            </p>
        `;
        $('#species_filter').css('font-style', 'italic');
    }

    /** HTML for "By measurement type" pulldown */
    _renderFilterByMeasurementType() {
        // var types = ['auditory threshold', 'critical ratio', 'critical bandwidth', 'time period of integration', 'TTS - Temporary Threshold Shift', 'PTS - Permanent Threshold Shift', 'signal duration test'];
        var types = ['auditory threshold', 'critical ratio', 'TTS - Temporary Threshold Shift', 'signal duration test'];
        var selectedOption = this._getSelectedOption('measurement_type');
        var options = "<option></option>";
        for (var t in types) {
            var selected = (selectedOption == types[t])? "selected" : ""; 
            var display_name = this._encodStr(replace_special_chars(types[t]));
            options += `<option value="${types[t]}" ${selected}>${display_name}</option>`;
        }
        var markup = `<label for="measurement_type_filter">By measurement type</label><select id="measurement_type_filter">${options}</select>`
        return markup;
    }
    
    /** HTML for "By species" pulldown */
    _renderFilterByVernacularName() {
        var taxa = this.api.list_species_vernacular();
        var selectedOption = this._getSelectedOption('species');
        var options = "<option></option>";
        for (var t in taxa) {
            if (t.total == 0) continue; // skip taxa with no entries
            var selected = (selectedOption == taxa[t].ott_id)? "selected" : ""; 
            if (taxa[t].total != 0) { // taxa[t].total is the number of animals, not the numebr of experiments/audiograms
                options += `<option value="${taxa[t].ott_id}" ${selected}>${taxa[t].vernacular_name_english}</option>`;
            }
        }
        var markup = `<label for="vernacular_filter">By species</label><select id="vernacular_filter">${options}</select>`
        return markup;
    }
    
    /** HTML for "By measurement method" pulldown */
    _renderFilterByMeasurementMethod() {
        var methods = this.api.list_parent_measurement_methods(); 
        var selectedOption = this._getSelectedOption('method');
        var options = "<option></option>";
        for (var m in methods) {
            var selected = (selectedOption == methods[m].method_id)? "selected" : ""; 
            options += `<option value="${methods[m].method_id}" ${selected}>${methods[m].method_name}</option>`;
        }
        var markup = `<label for="method_filter">By measurement method</label><select id="method_filter">${options}</select>`
        return markup;
    }
    
    /** HTML for "By publication" pulldown */
    _renderFilterByPublication() {
        var publications = this.api.list_publications();
        var selectedOption = this._getSelectedOption('publication');
        var options = "<option></option>";
        for (var p in publications) {
            var selected = (selectedOption == publications[p].id)? "selected" : "";
            var citation_short = this._encodStr(replace_special_chars(publications[p].citation_short));
            options += `<option value="${publications[p].id}" ${selected}>${citation_short}</option>`;
        }
        var markup = `<label for="publication_filter">By publication</label><select id="publication_filter">${options}</select>`
        return markup;
    }

    /** Read the GET parameters from the URL*/
    _getSelectedOption(paramName) {
        var temp = decodeURI(location.search.split(`${paramName}=`)[1]);
        return(temp.split('&')[0])
    }
    
    /**
     * Reset filters and page content by reloading the page.
     */
    reset() {
        this._reload();
    }

    /**
     * Apply filter:
     * * read the selected values
     * * reload the page
     */
    apply() {
        // read value for "By measurement type"
        var measurementTypeEl = document.getElementById("measurement_type_filter");
        var selectedMeasurementType = measurementTypeEl.options[measurementTypeEl.selectedIndex].value
        
        // read value for "By species"
        var selectedSpecies = this._readSelectedSpecies().join(",");
        
        // read value for "By measurement method"
        var methodFilterEl = document.getElementById("method_filter");
        if (methodFilterEl.selectedIndex != -1) {
            var selectedMethod = methodFilterEl.options[methodFilterEl.selectedIndex].value
        }
        
        // read value for "By publication"
        var publicationFilterEl = document.getElementById("publication_filter");
        var selectedPublication = publicationFilterEl.options[publicationFilterEl.selectedIndex].value

        // reload the page, parameters will be passed through GET
        this._reload({
            'species': selectedSpecies,
            'method': selectedMethod,
            'publication': selectedPublication,
            'measurement_type': selectedMeasurementType
        });
    }

    /** Read (multiple) selected species from pulldown */
    _readSelectedSpecies() {
        var resp = [];
        var speciesFilterEl = document.getElementById("vernacular_filter");
        var speciesOptions = speciesFilterEl.options;
        var selectedSpecies = speciesFilterEl.options[speciesFilterEl.selectedIndex].value
        for (var i = 0; i < speciesOptions.length; i++) {
            var opt = speciesOptions[i];
            if (opt.selected) {
                resp.push(opt.value);
            }
        }
        return resp;
    }

    /**
     * Reload the "browse" page, taking selected filter parameters into account.
     * Called in the apply() method
     * @param search: dictionary of parameters
     */
    _reload(search=null) {
        // the sorting order of the filter result depends on the selected filter parameter(s)
        // or combination of parameters
        var order_by = 'vernacular_name_english'; // when applying filters, sort by species by default
        if (search) {
            if (search['method'] && !search['species']) {
                order_by = 'measurement_method'; // when filtering only by method, sort by method
            } else if (search['publication'] && !search['species']) {
                order_by = 'citation_short'; // when filtering only by publication, sort by publication
            }
        }
        var url = "/audiogrambase"
        if (order_by) {
            url += `?order_by=${order_by}`;
        }
        // pack parameters in GET string
        if (search) {
            url += `&species=${search['species']}&method=${search['method']}&publication=${search['publication']}&measurement_type=${search['measurement_type']}`;
        }
        window.location.href=url;
    }
    
    _encodStr(rawStr) {
        return rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });
    }
}
