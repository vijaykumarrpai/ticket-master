console.log('script file loaded');

var baseUrl = 'http:dct-api-data.herokuapp.com';

var idHandle = document.getElementById('id');
var countHandle = document.getElementById('count');
var tableBodyHandle = document.getElementById('tableBody');
var ticketFormHandle = document.getElementById('ticketForm');

var nameHandle = document.getElementById('name');
var nameErrorHandle = document.getElementById('nameError');

var departmentHandle = document.getElementById('department');
var departmentErrorHandle = document.getElementById('departmentError');

var priorityHandle = document.getElementById('priority');
var priorityErrorHandle = document.getElementById('priorityError');

var priorityNames = document.getElementsByName('priority');
var messageHandle = document.getElementById('message');
var messageErrorHandle = document.getElementById('messageError');

var allBtnHandle = document.getElementById('allBtn');
var highBtnHandle = document.getElementById('highBtn');
var mediumBtnHandle = document.getElementById('mediumBtn');
var lowBtnHandle = document.getElementById('lowBtn');
var selectHandle = document.getElementById('select');

var searchHandle = document.getElementById('search');

var alertHandle = document.getElementById('alert');

var showHandle = document.getElementById('show');

var progressHandle = document.getElementById('progress');

var ContainerHandle = document.getElementById('container');

var pieChartHandle = document.getElementById('piechart');

var tickets;
var tr;

var completeCount;
var highPercent;
var mediumPercent;
var lowPercent;

var barCount;
var techPercent;
var salPercent;
var hrPercent;
var techCount;
var salCount;
var hrCount;

function buildProgress() {
    var percentage = (completeCount/tickets.length) * 100;
    console.log(percentage);
    progressHandle.setAttribute("style", `width: ${percentage}%`);
}

function stats(ticketCode) {
    var tick = document.getElementById(ticketCode);
    var parent = tick.parentNode;
    console.log(parent);
    console.log(tick);
    if(tick.checked) {
    axios.put(`${baseUrl}/tickets/${ticketCode}?api_key=${key}`,{status: 'completed'})
    .then(function(response){
        var ticket = response.data;
        var spanHandle = document.getElementsByTagName('span');
        parent.childNodes[1].innerHTML = ticket.status;
        spanHandle.innerHTML = ticket.status;
        completeCount++;
        buildProgress();
    })
    .catch(function(err){
        console.log(err);
    });
} else {
    axios.put(`${baseUrl}/tickets/${ticketCode}?api_key=${key}`,{status:'open'})
    .then(function(response){
        var ticket = response.data;
        var spanHandle = document.getElementsByTagName('span');
        parent.childNodes[1].innerHTML = ticket.status;
        spanHandle.innerHTML = ticket.status;
        completeCount--;
        buildProgress();
    })
    .catch(function(err){
        console.log(err);
    });
    }
}

function onlygetTickets() {
    axios.get(`${baseUrl}/tickets?api_key=${key}`)
    .then(response => {
        tickets = response.data;
    })
    .catch(err => {
        console.log(err);
    });
}

function filterTickets(priority) {
    onlygetTickets();
    tableBodyHandle.innerHTML = '';
    var count = 0;
    tickets.forEach(function(ticket){
        if(ticket.priority === priority) {
            count++;
            buildRow(ticket);
        }
    });
    countHandle.innerHTML = count;
}

allBtnHandle.addEventListener('click', function(){
    tableBodyHandle.innerHTML = '';
    tickets.forEach(function(ticket){
        buildRow(ticket);
    })
    countHandle.innerHTML = tickets.length;
}, false);

highBtnHandle.addEventListener('click', function(){
    filterTickets('high');
}, false);

mediumBtnHandle.addEventListener('click', function(){
    filterTickets('medium');
}, false);

lowBtnHandle.addEventListener('click', function(){
    filterTickets('low');
},false);

// selectHandle.addEventListener('change', function(){
//     if(selectHandle.value === 'high') {
//         filterTickets('high');
//     } else if (selectHandle.value === 'medium') {
//         filterTickets('medium');
//     } else if (selectHandle.value === 'low') {
//         filterTickets('low');
//     } else {
//         tableBodyHandle.innerHTML = '';
//         tickets.forEach(function(ticket){
//         buildRow(ticket);
//         });
//         countHandle.innerHTML = tickets.length;
//     }
// }, false);

searchHandle.addEventListener('keyup', function(){
    idCount = 1;

    tableBodyHandle.innerHTML = '';
    var searchResults = tickets.filter(function(ticket){
        return (ticket.ticket_code.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0) || (ticket.name.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0) || (ticket.department.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0) || (ticket.priority.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0) || (ticket.status.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >= 0);
    });

    searchResults.forEach(function(ticket){
        buildRow(ticket);
    })
    countHandle.innerHTML = searchResults.length;
    showHandle.innerHTML = '';
    showText = document.createTextNode(`showing ${idCount - 1} of ${showCount} results`);
    showHandle.appendChild(showText);
}, false);

var idCount = 1;

var hasErrors = {
    name: true,
    department: true,
    priority: true,
    message: true
}

function validateName() {
    if(nameHandle.value === '') {
        nameErrorHandle.innerHTML = 'can not be empty';
        hasErrors.name = true;
    } else {
        nameErrorHandle.innerHTML = '';
        hasErrors.name = false;
    }
}

function validateDepartment() {
    if(departmentHandle.value === "") {
        departmentErrorHandle.innerHTML = 'please select an option';
        hasErrors.department = true;
    } else {
        departmentErrorHandle.innerHTML = '';
        hasErrors.department = false;
    }
}

