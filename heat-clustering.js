var userMap;
var m;
var control;
var fileInput;
var userCSV;
var callCsvFunctions = true;
var print_pdf;
var createdPolygon ;
var polygonLayer;
var layergroup;
var delPolygon ;
var featuresData =[];
var serviceUrl ='http://backend.tplmaps.com:8182/hc/polygons';
var dataTB = '';
var marker = '';



var map = {
    
    addCluster: function (csv) {
       
            this.clear();

            var myCallback = function (data) {
                userCSV = data;
                $("#spin").hide();
                $("#message").attr('class', 'text-success');
                $("#message").text("Marker layer Created");   
                userMap.fitBounds(data.getBounds());       
            };
            
            var csvoptions = {
                file: csv,
                parseOptions: {},
                clusterOptions:{
                    spiderfyOnMaxZoom: false, 
                    removeOutsideVisibleBounds: true,
                    showCoverageOnHover: true, 
                    zoomToBoundsOnClick: true, 
                    polygonOptions : 
                    { 
                      weight: 1, 
                      color: 'green',
                      opacity: 0.6 
                    }
                },
                map: userMap,
                callback: myCallback
            }

        if(callCsvFunctions){
            return userCSV = TPLMaps.overlays.csvMarkerCluster(csvoptions);
        }
        else{
            return userCSV = TPLMaps.overlays.excelClusterMap(csvoptions);
        }
       
    },
    addHeatMap: function (csv) {

            this.clear();
        
            var myCallback = function (data) {
                userCSV = data;   
                $("#message").attr('class', 'text-success');
                $("#message").text("HeatLayer Created");   
            };
            var parseOptions = {
    
                radius: 10,
                blur: 10,
            };
            if(($('#radius').val().length) > 0){
                var radius = $('#radius').val();
                if(isNaN(radius)){
                    alert(" not a valid value");
                    invalidData = true;
                 }else{
                    parseOptions.radius =  JSON.parse(radius);
                 }
                
            } 
            else  { parseOptions.radius = 10; }
        
            if($('#blur').val().length > 0){
                var blur = $('#blur').val();
                if(isNaN(blur)){
                    alert(" not a valid value");
                    invalidData = true;
                 }else{
                    parseOptions.blur =  JSON.parse(blur);
                 }
               
            } else  { parseOptions.blur = 10; }
        
            var heatoptions = {
                file: csv,
                parseOptions: parseOptions,
                map: userMap,
                callback: myCallback
            }
        if(callCsvFunctions){
            return userCSV = TPLMaps.overlays.csvHeatMap(heatoptions);
        }
        else{
            return userCSV = TPLMaps.overlays.excelHeatMap(heatoptions);
        }
        
        
    },
    addprintWidget: function () {
       
            var options = {
                title:  'Export To PDF',
                position: 'topleft',
                tileWait: 500,
                filename:  'My Map',
                hidden: false,
                hideControlContainer: false,
                // hideClasses: ['leaflet-left', 'leaflet-top'], 
                hideClasses: ['leaflet-left', 'leaflet-top', 'cover'],
                customWindowTitle: ($("#filename").val() == "") ? 'My Map' : $("#filename").val(),
                spinnerBgColor: "#0DC5C1",
                customSpinnerClass: "epLoader",
                map: userMap
            };
            print_pdf = TPLMaps.widget.addPrintWidgetPdf(options);
            // $("#btnSave").attr("disabled", true);
        
        },

    clear: function () {
        if (userCSV != undefined && userCSV != "") {
            userMap.removeLayer(userCSV);
        }
    },

    clearWidget: function () {
        $("#name").val('');
        $("#severity").val('');
        $("#description").val('');
        reqParam = '';
        polygonLayer ='';
        createdPolygon ='';
    },

    savePolygon: function(){
        var options = {
            sticky: true,
            opacity: 0.9,
            direction: 'auto',
            permanent: true
        }
        var reqParam = {};
        var e1 = document.getElementById("inputGroupSelect02");
        if($("#name").val().length>0 && $("#description").val().length>0 && createdPolygon!=undefined && createdPolygon!=''){
            options.label = $("#name").val();
            reqParam.name = $("#name").val();
            reqParam.description = $("#description").val();
            reqParam.severityLevel = e1.options[e1.selectedIndex].value;
            reqParam.polygon = createdPolygon;
            options.geomObject = polygonLayer;

            var response = addPolygonAjax(JSON.stringify(reqParam));
            // var response = addpolygon(JSON.stringify(reqParam));
            // loadPolygons();
           
            userMap.removeLayer(polygonLayer);
            polygonLayer ='';
            loadPolygonAjax();
            
        } else {
            alert('pease select all the necessary fields');
        }
    }

} //end map

