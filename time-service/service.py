from flask import Flask
from config import ConfigClass
from lib.dropboxHandler import DropboxHandler

app = Flask(__name__)
app.config.from_object(__name__+'.ConfigClass')

@app.route('/authorize/url')
def authorize():
  session = {}
  redirect_url = get_dropbox_auth_flow(app.config, session)
  return redirect_url

if __name__ == '__main__':
    app.run()
