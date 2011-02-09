.. _installation:

Installation
============

Before serving amazing real-time dashboards to the world, you need to download
and install Cupd's dependencies which are NodeJS and ExpressJS.

NodeJS
------

Because the server side of Cupd is built on top of `NodeJS
<http://nodejs.org/>`_ you need to install it before starting. The easiest way
is to check your operating system documentation and install a prepackaged
version of NodeJS. Otherwise you can build and install it `from source
<https://github.com/ry/node/wiki/Installation>`_.

ExpressJS
---------

Cupd embeds a small web server which heavily uses `ExpressJS
<http://expressjs.com/>`_ therefore you will obviously need it.  According to
their `installation guide <http://expressjs.com/guide.html>`_ you can use one
of the following way to install it:

With curl:

.. code-block:: bash

    $ curl -# http://expressjs.com/install.sh | sh


With `npm <http://npmjs.org/>`_:

.. code-block:: bash

    $ npm install express

Or building from the Git trunk:

.. code-block:: bash

    $ git clone https://github.com/visionmedia/express.git
    $ git submodule update --init
    $ make install
    $ make install-support

