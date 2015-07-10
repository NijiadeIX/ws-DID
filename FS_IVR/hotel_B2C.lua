http               = require('httpAgent')
hotel              = {}
callId             = session:get_uuid()
accessUrl          = 'http://192.168.231.1:8888/access/get'
dnisUrl            = 'http://192.168.231.1:8888/callid/get'
welcomeWav         = 'hotel-welcome_1.wav'
inputErrWav        = 'hotel-input_error.wav'
inputErrMaxWav     = 'hotel-input_error_max.wav'
accessDeniedWav    = 'hotel-access_denied.wav'
callRejectedWav    = 'hotel-call_rejected.wav'
hasLeftBuildingWav = 'hotel-has_left_the_building.wav'

-- access control --
function checkAccess(departId)
    local accessible = false
    local reqData = {
        department_id = departId
    }
    local statusCode, resData = http.post(accessUrl, reqData)
    if statusCode == 200 and resData.response_code ~= nil and resData.response_code == 'hotel_success' then
        accessible = true
    end 
    return accesible
end

-- get dnis --
function getDnis(departId, serviceType, callerNum, calleeNum)
    local digits, resultCode, dnis
    local time = 3 
    while (time > 0)
    do  
        if time == 3 then
            digits = ssession:playAndGetDigits(2, 10, 1, 15000, "#", welcomeWav, "", "\\d+")
        else
            digits = ssession:playAndGetDigits(2, 10, 1, 15000, "#", inputErrWav, "", "\\d+")
        end

        if digits == nil then  -- no input --
            if (time > 1) then  
                session:execute('playback', inputErrWav)
            else
                session:execute('playback', inputErrMaxWav)
            end 
        else   -- call web service --
            local body = {
                department_id     = departId,
                service_type      = serviceType,
                call_in_caller_id = callerNum,
                call_in_callee_id = calleeNum,
                dtmf              = digits,
                call_id           = callId
            }
            local statusCode, body = http.post(dnisUrl, body)

            if (statusCode == 200) then
                if body.response_code == 'hotel_success' then
                    dnis = body.call_out_callee_id
                    break
                elseif body.response_code == 'hotel_orders_error1' then
                    if (time == 0) then  
                        session:execute('playback', inputErrMaxWav)
                    end 
                elseif body.response_code == 'hotel_orders_error2' then
                    session:execute('playback', hasLeftBuildingWav)
                    break
                elseif body.response_code == 'hotel_blacklist' then
                    session:execute('playback', callRejectedWav)
                    break
                end
            else
                session:consoleLog('warn', 'web service wrong')
            end
        end

        time = time - 1
    end
    return dnis
end

function dial(dnis) 
    session:execute('bridge', 'user/' .. dnis)
end

function hotel.run(departId, serviceType, callerNum, calleeNum)
    local accessible = checkAccess(departId)
    if accessible == false then 
        --play music--
        session:execute('playback', accessDeniedWav)
        session:hangup()
        return
    end

    local dnis = getDnis(departId, serviceType, callerNum, calleeNum)
    print('---------- dnis -------------------')
    print(dnis)
    if dnis == nil then 
        session:hangup()
        return
    end

    dial(dnis)  
end

return hotel
