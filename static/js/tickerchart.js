$(window).load(function() {
    if ($('.se-pre-load').is(':visible')) {
        $('.panel').hide();
    }
});

$(function() {
    var CORSURLPrefix, url;
    CORSURLPrefix = 'https://cors-anywhere.herokuapp.com/';
    url = 'https://api.coinmarketcap.com/v1/ticker?limit=100';
    $.getJSON(CORSURLPrefix + url, handleGetJSONResponseTickerAPI);
});

function handleGetJSONResponseTickerAPI(data) {
    var traceData, day_vol_threshold, colors, report_date;
    colors = ['rgb(204, 0, 0)', 'rgb(38, 77, 0)', 'rgb(38, 77, 0)']
    day_vol_threshold = 5000;  // Only want trading vol >= $5K
    traceData = {
        'type': 'scatter', 'mode': 'markers', 'hoverinfo': 'text',
        'x': [], 'y': [], 'text': [], 'marker': {'size': [], 'color': []}
    };
    $.each(data, function (index, value) {
        if (value['24h_volume_usd'] >= day_vol_threshold) {
            traceData['x'].push((value['24h_volume_usd'] / value['market_cap_usd']) * 100);
            traceData['y'].push(value['market_cap_usd']);
            traceData['text'].push(
                value['name'] + '<br />24 Hour: ' + value['percent_change_24h'] +
                '%<br />7 Day: ' + value['percent_change_7d'] + '%');
            traceData['marker']['size'].push(Math.log(value['24h_volume_usd']));
            traceData['marker']['color'].push(colors[Math.sign(value['percent_change_24h']) + 1]);
        }
        if (value['id'] === 'bitcoin') {
            report_datetime = new Date(parseInt(value['last_updated']) * 1000);
        }
    });
    $('.se-pre-load').hide();
    $('.panel').delay(1500).show();
    initiateChart([traceData], report_datetime);
}

function formatDateTimeUTC(date) {
    var day, monthIndex, year, hours, minutes, seconds, monthNames;
    monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];
    day = date.getUTCDate();
    monthIndex = date.getUTCMonth();
    year = date.getUTCFullYear();
    hours = date.getUTCHours();
    minutes = date.getUTCMinutes();
    seconds = date.getUTCSeconds();
    return (monthNames[monthIndex].slice(0, 3) + ' ' + day + ', ' +  year + ' ' + ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2) + ' UTC');
}

// Chart
function initiateChart(data, report_datetime) {
    var layout;
    layout = {
        title: 'Cryptocurrency Daily Turnover Rate (@ Exchanges)<br />As-of ' + formatDateTimeUTC(report_datetime),
        xaxis: {
            'title': '24H Turnover Ratio',
            'type': 'log',
            'ticksuffix': '%',
            'dtick': 0.5
        },
        yaxis: {
            'title': 'Market Cap',
            'type': 'log'
        },
        hovermode: 'closest'

    };
    Plotly.newPlot('mainChart', data, layout);
}
