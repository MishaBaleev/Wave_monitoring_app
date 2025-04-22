from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import ujson as json
from django.core.files.uploadedfile import InMemoryUploadedFile
import pandas as pd
import os
import time

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
  
class uploadLogPart(APIView):
    def addChartXLSX(self, wb, ws, column:int, title:str, place:list, length:int):
        chart = wb.add_chart({"type": "line"})
        chart.set_legend({'none': True})
        chart.set_size({"width": 600, "height": 400})
        chart.add_series({"values": ["report", 1, column, length, column], "name": title})
        ws.insert_chart(place[0], place[1], chart)

    def post(self, request):
        try:
            report_path = f'{os.getcwd().replace("server", "reports")}/report_{time.time()}.xlsx'
            data = json.loads(request.data["data"])
            df = pd.DataFrame()
            for key, item in data.items(): df = pd.concat([df, pd.DataFrame({key: item.values()})], axis=1)
            writer = pd.ExcelWriter(report_path, engine="xlsxwriter")
            df.to_excel(writer, sheet_name="report")
            wb = writer.book 
            ws = writer.sheets["report"]
            chart_pos = [[1,6], [22,6], [43,6]]
            for index, key in enumerate(df.columns.to_list()):
                self.addChartXLSX(wb=wb, ws=ws, column=index+1, place=chart_pos[index], title=f"{key}_change", length=len(df[key]))
            writer.close()
            return JsonResponse({}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse({}, status=500)

