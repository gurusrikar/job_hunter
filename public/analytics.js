var realTimeInterval;
var gaugeOptions = {
    chart: {
        type: 'solidgauge',
        plotShadow: false,
    },
    title: " ",
    pane: {
        center: ['50%', '87%', '90%'],
        size: '160%',
        startAngle: -90,
        endAngle: 90,
        background: {
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc',
            borderWidth: 0,
        }
    },
    credits: {
        enabled: false
    },
    yAxis: {
        stops: [
            [0.94, '#DF5353'], // red
            [0.95, '#ffff00'], // yellow
            [0.99, '#55BF3B'] // green
        ],
        minorTickInterval: null,
        tickAmount: 2,
        title: {
            y: 77,
            style: {
                color: '#000000'
            }
        },
        labels: {
            enabled: false
        }
    },

    plotOptions: {
        solidgauge: {
            dataLabels: {
                y: 13,
                borderWidth: 0,
                useHTML: true
            },
        }
    }
};

$(document).ready(function () {
    $('#last24Hours').highcharts(Highcharts.merge(gaugeOptions, {
        chart: {
            backgroundColor: '#000000',
        },
        yAxis: {
            min: 0,
            max: 100
        },
        series: [{
            name: '24hours',
            data: [0],
            tooltip: {
                valueSuffix: '%'
            },
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:40px;color:white;' + '">{y}</span>' +
                '<span style="font-size:12px;color:white">%</span></div>',
                borderRadius: 3
            },
        }]
    }));

    $('#last7Days').highcharts(Highcharts.merge(gaugeOptions, {
        chart: {
            backgroundColor: '#000000',
        },
        yAxis: {
            min: 0,
            max: 100
        },

        series: [{
            name: '7days',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:40px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white') + '">{y}</span>' +
                '<span style="font-size:12px;color:white">%</span></div>'
            }
        }]
    }));

    $('#last30Days').highcharts(Highcharts.merge(gaugeOptions, {
        chart: {
            backgroundColor: '#000000',
        },
        yAxis: {
            min: 0,
            max: 100,
        },

        series: [{
            name: '30days',
            data: [0],
            tooltip: {
                valueSuffix: '%'
            },
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:40px;color:' +
                ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white') + '">{y}</span>' +
                '<span style="font-size:12px;color:white">%</span></div>'
            }
        }]
    }));
    window.setInterval(function () {
        var reqURL = "https://api.uptimerobot.com/getMonitors?apiKey=m777515929-da8aa69f831de18f06348a26&customUptimeRatio=1-7-30&noJsonCallback=1&format=json";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            jsonData = xhttp.responseText;
        };
        xhttp.open("GET", reqURL, false);
        xhttp.send();
        splitval = JSON.parse(jsonData).monitors.monitor[0].customuptimeratio.split('-');
        var point = $('#last24Hours').highcharts().series[0].points[0];
        point.update(Number(splitval[0]));
        var point = $('#last7Days').highcharts().series[0].points[0];
        point.update(Number(splitval[1]));
        var point = $('#last30Days').highcharts().series[0].points[0];
        point.update(Number(splitval[2]));
    }, 1000);
});

