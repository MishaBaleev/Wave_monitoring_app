import os
import time
import pandas as pd

class UAV_Logger():
    def __init__(self, com_logger):
        self.com_logger = com_logger 
        self.log = {
            "roll": [], 
            "roll_time": [],
            "pitch": [], 
            "pitch_time": [], 
            "yaw": [], 
            "yaw_time": [],
            "lat": [], 
            "lat_time": [],
            "lon": [],  
            "lon_time": [],
            "eph": [],
            "eph_time": [],
            "epv": [],
            "epv_time": [],
            "satellites_visible": [],
            "satellites_visible_time": [],
            "battery_remaining": [],
            "battery_remaining_time": [],
            "altitude_relative": [],
            "altitude_relative_time": [],
            "vel": [],
            "vel_time": [] 
        }
        self.mission = {
            "mission_lat": [],
            "mission_lon": [],
            "mission_alt": []
        }
        com_logger.logger.info(f"Successfully started uav logger, time_usec - {time.time()}")

    def updateLog(self, key:str, value:float) -> None:
        self.log[key].append(value)
        self.log[f"{key}_time"].append(time.time())
        # self.com_logger.logger.info(f"Successfully updated uav log, time_usec - {time.time()}")

    def setMission(self, waypoints:list) -> None:
        for point in waypoints:
            self.mission["mission_lat"].append(point[0])
            self.mission["mission_lon"].append(point[1])
            self.mission["mission_alt"].append(point[2])
    
    def saveLog(self) -> None:
        df = pd.DataFrame()
        for log_key in list(self.log.keys()):
            df = pd.concat([df, pd.DataFrame({log_key: self.log[log_key]})], axis=1)
        df = pd.concat([df, pd.DataFrame({"": []})], axis=1)
        for mission_key in list(self.mission.keys()):
            print({mission_key: self.mission[mission_key]}) 
            df = pd.concat([df, pd.DataFrame({mission_key: self.mission[mission_key]})], axis=1)
        df.to_excel(f'{os.getcwd().replace("backend", "uav_logs")}/uav_log_{time.time()}.xlsx')
        self.com_logger.logger.info(f"Successfully saved uav log, time_usec - {time.time()}")