function loadTabularData(){

    let tableHtml = '';
        tableHtml += '<table id="example" class="display nowrap" style="width:100%">';
        tableHtml+='<thead>';
        tableHtml+='<tr>';
        tableHtml+= '<th>Sr #</th>';
        tableHtml+= '<th>Status</th>';
        tableHtml+= '<th>Patient Name</th>';
        tableHtml+= '<th>Report Number</th>';
        tableHtml+= '<th>Treatment Place</th>';
        tableHtml+= '<th>Contact</th>';
        tableHtml+= '<th>CNIC</th>';
        tableHtml+= '<th>Date Repoted</th>';
        tableHtml+= '</tr>';
        tableHtml+= '</thead>';
        tableHtml+= '<tbody></tbody>';
        tableHtml+= '</table>'
        $("._details").append(tableHtml);

        $.ajax({
            'url': "http://backend.tplmaps.com:8182/hc/locations",
            'method': "GET",
            'contentType': 'application/json'
        }).done( function(data) {

                var html = "";
                response =  data;
                for (var i=0; i < response.length; i++)
                {
                    html += "<tr id='tablerow_"+response[i]['id']+"' data-lat='"+response[i]['latitude']+"' data-long='"+response[i]['longitude']+"'>";
                    html +=     "<td>"+response[i]['id']+"</td>";
                    html +=     "<td>"+response[i]['status']+"</td>";
                    html +=     "<td>"+response[i]['name']+"</td>";
                    html +=     "<td>"+response[i]['report_number']+"</td>";
                    html +=     "<td>"+response[i]['treatment_place']+"</td>";
                    html +=     "<td>"+response[i]['contact']+"</td>";
                    html +=     "<td>"+response[i]['cnic']+"</td>";;
                    html +=     "<td>"+response[i]['creation_date']+"</td>";
                    // if (response[i]['updated_at'] == null)
                    //     html +=     "<td></td>";
                    // else
                    //     html +=     "<td>"+jQuery.dateFormat.date(response[i]['updated_at'], "dd-MMM-yy hh:mm a")+"</td>";
                    html += "</tr>";    
                    
                }
                
                // $("#page-length-option tbody").html(html);
                // console.log(html)
                $("#example tbody").html(html)


            dataTB = $('#example').dataTable({
                "lengthMenu": [
                        [10, 25, 50, -1],
                        [10, 25, 50, "All"]
                ],
                "aaSorting": [[ 6, "desc" ]]
            });
        })
    }
