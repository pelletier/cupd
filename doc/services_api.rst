.. _services_api:

Services API
============

Services API is the entry point for data providers. It is built on top of
websocket. So first of all, pick a websocket **client** library for your
favorite language:

    - Python: `<http://github.com/mtah/python-websocket>`_
    - Ruby: `<http://github.com/gimite/web-socket-ruby>`_
    - Javascript: `<http://github.com/guille/node.websocket.js/>`_
    - Java: `<http://github.com/adamac/Java-WebSocket-client>`_
    - Erlang: `<http://github.com/davebryson/erlang_websocket>`_
    - ...

Once you've got familiar with it read further.

How it works
------------

It is pretty easy: first, you do the handshake, then you send payloads of
data. All the exchanges are JSON-formatted, and must follow a given structure.

Handshake
---------

Once you are connected to the server, it will send you the following message::

    {
        "type": "welcome",
        "uid": "ACA764FEF7ED43D3BF7D31472B952987"
    }

The ``type`` field must be in every single message. The ``welcome`` message
basically allows you a `unique id <http://www.ietf.org/rfc/rfc4122.txt>`_. You
**must** retain the given uuid, because all the messages *you* are going to
send must contain an ``uid`` field which contains this string.

You now have to authenticate.

    Note:
    For now, authenticating is not yet fully designed. We plan to add
    a public /private keys authentication here.

Send a message like the following::

    {
        "type": "auth",
        "uid": "ACA764FEF7ED43D3BF7D31472B952987",
        "name": "your_app",
    }

Your application name must be consistent with the one you use in your widget.

    Note:
    The authentication will enable a strict check of the uniqueness of your
    application name in a future release.


