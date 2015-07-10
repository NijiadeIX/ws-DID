local http  = require("socket.http")
local ltn12 = require("ltn12")
local json  = require("json")

local httpAgent = {}
function httpAgent.post(_url, _postData)
    local r,c 
    local responseBody = {}
    local data = json.encode(_postData)
    body,code = http.request{  
        url =  _url,
        method = "POST",  
        headers =   
        {   
            ["Content-Type"] = "application/json",  
            ["Content-Length"] = #data,  
        },  
        source = ltn12.source.string(data),  
        sink = ltn12.sink.table(responseBody)  

    }   
    return code,json.decode(table.concat(responseBody))
end
return httpAgent
