var CORSURLPrefix;

$(window).load(function() {
    if ($('.se-pre-load').is(':visible')) {
        $('.panel').hide();
    }
});

$(function() {
    var url;
    CORSURLPrefix = 'https://cors-anywhere.herokuapp.com/';
    url = 'https://api.coinmarketcap.com/v1/ticker?limit=100';
    $.getJSON(CORSURLPrefix + url, handleGetJSONResponseTickerAPI);
});

function handleGetJSONResponseTickerAPI(data) {
    var traceData, day_vol_threshold;
    day_vol_threshold = 5000;  // Only want trading vol >= $5K
    traceData = {
        'type': 'scatter', 'mode': 'markers', 'hoverinfo': 'text',
        'x': [], 'y': [], 'text': [], 'marker': {'size': []}
    };
    $.each(data, function (index, value) {
        if (value['24h_volume_usd'] >= day_vol_threshold) {
            traceData['x'].push(value['market_cap_usd']);
            traceData['y'].push((value['24h_volume_usd'] / value['market_cap_usd']) * 100);
            traceData['text'].push(value['name']);
            traceData['marker']['size'].push(Math.log(value['24h_volume_usd'] / 10)); // Why / 10? To better show relative size.
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
            'title': 'Market Cap',
            'type': 'log'
        },
        yaxis: {
            'title': '24H Turnover Ratio',
            'type': 'log',
            'ticksuffix': '%',
            'dtick': 0.5
        },
        hovermode: 'closest'
    };
    Plotly.newPlot('mainChart', data, layout);
}
