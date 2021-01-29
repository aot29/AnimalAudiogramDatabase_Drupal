function syncTaxa() {
    var selected_vf = filter.vernacularFilter.read();
    filter.taxonFilter.set(selected_vf);
}

function syncVernacular() {
    var selected_tf = filter.taxonFilter.read();
    filter.vernacularFilter.set(selected_tf);
}

class MeasurementTypeFilter extends AdvancedFilter {
    constructor(api, name, label, options) {
        super(api);
        this.name = name;
        this.label = label;
        this.options = options; 
    }
    
    render() {
        // var types = ['auditory threshold', 'critical ratio', 'critical bandwidth', 'time period of integration', 'TTS - Temporary Threshold Shift', 'PTS - Permanent Threshold Shift', 'signal duration test'];
        var types = ['auditory threshold', 'critical ratio', 'TTS - Temporary Threshold Shift', 'signal duration test'];
        var selectedOptions = this._getSelectedOption('measurement_type');
        var options = "";
        for (var t in types) {
            for (var o in selectedOptions) {
                var checked = "";
                if (selectedOptions[o] == types[t]) {
                    checked = "checked";
                    break;
                }
            }
            options += `
                   <input ${checked} 
                      style="margin-left: 1em;" 
                      type="checkbox" 
                      class="measurementTypeCheckbox" 
                      value="${types[t]}" 
                      id="measurement_type_${t}">
                   <label class="filter_value" for="measurement_type_${t}">${types[t]}</label><br/>`
        }
        var markup = `
        <label class="filter_label" for="vernacular_filter">Measurement type</label>
        ${options}`;
        return markup;
    }

    read() {
        var resp = []; 
        var inputElements = document.getElementsByClassName('measurementTypeCheckbox');
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                resp.push(inputElements[i].value);
            }
        }
        return resp.join(',');
    }
}

class VernacularNameFilter extends AdvancedFilter {

    render() {
        var taxa = this.api.list_species_vernacular();
        var selectedOptions = this._getSelectedOption('species');
        // console.log(selectedOptions);
        var options = "<option></option>";
        for (var t in taxa) {
            for (var o in selectedOptions) {
                var selected = "";
                if (selectedOptions[o] == taxa[t].ott_id) {
                    selected = "selected";
                    break;
                }
            }
            if (taxa[t].total != 0) { // taxa[t].total is the number of taxa, not the number of experiments/audiograms
                options += `<option value="${taxa[t].ott_id}" ${selected}>${taxa[t].vernacular_name_english}</option>`;
            }
        }
        var markup = `
        <label class="filter_label" for="vernacular_filter">Species (English name)</label>
        <em>Select multiple entries with the Ctlr and Shift keys</em>
        <select id="vernacular_filter" multiple size="12" onChange="syncTaxa()">${options}</select>`;
        return markup;
    }

    /** Read (multiple) selected species from pulldown */
    read() {
        var resp = [];
        var speciesFilterEl = document.getElementById("vernacular_filter");
        var speciesOptions = speciesFilterEl.options;
        if (speciesFilterEl.selectedIndex !== -1) {
            var selectedSpecies = speciesOptions[speciesFilterEl.selectedIndex].value
            for (var i = 0; i < speciesOptions.length; i++) {
                var opt = speciesOptions[i];
                if (opt.selected) {
                    resp.push(opt.value);
                }
            }
        }
        return resp.join(',');
    }
    
    set(values) {
        var vals = values.split(',');
        var speciesFilterEl = document.getElementById("vernacular_filter");
        var speciesOptions = speciesFilterEl.options;
        for (var i = 0; i < speciesOptions.length; i++) {
            var opt = speciesOptions[i];
            opt.selected = false;
            for (var j = 0; j < vals.length; j++) {
                if (opt.value == vals[j]) {
                    opt.selected = true;
                }
            }
        }
    }
}


