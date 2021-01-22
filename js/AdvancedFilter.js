$( function() {
    $( "#species_filter" ).selectmenu();
});

class AdvancedFilter {

    /**
     * @param api instance of API_Client
     */
    constructor(api) {
        this.api = api;
    }

    _initializeFilters() {
        // filter classes are in js/specificFilters.js
        this.vernacularFilter = new VernacularNameFilter(this.api);
        this.taxonFilter = new TaxonFilter(this.api);
        this.measurementTypeFilter = new MeasurementTypeFilter(this.api);
        this.methodFilter = new MeasurementMethodFilter(this.api);
        this.publicationFilter = new PublicationFilter(this.api);
        this.facilityFilter = new FacilityFilter(this.api);
        this.yearFilter = new YearFilter(this.api);
        this.mediumFilter = new MediumFilter(api);
        this.sexFilter = new SexFilter(this.api);
        this.libertyFilter = new LibertyFilter(this.api);
        this.lifeStageFilter = new LifeStageFilter(this.api);
        this.durationInCaptivityFilter = new DurationInCaptivityFilter(api);
        this.ageFilter = new AgeFilter(api);
        this.positionFilter = new PositionFilter(api);
        this.distanceFilter = new DistanceFilter(api);
        this.thresholdFilter = new ThresholdFilter(api);
        this.toneFilter = new ToneFilter(api);
        this.sedatedFilter = new SedatedFilter(api);
        this.staircaseFilter = new StaircaseFilter(api);
        this.formFilter = new FormFilter(api);
        this.constantsFilter = new ConstantsFilter(api);
    }
    
    /**
     * Render the filters of the filter block.
     * Add the filter block (e.g. to the sidebar) in Structure -> Block Layout
     * Called from inside the browse-template.
     */
    render() {
        var filterEl = document.getElementById("filters");
        this._initializeFilters();
        var details_open = "";
        if (document.location.search == "") {
            details_open = 'open="true"';
        }
        
        filterEl.innerHTML = `
            <details ${details_open}>
                <summary><h3>Animal details</h3></summary>
                <div id="display_animal_details">
                    <table style="width: 89%; margin-left: 1.75em;">
                        <tr>
                            <td style="width:50%; vertical-align: top;">
                                ${this.vernacularFilter.render()}
                                ${this.taxonFilter.render()}
                            </td>
                            <td style="width:50%; vertical-align: top;">
                                ${this.sexFilter.render()}
                                ${this.libertyFilter.render()}
                                ${this.lifeStageFilter.render()}
                                ${this.ageFilter.render()}
                                ${this.durationInCaptivityFilter.render()}
                            </td>
                        </tr>
                    </table>
                </div>
            </details>
            <details ${details_open}>
                <summary><h3>Experiment details</h3></summary>
                <div id="display_experiment_details">
                    <table style="width: 89%; margin-left: 1.75em;">
                        <tr>
                            <td style="width:30%; vertical-align: top;">
                                ${this.yearFilter.render()}
                                ${this.mediumFilter.render()}
                                ${this.positionFilter.render()}
                                ${this.distanceFilter.render()}
                                ${this.sedatedFilter.render()}
                            </td>
                            <td style="width:30%; vertical-align: top;">
                                ${this.measurementTypeFilter.render()}
                                ${this.methodFilter.render()}
                                ${this.thresholdFilter.render()}
                            </td>
                            <td style="width:30%; vertical-align: top;">
                                ${this.toneFilter.render()}
                                ${this.staircaseFilter.render()}
                                ${this.formFilter.render()}
                                ${this.constantsFilter.render()}
                            </td>
                        </tr>
                        <tr>
                            <td style="width:50%; vertical-align: top;" colspan="3">
                                ${this.facilityFilter.render()}
                            </td>
                        </tr>
                    </table>
                </div>
            </details>
            <details ${details_open}>
                <summary><h3>Publication details</h3></summary>
                <div id="display_publication_details">
                    <table style="width: 89%; margin-left: 1.75em;"><tr><td>
                        ${this.publicationFilter.render()}
                    </td></tr></table>
                </div>
            </details>
            <div class="button main_button" id="apply_button" onclick="filter.apply()">Apply filter</div>
            <div class="button" id="reset_button" onclick="filter.reset()">Clear filter</div>
        `;
        $('#species_filter').css('font-style', 'italic');

    }
    
