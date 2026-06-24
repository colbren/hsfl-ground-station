import socket
from datetime import datetime

from .packet_store import packet_buffer


def start_telemetry_pipeline():
    RX_HOST = "0.0.0.0"
    RX_PORT = 10015

    TX_HOST = "127.0.0.1"
    TX_PORT = 10016

    rx_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    rx_sock.bind((RX_HOST, RX_PORT))

    tx_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    print(f"[TEL] RX on {RX_PORT} → TX to {TX_PORT}")

    while True:
        data, addr = rx_sock.recvfrom(4096)

        packet_buffer.appendleft({
            "type": "telemetry",
            "timestamp": datetime.now().isoformat(),
            "source": f"{addr[0]}:{addr[1]}",
            "length": len(data),
            "data": data.hex(),
        })

        tx_sock.sendto(data, (TX_HOST, TX_PORT))