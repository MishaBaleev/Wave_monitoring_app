from pymavlink import mavutil
import math 

class MissionItem():
    def __init__(self, index:int, current:int, x:float, y:float, z:float) -> None:
        self.seq = index 
        self.frame = mavutil.mavlink.MAV_FRAME_GLOBAL_RELATIVE_ALT
        self.command = mavutil.mavlink.MAV_CMD_NAV_WAYPOINT
        self.current = current 
        self.auto = 1
        self.param1 = 0.0
        self.param2 = 2.0
        self.param3 = 20.0
        self.param4 = math.nan 
        self.param5 = x 
        self.param6 = y 
        self.param7 = z 
        self.missionType = 0