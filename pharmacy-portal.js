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
var serviceUrl ='http://localhost:8182/pharmacy/medicine';
var dataTB = '';
var marker = '';



function loadTabularData(){

    let tableHtml = '';
        tableHtml += '<table id="example" class="display nowrap" style="width:100%">';
        tableHtml+='<thead>';
        tableHtml+='<tr>';
        tableHtml+= '<th>Sr #</th>';
        // tableHtml+= '<th>Status</th>';
        tableHtml+= '<th>MedicineName</th>';
        tableHtml+= '<th>BrandName</th>';
        tableHtml+= '<th>ExpiryDate/Lab</th>';
        tableHtml+= '<th>Price</th>';
        tableHtml+= '</tr>';
        tableHtml+= '</thead>';
        tableHtml+= '<tbody></tbody>';
        tableHtml+= '</table>'
        $("._details").append(tableHtml);

        $.ajax({
            'url': "http://localhost:8182/pharmacy/medicine",
            'method': "GET",
            'contentType': 'application/json'
        }).done( function(data) {

                var html = "";
                response =  data;
                for (var i=0; i < response.length; i++)
                {
        // "medicine_id": 1,
        // "medicine_name": "pain killer",
        // "brand_name": "abc",
        // "expiry": "2022-12-11T19:00:00.000+0000",
        // "quantity": 22,
        // "price": 220
                    html += "<tr id='tablerow_"+response[i]['medicine_id']+"' data-lat='"+response[i]['medicine_name']+"' data-long='"+response[i]['medicine_name']+"'>";
                    html +=     "<td>"+response[i]['medicine_id']+"</td>";
                    // html +=     "<td>"+response[i]['status']+"</td>";
                    html +=     "<td>"+response[i]['medicine_name']+"</td>";
                    html +=     "<td>"+response[i]['brand_name']+"</td>";
                    html +=     "<td>"+response[i]['expiry']+"</td>";
                    html +=     "<td>"+response[i]['price']+"</td>";
                    // html +=     "<td>"+response[i]['cnic']+"</td>";
                    // var address = (response[i]['address']==undefined ||response[i]['address']==null )  ? '' : response[i]['address'];
                    // html +=     "<td>"+address+"</td>";
                    // html +=     "<td>"+response[i]['creation_date']+"</td>";
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
    };

window.onload = function () 
{


     if (localStorage.hasOwnProperty('isLoggedin') && localStorage.getItem('isLoggedin') == "true") {
            console.log('no redirection will happen');
            // window.location.href = '/pharmacy-portal/index.html'
        } 
    else {
            window.location.href = '/pharmacy-portal/login.html'
            // console.log('no redirection');

            // alert("please provide a valid email and password to login!")

        }
        this.loadTabularData();
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

        // alert($("#example tbody tr").length )
        if($("#example tbody tr").length <1){

                dataTB.fnDestroy()

            $('#example tbody').empty();
            loadTabularData();
        }
        $(".map-title").toggle();


    
        // $("body").on("click", "#example tbody tr", function() {
        // // $("#example tbody tr").click(function (){

        //     let id = $(this).attr('id').split('_');
        //     id = id[1]
        //     // console.log(id);

        //     let html ='';
        //     html+= '<div id="model_'+id+'" class="modal" tabindex="-1" role="dialog">';
        //     html+= '<div class="modal-dialog" role="document">';
        //     html+=  '<div class="modal-content">';
        //     html+=  '<div class="modal-header">';
        //     html+=  '<h5 class="modal-title">Confirm or Decline Case</h5>';
        //     html+=  '<button id="modalbtn_'+id+'" type="button" class="close" data-dismiss="modal" aria-label="Close">';
        //     html+=  '<span aria-hidden="true">&times;</span>';
        //     html+= '</button>';
        //     html+= '</div>';
        //     html+= '<div class="modal-body">';
        //     html+= '<p>Please mark this Covid-19 case confirm or decline</p>';
        //     html+= '</div>';
        //     html+= '<div class="modal-footer">';
        //     html+= '<button id="modelbtn_'+id+'" type="button" class="btn btn-primary submit_case" value="Approved">Confirm</button>';
        //     html+= '<button id="modelbtn1_'+id+'" type="button" class="btn btn-secondary submit_case" data-dismiss="modal" value="Denied">Decline</button>';
        //      html+= '</div>';
        //     html+= '</div>';
        //     html+= '</div>';
        //     html+= '</div>';
        //     // console.log(html);

        //     $("body").append(html);

          

        //     $(".modal").show();

        // }); 

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

    //   this.loadPharmacyAjax();

    }

function addPharmacyAjax(reqParam){
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


function updatepharmacy(reqParam) {
      
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         var responseData = JSON.parse(this.responseText);
         if(responseData==1){
            updateReqParams = '';
            for(var i =0 ;i< featuresData.length;i++){
                userMap.removeLayer(featuresData[i]);
            }
            loadPharmacyAjax();
            alert('updated!');
        }else{
            alert('not updated please try again later');
        }
        //   alert(responseData);
        return responseData;
      }
     };
     xhttp.open("PUT", serviceUrl, true);
    //  xhttp.open("PUT", 'http://localhost:8182/pharmacy/medicine', true);
     xhttp.setRequestHeader("Content-type", "application/json");
     xhttp.send(reqParam);
}

function deletePharmacy(options) {
      
    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         var responseData = JSON.parse(this.responseText);
         if(responseData==1){


            alert('Deleted from datbase');
        }else{
            alert('not deleted please try again later');
        }
        //   alert(responseData);
        return responseData;
      }
     };
     xhttp.open("DELETE", serviceUrl, true);
    //  xhttp.open("DELETE", 'http://localhost:8182/pharmacy/medicine', true);
     xhttp.setRequestHeader("Content-type", "application/json");
     xhttp.send(JSON.stringify(options.reqParam));
}

