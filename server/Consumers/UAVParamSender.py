import time
from pymavlink import mavutil

class UAVParamSender():
    def __init__(self, com_logger, mavConnection):
        self.com_logger = com_logger
        self.mavConnection = mavConnection
        com_logger.logger.info(f"Successfully started uav params sender, time_usec - {time.time()}")

    def send(self, key:str, value:float) -> None:
        self.mavConnection.mav.param_set_send(
            self.mavConnection.target_system, 
            self.mavConnection.target_component, 
            bytes(key, "utf-8"), 
            float(value), 
            mavutil.mavlink.MAV_PARAM_TYPE_REAL32
        )
        self.com_logger.logger.info(f"Successfully sended param {key} with value {value}, time_usec - {time.time()}")
        
