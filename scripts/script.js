const cnfrm = document.getElementById('confirm')
const activ = document.getElementById('active')
const rcvrd = document.getElementById('recover')
const death = document.getElementById('deaths')
const world = document.getElementById('wbtn')
const india = document.getElementById('ibtn')
const graph = document.getElementById('graph')
const table = document.getElementById('dataTable')

var currentCountry='india', currntCond='confirmed', stat;


world.onclick = ()=>{
    india.classList.remove('counClick')
    world.classList.add('counClick')
    currentCountry = 'world'
    updateUI()
}

india.onclick = ()=>{
    world.classList.remove('counClick')
    india.classList.add('counClick')
    currentCountry = 'india'
    updateUI()
}

cnfrm.onclick = () =>{
    rcvrd.classList.remove('condClick')
    death.classList.remove('condClick')
    activ.classList.remove('condClick')
    cnfrm.classList.add('condClick')
    currntCond = 'confirmed'
    updateChart()
}

activ.onclick = () =>{
    rcvrd.classList.remove('condClick')
    death.classList.remove('condClick')
    cnfrm.classList.remove('condClick')
    activ.classList.add('condClick')
    currntCond = 'active'
    updateChart()
}

rcvrd.onclick = () =>{
    rcvrd.classList.add('condClick')
    death.classList.remove('condClick')
    activ.classList.remove('condClick')
    cnfrm.classList.remove('condClick')
    currntCond = 'recovered'
    updateChart()
}


death.onclick = () =>{
    rcvrd.classList.remove('condClick')
    death.classList.add('condClick')
    activ.classList.remove('condClick')
    cnfrm.classList.remove('condClick')
    currntCond = 'deaths'
    updateChart()
}


function updateChart(){
    Plotly.restyle(graph,{
        labels : [stat[currentCountry].labels],
        values : [stat[currentCountry][currntCond]],
    })
}


function updateUI(){
    // update the stats on top bar
    document.getElementById('stat1').innerText = `${stat[currentCountry].total.confirmed}`
    document.getElementById('stat2').innerText = `${stat[currentCountry].total.active}`
    document.getElementById('stat3').innerText = `${stat[currentCountry].total.recovered}`
    document.getElementById('stat4').innerText = `${stat[currentCountry].total.deaths}`

    // no delta in active cases
    if(stat[currentCountry].total.deltaconfirmed) document.getElementById('deltastat1').innerText = `(+${stat[currentCountry].total.deltaconfirmed})`
    if(stat[currentCountry].total.deltarecovered) document.getElementById('deltastat3').innerText = `(+${stat[currentCountry].total.deltarecovered})`
    if(stat[currentCountry].total.deltadeaths) document.getElementById('deltastat4').innerText = `(+${stat[currentCountry].total.deltadeaths})`

    //update table
    var tableStr = `<tr>
        <th>${currentCountry=='world' ? 'Country': 'State/UT'}</th>
        <th>Confirmed</th>
        <th>Active</th>
        <th>Deaths</th>
        <th>Recovered</th>
    </tr>`

    for(let i=0; i<stat[currentCountry].labels.length; i++){
        tableStr +=`
        <tr>
            <td>${stat[currentCountry].labels[i]}</td>
            <td>${stat[currentCountry].confirmed[i]}</td>
            <td>${stat[currentCountry].active[i]}</td>
            <td>${stat[currentCountry].deaths[i]}</td>
            <td>${stat[currentCountry].recovered[i]}</td>
        </tr>`
    }

    table.innerHTML = tableStr;
    updateChart();
}


function initialUIUpdate(){
    Plotly.newPlot(graph,
        [{
            values: stat[currentCountry][currntCond],
            labels:stat[currentCountry].labels,
            type: 'pie',
            textposition:'inside', 
            textinfo:'percent+label',
            showlegend:false
        }]
        ,{
            height:300,
            width:300,
            margin:{
                l:0,
                r:0,
                b:0,
                t:0 },
                padding:0
        },{
            displayModeBar: false
        });
        updateUI()
}

// for testing locally
// stat = {
//     'world' : JSON.parse(localStorage.getItem('world')),
//     'india' : JSON.parse(localStorage.getItem('india')),
// }
// initialUIUpdate()


chrome.storage.local.get(['world','india'],(response=>{
    stat = response;
    console.log(stat)
    initialUIUpdate()
}))

chrome.storage.onChanged.addListener(()=>{
    chrome.storage.local.get(['world','india'],(response=>{
        stat = response;
        console.log(stat)
        initialUIUpdate()
    }))
})