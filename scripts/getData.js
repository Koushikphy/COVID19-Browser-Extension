parseVal= (elem) => parseInt(elem.replace(/,/g, ""))

function filterWorldData(input){ // world api data is not sorted and also contain comma
    var data = [], total, labels = [], confirmed = [], active=[], deaths=[],recovered=[];

    input.forEach(i=>{
        if(i.Country=='World'){ // WTF?
            total={
                confirmed: parseVal(i.TotalCases),
                active: parseVal(i.ActiveCases),
                recovered: parseVal(i.TotalRecovered),
                deaths : parseVal(i.TotalDeaths),
                deltaconfirmed: parseVal(i.NewCases)==0? '': `(+${parseVal(i.NewCases)})`,
                deltarecovered: '',
                deltadeaths: parseVal(i.NewDeaths)==0? '': `(+${parseVal(i.NewDeaths)})`
            }
        }else if(i.Country=='Total:') { // from the last line, just ignore
            return
        } else { // TODO: Bad loop structure to sort out the data
            data.push({
                country: i.Country, 
                confirmed: parseVal(i.TotalCases),
                recovered: parseVal(i.TotalRecovered),
                deaths : parseVal(i.TotalDeaths),
                active : parseVal(i.ActiveCases)
            })
        }
        data = data.sort((a,b) => (a.confirmed < b.confirmed) ? 1 : ((b.confirmed < a.confirmed) ? -1 : 0));
    })
    data.slice(0,50).forEach(e=>{ // take just 50 countries in sorted
        labels.push(e.country)
        confirmed.push(e.confirmed)
        active.push(e.active)
        deaths.push(e.deaths)
        recovered.push(e.recovered)
    })

    return {total,labels,confirmed,active,deaths,recovered}
}




function filterIndiaData(input){
    var  total, labels = [], confirmed = [], active=[], deaths=[],recovered=[];
    let ttl = input[0]
    total={
        confirmed: parseVal(ttl.confirmed),
        active: parseVal(ttl.active),
        recovered: parseVal(ttl.recovered),
        deaths : parseVal(ttl.deaths),
        deltaconfirmed: parseVal(ttl.deltaconfirmed)==0? '': `(+${parseVal(ttl.deltaconfirmed)})`,
        deltarecovered: parseVal(ttl.deltarecovered)==0? '': `(+${parseVal(ttl.deltarecovered)})`,
        deltadeaths: parseVal(ttl.deltadeaths)==0? '': `(+${parseVal(ttl.deltadeaths)})`
    }

    input.forEach(elem=>{
        if(elem.state=='Total') return
        labels.push(elem.state)
        confirmed.push(elem.confirmed)
        active.push(elem.active)
        deaths.push(elem.deaths)
        recovered.push(elem.recovered)
    })
    return {total,labels,confirmed,active,deaths,recovered}
}



function updateData(){

        // get india data
        axios.get('https://api.covid19india.org/data.json').then(response=>{
            if(response.status !=200) console.log('failed')
            data = filterIndiaData(response.data.statewise)
            console.log(data)
            // localStorage.setItem('india',JSON.stringify(data))
            chrome.storage.local.set({'india':data})
            chrome.browserAction.setBadgeText({
                text: `${(data.total.confirmed)}`
            })
            chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' })
        })

        axios.get('https://covid19-server.chrismichael.now.sh/api/v1/AllReports').then(response=>{
            if(response.status !=200) console.log('failed')

            data = filterWorldData(response.data.reports[0].table[0])
            console.log(data)

            // localStorage.setItem('world',JSON.stringify(data))
            chrome.storage.local.set({'world':data})
        })
}

updateData()
setInterval(updateData, 1000*60*10)// update data every 10 minutes