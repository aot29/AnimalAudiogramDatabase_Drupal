class Formatter {
    create_checkbox(name, value, css_class=null) {
	var checkbox_el = document.createElement("input");
	checkbox_el.type = "checkbox";
	checkbox_el.name = name;
	checkbox_el.value = value
	if (css_class) {
	    checkbox_el.classList.add(css_class);
	}
	return checkbox_el;	
    }

    create_binomial_name(species_name) {
	var binomial_name = document.createElement("span");
	var scf_name = document.createTextNode(species_name);
	var scf_span = document.createElement("span");
	scf_span.style.fontStyle="italic";
	scf_span.appendChild(scf_name)
	binomial_name.appendChild( scf_span);
	return binomial_name;
    }

    create_empty_results(text) {
	var resp = document.createElement("div");
	resp.style.fontStyle="italic";
	resp.style.marginLeft="3em";
	resp.appendChild(document.createTextNode(text));
        return resp;
    }
}

class Table_Formatter extends Formatter {
    constructor() {
	super();
    }

    create_table(css_class=null) {
	var table_el = document.createElement("table");
	if (css_class) {
	    table_el.classList.add(css_class);
	}
	return table_el;
    }

    create_row(css_class=null) {
	var row_el = document.createElement("tr");
	if (css_class) {
	    row_el.classList.add(css_class);
	}
	return row_el;	
    }

    /**
       Create table headers
       @paran content: String, header title
       @param css_class: String, css class selector
     */
    create_head(content, css_class=null, link=null) {
	var head_el = document.createElement("th");
	if (link && content) {
	    var a_el = document.createElement("a");
	    a_el.setAttribute('href', link);
	    a_el.appendChild(document.createTextNode(content));
	    head_el.appendChild(a_el);
	} else if (content) {
	    head_el.appendChild(document.createTextNode(content));
	}
	if (css_class) {
	    head_el.classList.add(css_class);
	}
	return head_el;	
    }

    create_cell(content, css_class=null, link=null, target=null) {
	var cell_el = document.createElement("td");
	if (css_class) {
	    cell_el.classList.add(css_class);
	}
	if (content && !link) {
	    cell_el.appendChild(document.createTextNode(content));
	}
	if (content && link) {
	    var a_el = document.createElement("a");
	    a_el.setAttribute('href', link);
            if (target) {
	        a_el.setAttribute('target', target);
            }
	    a_el.appendChild(document.createTextNode(content));
	    cell_el.appendChild(a_el);
	}
	return cell_el;	
    }
    
    create_citation_cell(content, doi) {
	var cell_el = document.createElement("td");
        var new_content = [];
	if (content && !doi) {
	    new_content.push(document.createTextNode(content));
	}
	if (content && doi) {
            content = content.replace(doi, '');
	    new_content.push(document.createTextNode(content));
	    var a_el = document.createElement("a");
            var link = "https://doi.org/{0}".format(doi)
	    a_el.setAttribute('href', link);
            a_el.setAttribute('target', '_blank');
            a_el.appendChild(document.createTextNode(doi));
	    new_content.push(a_el);
	}
        for (var i = 0; i < new_content.length; i++) {
            cell_el.appendChild(new_content[i]);
        }
	return cell_el;	
    }
}

class Layers_Table_Formatter extends Table_Formatter {
    /**
       Format a JSON object as a HTML table for layers view.

       @results list of json dicts containing the result of the query
       @return table element
     */
    constructor() {
	super();
    }
    
    render(results) {
	var table = this.create_table();
	table.classList.add("browse");
	var head_row = this.create_row();
	table.appendChild(head_row);
	head_row.appendChild( this.create_head("#") );
	head_row.appendChild( this.create_head("Species (English name)") );
	head_row.appendChild( this.create_head("Species (Latin name)") );
	head_row.appendChild( this.create_head("Method") );
	head_row.appendChild( this.create_head("Publication") );
        var c = 65
	for (var i in results) {
	    var entry = results[i];
	    var row = this.create_row();
	    table.appendChild(row);
            // row label
            var label = String.fromCharCode(c);
	    row.appendChild(this.create_cell(label));
            c++
	    // English name
	    row.appendChild(this.create_cell( entry.vernacular_name_english ));
	    // scientific name
    	    var species_name = this.create_binomial_name(entry.species_name);
	    var species_name_cell = this.create_cell();
	    species_name_cell.appendChild( species_name );
	    row.appendChild( species_name_cell );
	    // Method
	    row.appendChild(this.create_cell( entry.measurement_method ));
	    // citation
	    row.appendChild(this.create_cell( entry.citation_short ));
	}
	return(table);
    }
}

class List_Table_Formatter extends Table_Formatter {
    /**
       Format a JSON object as a HTML table for browsing.

       @results list of json dicts containing the result of the query
       @return table element
     */
    constructor() {
	super();
    }

