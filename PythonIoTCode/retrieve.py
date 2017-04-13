import urllib3
import certifi
import win32api,win32con
import win32com.client as comctl
import json
import time
# It is absolutely CRITICAL that you use certificate validation to ensure and guarantee that
# 1. you are indeed sending the message to *.hanatrial.ondemand.com and
# 2. that you avoid the possibility of TLS/SSL MITM attacks which would allow a malicious person to capture the OAuth token
# URLLIB3 DOES NOT VERIFY CERTIFICATES BY DEFAULT
# Therefore, install urllib3 and certifi and specify the PoolManager as below to enforce certificate check
# See https://urllib3.readthedocs.org/en/latest/security.html for more details

# use with or without proxy
http = urllib3.PoolManager(
    cert_reqs='CERT_REQUIRED', # Force certificate check.
    ca_certs=certifi.where(),  # Path to the Certifi bundle.
)
# http = urllib3.proxy_from_url('http://proxy_host:proxy_port')

# interaction for a specific Device instance - replace 1 with your specific Device ID
#url = 'https://iotmmsp651606trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/data/1ac8a403-d4ec-4279-a31e-985127275d8b'
url = 'https://iotmmsp651606trial.hanatrial.ondemand.com/com.sap.iotservices.mms/v1/api/http/data/17a0ae42-ef16-433a-854c-7d38d1ee4f0a'

# send message of Message Type 'm0t0y0p0e1' and the corresponding payload layout that you defined in the IoT Services Cockpit
body1='{"mode":"async", "messageType":"9658e7591ba1f6500040", "messages":[{"ledstate":'
body_state = 'true'
body_time = ( str(int(time.time())))
body2=', "timestamp":'+str(body_time)+'}]}'
body = body1 + body_state + body2

headers = urllib3.util.make_headers()
    
def isCapsLockOn():
    "return 1 if CapsLock is ON"
    return win32api.GetKeyState(win32con.VK_CAPITAL)

# use with authentication
# please insert correct OAuth token
#headers['Authorization'] = 'Bearer ' + '82bf79b77fe14aa7f7b62c186cade6da'
headers['Authorization'] = 'Bearer ' + 'aadd62c64ebf82fd28d4375cc9f409d'
headers['Content-Type'] = 'application/json;charset=utf-8'

wsh = comctl.Dispatch("WScript.Shell")

def sendStateToCloud():
    try:
            body_state = str(bool(isCapsLockOn()))
            body_time = ( str(int(time.time())))
            body2=', "timestamp":'+body_time+'}]}'
            body = str(body1) + str(body_state) + str(body2)
            r = http.urlopen('POST', url, body=body, headers=headers)
            print("_____________________________"+str(body_state))
            print(r.data)
    except urllib3.exceptions.SSLError as e:
            print (e)

sendStateToCloud()

last_caps = isCapsLockOn()


try:
    while True:
        r = http.urlopen('GET', url, headers=headers)
        j = json.loads(r.data.decode("utf-8"))
        if(last_caps != isCapsLockOn()):
            last_caps = isCapsLockOn()
            sendStateToCloud()
        
        if (len(r.data) > 2):
            led_state = j[0]['messages'][0]['Censor2']
            #print(r.status)
            print("_____________________________________")
            print(r.data)
            print("_____________________________________")
            print(j[0]['messages'][0]['Censor2'])
            if (led_state and not isCapsLockOn()):
                wsh.SendKeys("""{CAPSLOCK}""")
                sendStateToCloud()
            elif (not led_state and isCapsLockOn()):
                wsh.SendKeys("""{CAPSLOCK}""")
                sendStateToCloud()
except KeyboardInterrupt:
    print ('interrupted!')