class TaxonFilter extends AdvancedFilter {
    /** Render species pulldown using JQuery, so that it can be rendered in italics */
    render() {
        var taxa = this.api.taxonomy();
        // console.log(taxa);
        var selectedOptions = this._getSelectedOption('taxon');
        var options = "<option></option>"
        for (var i = 0; i < taxa.length; i++) {
            var t1 = taxa[i];
            // class
            if (t1.rank == "class") {
                options += `<optgroup label="${t1.unique_name}">`;
                // order
                for (var j = 0; j < taxa.length; j++) {
                    var t2 = taxa[j];
                    if (t2.parent == t1.ott_id) {
                        options += `<optgroup label="&nbsp;&nbsp;${t2.unique_name}">`;
                        // family
                        for (var k = 0; k < taxa.length; k++) {
                            var t3 = taxa[k];
                            if (t3.parent == t2.ott_id) {
                                options += `<optgroup label="&nbsp;&nbsp;&nbsp;&nbsp;${t3.unique_name}">`;
                                // species
                                for (var l = 0; l < taxa.length; l++) {
                                    var t4 = taxa[l];
                                    if (t3.lft < t4.lft && t3.rgt > t4.rgt && t4.rank == "species") {
                                        for (var o in selectedOptions) {
                                            var selected = "";
                                            if (selectedOptions[o] == t4.ott_id) {
                                                selected = "selected";
                                                break;
                                            }
                                        }
                                        options += `<option style="font-style: italic;" value="${t4.ott_id}" ${selected}>&nbsp;&nbsp;${t4.unique_name}</option>`;
                                    }
                                }
                                options += '</optgroup>';
                            }
                        }
                        options += '</optgroup>';
                    }
                    options += '</optgroup>';
                }
            }
        }
        var markup = `
        <label class="filter_label" for="vernacular_filter">Taxon</label>
        <em>Select multiple entries with the Ctlr and Shift keys</em>
        <select id="taxon_filter" multiple size="12" onChange="syncVernacular()">${options}</select>`
        return markup;
    }
    
    read() {
        var resp = [];
        var speciesFilterEl = document.getElementById("taxon_filter");
        var speciesOptions = speciesFilterEl.options;
        if (speciesFilterEl.selectedIndex !== -1) {
            var selectedSpecies = speciesOptions[speciesFilterEl.selectedIndex].value
            for (var i = 0; i < speciesOptions.length; i++) {
                var opt = speciesOptions[i];
                if (opt.selected) {
                    resp.push(opt.value);
                }
            }
        }
        return resp.join(',');
    }

    set(values) {
        var vals = values.split(',');
        var speciesFilterEl = document.getElementById("taxon_filter");
        var speciesOptions = speciesFilterEl.options;            
        for (var i = 0; i < speciesOptions.length; i++) {
            var opt = speciesOptions[i];

            opt.selected = false;
            for (var j = 0; j < vals.length; j++) {
                if (opt.value == vals[j]) {
                    opt.selected = true;
                }
            }
        }
    }
}


class MeasurementMethodFilter extends AdvancedFilter {
    render() {
        var methods = this.api.list_measurement_methods(); 
        var selectedOptions = this._getSelectedOption('method');
        var options_behavioral = ""
        for (var i = 0; i < methods.length; i++) {
            var m = methods[i];
            if (m.method_name.includes("behavioral")) {
                var method_name = m.method_name.split(':')[1].trim();
                var checked = "";
                for (var o in selectedOptions) {
                    if (selectedOptions[o] == m.method_id) {
                        checked = "checked";
                        break;
                    }
                }
                options_behavioral += `<input ${checked} style="margin-left: 1em;" type="checkbox" class="methodCheckbox" value="${m.method_id}" id="method_${m.method_id}"><label class="filter_value" for="method_${m.method_id}2">${method_name}</label><br/>`
            }
        }
        var options_electro = ""
        for (var i = 0; i < methods.length; i++) {
            var m = methods[i];
            if (m.method_name.includes("electrophysiological")) {
                var method_name = m.method_name.split(':')[1].trim();
                var checked = "";
                for (var o in selectedOptions) {
                    if (selectedOptions[o] == m.method_id) {
                        checked = "checked";
                        break;
                    }
                }
                options_electro += `<input ${checked} style="margin-left: 1em;" type="checkbox" class="methodCheckbox" value="${m.method_id}" id="method_${m.method_id}"><label class="filter_value" for="method_${m.method_id}2">${method_name}</label><br/>`
            }
        }
        var markup = `
            <label class="filter_label" for="method_filter">Measurement method</label>
            <em>Behavioral</em><br/>${options_behavioral}
            <em>Electrophysiological</em><br/>${options_electro}
        `;
        return markup;
    }