window.onload = function () 
{

     if (localStorage.hasOwnProperty('isLoggedin') && localStorage.getItem('isLoggedin') == "true") {
            console.log('no redirection will happen');
            // window.location.href = '/heatmap-clustring-js-api-beta/?api_key=$2a$10$FIC4ZAY4wHH3a75k4QuukuPuoU8gYloZcHXeDxb0E3fCVAYD6fSfy'
        } 
    else {
            window.location.href = '/heatmap-clustring-js-api/login.html'
            // console.log('no redirection');

            // alert("please provide a valid email and password to login!")

        }
    var idleTime = 0;
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });

    function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 19) { // 20 minutes
            // alert('page is goin to reload')
            localStorage.clear()
            window.location.reload();
        }
    }
    $("#legend-btn").on('click', function(){

        // alert($("#example tbody tr").length )
        if($("#example tbody tr").length <1){

                dataTB.fnDestroy()

            $('#example tbody').empty();
            loadTabularData();
        }
        $(".map-title").toggle();


    });
    loadTabularData();

    // $('#example').DataTable( {
    //     ajax: {
    //             'url': "http://backend.tplmaps.com:8182/hc/locations",
    //             'type': "GET",
    //             'dataType': 'json',
    //         },        
    //     deferRender:    true,
    //     scrollY:        200,
    //     scrollCollapse: true,
    //     scroller:       true
    // } );


    
        $("body").on("click", "#example tbody tr", function() {
        // $("#example tbody tr").click(function (){

            let id = $(this).attr('id').split('_');
            id = id[1]
            // console.log(id);

            let html ='';
            html+= '<div id="model_'+id+'" class="modal" tabindex="-1" role="dialog">';
            html+= '<div class="modal-dialog" role="document">';
            html+=  '<div class="modal-content">';
            html+=  '<div class="modal-header">';
            html+=  '<h5 class="modal-title">Confirm or Decline Case</h5>';
            html+=  '<button id="modalbtn_'+id+'" type="button" class="close" data-dismiss="modal" aria-label="Close">';
            html+=  '<span aria-hidden="true">&times;</span>';
            html+= '</button>';
            html+= '</div>';
            html+= '<div class="modal-body">';
            html+= '<p>Please mark this Covid-19 case confirm or decline</p>';
            html+= '</div>';
            html+= '<div class="modal-footer">';
            html+= '<button id="modelbtn_'+id+'" type="button" class="btn btn-primary submit_case" value="approved">Confirm</button>';
            html+= '<button id="modelbtn1_'+id+'" type="button" class="btn btn-secondary submit_case" data-dismiss="modal" value="denied">Decline</button>';
             html+= '</div>';
            html+= '</div>';
            html+= '</div>';
            html+= '</div>';
            // console.log(html);

            $("body").append(html);



            

            // if ($('#lat').val().length > 0 && $('#lng').val().length > 0 && $('#icon').val().length > 0 && $('#labelText').val().length > 0) 
            //     $("#tablerow_"+id).data("long")
            if (marker)
                userMap.removeLayer(marker)

                var option = {
                    lat: $("#tablerow_"+id).data("lat"), //33.6413459,
                    lng: $("#tablerow_"+id).data("long"), //72.9873808,
                    icon: 'https://image.flaticon.com/icons/png/128/787/787535.png',
                    canvasPadding: 0.0,
                    map: map
                };
                console.log(option)
                marker = TPLMaps.overlays.point(option);

                var zoomOptions = {
                        zoom: 12,
                        lat: $("#tablerow_"+id).data("lat"),
                        lng: $("#tablerow_"+id).data("long"),
                        map: userMap
            };

            // TPLMaps.map.setCenterZoom(zoomOptions);
                userMap.setView(marker.getLatLng());
                var options = {
                    map: userMap,
                    geomObject: marker
                }

                TPLMaps.overlays.addToMap(options);

            $(".modal").show();

        }); 

        $("body").on("click", ".modal_close", function() {

            let id = $(this).attr('id').split('_');
            console.log(id[1])
            $("#model_"+id[1]).remove();
            // if (marker)
            //     userMap.removeLayer(marker)
        }); 

         $("body").on("click", ".close", function() {

            let id = $(this).attr('id').split('_');
            $("#model_"+id[1]).remove();
            // if (marker)
            //     userMap.removeLayer(marker)

        }); 

        $("body").on("click", ".submit_case", function() {
        // $("#example tbody tr").click(function (){
            let status = $(this).val();
            let id = $(this).attr('id').split('_');
            // alert(id)
            data ={'id': id[1],
                    'status': status}
                    console.log(JSON.stringify(data))
        //     $.ajax({
        //     'url': "http://backend.tplmaps.com:8182/hc/location",
        //     'method': "PUT",
        //     'data': data,
        //     'contentType': 'application/json'
        // }).done( function(data) {
        //     alert(data)
        // })

        $.ajax({
                url: 'http://backend.tplmaps.com:8182/hc/location',
                type: 'PUT',
                data: JSON.stringify(data),
                contentType: 'application/json',
                // async: true,
                // beforeSend: function(xhr) {
                //     xhr.setRequestHeader("Authorization", "Basic " + btoa($("#username").val() + ":" + $("#password").val()));
                // },
                success: function(data) {
                    console.log(data)
                    alert(data.msg)

                    $("#example tbody").empty();
                },
                error: function(error) {
                    // console.log('status', error.status)
                    console.log('message', error.responseText)
                    alert("There is an error occured while updating status, please try again")
                    // $("#username").val('')
                    // $("#password").val('')

                }

            });
            $(".modal").remove();
            $(".map-title").hide();


        }); 
        // modal_close submit_case

    // control = L.control()
    const mapOption = {
        lat: 33.7098,
        lng: 73.0533,
        zoom: 15,
        minZoom: 3,
        maxZoom: 20,
        editable: true,
        divID: "map"
    };

    userMap = TPLMaps.map.initMap(mapOption);

    const toolOptions = {
        circle: false,
        polygon: true,
        polyline: false,
        marker: false,
        map:this.userMap
    };

    tool = TPLMaps.draw.getDrawTool(toolOptions);
    map.addprintWidget(userMap);

    //   this.loadPolygons();
      this.loadPolygonAjax();

    var polygons = [];
    var saveForm = '';

    saveForm += '<form class="form-horizontal" id="sidebar-form">';           
    saveForm +='<div class="row" style="margin-top: 5px;">';
    saveForm +='<div class="col sm-6">';
    saveForm +='  <div class="form-group required control-label">';
    saveForm += '<label for="lat">Name</label>';
    saveForm +=' <input type="text" class="form-control" id="name" placeholder="Enter Title" required="true">';
    saveForm +='<small id="latHelp" class="form-text text-muted">Example: Blue Area</small>';
    saveForm +=' </div></div>';
    saveForm += '<div class="col sm-6">';
    saveForm += '<div class="form-group required control-label">';
    saveForm +='<label for="lat">Severity Level</label>';
    saveForm +='<div class="input-group mb-3">';
    saveForm +='<select class="custom-select" id="inputGroupSelect02">';
    saveForm +='<option value="1">Low Risk</option><option value="2">Low To Medium Risk</option><option value="3">Medium Risk</option>';
    saveForm += '<option value="4">High Risk</option><option value="5">Extremely High Risk</option></select></div>';
    saveForm +='<small id="latHelp" class="form-text text-muted">Example: 3</small>';
    saveForm +='</div></div></div>';
    saveForm +='<div class="row"><div class="col sm-12"><input type="text" class="form-control" id="description" placeholder="Enter Description" required="true">';
    saveForm +='<small id="latHelp" class="form-text text-muted">Example: Effected Zone </small>';
    saveForm +='</div></div>';
    saveForm +='<div class="row"><div class="col sm-12"><div class="text-center" style="margin-top: 3%">';
    saveForm +='<button type="button" style="background-color: #146734;border: 2px solid #146734;" class="btn btn-primary" id="btnSave" onclick="map.savePolygon()">Save Polygon</button>';
    saveForm +='<button type="button" style="color: #146734;background-color: #ffffff;border: 2px solid #146734;margin-left:5px;height:38px" class="btn btn-primary" onclick="map.clearWidget()">Clear</button>';
    saveForm +='</div></div></div></div></form>';
    
    addWidgetForChoseFielForm();

      $("#btnPanel").click(function () {
        $("#cover").show();
       
      });

    TPLMaps.draw.drawControl(tool, event => {

        if(event.layerType == 'polygon'){
            createdPolygon = this.JSON.stringify(event.layer.toGeoJSON().geometry);
            polygonLayer = event.layer;
            // {keepInView: true, closeButton: true, autoClose: false, autoPan: false}
            
            this.userMap.addLayer(polygonLayer);
            polygonLayer.bindPopup(saveForm).openPopup();
            $("#btnSave").attr("disabled", false);
           
        }
        return true;
    });

    //code if you want the name of the file appear on select
    $(".custom-file-input").on("change", function () {
        fileInput = $(this).val().split("\\").pop();
        var res = fileInput.split(".");
        if(res[1]=='csv'){
            callCsvFunctions = true;
        }
        else{
            
            callCsvFunctions = false;
        }
        $(this).siblings(".custom-file-label").addClass("selected").html(fileInput);
    });

    $("#csvFile").click(function () {
        var myFileInput = document.getElementById("customFile");
        var file = myFileInput.files[0];
        var checkbox = document.querySelector('input[type="checkbox"]');
        if(file==undefined){
            alert('please select file first');
        }
        else{
            if (checkbox.checked) {
                userCSV = map.addHeatMap(file);
                document.getElementById('lblLayer').innerHTML = 'Heatmap Layer';
                fileInput.value = '';

            } else {
                userCSV = map.addCluster(file);
                document.getElementById('lblLayer').innerHTML = 'Cluster Layer';
                fileInput.value = '';
            }
        }
        
    });

    $("#btnClose").click(function () {
        $("#cover").hide();
    });

    document.getElementById("btnLayerSwitcher").addEventListener("click", function () {
        var checkbox = document.querySelector('input[type="checkbox"]');
        var myFileInput = document.getElementById("customFile");
        var file = myFileInput.files[0];

        if(file==undefined){
            alert('please select file first');
        }
        else{
            if (checkbox.checked) {
                userCSV = map.addHeatMap(file);
                document.getElementById('lblLayer').innerHTML = 'Heatmap Layer';
                fileInput.value = '';

            } else {
                 userCSV = map.addCluster(file);
                document.getElementById('lblLayer').innerHTML = 'Cluster Layer';
                fileInput.value = '';
            }
        } 

    });

}