    render_th(head_row) {
	head_row.appendChild( this.create_head("") );
	head_row.appendChild( this.create_head("Audiogram count", "audiogram_count") );
	head_row.appendChild( this.create_head("Species (English name)", "species_english_th", '/audiogrambase?order_by=vernacular_name_english') );
	head_row.appendChild( this.create_head("Species (Latin name)", "species_latin_th", '/audiogrambase?order_by=species_name') );
	head_row.appendChild( this.create_head("Method", null, '/audiogrambase?order_by=measurement_method') );
	head_row.appendChild( this.create_head("Publication", null, '/audiogrambase?order_by=citation_short') );
    }
    
    render(results) {
	var table = this.create_table();
	table.classList.add("browse");
	var head_row = this.create_row();
	table.appendChild(head_row);
        this.render_th(head_row);
	for (var i in results) {
	    var entry = results[i];
	    var row = this.create_row();
	    table.appendChild(row);
	    // checkbox
	    var checkbox = this.create_checkbox("display", entry.id);
	    var checkbox_cell = this.create_cell();
	    checkbox_cell.appendChild( checkbox );
	    row.appendChild( checkbox_cell );
            // Count
            var count = entry.id.toString().split(',').length;
	    row.appendChild(this.create_cell( count, "audiogram_count"));
	    // English name
	    row.appendChild(this.create_cell( entry.vernacular_name_english ));
	    // scientific name
    	    var species_name = this.create_binomial_name(entry.species_name);
	    var species_name_cell = this.create_cell();
	    species_name_cell.appendChild( species_name );
	    row.appendChild( species_name_cell );
	    // Method
	    row.appendChild(this.create_cell( entry.measurement_method ));
	    // citation
	    row.appendChild(this.create_cell( replace_special_chars(entry.citation_short )));
	}
	return(table);
    }
}


class Paginated_Table_Formatter extends List_Table_Formatter {
    /**
       Format a JSON object as a HTML table with pagination.

       @results list of json dicts containing the result of the query
       @return table element
     */
    
    constructor() {
	super();
	this.currentPage = 1;
	this.numberPerPage = 20;
	this.numberOfPages = 1;
    }
    
    render(result) {
	this.result = this.consolidate(result);
	this.numberOfPages = this.getNumberOfPages();
	this.currentPage = 1;
	return this.loadList();
    }

    /** Entries with the same values will be displayed in one row */
    consolidate(result) {
        var consolidated = [];
        for (var i = 0; i < result.length; i++) {
            var found = false;
            for (var j = 0; j < consolidated.length; j++) {
                if ( result[i].citation_short == consolidated[j].citation_short &&
                     result[i].measurement_method == consolidated[j].measurement_method &&
                     result[i].species_name == consolidated[j].species_name ) {
                    consolidated[j].id = consolidated[j].id.toString().concat(',', result[i].id);
                    found = true;
                    break;
                }
            }
            if (!found) {
                consolidated.push(result[i]);
            }
        }
        return consolidated;
    }
    
    getNumberOfPages() {
	return Math.ceil(this.result.length / this.numberPerPage);
    }

    previousPage() {
	this.currentPage -= 1;
	return this.loadList();
    }
    
    nextPage() {
	this.currentPage += 1;
	return this.loadList();
    }

    loadList() {
	var begin = (this.currentPage - 1) * this.numberPerPage;
	var end = begin + this.numberPerPage;
	var pageList = this.result.slice(begin, end);
	return super.render(pageList);
    }

}

class Advanced_Table_Formatter extends Paginated_Table_Formatter {
    render_th(head_row) {
	head_row.appendChild( this.create_head("") );
	head_row.appendChild( this.create_head("Audiogram count", "audiogram_count") );
	head_row.appendChild( this.create_head("Species (English name)", "species_english_th", '/advanced?order_by=vernacular_name_english') );
	head_row.appendChild( this.create_head("Species (Latin name)", "species_latin_th", '/advanced?order_by=species_name') );
	head_row.appendChild( this.create_head("Method", null, '/advanced?order_by=measurement_method') );
	head_row.appendChild( this.create_head("Publication", null, '/advanced?order_by=citation_short') );
    }
}

class Metadata_Table_Formatter extends Table_Formatter {
    /**
       Base class to render metadata as a table.

       @results json dict (not list) containing a single result of the query
       @return table element
     */
    constructor() {
	super();
    }
    
