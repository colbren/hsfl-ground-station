import socket
from datetime import datetime

from .packet_store import packet_buffer


def start_listener():
    HOST = "0.0.0.0"
    PORT = 10015

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((HOST, PORT))

    print(f"Listening on UDP {HOST}:{PORT}")

    while True:
        data, addr = sock.recvfrom(4096)

        packet = {
            "timestamp": datetime.now().isoformat(),
            "source": f"{addr[0]}:{addr[1]}",
            "length": len(data),
            "data": data.hex(),
        }

        packet_buffer.appendleft(packet)

        print(
            f"[{packet['timestamp']}] "
            f"{packet['source']} "
            f"{packet['length']} bytes"
        )