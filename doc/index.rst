Cupd, real time dashboard
=========================

Cupd is a real time, nodejs-powered and websocket-based dashboard server. It
exposes an API for services, which publish data, and embeds a small web server
to display a dashboard to the real users. Basically, it allows you to plug any
kind of data source (RSS feeds, IRC chat, web statistics, video streaming and
so on) and broadcast it to an unlimited number of users, through an highly
customizable dashboard interface.


Quickstart
----------

You must have nodejs and a websocket-capable web browser installed. Once you
are ready, do something like this:

.. code-block:: bash
    
    $ git clone git://github.com/pelletier/cupd.git
    $ cd cupd
    $ node app/cupd.js

Your Cupd dashboard is now available on `<http://localhost:3000/>`_. However,
without services (ie, data sources), it is not really interesting. Fire another
terminal, and:

.. code-block:: bash
    
    $ cd cupd/plugins/hello_world
    $ ruby hello_world.rb

Once the plugin is initialized, you can switch back to your web browser and see
a nice ``Hello world`` with the local time running above.


Questions? Want to get involved?
--------------------------------

Pick one:

- Fork and request a pull on GitHub.
- Drop me `an email <thomas.about.cupd@pelletier.im>`_.
- Get in touch on `Twitter <http://twitter.com/kizlum/>`_.


Contents
--------

.. toctree::
   :maxdepth: 2
   
   services_api

* :ref:`search`