    render(result) {
	var table = this.create_table("metadata");
	var entry = result;
	for (var key in this.labels) {
	    if (entry[key] !== null) {
		var key_output = this.labels[key];
		var row = this.create_row();
		table.appendChild(row);
		var head = this.create_head(key_output, "key");
		row.appendChild(head);
		var cell = null;                
		if (key == 'species_name') {
		    cell = this.create_cell(entry[key], "species_name");
                } else if (key == "citation_long"){
                    cell = this.create_citation_cell(replace_special_chars(entry[key]), entry['DOI'])
		} else if (key == 'DOI') {
		    cell = this.create_cell(entry[key], null, "https://doi.org/{0}".format(entry[key]), "_blank");
		} else if(key.indexOf("in_meter") != -1) {
		    cell = this.create_cell("{0} m".format(entry[key]));			
		} else if(key.indexOf("in_decibel") != -1) {
		    cell = this.create_cell("{0} dB".format(entry[key]));			
		} else if(key.indexOf("in_decibel") != -1) {
		    cell = this.create_cell("{0} ms".format(entry[key]));
		} else if(key.indexOf("in_khz") != -1) {
		    cell = this.create_cell("{0} kHz".format(entry[key]));
		} else if(key.indexOf("in_month") != -1) {
		    cell = this.create_cell("{0} months".format(entry[key]));
                } else if(key.indexOf("citation") != -1) {
                    cell = this.create_cell(replace_special_chars(entry[key]));
                } else if(key.indexOf("threshold_determination_method") != -1) {
                    cell = this.create_cell("{0} %".format(entry[key]));
                } else if(key.indexOf("calibration") != -1) {
                    cell = this.create_cell(replace_special_chars(entry[key]));
		} else {
		    cell = this.create_cell(entry[key]);
		}
		row.appendChild(cell);
	    }
	}
	return(table);
    }
}

class Experiment_Metadata_Formatter extends Metadata_Table_Formatter {
    /**
       Render experiment metadata as a table.

       @results json dict (not list) containing a single result of the query
       @return table element
     */
    constructor() {
	super();

	this.labels = {
	    'number_of_measurements': "Measurements",
	    'facility_name': "Facility",
	    'position_of_animal': "Position of the animal",
	    'distance_to_sound_source_in_meter': "Distance to sound source",
	    'test_environment_description': "Test environment",
            'medium': "Medium",
	    'measurement_method': "Method",
	    'position_first_electrode': "1st electrode",
	    'position_second_electrode': "2nd electrode",
	    'position_third_electrode': "3rd electrode",
	    'year_of_experiment': "Year of experiment",
	    'background_noise_in_decibel': "Background noise",
	    'calibration': "Calibration",
	    'threshold_determination_method': "Threshold determination info",
	    'testtone_form_method': "Test Tone Form",
	    'testtone_presentation_staircase': "Staircase procedure",
	    'testtone_presentation_method_constants': "Method of Constants",
	    'testtone_presentation_sound_form': "Form of the sound",
	    'sedated': "Sedated",
	    'sedation_details': "Sedation details"
	}
    }
}

class Animal_Metadata_Formatter extends Metadata_Table_Formatter {
    /**
       Render animal metadata as a table.

       @results json dict (not list) containing a single result of the query
       @return table element
     */
    constructor() {
	super();

	this.labels = {
	    'individual_name': "Individual animal name",
	    'life_stage': "Life stage",
	    'sex': "Sex",
	    'age_in_month': "Age in months",
	    'liberty_status': "Status of liberty",
	    'captivity_duration_in_month': "Duration of captivity",
	    'biological_season': "Biological season"
	}
    }
}

class Publication_Metadata_Formatter extends Metadata_Table_Formatter {
    /**
       Render publication details as a table.

       @results json dict (not list) containing a single result of the query
       @return table element
     */
    constructor() {
	super();

	this.labels = {
	    'citation_long': "Source"
	}
    }
}


class Caption_Formatter extends Formatter {
    /**
       Render diagram caption.

       @results object containing the result of the query
       @return div element
     */
    render(id, entry) {
	var caption = document.createElement("div");
        
        var id_el = document.createElement("div");
	caption.appendChild(id_el);
        id_el.classList.add("audiogram_id");
	var a_el = document.createElement("a");
	a_el.setAttribute('href', `/audiogram?ids=${id}`);
	a_el.setAttribute('target', '_blank');
	a_el.appendChild(document.createTextNode(`Database Id: ${id}`))
        id_el.appendChild(a_el);

	var species_el = document.createElement("div");
	caption.appendChild(species_el);
	species_el.classList.add("binomial_name");
	var binomial_name = this.create_binomial_name(entry.species_name);
        if (entry.vernacular_name_english) {
	    species_el.appendChild(document.createTextNode(entry.vernacular_name_english))
	    species_el.appendChild(document.createTextNode(" ("))
	    species_el.appendChild(binomial_name)
	    species_el.appendChild(document.createTextNode(")"));
        } else {
	    species_el.appendChild(binomial_name);
        }

        var type_el = document.createTextNode(`Measurement type: ${entry.measurement_type}`);
	caption.appendChild(type_el);

	return(caption)
    }
}