function validatePriority() {
    for(var i = 0; i < priorityNames.length; i++) {
        if(priorityNames[i].checked === 'true') {
            priorityErrorHandle.innerHTML = 'select a priority';
            hasErrors.priority = true;
        } else {
            priorityErrorHandle.innerHTML = '';
            hasErrors.priority = false;
        }
    }
}

function validateMessage() {
    if(messageHandle.value === "") {
        messageErrorHandle.innerHTML = 'please enter message';
        hasErrors.message = true;
    } else {
        messageErrorHandle.innerHTML = '';
        hasErrors.message = false;
    }
}

function buildRow(ticket) {
    var tr = document.createElement('tr');
    if(ticket.status === 'completed') {
    tr.innerHTML = `
        <td>${idCount++}</td>
        <td>${ticket.ticket_code}</td>
        <td>${ticket.name}</td>
        <td>${ticket.department}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.message}</td>
        <td><input type="checkbox" id="${ticket.ticket_code}" checked="true" onclick="stats(this.id)"><span>${ticket.status}</span></td>`;
}
    else {
        tr.innerHTML = `
        <td>${idCount++}</td>
        <td>${ticket.ticket_code}</td>
        <td>${ticket.name}</td>
        <td>${ticket.department}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.message}</td>
        <td><input type="checkbox" id="${ticket.ticket_code}" onclick="stats(this.id)"><span>${ticket.status}</span></td>`; 
    }
    tableBodyHandle.appendChild(tr);
}

function getTickets() {
    axios.get(`${baseUrl}/tickets?api_key=${key}`)
    .then(function(response){
    tickets = response.data;
    showCount = tickets.length;
    
    countHandle.innerHTML = tickets.length;
    tickets.forEach(function(ticket){
        buildRow(ticket);
    })
    completeCount = tickets.filter(ele => ele.status === 'completed').length;
    highPercent = calculate('high');
    mediumPercent = calculate('medium');
    lowPercent = calculate('low');

    var techCount = tickets.filter(function(ticket){
        return ticket.department == 'Technical';
    });
    techPercent = techCount.length;

    var salCount = tickets.filter(function(ticket){
        return ticket.department == 'Sales';
    });
    salPercent = salCount.length;

    var hrCount = tickets.filter(function(ticket){
        return ticket.department == 'Hr';
    });
    hrPercent = hrCount.length;

    buildProgress();
    buildChart();
    buildBarChart();
})

.catch(function(err){
    console.log(err);
});
}

function calculate(value) {
    var count = (tickets.filter(ele => ele.priority === value).length/tickets.length) * 100;
    return count;
}

function barCalculate(value) {
    var counter = (tickets.filter(element => element.department === value).length/tickets.length) * 100;
    return counter;
}

function getPriorityValue() {
    for(var i = 0; i < priorityNames.length; i++) {
        if(priorityNames[i].checked) {
            return priorityNames[i].value;
        }
    }
}

ticketFormHandle.addEventListener('submit', function(e){
    validateName();
    validateDepartment();
    validatePriority();
    validateMessage();

    e.preventDefault();

    var formData = {
        name: nameHandle.value,
        department: departmentHandle.value,
        priority: getPriorityValue(),
        message: messageHandle.value 
    }; 

    axios.post(`${baseUrl}/tickets?api_key=${key}`, formData)
    .then(function(response){
        var ticket = response.data; 
        buildRow(ticket); 
        countHandle.innerHTML = parseInt(countHandle.innerHTML) + 1; 
        ticketFormHandle.reset(); 
        alertHandle.innerHTML = '<div class="alert alert-success" role="alert">Successfully created</div>';
        setTimeout(function(){
            alertHandle.innerHTML = '';
        }, 3000);
    })
    .catch(function(err){
        console.log(err); 
    })
}, false); 

// google.charts.load('current', {'packages': ['corechart']});
// google.charts.setOnLoadCallback(drawChart);

// function drawChart() {
//     var data = google.visualization.arrayToDataTable([
//         ['Status', 'Percentage'],
//         ['open', 30.77],
//         ['completed', 69.23]
//     ]);
//     var options = {'title': 'isCompleted', 'width': 550, 'height': 400};

//     var chart = new google.visualization.PieChart(pieChartHandle);
//     chart.draw(data, options);
// }

var myChart;
var barChart;

function buildChart() {
    myChart = Highcharts.chart('piechart', {
        chart : {
            plotBackgroundColor : null,
            plotBorderWidth : null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: '<b>Ticket Priority %</b>'
        },
        tooltip: {
            pointFormat: '${series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie : {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Priority',
            colorByPoint: true,
            data: [{
                name: 'high',
                y: highPercent,
            }, {
                name: 'medium',
                y: mediumPercent,
            }, {
                name: 'low', 
                y: lowPercent,
            }]
        }]
    });
}

function buildBarChart() {
    barChart = Highcharts.chart('container', {
        chart: {
            type: 'bar'
        }, 
        title: {
            text: 'Tickets By Department'
        },
        xAxis: {
            categories: ['Technical', 'Sales', 'HR']
        },
        yAxis: {
            title: {
                text: 'Status'
            }
        },
        series: [{
                name: 'Technical',
                data: [techPercent]
            }, {
                name: 'Sales', 
                data: [salPercent],
            }, {
                name: 'Hr',
                data: [hrPercent]
            }]
        });
    };
    buildBarChart(tickets);

window.addEventListener('load', function(){
    getTickets();
    //drawChart();
    //chart(tickets);
}, false)