    /** Read the GET parameters from the URL*/
    _getSelectedOption(paramName) {
        var temp = decodeURI(location.search.split(`${paramName}=`)[1]);
        temp = temp.split('&')[0]
        return(temp.split(','))
    }
    
    /**
     * Reset filters and page content by reloading the page.
     */
    reset() {
        this._reload();
    }

    /**
     * Apply filters by calling the API client and 
     * getting the filtered contents from the backend,
     * reload the page
     */
    apply() {
        var selectedYearRange = this.yearFilter.read();
        var captivityRange = this.durationInCaptivityFilter.read();
        var ageRange = this.ageFilter.read();
        var distanceRange = this.distanceFilter.read();
        var thresholdRange = this.thresholdFilter.read();
        this._reload({
            // 'species': this.vernacularFilter.read(),
            'taxon': this.taxonFilter.read(),
            'method': this.methodFilter.read(),
            'publication': this.publicationFilter.read(),
            'facility': this.facilityFilter.read(),
            'from': selectedYearRange.from,
            'to': selectedYearRange.to,
            'medium': this.mediumFilter.read(),
            'sex': this.sexFilter.read(),
            'liberty': this.libertyFilter.read(),
            'lifestage': this.lifeStageFilter.read(),
            'duration_in_captivity_from': captivityRange.from,
            'duration_in_captivity_to': captivityRange.to,
            'sedated': this.sedatedFilter.read(),
            'age_from': ageRange.from,
            'age_to': ageRange.to,
            'position': this.positionFilter.read(),
            'distance_from': distanceRange.from,
            'distance_to': distanceRange.to,
            'threshold_from': thresholdRange.from,
            'threshold_to': thresholdRange.to,
            'tone': this.toneFilter.read(),
            'staircase': this.staircaseFilter.read(),
            'form': this.formFilter.read(),
            'constants': this.constantsFilter.read(),
            'measurement_type': this.measurementTypeFilter.read()
        });
    }

    _requestedParametersToURL() {        
        var url = "";
        var search = this._readRequestedParameters();
        if (search) {
            url += `&species=${search['taxon']}`;
            url += `&taxon=${search['taxon']}`;
            url += `&method=${search['method']}`;
            url += `&publication=${search['publication']}`;
            url += `&facility=${search['facility']}`;
            url += `&from=${search['from']}`;
            url += `&to=${search['to']}`;
            url += `&medium=${search['medium']}`;
            url += `&sex=${search['sex']}`;
            url += `&liberty=${search['liberty']}`;
            url += `&lifestage=${search['lifestage']}`;
            url += `&duration_in_captivity_from=${search['duration_in_captivity_from']}`;
            url += `&duration_in_captivity_to=${search['duration_in_captivity_to']}`;
            url += `&sedated=${search['sedated']}`;
            url += `&age_from=${search['age_from']}`;
            url += `&age_to=${search['age_to']}`;
            url += `&position=${search['position']}`;            
            url += `&distance_from=${search['distance_from']}`;
            url += `&distance_to=${search['distance_to']}`;
            url += `&threshold_from=${search['threshold_from']}`;
            url += `&threshold_to=${search['threshold_to']}`;
            url += `&tone=${search['tone']}`;
            url += `&staircase=${search['staircase']}`;
            url += `&form=${search['form']}`;
            url += `&constants=${search['constants']}`;
            url += `&measurement_type=${search['measurement_type']}`;            
        }
        return url;
    }
    