    read() {
        var resp = []; 
        var inputElements = document.getElementsByClassName('methodCheckbox');
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                resp.push(inputElements[i].value);
            }
        }
        return resp.join(',');
    }
}


class PublicationFilter extends AdvancedFilter {
    render() {
        var publications = this.api.list_publications();
        var selectedOptions = this._getSelectedOption('publication');
        var options = "<option></option>";
        for (var p in publications) {
            var selected = "";
            for (var o in selectedOptions) {
                if (selectedOptions[o] == publications[p].id) {
                    selected =  "selected";
                    break;
                }
            }
            var citation_short = this._encodStr(replace_special_chars(publications[p].citation_short));
            options += `<option value="${publications[p].id}" ${selected}>${citation_short}</option>`;
        }
        var markup = `
        <label class="filter_label" for="publication_filter">Publication</label>
        <em>Select multiple entries with the Ctlr and Shift keys</em>
        <select id="publication_filter" multiple size="12">${options}</select>
        `;
        return markup;
    }

    read() {
        var resp = [];
        var filterEl = document.getElementById("publication_filter");
        var options = filterEl.options;
        if (filterEl.selectedIndex !== -1) {
            var selected = options[filterEl.selectedIndex].value
            for (var i = 0; i < options.length; i++) {
                var opt = options[i];
                if (opt.selected) {
                    resp.push(opt.value);
                }
            }
        }
        return resp.join(',');
    }
}


class FacilityFilter extends AdvancedFilter {
    render() {
        var facilities = this.api.list_facilities();
        var selectedOptions = this._getSelectedOption('facility');
        var options = "<option></option>";
        for (var p in facilities) {
            if (facilities[p].name) {
                var selected = "";
                for (var o in selectedOptions) {
                    if (selectedOptions[o] == facilities[p].id) {
                        selected =  "selected";
                    }
                }
                var name = this._encodStr(replace_special_chars(facilities[p].name));
                options += `<option value="${facilities[p].id}" ${selected}>${replace_special_chars(name)}</option>`;
            }
        }
        var markup = `
        <label class="filter_label" for=facilities_filter">Facility</label>
        <em>Select multiple entries with the Ctlr and Shift keys</em>
        <select id="facilities_filter" multiple size="15">${options}</select>
        `;
        return markup;
    }

    read() {
        var resp = [];
        var filterEl = document.getElementById("facilities_filter");
        var options = filterEl.options;
        if (filterEl.selectedIndex !== -1) {
            var selected = options[filterEl.selectedIndex].value
            for (var i = 0; i < options.length; i++) {
                var opt = options[i];
                if (opt.selected) {
                    resp.push(opt.value);
                }
            }
        }
        return resp.join(',');
    }
}

class YearFilter extends AdvancedFilter {
    render() {
        var from = this._getSelectedOption('from');
        if (from == 'undefined') from="";
        var to = this._getSelectedOption('to');
        if (to == 'undefined') to="";
        var markup = `
            <div class="filter_label">Year of experiment</div>
            from: <input type="text" id="from_year" size="4" placeholder="YYYY" value="${from}"/> to: <input type="text" id="to_year" placeholder="YYYY" value="${to}" size="4"/> 
        `;
        return markup;
    }

    read() {
        var from = document.getElementById("from_year").value;
        var to = document.getElementById("to_year").value;
        var resp = Object();
        resp.from = from;
        resp.to = to;
        return resp;
    }
}

class MediumFilter extends OptionsFilter {
    constructor(api) {
        var name = 'medium';
        var label = 'Medium';
        var options = ['air', 'water'];
        super(api, name, label, options);
    }
}


class DurationInCaptivityFilter extends AdvancedFilter {
    render() {
        var from = this._getSelectedOption('duration_in_captivity_from');
        if (from == 'undefined') from="";
        var to = this._getSelectedOption('duration_in_captivity_to');
        if (to == 'undefined') to="";
        var markup = `
            <div class="filter_label">Duration in captivity (months)</div>
            from: <input type="text" id="from_captivity" size="4" value="${from}"/> to: <input type="text" id="to_captivity" placeholder="" value="${to}" size="4"/> 
        `;
        return markup;
    }

