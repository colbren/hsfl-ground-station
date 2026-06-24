from datetime import datetime

from .packet_store import packet_buffer
from .receiver import UdpReceiver
from .sender import UdpSender


def start_passthrough():
    receiver = UdpReceiver()
    sender = UdpSender()

    receiver.start()

    while True:
        data, addr = receiver.receive()

        packet_buffer.appendleft({
            "timestamp": datetime.now().isoformat(),
            "source": f"{addr[0]}:{addr[1]}",
            "length": len(data),
            "data": data.hex(),
        })

        sender.send(data)