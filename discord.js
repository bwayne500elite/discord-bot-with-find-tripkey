const Discord = require('discord.js');
const { token } = require('./token.json');
const client = new Discord.Client();
//import express 和 ws 套件
const express = require('express')
const SocketServer = require('ws').Server

//指定開啟的 port
const PORT = 3000

//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server })
var db = []
//當 WebSocket 從外部連結時執行
wss.on('connection', ws => {
    console.log('Client connected')

    //對 message 設定監聽，接收從 Client 發送的訊息
    ws.on('message', data => {
        //data 為 Client 發送的訊息，現在將訊息原封不動發送出去
        //ws.send(data)
      db = JSON.parse(data)
      //console.log(db[0])
    })

    ws.on('close', () => {
        console.log('Close connected')
    })
})
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// 當 Bot 接收到訊息時的事件
client.on('message', msg => {
    // 如果訊息的內容是 'ping'
   var realmsg = (msg.content).split('_');
   switch(realmsg[0]){
     case 'guluoma':
       msg.reply('附裝甲');
       break;
     case 'alluser':
       console.log(db[0]);
       msg.reply(JSON.stringify(db[0]));
       break;
     case '!find':
       var player = ""
       for (let i=0; i<db.length; i++) {
         //if(player==""){
           if(db[i]["name"].includes(realmsg[1])){
              player += "\n"+"Player"+" "+db[i]["name"]+"\n"+"tripkey = "+db[i]["fullTrip"]+"\n"+db[i]["skinUrl"]+"\n"
         }
         if(realmsg[1]=="noname"){
           if(db[i]["name"].includes(" ")){
           player += "\n"+"Player"+" "+db[i]["name"]+"\n"+"tripkey = "+db[i]["fullTrip"]+"\n"+db[i]["skinUrl"]+"\n"
         }
         }
        //}
        
       }
       msg.reply(player)
       break;
   }
});

client.login(token);