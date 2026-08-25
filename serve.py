import http.server
import socketserver
import os

os.chdir(r"C:\Users\nicko\Documents\EagleCatch Website v2")
handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", 8080), handler) as httpd:
    print("Serving on port 8080", flush=True)
    httpd.serve_forever()