function returnLabel(value){
        var label;
        if(value=='1') label='Low Risk';
        if(value=='2') label='Low To Medium Risk';
        if(value=='3') label='Medium Risk';
        if(value=='4') label='High Risk';
        if(value=='5') label='Extremely High Risk';
        return label;
    }

    function returnLabelNumber(value){
        var number;
        value = value.trim();
        if(value.toLowerCase()==('Low Risk'.toLowerCase())) number = 1;
        if(value.toLowerCase()==('Low To Medium Risk'.toLowerCase())) number = 2 ;
        if(value.toLowerCase()==('Medium Risk'.toLowerCase())) number = 3;
        if(value.toLowerCase()==('High Risk'.toLowerCase())) number = 4;
        if(value.toLowerCase()==('Extremely High Risk'.toLowerCase())) number = 5;
        return number;
    }  

function addWidgetForChoseFielForm(){
   
    var options ={
        // icon:'<img src="https://api.tplmaps.com/js-api-v2/assets/images/marker-icon.png" style="width:16px">',
        icon:'<svg id = "btnPanel" class="bi bi-plus leaflet-touch" background-color: "#484c27" width="40px!important" height="37px!important" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 3.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H4a.5.5 0 010-1h3.5V4a.5.5 0 01.5-.5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M7.5 8a.5.5 0 01.5-.5h4a.5.5 0 010 1H8.5V12a.5.5 0 01-1 0V8z" clip-rule="evenodd"/></svg>',
        userMap:userMap 
    };

     var findCoffee = TPLMaps.widget.addEasyButton(options);
     findCoffee.addTo(userMap);

}

