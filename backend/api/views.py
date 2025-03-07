from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
import ujson as json
import os

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