    read() {
        var from = document.getElementById("from_captivity").value;
        var to = document.getElementById("to_captivity").value;
        var resp = Object();
        resp.from = from;
        resp.to = to;
        return resp;
    }
}

class AgeFilter extends AdvancedFilter {
    render() {
        var from = this._getSelectedOption('age_from');
        if (from == 'undefined') from="";
        var to = this._getSelectedOption('age_to');
        if (to == 'undefined') to="";
        var markup = `
            <div class="filter_label">Age of the animal (months)</div>
            from: <input type="text" id="age_from" size="4" placeholder="" value="${from}"/> to: <input type="text" id="age_to" value="${to}" size="4"/> 
        `;
        return markup;
    }

    read() {
        var from = document.getElementById("age_from").value;
        var to = document.getElementById("age_to").value;
        var resp = Object();
        resp.from = from;
        resp.to = to;
        return resp;
    }
}

class SexFilter extends AdvancedFilter {
    render() {
        var selectedOptions = this._getSelectedOption('sex');
        // console.log(selectedOptions);
        var female_checked = "";
        var male_checked = ""; 
        for (var o in selectedOptions) {
            if (selectedOptions[o].indexOf("female") != -1) {
                female_checked =  "checked";
            }
            if (selectedOptions[o].indexOf("male") != -1 && selectedOptions[o].indexOf("female") == -1) {
                male_checked = "checked";
            }
        }
        var markup = `
            <div class="filter_label">Sex</div>
            <input style="margin-left: 1em;" class="sexCheckbox" ${female_checked} type="checkbox" value="female" id="female"><label class="filter_value" for="female">female</label><br/>
            <input style="margin-left: 1em;" class="sexCheckbox" ${male_checked} type="checkbox" value="male" id="male"><label class="filter_value" for="male">male</label><br/>
        `;
        return markup;
    }

    read() {
        var resp = []; 
        var inputElements = document.getElementsByClassName('sexCheckbox');
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                resp.push(inputElements[i].value);
            }
        }
        return resp.join(',');
    }
}

class LibertyFilter extends OptionsFilter {
    constructor(api) {
        var name = 'liberty';
        var label = 'Liberty status';
        var options = ['captive', 'stranded', 'wild'];
        super(api, name, label, options);
    }
}

class LifeStageFilter extends AdvancedFilter {
    render() {
        var selectedOptions = this._getSelectedOption('lifestage');
        var juvenile_checked = "";
        var subadult_checked = "";
        var adult_checked = "";
        for (var o in selectedOptions) {
            if (selectedOptions[o].indexOf("juvenile") != -1) {
                juvenile_checked =  "checked";
            }
            if (selectedOptions[o].indexOf("sub-adult") != -1) {
                subadult_checked =  "checked";
            }
            if (selectedOptions[o].indexOf("adult") != -1 && selectedOptions[o].indexOf("sub-adult") == -1) {
                adult_checked =  "checked";
            }
        }
        var markup = `
            <div class="filter_label">Life stage</div>
            <input style="margin-left: 1em;" class="lifestageCheckbox" ${juvenile_checked} type="checkbox" value="juvenile" id="juvenile"><label class="filter_value" for="juvenile">juvenile</label><br/>
            <input style="margin-left: 1em;" class="lifestageCheckbox" ${subadult_checked} type="checkbox" value="sub-adult" id="sub-adult"><label class="filter_value" for="sub-adult">sub-adult</label><br/>
            <input style="margin-left: 1em;" class="lifestageCheckbox" ${adult_checked} type="checkbox" value="adult" id="adult"><label class="filter_value" for="adult">adult</label><br/>
        `;
        return markup;
    }
    
    read() {
        var resp = []; 
        var inputElements = document.getElementsByClassName('lifestageCheckbox');
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                resp.push(inputElements[i].value);
            }
        }
        return resp.join(',');
    }
}

