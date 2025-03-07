from channels.generic.websocket import WebsocketConsumer
import ujson as json
from threading import Thread
import time
from pymavlink import mavutil
from .MissionItem import MissionItem
import math
import numpy as np
from .Com_Logger import Com_Logger
from .Destruct import Destruct
from .UAV_Logger import UAV_Logger
from .UAVParamSender import UAVParamSender

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
            "altitude_relative_count": 0,
            "vel_count": 0
        }
        self.com_logger = None
        self.uav_logger = None
        self.destruct = None
        self.param_sender = None


    def arm(self):
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 1, 0,0,0,0,0,0)
        self.com_logger.logger.info(f"Successfully armed, time_usec - {time.time()}")
    
    def disarm(self) -> None:
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM, 0, 0, 0,0,0,0,0,0)
        self.com_logger.logger.info(f"Successfully disarmed, time_usec - {time.time()}")

    def takeoff(self):
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_NAV_TAKEOFF, 0,0,0,0, math.nan, 0, 0, 1000)
        self.com_logger.logger.info(f"Successfully takeoff, time_usec - {time.time()}")

    def rtl(self) -> None:
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_NAV_RETURN_TO_LAUNCH, 0,0,0,0,0,0,0,0)
        self.com_logger.logger.info(f"Successfully rtl, time_usec - {time.time()}")

    # def clearUAV(self) -> None:
    #     self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_CLEAR_MISSION, 0, 0, 0, 0, 0, 0, 0, 0  )
    #     logging.info("Successfully Cleared Mission")

    def startMission(self, waypoints:list):
        # self.clearUAV()
        n = len(waypoints)
        self.mavConnection.mav.mission_count_send(self.mavConnection.target_system, self.mavConnection.target_component, n, 0)
        for waypoint in waypoints:
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
        self.com_logger.logger.info(f"Successfully uploaded mission with {n} waypoints, time_usec - {time.time()}")
        self.arm()
        self.takeoff()
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_MISSION_START, 0,0,0,0,0,0,0,0)
        self.com_logger.logger.info(f"Successfully started mission with {n} waypoints, time_usec - {time.time()}")

    def land(self):
        self.mavConnection.mav.command_long_send(self.mavConnection.target_system, self.mavConnection.target_component, mavutil.mavlink.MAV_CMD_NAV_LAND , 0, 0, 0, 0, 0, 0, 0, 0)
        self.com_logger.logger.info(f"Successfully landing, time_usec - {time.time()}")

    def stableConnection(self):
        while self.connected:
            self.mavConnection.recv_match(blocking=True)
            msg = self.mavConnection.messages
            headers = [
                {"roll": "ATTITUDE"}, 
                {"pitch": "ATTITUDE"}, 
                {"yaw": "ATTITUDE"}, 
                {"lat": "GPS_RAW_INT"}, 
                {"lon": "GPS_RAW_INT"},  
                {"satellites_visible": "GPS_RAW_INT"},
                {"battery_remaining": "BATTERY_STATUS"},
                {"altitude_relative": "ALTITUDE"},
                {"vel": "GPS_RAW_INT"}
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
                    if key == "vel":
                        value = value / 100
                    self.message_count[f"{key}_count"] += 1
                    # print(key, value, self.message_count[f"{key}_count"])
                    if (key == "lon" or key == "lat") and self.message_count[f"{key}_count"] >= 100 and not np.isnan(value):
                        self.send(json.dumps({"type": "frame", "frame_part": {"key": key, "value": value, "time_usec": time.time()}}))
                        self.message_count[f"{key}_count"] = 0
                        self.uav_logger.updateLog(key, value)
                        continue
                    if self.message_count[f"{key}_count"] >= 100 and not np.isnan(value):
                        # print(key, value, self.message_count[f"{key}_count"])
                        self.send(json.dumps({"type": "frame", "frame_part": {"key": key, "value": value, "time_usec": time.time()}}))
                        self.message_count[f"{key}_count"] = 0
                        self.uav_logger.updateLog(key, value)
                except: pass
                           
    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        command = data["type"]
        match command:
                case "connect":
                    address = data["data"]["address"]
                    try: 
                        self.com_logger = Com_Logger()
                        self.com_logger.start()
                        self.connected = True
                        self.uav_logger = UAV_Logger(self.com_logger)
                        self.mavConnection = mavutil.mavlink_connection(f'udp:{address}', dialect="common")
                        self.destruct = Destruct(self.com_logger, self.mavConnection)
                        self.thread = Thread(target=self.stableConnection, args={})
                        self.thread.daemon = True 
                        self.thread.start()  
                        self.param_sender = UAVParamSender(self.com_logger, self.mavConnection)
                        self.com_logger.logger.info(f"Successfully connected, time_usec - {time.time()}")
                    except:
                        self.send(json.dumps({"result": False, "message": "Ошибка соединения"}, ensure_ascii=False))
                        self.com_logger.logger.critical(f"Connection Error, time_usec - {time.time()}")
                case "disconnect":
                    self.connected = False
                    self.thread.join()
                    self.mavConnection.close()
                    self.uav_logger.saveLog()
                    self.com_logger.logger.info(f"Successfully disconnected, time_usec - {time.time()}")
                    self.com_logger.disable()
                case "start_mission":
                    if self.connected:
                        mission_data = [{"coords": item["coords"], "speed": item["speed"]} for item in data["data"]["mission"]]
                        mission_waypoints = []
                        for index, point in enumerate(mission_data):
                            mission_waypoints.append(MissionItem(index, 0, point["coords"][1], point["coords"][0], point["coords"][2], point["speed"]))
                        self.startMission(mission_waypoints)
                case "arm": pass
                case "disarm": pass
                case "takeoff":
                    if self.connected:
                        self.arm()
                        self.takeoff()
                        self.mavConnection.motors_disarmed_wait()
                        self.arm()
                case "land":
                    if self.connected: self.land()
                case "rtl": self.rtl()
                case "gps":
                    if self.connected:
                        if self.destruct.sensors["gps"]: self.destruct.offGPS()
                        else: self.destruct.onGPS()
                case "compass":
                    if self.connected:
                        if self.destruct.sensors["compass"]: self.destruct.offCompass()
                        else: self.destruct.onCompass()
                case "acel":
                    if self.connected:
                        if self.destruct.sensors["acel"]: self.destruct.offAcel()
                        else: self.destruct.onAcel()
                case "uav_param": 
                    if self.connected: self.param_sender.send(data["data"]["param_key"], data["data"]["param_value"])
                

    def disconnect(self, code):
        pass