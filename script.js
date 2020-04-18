var total, indiaData;
document.getElementById('wbtn').onclick =()=> { changeCountry('w')}
document.getElementById('ibtn').onclick =()=> { changeCountry('india')}
changeCountry()

function changeCountry(country){
    if(country=='india'){
        // total = indiaTotal
        // data = indiaData
        chrome.storage.local.get(['indiaTotal','indiaData'],(response=>{
            total = response.indiaTotal
            data = response.indiaData
            updateUI('State/UT')
        }))
    } else{
        // total = worldTotal
        // data = worldData
        chrome.storage.local.get(['worldTotal','worldData'],(response=>{
            total = response.worldTotal
            data = response.worldData
            updateUI('Country')

        }))
    }
}

function updateUI(cors){
    document.getElementById('stat1').innerText = `${total.confirmed}`
    document.getElementById('stat2').innerText = `${total.recovered}`
    document.getElementById('stat3').innerText = `${total.deaths}`
    document.getElementById('deltastat1').innerText = `(+${total.deltaconfirmed})`
    document.getElementById('deltastat2').innerText = `(+${total.deltarecovered})`
    document.getElementById('deltastat3').innerText = `(+${total.deltadeaths})`
    
    
    var tableStr = `<tr>
        <th>${cors}</th>
        <th>Confirmed</th>
        <th>Active</th>
        <th>Deaths</th>
        <th>Recovered</th>
    </tr>`
    
    var labels=[], valuesC = [], valuesR = [], valuesD = [];
    
    data.forEach(e=>{
            labels.push(e.state)
            valuesC.push(e.confirmed)
            valuesD.push(e.deaths)
            valuesR.push(e.recovered)
    
            tableStr +=`
            <tr>
                <td>${e.state}</td>
                <td>${e.confirmed}</td>
                <td>${e.active}</td>
                <td>${e.recovered}</td>
                <td>${e.deaths}</td>
            </tr>`
    })
    document.getElementById('dataTable').innerHTML = tableStr

    var plotDat1 = [{
        values: valuesC,
        labels:labels,
        type: 'pie',
        textposition:'inside', 
        textinfo:'percent+label',
        showlegend:false
    }];

    var plotDat2 = [{
        values: valuesR,
        labels:labels,
        type: 'pie',
        textposition:'inside', 
        textinfo:'percent+label',
        showlegend:false
    }];

    var plotDat3 = [{
        values: valuesD,
        labels:labels,
        type: 'pie',
        textposition:'inside', 
        textinfo:'percent+label',
        showlegend:false
    }];

    var layout = {
        autosize:true,
        margin:{
            l:10,
            r:10,
            b:0,
            t:0 },
            padding:0
    };
    Plotly.newPlot('graph1', plotDat1, layout, {displayModeBar: false});
    Plotly.newPlot('graph2', plotDat2, layout, {displayModeBar: false});
    Plotly.newPlot('graph3', plotDat3, layout, {displayModeBar: false});
}