function addPolygonAjax(reqParam){
    $.ajax({
        
        url: serviceUrl,
        // url:'http://localhostpol:8182/hc/polygons',
        type: 'POST',
        data: reqParam,
        contentType: 'application/json',
        async: false,
        success: function(data) {
            if(data==1){
                $("#name").val('');
                $("#description").val('');
                reqParam = '';
                // polygonLayer ='';
                createdPolygon ='';
                alert('saved to datbase');
            }
        },
        error: function(error) {
            // console.log('status', error.status)
            console.log('message', error.responseText)
            alert("There is an error occured while Saving Data, please try again")

        }

    });
}


function updatepolygon(reqParam) {
      
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         var responseData = JSON.parse(this.responseText);
         if(responseData==1){
            updateReqParams = '';
            for(var i =0 ;i< featuresData.length;i++){
                userMap.removeLayer(featuresData[i]);
            }
            loadPolygonAjax();
            alert('updated!');
        }else{
            alert('not updated please try again later');
        }
        //   alert(responseData);
        return responseData;
      }
     };
     xhttp.open("PUT", serviceUrl, true);
    //  xhttp.open("PUT", 'http://localhost:8182/hc/polygons', true);
     xhttp.setRequestHeader("Content-type", "application/json");
     xhttp.send(reqParam);
}

