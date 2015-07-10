callerNum = argv[1]
calleeNum = argv[2]

http = require('httpAgent')
url = 'http://192.168.231.1:8888/service_number/get_department'

if callerNum == nil or calleeNum == nil then
	session:consoleLog('error', 'caller number and callee number expected')
	return
end

local departId, serviceType
local data = {
	callee_id = calleeNum
}

local code, body = http.post(url, data)
if code == 200 then
	session:answer()
	departId = body.department_id
	serviceType = body.service_type

	local scriptName, script
	if serviceType == 'customer' then
		scriptName = 'hotel_B2C'
	elseif serviceType == 'supplier' then
		scriptName = 'hotel_C2B'
	end

	script = require(scriptName)
	script.run(departId, serviceType, callerNum, calleeNum)
else 
	session:consoleLog('error', 'web service error')
	session:hangup()
end