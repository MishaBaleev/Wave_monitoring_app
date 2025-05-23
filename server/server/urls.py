from django.contrib import admin
from django.urls import path
from django.urls import re_path as url
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", index, name="index"),
    path("checkBack", checkBack.as_view()),
    path("getMissionPlan", getMissionPlan.as_view()),
    path("getLogData", getLogData.as_view()),
    path("uploadLogPart", uploadLogPart.as_view())
]
