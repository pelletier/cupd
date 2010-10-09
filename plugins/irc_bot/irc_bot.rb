# IRC client which acts as a server for Cupd

require 'rubygems'
require 'json'
require 'socket'
require 'web_socket'


$SAFE = 1

$UID = nil;


class IRC
  def initialize(server, port, nick, channel)
    @websocket_client = WebSocket.new("ws://192.168.0.42:8001/") 

    Thread.new() do
      while data = @websocket_client.receive()
        data = JSON.parse(data)
        if data['type'] == 'welcome'
          $UID = data['uid']

          auth_message = {
            :uid => $UID,
            :type => 'auth',
            :name => 'irc_bot'
          }

          @websocket_client.send(auth_message.to_json)

        end
      end
    end



    @server = server
    @port = port
    @nick = nick
    @channel = channel
  end

  def send(s)
    puts "--> #{s}"
    @irc.send("#{s}\n", 0)
  end

  def connect()
    @irc = TCPSocket.open(@server, @port)
    send "USER blah blah blah :blah blah"
    send "NICK #{@nick}"
    send "JOIN #{@channel}"
  end

  def handle_server_input(s)
    case s.strip
      when /^PING :(.+)$/i
        puts "[ Server ping ]"
        send "PONG :#{$1}"
      when /^:(.+?)!(.+?)@(.+?)\sPRIVMSG\s.+\s:[\001]PING (.+)[\001]$/i
        puts "[ CTCP PING from #{$1}!#{$2}@#{$3} ]"
        send "NOTICE #{$1} :\001PING #{$4}\001"
      when /^:(.+?)!(.+?)@(.+?)\sPRIVMSG\s.+\s:[\001]VERSION[\001]$/i
        puts "[ CTCP VERSION from #{$1}!#{$2}@#{$3} ]"
        send "NOTICE #{$1} :\001VERSION Ruby-irc v0.042\001"
      when /^:(.+?)!.* PRIVMSG (#[a-zA-Z0-9]*) :(.+)$/i
        if $2 == @channel
          puts "#{$1} >>> #{$3}"

          update_message = {
            :uid => $UID,
            :type => 'data',
            :data => {
                :username => $1,
                :text => $3
              }
          }

          @websocket_client.send( update_message.to_json )
        end
      else
        puts s 
    end
  end

  def main_loop()
    while true
      s = @irc.gets
      handle_server_input(s)
    end
  end
end


irc = IRC.new('irc.freenode.net', 6667, 'cupd__', '#archlinux')
irc.connect()
begin
  irc.main_loop()
rescue Interrupt
rescue Exception => detail
  puts detail.message()
  print detail.backtrace.join('\n')
  retry
end
