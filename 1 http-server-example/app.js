const http = require("http");

const server = http.createServer((request, response)=>{
    console.log(request);

    const {url} = request;

    if(url === "/"){
        response.write("<h2>Home page</h2>");
    }
    response.end();
});

server.listen(3000, ()=> {
    console.log("Server started!");
});
