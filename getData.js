parseVal= (elem) => parseInt(elem.replace(/,/g, ""))

function filterWorldData(input){ // world api data is not sorted and also contain comma
    var data = [];
    input.forEach(i=>{
        if(i.Country=='World'){ // WTF?
            var total={
                confirmed: parseVal(i.TotalCases),
                recovered: parseVal(i.TotalRecovered),
                deaths : parseVal(i.TotalDeaths),
                deltaconfirmed: parseVal(i.NewCases),
                deltarecovered: parseVal(i.NewDeaths),
                deltadeaths: ''
            }
        }else if(i.Country=='Total:') {
            return
        } else{
            data.push({
                state: i.Country, // just to be consistent with india data
                confirmed: parseVal(i.TotalCases),
                recovered: parseVal(i.TotalRecovered),
                deaths : parseVal(i.TotalDeaths),
                active : parseVal(i.ActiveCases)
            })
        }
        data = data.sort((a,b) => (a.confirmed < b.confirmed) ? 1 : ((b.confirmed < a.confirmed) ? -1 : 0));
        data = data.slice(0,30)
    })
    console.log(total, data)
    return [total, data]
}


var indiaData,indiaTotal,worldData,worldTotal;



function updateData(){

        // get india data
        axios.get('https://api.covid19india.org/data.json').then(response=>{
            if(response.status !=200) console.log('failed')
            indiaTotal =  response.data.statewise[0]
            indiaData = response.data.statewise.slice(1)
            console.log(response)
            chrome.storage.local.set({indiaTotal})
            chrome.storage.local.set({indiaData})

        })

        //world data

        axios.get('https://covid19-server.chrismichael.now.sh/api/v1/AllReports').then(response=>{
            if(response.status !=200) console.log('failed')


            worldData = []
            response.data.reports[0].table[0].forEach(i=>{
                if(i.Country=='World'){ // WTF?
                    worldTotal={
                        confirmed: parseVal(i.TotalCases),
                        recovered: parseVal(i.TotalRecovered),
                        deaths : parseVal(i.TotalDeaths),
                        deltaconfirmed: parseVal(i.NewCases),
                        deltarecovered: parseVal(i.NewDeaths),
                        deltadeaths: ''
                    }
                }else if(i.Country=='Total:') {
                    return
                } else{
                    worldData.push({
                        state: i.Country, // just to be consistent with india worldData
                        confirmed: parseVal(i.TotalCases),
                        recovered: parseVal(i.TotalRecovered),
                        deaths : parseVal(i.TotalDeaths),
                        active : parseVal(i.ActiveCases)
                    })
                }
                worldData = worldData.sort((a,b) => (a.confirmed < b.confirmed) ? 1 : ((b.confirmed < a.confirmed) ? -1 : 0));
                worldData = worldData.slice(0,30)
                
            })
            console.log(response)
            chrome.storage.local.set({worldTotal})
            chrome.storage.local.set({worldData})
            
            chrome.browserAction.setBadgeText({
                text: `${(worldTotal.confirmed/1e6).toFixed(1)}M `
            })
            chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' })
            // changeCountry()
        })

}

updateData()

setInterval(updateData, 1000*60*30)