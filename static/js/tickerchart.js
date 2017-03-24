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
    var traceData, day_vol_threshold, colors;
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
            traceData['text'].push(value['name']);
            traceData['marker']['size'].push(Math.log(value['24h_volume_usd']));
            traceData['marker']['color'].push(colors[Math.sign(value['percent_change_24h']) + 1]);
        };
    });
    $('.se-pre-load').hide();
    $('.panel').delay(1500).show();
    initiateChart([traceData]);
}

// Chart
function initiateChart(data) {
    var layout;
    layout = {
        title: 'Cryptocurrency Daily Turnover Rate (@ Exchanges)',
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
