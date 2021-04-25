import json, requests
import xml.etree.ElementTree as XML


"""
Possible parameters:
starttime
endtime
timestep
parameters
crs
bbox
place
fmisid
maxlocations
geoid
wmo
"""
def createWeatherJson(start, end):
    respond = requests.get("http://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::daily::simple&place=tuusula&starttime=2021-02-22T00:00:00Z")
    data = respond.text
    root = XML.fromstring(data)

    dataList = list()
    for value,name,time in zip(root.iter("{http://xml.fmi.fi/schema/wfs/2.0}ParameterValue"),root.iter("{http://xml.fmi.fi/schema/wfs/2.0}ParameterName"), root.iter("{http://xml.fmi.fi/schema/wfs/2.0}Time")):
        #print(time.text, name.text, value.text)
        date = time.text.split("T")[0]

        dataList.append({"name":name.text, "value":value.text, "time":date})

    with open('./src/data/weather.json', 'w') as out:
        json.dump(dataList, out)

    print("Weather data saved.")

    return "Success"