function loadPharmacyAjax(){

   
    $.ajax({
        
        url: serviceUrl,
        // url:'http://localhost:8182/pharmacy/medicine',
        type: 'GET',
        contentType: 'application/json',
        async: false,
        success: function(data) {
            
            var data = JSON.parse(data);
               
            var polygonLayers = [];
           
            //  var table ='';
            for(var i=0; i<data.length;i++){
                
                // var colIndex = data.features[i].properties.severityLevel-1;
              
               // var str = "<table class='leaflet-popup-content' id ='tblData' style='line-height:2.4;table-layout: fixed;width:200px;'>";
               // str += "<tr style='border-bottom:1pt solid LightGray;word-wrap: break-word;'><td><b>Name</b></td> <td id = 'tdName' style='padding-left:15px;word-wrap: break-word;'> "+data.features[i].properties.name+"</td> </tr>";
               // str += "<tr style='border-bottom:1pt solid LightGray;word-wrap: break-word;'><td><b>Severity Level</b></td> <td id = 'tdSeverity' style='padding-left:15px;word-wrap: break-word;'>"+returnLabel(data.features[i].properties.severityLevel)+"</td> </tr>";
               // str += "<tr style='border-bottom:1pt solid LightGray;word-wrap: break-word;'><td><b>Description</b></td> <td id = 'tdDesc' style='padding-left:15px;word-wrap: break-word;'> "+data.features[i].properties.description+"</td> </tr>";
               // str += "<input type='hidden' id='id' value="+data.features[i].properties.id+" >";
            //    str += "<input type='hidden' id='id' value="+data.features[i]+" >";
               // str += "</table>";
               // str += '<div class="row">';
               // str += '<div class="col sm-12 text-center" style="line-height: 2.4;">';
            //    str += '<div class="text-center" style="margin-top: 3%">';
               // str += '<button type="button" style="background-color: #146734;border: 2px solid #146734; width:60px;height:38px;" class="btn btn-primary" id="btnEdit">Edit</button>';
               // str += '<button type="button" style="background-color: #146734;border: 2px solid #146734; width:72px;height:38px; display:none;margin-left: 5px;" class="btn btn-primary" id="btnUpdate">Update</button>';
               // str += '<button type="button" id="btnDelete" style="color: #146734;background-color: #ffffff;border: 2px solid #146734;width:68px;height:38px;margin-left: 5px;" class="btn btn-primary">Delete</button>';
            //    str += '</div>';
               // str += '</div>';
               // str += '</div>';
               table += '<tr>'; 
               table += '<td></td>';
    

                
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