class PositionFilter extends AdvancedFilter {
    render() {
        var selectedOption = this._getSelectedOption('position');
        var options = ['in-air and underwater','totally underwater', 'head just below water surface', 'head half out of water', 'outside of the water', 'totally above water'];
        var checked = [];
        for (var i = 0; i < options.length; i++) {
            checked[i] = (selectedOption.indexOf(options[i]) != -1)? "checked":"";
        }
        var markup = `<div class="filter_label">Position of the animal</div>`;
        for (var i = 0; i < options.length; i++) {
            markup += `<input style="margin-left: 1em;" class="positionCheckbox" ${checked[i]} type="checkbox" value="${options[i]}" id="${options[i]}"><label class="filter_value" for="${options[i]}">${options[i]}</label><br/>`;
        }
        return markup;
    }
    
    read() {
        var resp = []; 
        var inputElements = document.getElementsByClassName('positionCheckbox');
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                resp.push(inputElements[i].value);
            }
        }
        return resp.join(',');
    }
}

class DistanceFilter extends AdvancedFilter {
    render() {
        var from = this._getSelectedOption('distance_from');
        if (from == 'undefined') from="";
        var to = this._getSelectedOption('distance_to');
        if (to == 'undefined') to="";
        var markup = `
            <div class="filter_label">Distance to sound source (m)</div>
            from: <input type="text" id="distance_from" size="4" placeholder="" value="${from}"/> to: <input type="text" id="distance_to" value="${to}" size="4"/> 
        `;
        return markup;
    }

    read() {
        var from = document.getElementById("distance_from").value;
        var to = document.getElementById("distance_to").value;
        var resp = Object();
        resp.from = from;
        resp.to = to;
        return resp;
    }
}

class ThresholdFilter extends AdvancedFilter {
    render() {
        var from = this._getSelectedOption('threshold_from');
        if (from == 'undefined') from="";
        var to = this._getSelectedOption('threshold_to');
        if (to == 'undefined') to="";
        var markup = `
            <div class="filter_label">Threshold determination info (%)</div>
            from: <input type="text" id="threshold_from" size="4" placeholder="" value="${from}"/> to: <input type="text" id="threshold_to" value="${to}" size="4"/> 
        `;
        return markup;
    }

    read() {
        var from = document.getElementById("threshold_from").value;
        var to = document.getElementById("threshold_to").value;
        var resp = Object();
        resp.from = from;
        resp.to = to;
        return resp;
    }
}

class ToneFilter extends AdvancedFilter {
    render() {
        var methods = this.api.list_tone_methods(); 
        var selectedOptions = this._getSelectedOption('tone');
        var options = ""
        for (var i = 0; i < methods.length; i++) {
            var m = methods[i];
            var checked = "";
            for (var o in selectedOptions) {
                if (selectedOptions[o] == m.method_id) {
                    checked = "checked";
                    break;
                }
            }
            options += `<input ${checked} style="margin-left: 1em;" type="checkbox" class="toneCheckbox" value="${m.method_id}" id="tone_${m.method_id}"><label class="filter_value" for="tone_${m.method_id}2">${m.method_name}</label><br/>`
        }
        var markup = `
            <label class="filter_label" for="method_filter">Form of the tone</label>
            ${options}
        `;
        return markup;
    }

    read() {
        var resp = []; 
        var inputElements = document.getElementsByClassName('toneCheckbox');
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                resp.push(inputElements[i].value);
            }
        }
        return resp.join(',');
    }
}

class SedatedFilter extends BooleanFilter {
    constructor(api) {
        var name = 'sedated';
        var label = 'Sedated';
        super(api, name, label);
    }
}

class StaircaseFilter extends BooleanFilter {
    constructor(api) {
        var name = 'staircase';
        var label = 'Staircase procedure';
        super(api, name, label);
    }
}

class FormFilter extends OptionsFilter {
    constructor(api) {
        var name = 'form';
        var label = 'Form of the sound';
        var options = ['click','pipe trains','prolonged','SAM (sinusoidal amplitude modulation)'];
        super(api, name, label, options);
    }
}

class ConstantsFilter extends BooleanFilter {
    constructor(api) {
        var name = 'constants';
        var label = 'Method of Constants';
        super(api, name, label);
    }
}

