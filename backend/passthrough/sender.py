import socket

class UdpSender:
    def __init__(self, host="127.0.0.1", port=10016):
        self.host = host
        self.port = port
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    def send(self, data):
        self.sock.sendto(data, (self.host, self.port))