from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
import ujson as json
from django.core.files.uploadedfile import InMemoryUploadedFile
import pandas as pd

def index(request):
    return render(request, "index.html")

class checkBack(APIView):
    def get(self, request):
        return Response()
    
class getMissionPlan(APIView):
    def post(self, request):
        mission_id = request.data["mission_id"]
        with open(f"./plans/plan_{mission_id}.json", "r") as mission:
            mission = json.loads(mission.read())["waypoints"]
        return Response({"waypoints": mission})

class getLogData(APIView):
    def post(self, request):
        uploaded_file: InMemoryUploadedFile = request.FILES['log_data']
        log_keys = [
            "roll", "roll_time", "pitch", "pitch_time", "yaw", "yaw_time", "lat", "lat_time",
            "lon", "lon_time", "satellites_visible", "satellites_visible_time", "battery_remaining",
            "battery_remaining_time", "altitude_relative", "altitude_relative_time", "vel", "vel_time"
        ]
        try:
            df = pd.read_excel(uploaded_file, index_col=0)
            df = df.fillna(-1)
            for log_key in log_keys:
                if log_key in df.columns.to_list(): pass 
                else: return Response({"status": "error", "message": "Bad File"})
            return Response({"status": "success", "data": df.to_dict()})
        except Exception as e:
            return Response({"status": "error", "message": str(e)})