    _readRequestedParameters() {
        var selectedYearRange = this.yearFilter.read();
        var captivityRange = this.durationInCaptivityFilter.read();
        var ageRange = this.ageFilter.read();
        var distanceRange = this.distanceFilter.read();
        var thresholdRange = this.thresholdFilter.read();
        var params = {
            // 'species': this.vernacularFilter.read(),
            'taxon': this.taxonFilter.read(),
            'method': this.methodFilter.read(),
            'publication': this.publicationFilter.read(),
            'facility': this.facilityFilter.read(),
            'from': selectedYearRange.from,
            'to': selectedYearRange.to,
            'medium': this.mediumFilter.read(),
            'sex': this.sexFilter.read(),
            'liberty': this.libertyFilter.read(),
            'lifestage': this.lifeStageFilter.read(),
            'duration_in_captivity_from': captivityRange.from,
            'duration_in_captivity_to': captivityRange.to,
            'sedated': this.sedatedFilter.read(),
            'age_from': ageRange.from,
            'age_to': ageRange.to,
            'position': this.positionFilter.read(),
            'distance_from': distanceRange.from,
            'distance_to': distanceRange.to,
            'threshold_from': thresholdRange.from,
            'threshold_to': thresholdRange.to,
            'tone': this.toneFilter.read(),
            'staircase': this.staircaseFilter.read(),
            'form': this.formFilter.read(),
            'constants': this.constantsFilter.read(),
            'measurement_type': this.measurementTypeFilter.read()
        };
        return params;
    }
    
    _reload(search=null) {
        var order_by = null;
        if (search) {
            order_by = 'vernacular_name_english'; // when applying filters, sort by species by default
            if (search['method'] && !search['species']) {
                order_by = 'measurement_method'; // when filtering only by method, sort by method
            } else if (search['publication'] && !search['species']) {
                order_by = 'citation_short'; // when filtering only by publication, sort by publication
            }
        }
        var url = "/advanced"
        if (order_by) {
            url += `?order_by=${order_by}`;
        }
        if (search) {
            url += `&species=${search['taxon']}`;
            url += `&taxon=${search['taxon']}`;
            url += `&method=${search['method']}`;
            url += `&publication=${search['publication']}`;
            url += `&facility=${search['facility']}`;
            url += `&from=${search['from']}`;
            url += `&to=${search['to']}`;
            url += `&medium=${search['medium']}`;
            url += `&sex=${search['sex']}`;
            url += `&liberty=${search['liberty']}`;
            url += `&lifestage=${search['lifestage']}`;
            url += `&duration_in_captivity_from=${search['duration_in_captivity_from']}`;
            url += `&duration_in_captivity_to=${search['duration_in_captivity_to']}`;
            url += `&sedated=${search['sedated']}`;
            url += `&age_from=${search['age_from']}`;
            url += `&age_to=${search['age_to']}`;
            url += `&position=${search['position']}`;            
            url += `&distance_from=${search['distance_from']}`;
            url += `&distance_to=${search['distance_to']}`;
            url += `&threshold_from=${search['threshold_from']}`;
            url += `&threshold_to=${search['threshold_to']}`;
            url += `&tone=${search['tone']}`;
            url += `&staircase=${search['staircase']}`;
            url += `&form=${search['form']}`;            
            url += `&constants=${search['constants']}`;
            url += `&measurement_type=${search['measurement_type']}`;
        }
        window.location.href=url;
    }
    
    _encodStr(rawStr) {
        return rawStr.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#'+i.charCodeAt(0)+';';
        });
    }
}

class OptionsFilter extends AdvancedFilter {
    constructor(api, name, label, options) {
        super(api);
        this.name = name;
        this.label = label;
        this.options = options;
    }
    
    render() {
        var selectedOptions = this._getSelectedOption(this.name);
        var checked = [];
        for (var i = 0; i < this.options.length; i++) {
            checked[i] = "";
            for (var o in selectedOptions) {
                if (selectedOptions[o].indexOf(this.options[i]) != -1) {
                    checked[i] = "checked";
                }
            }
        }
        var markup = `<div class="filter_label">${this.label}</div>`;
        for (var i = 0; i < this.options.length; i++) {
            markup += `<input style="margin-left: 1em;" class="${this.name}Checkbox" ${checked[i]} type="checkbox" value="${this.options[i]}" id="${this.options[i]}"><label class="filter_value" for="${this.options[i]}">${this.options[i]}</label><br/>`;
        }
        return markup;
    }
    
    read() {
        var resp = []; 
        var inputElements = document.getElementsByClassName(`${this.name}Checkbox`);
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                resp.push(inputElements[i].value);
            }
        }
        return resp.join(',');
    }
}

class BooleanFilter extends OptionsFilter {
    constructor(api, name, label) {
        var options = ['yes','no'];
        super(api, name, label, options);
    }    
}

