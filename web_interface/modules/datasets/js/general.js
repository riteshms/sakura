//Code started by Michael Ortega for the LIG
//August, 22nd, 2017


var global_ids = 0;
var file_lines = null;
var database_infos = null;
var datasets_tags_list = null;

function not_yet() {
    alert("not yet implemented");
}


function recover_datasets() {
    
    var database_id = window.location.search.substr(1).split("=")[1];
    //console.log(parseInt(database_id));
    ////////////TEMP////////////////////////
    sakura.common.ws_request('list_databases', [], {}, function (result) {
        if (result.length)
            database_id = result[0].database_id;
        else {
            alert("No database found !!!");
            return;
        }
    
    ////////////END TEMP////////////////////////
        sakura.common.ws_request('get_database_info', [parseInt(database_id)], {}, function (result) {
        
            console.log(result);
            //Filling dataset
            var body = $('#table_of_datasets').find('tbody');
            body.empty();
            result.tables.forEach( function(dataset, index) {
                console.log(dataset);
                var dataset_id = index;
                body.append('<tr>   <td>'+dataset.name+'</td><td>'+dataset.description+'</td> \
                                    <td align="right"> \
                                        <span title="Upload data in this dataset" class="glyphicon glyphicon-upload" style="cursor: pointer;" onclick="dataset_upload('+database_id+','+dataset_id+');"> </span> \
                                        <span title="Download the dataset" class="glyphicon glyphicon-download" style="cursor: pointer;" onclick="dataset_download('+database_id+','+dataset_id+');"> </span> \
                                        <span>&nbsp</span> \
                                        <span title="Look at the dataset" class="glyphicon glyphicon-eye-open" style="cursor: pointer;" onclick="dataset_look_at('+database_id+','+dataset_id+');"></span> \
                                        <span title="Analytics" class="glyphicon glyphicon-info-sign" style="cursor: pointer;" onclick="dataset_analytics('+database_id+','+dataset_id+');"></span> \
                                        <span>&nbsp</span> \
                                        <span title="delete" class="glyphicon glyphicon-remove" style="cursor: pointer;" onclick="dataset_delete('+database_id+','+dataset_id+');"></span> \
                                    </td>\
                            </tr>');
            });
            
            //Updating/emptying html elements
            $('#datasets_creation_name').val("");
            $('#datasets_creation_description').val("");
            $("#datasets_file_from_HD").val("");
            $('#datasets_creation_button').attr('onclick', 'datasets_send_new('+database_id+')');
        
            datasets_add_a_row('datasets_creation_from_scratch_columns');
            database_infos = result;
            
            //Ask for the existing tags
            sakura.common.ws_request('list_existing_datasets_tags', [database_id], {}, function (tags_list) {
                datasets_tags_list = [""];
                $.merge(datasets_tags_list, tags_list);
                console.log(datasets_tags_list);
            });
        });
    });
}


function dataset_upload(database_id, dataset_id) {
    not_yet();
}


function dataset_download(database_id, dataset_id) {
    not_yet();
}

function dataset_look_at(database_id, dataset_id) {
    var dataset     = database_infos.tables[dataset_id]
    
    //HEADER
    var header_txt  = "<h3>"+dataset.name+"</h3>";
    header_txt      += "<h8>"+dataset.description+"</h8>";
    $('#datasets_visu_header').html(header_txt);
    
    //BODY
    var head  = $('#datasets_visu_table_of_rows').find('thead');
    var body  = $('#datasets_visu_table_of_rows').find('tbody');
    head.empty()
    body.empty()
    
    var new_h_row = $(head[0].insertRow());
    (dataset.columns).forEach( function (item) {
        new_h_row.append("<th>"+item[0]+"</th>");
    });
    
    var new_b_row = $(body[0].insertRow());
    new_b_row.append("<td>Coming soon</td>");
    
    $('#datasets_visu_dataset_modal').modal();
}


function dataset_analytics(database_id, dataset_id) {
    not_yet();
}


function dataset_delete(database_id, dataset_id) {
    not_yet();
}


function datasets_alert(header_str, body_str) {
    var h = $('#datasets_alert_header');
    var b = $('#datasets_alert_body');
    h.html("<h3><font color=\"white\">"+header_str+"</font></h3>");
    b.html("<p>"+body_str+"</p>");
    $('#datasets_alert_modal').modal();
}