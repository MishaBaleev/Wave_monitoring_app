from channels.generic.websocket import WebsocketConsumer
import ujson as json
from threading import Thread
import time
from pymavlink import mavutil
from .MissionItem import MissionItem
import math
import numpy as np

class MainConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.thread = None
        self.mavConnection = None
        self.connected = False
        self.message_count = {
            "roll_count": 0, 
            "pitch_count": 0, 
            "yaw_count": 0, 
            "lat_count": 0, 
            "lon_count": 0,  
            "satellites_visible_count": 0,
            "battery_remaining_count": 0,
            "altitude_relative_count": 0
        }

    def arm(self):
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 1, 0,0,0,0,0,0)
        print("---Successfully armed---")
    def disarm(self) -> None:
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 0, 0,0,0,0,0,0)
        print("---Successfully disarmed---")

    def takeoff(self):
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0,0,0,0, math.nan, 0, 0, 1000)
        print("---Successfully takeoff---")

    def rtl(self) -> None:
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH, 0,0,0,0,0,0,0,0)
        print("---Successfully rtl---")

    def startMission(self, waypoints:list):
        n = len(waypoints)
        self.mavConnection.mav.mission_count_send(self.mavConnection.target_system, self.mavConnection.target_component, n, 0)
        for waypoint in waypoints:
            print(waypoint.param5, waypoint.param6)
            self.mavConnection.mav.mission_item_send(self.mavConnection.target_system, self.mavConnection.target_component,
                                            waypoint.seq, 
                                            waypoint.frame,
                                            waypoint.command,
                                            waypoint.current,
                                            waypoint.auto,
                                            waypoint.param1,
                                            waypoint.param2,
                                            waypoint.param3,
                                            waypoint.param4,
                                            waypoint.param5,
                                            waypoint.param6,
                                            waypoint.param7,
                                            waypoint.missionType)
        self.arm()
        self.takeoff()
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_MISSION_START, 0,0,0,0,0,0,0,0)
        print("---Successfully startied mission---")

    def land(self):
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_NAV_LAND , 0, 0, 0, 0, 0, 0, 0, 0)
        print("---Successfully landing---")

    def stableConnection(self):
        while self.connected:
            self.mavConnection.recv_match(blocking=True)
            msg = self.mavConnection.messages
            headers = [
                {"roll": "ATTITUDE"}, 
                {"pitch": "ATTITUDE"}, 
                {"yaw": "ATTITUDE"}, 
                {"lat": "GLOBAL_POSITION_INT"}, 
                {"lon": "GLOBAL_POSITION_INT"},  
                {"satellites_visible": "GPS_RAW_INT"},
                {"battery_remaining": "BATTERY_STATUS"},
                {"altitude_relative": "ALTITUDE"}
            ]
            for h in headers:
                try:
                    key = list(h.keys())[0]
                    value = getattr(msg[h[key]], key)
                    if key == "lon" or key == "lat":
                        value = value / 10**7
                    if key == "altitude_relative": 
                        if value < 0: value = 0
                    if key == "roll" or key == "pitch" or key == "yaw": 
                        value = value * (180 / math.pi)
                    self.message_count[f"{key}_count"] += 1
                    if self.message_count[f"{key}_count"] >= 100 and not np.isnan(value):
                        self.send(json.dumps({"type": "frame", "frame_part": {"key": key, "value": value, "time_usec": time.time()}}))
                        self.message_count[f"{key}_count"] = 0
                except:
                    pass
                           
    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        command = data["type"]
        match command:
                case "connect":
                    address = data["data"]["address"]
                    try: 
                        self.connected = True
                        self.mavConnection = mavutil.mavlink_connection(f'udp:{address}')
                        self.thread = Thread(target=self.stableConnection, args={})
                        self.thread.daemon = True 
                        self.thread.start()  
                        print("---Successfully connected---")
                    except:
                        self.send(json.dumps({"result": False, "message": "Ошибка соединения"}, ensure_ascii=False))
                        print("---Connection Error---")
                case "disconnect":
                    self.connected = False
                    self.thread.join()
                    self.mavConnection.close()
                    print("---Successfully disconnected---")
                case "start_mission":
                    if self.connected:
                        print(data)
                        mission_data = [item["coords"] for item in data["data"]["mission"]]
                        mission_waypoints = []
                        for index, point in enumerate(mission_data):
                            mission_waypoints.append(MissionItem(index, 0, point[1], point[0], point[2]))
                        self.startMission(mission_waypoints)
                case "arm":
                    pass
                case "disarm":
                    pass
                case "takeoff":
                    if self.connected:
                        self.arm()
                        self.takeoff()
                        self.mavConnection.motors_disarmed_wait()
                        self.arm()
                case "land":
                    if self.connected:
                        self.land()
                case "rtl":
                    self.rtl()

    def disconnect(self, code):
        pass