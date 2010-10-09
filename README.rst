====
Cupd
====

Cupd is a real time, `nodejs <http://nodejs.org/>`_-powered and `websocket
<http://dev.w3.org/html5/websockets/>`_-based dashboard server. It exposes an
API for services, which publish data, and embeds a small web server to display
a dashboard to the real users. Basically, it allows you to plug any kind of
data source (RSS feeds, IRC chat, web statistics, video streaming and so on)
and broadcast it to an unlimited number of users, through an highly
customizable dashboard interface.

Quickstart
----------

    For more documentation, read the `wiki
    <http://github.com/pelletier/cupd/wiki/_pages>`_.

You must have nodejs and a websocket-capable web browser installed. Once you
are ready, do something like this::

    $ git clone git://github.com/pelletier/cupd.git
    $ cd cupd
    $ node app/cupd.js

Your Cupd dashboard is now available on `<http://localhost:3000/>`_. However,
without services (ie, data sources), it is not really interesting. Fire another
terminal, and::

    $ cd cupd/plugins/hello_world
    $ ruby hello_world.rb

Once the plugin is initialized, you can switch back to your web browser and see
a nice ``Hello world`` with the local time running above.

Questions? Getting involved?
----------------------------

Pick one:

- Fork and request a pull on GitHub.
- Drop me `an email <thomas.about.cupd@pelletier.im>`_.
- Get in touch on `Twitter <http://twitter.com/kizlum/>`_.

License
-------

Copyright (c) 2010 Thomas Pelletier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

