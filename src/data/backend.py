import urllib3, http.server
import weather
import lumofetch

class ServerHandler(http.server.BaseHTTPRequestHandler):
    print("Server running...")
    def do_GET(self):
        print("Got request")
        if("update_weather") in self.path:
            print("update weather request")
            weather.createWeatherJson(None, None)
            print("Weather update done")

        if("update_consumption") in self.path:
            print("update consumption request")
            lumofetch.lumoFetch()
            print("Lumofetch done")
        
        if("update_daily") in self.path:
            date = self.path.split("/")[-1]
            print("update consumption request for date: "+date)
            lumofetch.lumoFetch(date)
            print("Lumofetch done")

        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

http.server.HTTPServer(("localhost", 8001), ServerHandler).serve_forever()