import http from 'http'
import app from './app.js';
import fs from 'fs'

let PORT=process.env.PORT || 3000;
let server=http.createServer({
    cert:fs.readFileSync("./cert.pem"),
    key:fs.readFileSync("./key.pem")
},app);

server.listen(PORT,()=>{
    console.log(`🚀 Server running on port ${PORT}`);
})