function deletePolygon(options) {
      
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         var responseData = JSON.parse(this.responseText);
         if(responseData==1){

            userMap.removeLayer(options.polygon);

            layerType ='';

            alert('Deleted from datbase');
        }else{
            alert('not deleted please try again later');
        }
        //   alert(responseData);
        return responseData;
      }
     };
     xhttp.open("DELETE", serviceUrl, true);
    //  xhttp.open("DELETE", 'http://localhost:8182/hc/polygons', true);
     xhttp.setRequestHeader("Content-type", "application/json");
     xhttp.send(JSON.stringify(options.reqParam));
}

function loadPolygonAjax(){

    var colors = ['dark green','#90ee90','Yellow','Red','Maroon'];
    var option = {
        style: {
          weight: 3,
         opacity: 0.3,
          color: 'blue',
          fillColor: 'red'
        }
      };
    $.ajax({
        
        url: serviceUrl,
        // url:'http://localhost:8182/hc/polygons',
        type: 'GET',
        contentType: 'application/json',
        async: false,
        success: function(data) {
            
            var data = JSON.parse(data);
               
            var polygonLayers = [];
           
            
            for(var i=0; i<data.features.length;i++){
                
                var colIndex = data.features[i].properties.severityLevel-1;
                option.style.fillColor = colors[colIndex];
                
                var layerInfo = {};
                layerInfo.id = data.features[i].properties.id;
               var polygon = TPLMaps.overlays.geojsonLayer(data.features[i], option);
               layerInfo.layer = polygon;
               featuresData.push(layerInfo);
            //    var label = data.features[i], option;
               var str = "<table class='leaflet-popup-content' id ='tblData' style='line-height:2.4;table-layout: fixed;width:200px;'>";
               str += "<tr style='border-bottom:1pt solid LightGray;word-wrap: break-word;'><td><b>Name</b></td> <td id = 'tdName' style='padding-left:15px;word-wrap: break-word;'> "+data.features[i].properties.name+"</td> </tr>";
               str += "<tr style='border-bottom:1pt solid LightGray;word-wrap: break-word;'><td><b>Severity Level</b></td> <td id = 'tdSeverity' style='padding-left:15px;word-wrap: break-word;'>"+returnLabel(data.features[i].properties.severityLevel)+"</td> </tr>";
               str += "<tr style='border-bottom:1pt solid LightGray;word-wrap: break-word;'><td><b>Description</b></td> <td id = 'tdDesc' style='padding-left:15px;word-wrap: break-word;'> "+data.features[i].properties.description+"</td> </tr>";
               str += "<input type='hidden' id='id' value="+data.features[i].properties.id+" >";
            //    str += "<input type='hidden' id='id' value="+data.features[i]+" >";
               str += "</table>";
               str += '<div class="row">';
               str += '<div class="col sm-12 text-center" style="line-height: 2.4;">';
            //    str += '<div class="text-center" style="margin-top: 3%">';
               str += '<button type="button" style="background-color: #146734;border: 2px solid #146734; width:60px;height:38px;" class="btn btn-primary" id="btnEdit">Edit</button>';
               str += '<button type="button" style="background-color: #146734;border: 2px solid #146734; width:72px;height:38px; display:none;margin-left: 5px;" class="btn btn-primary" id="btnUpdate">Update</button>';
               str += '<button type="button" id="btnDelete" style="color: #146734;background-color: #ffffff;border: 2px solid #146734;width:68px;height:38px;margin-left: 5px;" class="btn btn-primary">Delete</button>';
            //    str += '</div>';
               str += '</div>';
               str += '</div>';
        polygon.bindPopup(str).on("popupopen", () => {
            var updateReqParams = {};
            var polyLayer;
            
            $("#btnDelete").on("click", e => {
                e.preventDefault();
                var optionDelete = {};
            
                var reqParam = {};
                var pLayer = featuresData.filter(e => e.id === $("#id").val())[0];
                reqParam.id =$("#id").val();
                optionDelete.reqParam = reqParam;
                optionDelete.polygon = pLayer.layer;
                var response = deletePolygon(optionDelete);

             });

            $("#btnEdit").on("click", e => {
                const instance = this;
                    e.preventDefault();
                    $("#btnEdit").hide();
                    $("#btnUpdate").show();
                    updateReqParams.id = $("#id").val();
                    var pLayer = featuresData.filter(e => e.id === $("#id").val())[0];
                    
                    polyLayer = pLayer.layer; 
                    // console.log(JSON.stringify(polyLayer.toGeoJSON().features[0].geometry));
                    polyLayer.getLayers()[0].editing.enable();
                 
                     $("#tdName").attr("contenteditable",true);
                     $("#tdSeverity").attr("contenteditable",true);
                     $("#tdDesc").attr("contenteditable",true);

                   
            });

            $("#btnUpdate").on("click", e => {
                e.preventDefault();
                $("#btnEdit").show();
                $("#btnUpdate").hide();
                 updateReqParams.severityLevel = returnLabelNumber($("#tdSeverity").text());
                 updateReqParams.name = $("#tdName").text().trim();
                 updateReqParams.description =  $("#tdDesc").text().trim();
                 updateReqParams.polygon = JSON.stringify(polyLayer.toGeoJSON().features[0].geometry);
                updatepolygon(JSON.stringify(updateReqParams));
                polyLayer.getLayers()[0].editing.disable();
               
            });
        });

                polygonLayers.push(polygon);
                TPLMaps.overlays.addToMap({
                    geomObject: polygon,
                    map: userMap
                });
                

                
             }
        },
        error: function(error) {
            // console.log('status', error.status)
            console.log('message', error.responseText)
            alert("There is an error occured while loading Data, please try again")

        }

    });
}

function showHideRightPanel() {
    var rightPanelRight = parseFloat($("#cover").css("right").replace("px", ""));
    var rightPanelWidth = $("#cover").css("width");

    if (rightPanelRight != 0) {
        $("#cover").css("right", "0%");
        $("#arrow-btn").css("transform", "rotate(0deg)");
    }
    else {
        $("#cover").css("right", "-" + rightPanelWidth);
        $("#arrow-btn").css("transform", "rotate(180deg)");
    }
}