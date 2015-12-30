from dropbox import DropboxOAuth2Flow

class Dropbox:
  # session[csrf_token_session_key] will be stored
  def get_dropbox_auth_flow(config, session):
    return DropboxOAuth2Flow(
      config['DROPBOX_APP_KEY'],
      config['DROPBOX_APP_SECRET'],
      config['DROPBOX_REDIRECT'],
      session,
      "dropbox-auth-csrf-token")

  # URL handler for /dropbox-auth-start
  def dropbox_auth_start(web_app_session, request):
    authorize_url = get_dropbox_auth_flow(web_app_session).start()
    return authorize_url

  # URL handler for /dropbox-auth-finish
  def dropbox_auth_finish(web_app_session, request):
    try:
      access_token, user_id, url_state = \
              get_dropbox_auth_flow(web_app_session).finish(
                  request.query_params)
    except BadRequestException, e:
        http_status(400)
    except BadStateException, e:
        # Start the auth flow again.
        redirect_to("/dropbox-auth-start")
    except CsrfException, e:
        http_status(403)
    except NotApprovedException, e:
        flash('Not approved?  Why not?')
        return redirect_to("/home")
    except ProviderException, e:
        logger.log("Auth error: %s" % (e,))
        http_status(403)
