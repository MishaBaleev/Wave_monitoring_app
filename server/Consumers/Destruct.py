import time

class Destruct():
    def __init__(self, logger, mavConnection):
        self.logger = logger
        self.sensors = {
            "gps": True,
            "compass": True,
            "acel": True
        }
        self.mavConnection = mavConnection
    
    def offGPS(self) -> None:  
        self.mavConnection.mav.command_long_send(
            self.mavConnection.target_system, self.mavConnection.target_component,
            420,  # MAV_CMD_INJECT_FAILURE 
            0,
            4,
            1,
            0, 0, 0, 0, 0
        )
        self.sensors["gps"] = False
        self.logger.logger.critical(f"GPS off, time_usec - {time.time()}")

    def onGPS(self) -> None:
        self.mavConnection.mav.command_long_send(
            self.mavConnection.target_system, self.mavConnection.target_component,
            420, # MAV_CMD_INJECT_FAILURE 
            0,
            4,  
            0,
            0, 0, 0, 0, 0
        )
        self.sensors["gps"] = True
        self.logger.logger.critical(f"GPS on, time_usec - {time.time()}")

    def offCompass(self) -> None:
        self.mavConnection.mav.command_long_send(
            self.mavConnection.target_system, self.mavConnection.target_component,
            420, # MAV_CMD_INJECT_FAILURE 
            0,
            2,
            1,
            0, 0, 0, 0, 0
        )
        self.sensors["compass"] = False
        self.logger.logger.critical(f"Compass off, time_usec - {time.time()}")
    
    def onCompass(self) -> None:
        self.mavConnection.mav.command_long_send(
            self.mavConnection.target_system, self.mavConnection.target_component,
            420, # MAV_CMD_INJECT_FAILURE 
            0,
            2,
            0,
            0, 0, 0, 0, 0
        )
        self.sensors["compass"] = True
        self.logger.logger.critical(f"Compass on, time_usec - {time.time()}")

    def offAcel(self) -> None:
        self.mavConnection.mav.command_long_send(
            self.mavConnection.target_system, self.mavConnection.target_component,
            420, # MAV_CMD_INJECT_FAILURE 
            0,
            1,
            1,
            0, 0, 0, 0, 0
        )
        self.sensors["acel"] = False
        self.logger.logger.critical(f"Acel off, time_usec - {time.time()}")

    def onAcel(self) -> None:
        self.mavConnection.mav.command_long_send(
            self.mavConnection.target_system, self.mavConnection.target_component,
            420, # MAV_CMD_INJECT_FAILURE 
            0,
            1,
            0,
            0, 0, 0, 0, 0
        )
        self.sensors["acel"] = True
        self.logger.logger.critical(f"Acel off, time_usec - {time.time()}")