function getData() {
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}
function drawChart() {
    var timeout;
    var first_time = true;
    var fixed_chart_2;
    var previous_total_active_users = 0;

    function makeCanvas(id) {
        var container = document.getElementById(id);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        container.innerHTML = '';
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        container.appendChild(canvas);
        return ctx;
    }

    function generateLegend(id, items) {
        var legend = document.getElementById(id);
        legend.innerHTML = items.map(function (item) {
            var color = item.color || item.fillColor;
            var label = item.label;
            return '<li><i style="width:11px;background:' + color + '"></i>' + label + '</li>';
        }).join('');
    }

    function slider_1_chart_1(data) {
        var data1 = [];
        var data2 = [];
        for (var i = 1; i < 13; i++) {
            data1.push(data[i][2]);
        }
        for (var i = 13; i < data.length; i++) {
            data2.push(data[i][2]);
        }
        var labels = [];
        for (var i = 1; i < 13; i++) {
            switch (data[i][0]) {
                case "01":
                    labels.push("Jan")
                    continue;
                case "02":
                    labels.push("Feb")
                    continue;
                case "03":
                    labels.push("Mar")
                    continue;
                case "04":
                    labels.push("Apr")
                    continue;
                case "05":
                    labels.push("May")
                    continue;
                case "06":
                    labels.push("Jun")
                    continue;
                case "07":
                    labels.push("Jul")
                    continue;
                case "08":
                    labels.push("Aug")
                    continue;
                case "09":
                    labels.push("Sep")
                    continue;
                case "10":
                    labels.push("Oct")
                    continue;
                case "11":
                    labels.push("Nov")
                    continue;
                case "12":
                    labels.push("Dec")
                    continue;
            }
        }
        var final_data = {
            labels: labels,
            datasets: [
                {
                    label: 'Last Year',
                    fillColor: 'rgba(75, 192, 192, 0.4)',
                    strokeColor: 'rgba(75, 192, 192, 1)',
                    pointBorderWidth: '0.1px',
                    fontFamily: 'Helvetica Neue',
                    data: data1
                },
                {
                    label: 'This Year',
                    fillColor: 'rgba(55, 165, 0, 0.4)',
                    strokeColor: 'rgba(58, 217, 44, 1)',
                    fontFamily: 'Helvetica Neue',
                    data: data2
                }
            ]
        };

        var options = {
            series: {
                0: {color: '#e2431e'},
                1: {color: '#e7711b'},
            }
        };

        new Chart(makeCanvas('slider-1-chart-1-container')).Line(final_data, {scaleFontColor: "#ffffff"});
        generateLegend('slider-1-legend-1-container', final_data.datasets);
    }

    function slider_1_chart_4(data) {
        final_data = [];
        data.forEach(function (row, i) {
            final_data.push({name: row[0], data: +row[1]});
        });
        var name = Array();
        var data = Array();
        var dataArrayFinal = Array();
        for (i = 0; i < final_data.length; i++) {
            name[i] = final_data[i].name;
            data[i] = final_data[i].data;
        }

        for (j = 0; j < name.length; j++) {
            var temp = new Array(name[j], data[j]);
            dataArrayFinal[j] = temp;
        }

        Highcharts.setOptions({
            colors: ['#20B2AA', '#008000', '#7CFC00', '#ffff00', '#FF4500']
        });

        $('#browsers').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                backgroundColor: '#000000',
                width: 700,
                height: 350
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        color: 'white',
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black', fontSize: '15px'
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: dataArrayFinal
            }]
        });
    }

    function deviceComparison(pc, mobile) {
        $('#deviceComparison').highcharts({
            chart: {
                type: 'bar',
                backgroundColor: '#000000',
                height: 100
            },
            title: {
                text: ''
            },
            legend: {
                itemStyle: {
                    color: '#ffffff',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                labels: {
                    enabled: false,
                },
                tickLength: 0,
                gridLineWidth: 0,
            },
            yAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: null
                },
                tickLength: 0
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    stacking: 'percent',
                    pointWidth: 80,
                    dataLabels: {
                        enabled: true,
                        color: '#FFFFFF',
                        inside: true,
                    },
                },
            },
            series: [{
                name: 'Mobile',
                data: [mobile],
                color: '#20B2AA',
            },
                {
                    name: 'Desktop',
                    data: [pc],
                    color: '#008000'
                }]
        });
    }

    function slider_1_chart_5(data) {
        var final_data = new google.visualization.DataTable();

        final_data.addColumn("string", "Region");
        final_data.addColumn("number", "Users");

        data.forEach(function (row, i) {
            final_data.addRow([String(row[0]), Number(row[1])]);
        });
        var options = {
            width: '100%',
            height: 400,
            displayMode: 'regions',
            region: 'US',
            resolution: 'provinces',
            backgroundColor: '#000000',
            colorAxis: {colors: ['#20B2AA', '#008000', '#7CFC00', '#FF4500']},
        };

        new google.visualization.GeoChart(
            document.getElementById('slider-1-chart-5-container')
        ).draw(final_data, options);
    }

    function slider_1_chart_6(data) {
        var final_data = new google.visualization.DataTable();

        final_data.addColumn("string", "Country");
        final_data.addColumn("number", "Users");

        data.forEach(function (row, i) {
            if (String(row[0]) != "United States" && String(row[0]) != "(not set)")
                final_data.addRow([String(row[0]), Number(row[1])]);
        });

        var options = {
            backgroundColor: '#000000',
            colorAxis: {colors: ['#20B2AA', '#008000', '#7CFC00', '#FF4500']},
            height: 350
        };

        new google.visualization.GeoChart(
            document.getElementById('slider-1-chart-6-container')
        ).draw(final_data, options);
    }

    function render_realtime_data() {
        $.get('https://g2ynnl6674.execute-api.us-west-2.amazonaws.com/test/dashboard-analytics/activeusers', {}, function (data) {
            var total_active_users = 0;
            var desktopNumber = 0;
            var OtherDevices = 0;
            data.forEach(function (row, i) {
                if (row[0] === "DESKTOP")
                    desktopNumber = desktopNumber + Number(row[2]);
                else
                    OtherDevices = OtherDevices + Number(row[2]);
            });
            console.log(desktopNumber);
            console.log(OtherDevices);
            deviceComparison(desktopNumber, OtherDevices);
            data.forEach(function (row, i) {
                total_active_users = total_active_users + Number(row[2]);
            });
            document.getElementById('ActiveUsers').innerHTML = String(total_active_users);
        });
    }

    render_realtime_data();
    setInterval(function () {
        render_realtime_data();
    }, 9000);

    function render_charts() {
        $.get('https://g2ynnl6674.execute-api.us-west-2.amazonaws.com/test/dashboard-analytics', {}, function (data, status) {
            ``
            slider_1_chart_1(data["dashboard_monthly_psu_data"]);
            slider_1_chart_4(data["dashboard_monthly_browsers_data"]);
            slider_1_chart_5(data["dashboard_monthly_US_state_data"]);
            slider_1_chart_6(data["dashboard_monthly_countries_data"]);
        });
    }

    render_charts();
    setInterval(function () {
        render_charts();
    }, 9000);
}
