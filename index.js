var file = null;
var i = 1;
var da = false;
var dataA = [
    
];

var dataB = [
    
];

var dataC = [
    
];

$(function(){
    
    $("#schedulerA").dxScheduler({
        timeZone: "Europe/Rome",
        dataSource: dataA,
        views: ["day","week", "month"],
        currentView: "month",
        currentDate: new Date().toLocaleDateString(),
        startDayHour: 7,
        height:400,
        width: 500,
        onAppointmentAdded: callit
    }).dxScheduler("instance");

    $("#schedulerB").dxScheduler({
        timeZone: "Europe/Rome",
        dataSource: dataB,
        views: ["day","week", "month"],
        currentView: "month",
        currentDate: new Date().toLocaleDateString(),
        startDayHour: 7,
        height: 400,
        width: 500,
        onAppointmentAdded: callit
    }).dxScheduler("instance");

    $("#schedulerC").dxScheduler({
        timeZone: "Europe/Rome",
        dataSource: dataC,
        views: ["day","week", "month"],
        currentView: "day",
        currentDate: new Date().toLocaleDateString(),
        startDayHour: 7,
        height: 400,
        width: 550,
        editing: {
            allowAdding: false,
            allowDeleting: false,
            allowUpdating: false,
            allowResizing: false,
            allowDragging: false
        },
        appointmentTemplate: function(data, index, element) {
            element.append("<i style='font-size:10px'>NOT AVAILABLE</i>");
            element.css('background-color','red');
            element.css('width','100%'); 
        },
        dataCellTemplate: function(data, index, element) {
            element.append("<i style='font-size:10px'>AVAILABLE</i>");
            element.css('background-color','green'); 
        }
        
    }).dxScheduler("instance");

    $("#buttonA").dxFileUploader({
        selectButtonText: "Import",
        name:"upl",
        labelText: "",
        uploadUrl: "http://localhost:3000/",
        onUploaded: function(e) {
            $.ajax({
                url: "http://localhost:3000/give",
                type: "GET",
                success: function (dataa) {
                    var dat = Object.values(dataa);
                    for (let i = 0; i < dat.length; i++) {
                    var schedulerInstance = $("#schedulerA").dxScheduler("instance");
                    schedulerInstance.addAppointment({
                        text: dat[i].description, 
                        startDate: new Date(dat[i].start), 
                        endDate: new Date(dat[i].end)
                    });    
                }
                    
                    //console.log(dataA);
                    schedulerInstance.getDataSource().reload();  
                  // console.log(dataA);
                  //callit();
                },
            });
        }
});

$("#buttonB").dxFileUploader({
    selectButtonText: "Import",
    name:"upl",
    labelText: "",
    uploadUrl: "http://localhost:3000/",
    onUploaded: function(e) {
        $.ajax({
            url: "http://localhost:3000/give",
            type: "GET",
            success: function (dataa) {
                var dat = Object.values(dataa);
                for (let i = 0; i < dat.length; i++) {
                var schedulerInstance = $("#schedulerB").dxScheduler("instance");
                schedulerInstance.addAppointment({
                    text: dat[i].description, 
                    startDate: new Date(dat[i].start), 
                    endDate: new Date(dat[i].end)
                });    
            }
                schedulerInstance.getDataSource().reload();  
                //console.log(dataA);
                //callit();
            },
        });
    }
});

$("#buttonC").dxButton({
    stylingMode: "contained",
        text: "Check",
        type: "normal",
        width: 120,
        onClick: checkiraj
    });
});

function checkiraj () {
    da = true;
    var scheduler = $("#schedulerC").dxScheduler("instance");
    for (let i = 0; i < dataC.length; i++) {
    scheduler.deleteAppointment(dataC[i]);
    i--;
    }
    var start = new Date(scheduler.getStartViewDate());
    var end = new Date(scheduler.getEndViewDate());
    var podaciA = dataA.filter(function (el) {
        return el.startDate.getTime() <= end.getTime() && el.startDate.getTime() >= start.getTime();
    });

    var podaciB = dataB.filter(function (el) {
        return el.startDate.getTime() <= end.getTime() && el.startDate.getTime() >= start.getTime();
    });
    podaciB.sort(function(a,b) {
        if (a.startDate.getTime() < b.startDate.getTime()) {
                return -1;
        }else {
            return 1;
        }
    });
    podaciA.sort(function(a,b) {
        if (a.startDate.getTime() < b.startDate.getTime()) {
            return -1;
        }else {
            return 1;
        }
    });

    for (let i = 0; i < podaciA.length; i++) {
        for (let j = 0; j < podaciB.length; j++) {
            if (podaciA[i].startDate.getTime() >= podaciB[j].startDate.getTime() && podaciA[i].endDate.getTime() <= podaciB[j].endDate.getTime()) {
                podaciA.splice(i,1);
                i--;
                break;
            }else if (podaciA[i].startDate.getTime() <= podaciB[j].startDate.getTime() && podaciA[i].endDate.getTime() >= podaciB[j].endDate.getTime()) {
                podaciB.splice(j,1);
                j--;
            }else if (podaciA[i].startDate.getTime() < podaciB[j].startDate.getTime() && podaciA[i].endDate.getTime() <= podaciB[j].endDate.getTime() && podaciA[i].endDate.getTime() > podaciB[j].startDate.getTime()) {
                podaciA[i].endDate = new Date(podaciB[j].endDate);
                podaciB.splice(j,1);
                j--;
            }else if (podaciA[i].startDate.getTime() <= podaciB[j].endDate.getTime() && podaciA[i].startDate.getTime() > podaciB[j].startDate.getTime() && podaciA[i].endDate.getTime() > podaciB[j].endDate.getTime()) {
                podaciA[i].startDate = new Date(podaciB[j].startDate);
                podaciB.splice(j,1);
                j--;
            }
        }
    }
    
    Array.prototype.push.apply(podaciA,podaciB); 
    for (let i = 0; i < podaciA.length; i++) {
        var schedulerInstance = $("#schedulerC").dxScheduler("instance");
        schedulerInstance.addAppointment({
            text: "NOT AVAILABLE", 
            startDate: new Date(podaciA[i].startDate), 
            endDate: new Date(podaciA[i].endDate),
            color: "red"
        });    
    }
        schedulerInstance.getDataSource().reload();  

}

function callit() {
    if(da) checkiraj();
}