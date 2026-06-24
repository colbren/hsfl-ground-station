import socket

class UdpReceiver:
    def __init__(self, host="0.0.0.0", port=10015):
        self.host = host
        self.port = port

    def receive(self):
        data, addr = self.sock.recvfrom(4096)
        return data, addr

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.bind((self.host, self.port))