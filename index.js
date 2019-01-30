var request = require('request');
var fs = require('fs');
var urls = require('./src/urls.json');
var ping = require('./src/ping.json');
var br = require('os').EOL;
var now = new Date();
var time = now.getDate()+'.'+now.getMonth()+1+'.'+now.getFullYear()+' '+ now.getHours()+':'+ now.getMinutes()+':'+ now.getSeconds()+'.'+ now.getMilliseconds();
fs.appendFileSync('logfile.log', br+time +' >  LastPosted '+ping.lastUpdate+' Updated: '+ping.ping);

request.get(urls.flu, function (error, response, body) {    
    if (error != null) {
        fs.appendFileSync('logfile.log', br+time+' >  Error!: '+error);} else{
    if (response.statusCode === 200){
        var fluresponse = JSON.parse(body);
        fs.appendFileSync('logfile.log', br+'    Status: '+response.statusCode+', Message: '+fluresponse.Message+',  Cashed: '+fluresponse.CachedUntilString);
    var fludl = fluresponse.Data.length;
    var objhook = {};
    objhook.username = 'Fleet up update';
    objhook.embeds = [];
    for (var i=0; i < fludl; i++){
        var color = 10197915;
        if (fluresponse.Data[i].Posted > ping.lastUpdate){
            ping.lastUpdate = fluresponse.Data[i].Posted;
            ping.ping = true;
            objhook.content = fluresponse.Data[i].PostedString;
        }
        if (fluresponse.Data[i].Type == 'Shield') {var color = 4886754};
        if (fluresponse.Data[i].Type == 'Armor') {var color = 16098851};
        if (fluresponse.Data[i].Type == 'Final') {var color = 13632027};
        objhook.embeds.push({'title':fluresponse.Data[i].SolarSystem + ' ' + fluresponse.Data[i].Planet + '-' + fluresponse.Data[i].Moon+' > '+fluresponse.Data[i].TimerType,'description':fluresponse.Data[i].Type+':: '+fluresponse.Data[i].ExpiresString,'color':color});
    };
    fs.writeFileSync('./src/msg.json',JSON.stringify(objhook));
    var msg = require('./src/msg.json');
    fs.writeFileSync('./src/ping.json',JSON.stringify(ping));
    var postoption = {
        headers:{'cache-control': 'no-cache',
        'Content-Type': 'application/json'},
        body: msg,
        json:true
    };
  if (ping.ping === true) {
      fs.appendFileSync('logfile.log', br+'    '+time +' Updated: '+ping.ping);
      request.post(urls.dwh, postoption, function (error, response, body) {
        if (error != null) {
            fs.appendFileSync('logfile.log', br+time+' >  Discord error!: '+error);}
        if (response.statusCode != 204){
            fs.appendFileSync('logfile.log', br+time+' >  Discord response status: '+response.statusCode+' - '+body.message);}
  });
}
  } else {
    fs.appendFileSync('logfile.log', br+'    Fleet up status: '+response.statusCode +' '+fluresponse.code +' <<')};
   console.log('ping:', ping);
    ping.ping = false;
    fs.writeFileSync('./src/ping.json',JSON.stringify(ping));}
    var msg = null;
  });