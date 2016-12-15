import bottle
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from hub.web.manager import web_manager
from hub.web.bottle import bottle_get_wsock

def web_greenlet(context, webapp_path):
    app = bottle.Bottle()

    @app.route('/websockets/gui')
    def handle_gui_websocket():
        wsock = bottle_get_wsock(bottle.request)
        web_manager(context, wsock)

    # if no route was found above, look for static files in webapp subdir
    @app.route('/')
    @app.route('/<filepath:path>')
    def server_static(filepath = 'index.html'):
        print('serving ' + filepath)
        return bottle.static_file(filepath, root = webapp_path)

    server = WSGIServer(("0.0.0.0", 8081), app,
                        handler_class=WebSocketHandler)
    server.serve_forever()
