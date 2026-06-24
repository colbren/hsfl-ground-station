import socket
from datetime import datetime

from .packet_store import packet_buffer


def start_command_pipeline():
    RX_HOST = "0.0.0.0"
    RX_PORT = 10026

    TX_HOST = "192.168.150.110"
    TX_PORT = 10025

    rx_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    rx_sock.bind((RX_HOST, RX_PORT))

    tx_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    print(f"[CMD] RX on {RX_PORT} → TX to {TX_PORT}")

    while True:
        data, addr = rx_sock.recvfrom(4096)

        packet_buffer.appendleft({
            "type": "command",
            "timestamp": datetime.now().isoformat(),
            "source": f"{addr[0]}:{addr[1]}",
            "length": len(data),
            "data": data.hex(),
        })

        tx_sock.sendto(data, (TX_HOST, TX_PORT))