/**
   A class to connect to the audiogram API.
 */
class API_Client {
    
    constructor(API_URL) {
	this.API_URL = API_URL;
    }
    
    /**
       Decode the get parameter ids that is encoded in the URL, into an array of integer.

       @return array<int>;
     */
    static decode() {
        var param = decodeURI(location.search.split('ids=')[1]);
	if (param !== "undefined") return param.split(',');
	else return false;
    }

    /**
       Check if the SPL units of all audiograms are compatible,
       so that these audiogras can be displayed as layers on top of each other.

       @param ids comma separetd ids of audiograms
       @return boolean
     */
    is_compatible(ids) {
        var query = `${this.API_URL}is_compatible`
        query = this._add_param(query, 'ids');
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }

    /**Whether the audiogram been converted to current units.*/
    is_converted(id) {
        var query = `${this.API_URL}is_converted`
        if (id) {
            query += `?ids=${id}`;
        } else {
            query = this._add_param(query, 'ids');
        }
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       List audiograms in a summarized format, for layers view.

       @param ids comma separetd ids of audiograms
       @return json object containing the result of the query
     */
    list(ids) {
        var query = `${this.API_URL}list`
        query = this._add_param(query, 'ids');
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Summarize the data in the database.

       @return json object containing the result of the query
     */
    summary() {
        var query = `${this.API_URL}summary`
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       List audiograms in a summarized format, for browsing.

       @return json object containing the result of the query
     */
    browse() {
        var query = `${this.API_URL}browse`
        query = this._add_param(query, 'order_by');
        query = this._add_param(query, 'species');
        query = this._add_param(query, 'taxon');
        query = this._add_param(query, 'method');
        query = this._add_param(query, 'publication');
        query = this._add_param(query, 'facility');
        query = this._add_param(query, 'from');
        query = this._add_param(query, 'to');
        query = this._add_param(query, 'medium');
        query = this._add_param(query, 'sex');
        query = this._add_param(query, 'liberty');
        query = this._add_param(query, 'lifestage');
        query = this._add_param(query, 'duration_in_captivity_from');
        query = this._add_param(query, 'duration_in_captivity_to');
        query = this._add_param(query, 'sedated');
        query = this._add_param(query, 'age_from');
        query = this._add_param(query, 'age_to');
        query = this._add_param(query, 'position');
        query = this._add_param(query, 'distance_from');
        query = this._add_param(query, 'distance_to');
        query = this._add_param(query, 'threshold_from');
        query = this._add_param(query, 'threshold_to');
        query = this._add_param(query, 'tone');
        query = this._add_param(query, 'staircase');
        query = this._add_param(query, 'form');
        query = this._add_param(query, 'constants');
        query = this._add_param(query, 'measurement_type');
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }

    _add_param(query, param_name) {
        var param_value = decodeURI(location.search.split(`${param_name}=`)[1]);        
        param_value = param_value.split('&')[0];
        var separator = query.includes('?')? '&':'?';
        if (param_value) {
            query += `${separator}${param_name}=${param_value}`;
        }
        return query;
    }
    
    /**
       Get experiment metadata for requested audiogram(s)

       @id int - id of an experiment
       @return json object containing the result of the query
     */
    get_experiment(id) {
	var query = this.API_URL + "experiment?id=" + id;
	var json = httpGet(query);
        if (json != "") {
            var obj = JSON.parse(json);
            return(obj);
        } else {
            return null;
        }
    }
    
    /**
       Get all data requested audiogram

       @id int - id of an experiment
       @return json object containing the result of the query
     */
    get_download(id) {
	var query = this.API_URL + "download?id=" + id;
	var json = httpGet(query);
        if (json != "") {
            var obj = JSON.parse(json);
            csv = convertToCSV(obj);
            return(csv);
        } else {
            return null;
        }
    }
    
    convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }
    
    /**
       Get metadata for animal(s) involved in this experiment

       @id int - id of an experiment
       @return json object containing the result of the query
     */
    get_animal(id) {
	var query = this.API_URL + "animal?id=" + id;
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Get publication details for requested audiogram(s)

       @id int - id of an experiment
       @return json object containing the result of the query
     */
    get_publication(id) {
	var query = this.API_URL + "publication?id=" + id;
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Get caption for requested audiogram(s)

       @id int - id of an experiment
       @return json object containing the result of the query
     */
    get_caption(id) {
	var query = this.API_URL + "caption?id=" + id;
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }

    /**
       Get a list of species (latin names) in the database

       @return json object containing the result of the query
     */
    list_species() {
	var query = this.API_URL + "all_species";
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Get a full taxonomic the from the database

       @return json object containing the result of the query
     */
    taxonomy() {
	var query = this.API_URL + "taxonomy";
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Get a list of species (vernacular names) in the database

       @return json object containing the result of the query
     */
    list_species_vernacular() {
	var query = this.API_URL + "all_species_vernacular";
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Get a list of methods in the database

       @return json object containing the result of the query
     */
    list_measurement_methods() {
	var query = this.API_URL + "all_measurement_methods";
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Get a list of methods in the database

       @return json object containing the result of the query
     */
    list_parent_measurement_methods() {
	var query = this.API_URL + "parent_measurement_methods";
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Get a list of methods in the database

       @return json object containing the result of the query
     */
    list_tone_methods() {
	var query = this.API_URL + "all_tone_methods";
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Get a list of publications in the database

       @return json object containing the result of the query
     */
    list_publications() {
	var query = this.API_URL + "all_publications";
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
    
    /**
       Get a list of facilities in the database

       @return json object containing the result of the query
     */
    list_facilities() {
	var query = this.API_URL + "all_facilities";
	var json = httpGet(query);
        var obj = JSON.parse(json);
        return(obj);
    }
}
