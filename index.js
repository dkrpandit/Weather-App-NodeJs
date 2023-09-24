
// -------------------------------------------------------------------------

const http = require("http")
const fs = require("fs")
const requests = require('requests');
const homeFile = fs.readFileSync("index.html", "utf-8")

const replaceVal = (temVal , orgVal)=>{
     let temperature = temVal.replace("{%temperature%}",(orgVal.main.temp -273.15).toFixed(2))
     temperature = temperature.replace("{%MinTemp%}",(orgVal.main.temp_min-273.15).toFixed(2))
     temperature = temperature.replace("{%MaxTemp%}",(orgVal.main.temp_max-273.15).toFixed(2))
     temperature = temperature.replace("{%city%}",orgVal.name)
     temperature = temperature.replace("{%Country%}",orgVal.sys.country)
     temperature = temperature.replace("{%weatherStatus%}",orgVal.weather[0].main)

     return temperature;
}
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=f539f50359792fceb4c030bab04d8547")
            .on('data', (chunk)=> {
                const objData = JSON.parse(chunk)
                arrayData = [objData]

                const realTimeData = arrayData.map((val)=>{
                    return replaceVal(homeFile,val)
                });

                // console.log(realTimeData.join(""))
                res.write(realTimeData.join(""))
            })
            .on('end', (err) =>{
                if (err) return console.log('connection closed due to errors', err);
                // console.log('end');
                res.end();

            });
    }
});

server.listen(8000 ,"localhost")
