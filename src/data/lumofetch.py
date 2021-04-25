import requests
import json
import time
from bs4 import BeautifulSoup

def lumoFetch(date=None):
    path = "./src/data/"
    #Load credentials from credentials.txt: account and password in json format
    file = open(path+"credentials.txt", "r")
    credentials = json.loads(file.read())
    file.close()

    print("Initiating session...")
    s = requests.session()
    x = s.get('https://oma.lumoenergia.fi/login')

    #get csrf_token from the page
    soup = BeautifulSoup(x.content, features="html.parser")
    csrftoken = soup.find('input', dict(name='csrf_token'))['value']
    print("Done")
    print("Logging in...")
    #login with credentials + csrf
    credentials["csrf_token"] = csrftoken
    s.post("https://oma.lumoenergia.fi/login", data=credentials)
    print("Logged in")
    #get data finally
    currentDate = time.strftime("%Y-%m-%d", time.gmtime())
    print(currentDate)
    yearFirst = "2021-01-01"

    print("Reset usage data")
    s.get("https://oma.lumoenergia.fi/contracts/2839307/reset_usage")
    print("Usage data reset, should be fresh now...")

    if not date:
        print("Fetching monthly data...")
        x = s.get('https://oma.lumoenergia.fi/contracts/2839307/usage/monthly?from='+yearFirst+'&to='+currentDate)
        dataMonthly = json.loads(x.content)

        print("Saving monthly data...")
        with open(path+'monthly.json', 'w') as out1:
            json.dump(dataMonthly, out1)

        time.sleep(1)
        print("Fetching daily data...")
        x = s.get('https://oma.lumoenergia.fi/contracts/2839307/usage/daily?from='+yearFirst+'&to='+currentDate)
        dataDaily = json.loads(x.content)

        print("Saving daily data...")
        print(dataDaily)
        with open(path+'daily.json', 'w') as out2:
            json.dump(dataDaily, out2)

        time.sleep(1)
    
    if date:
        print("Fetching hourly data...")
        x = s.get('https://oma.lumoenergia.fi/contracts/2839307/usage/hourly?from='+date)
        dataHourly = json.loads(x.content)

        print("Saving hourly data...")
        print(dataHourly)
        with open(path+'hourly-'+date+'.json', 'w') as out3:
            json.dump(dataHourly, out3)

        with open(path+'hourly.json', 'w') as out4:
            json.dump(dataHourly, out4)

    print("Done!")

    s.close()
    print("Session closed")

    return "Success"

