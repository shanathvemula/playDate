from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.renderers import JSONRenderer

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken

from drf_spectacular.utils import extend_schema, OpenApiParameter

from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.db.models import F
from django.db.models.expressions import RawSQL


from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D

from datetime import datetime, timedelta

from tournament.serializers import (TournamentSerializer, TournamentSerializerDepth, TournamentGroundsSerializer,
                                    TeamsSerializer, TeamsSerializerDepth, IdSerializer)
from tournament.models import Tournament, Teams, GroundNew
from payments.models import Transaction
from app.models import User

from django.db import connection


# Create your views here.

# def find_transactions(ground_id, start_date, end_date):
#     start_date = datetime.strptime(start_date, "%Y-%m-%d")
#     end_date = datetime.strptime(end_date, "%Y-%m-%d")
#     # transactions = Transaction.objects.filter(groundId=ground_id, selectedSlots__date__range=(start_date, end_date))
#     # groundId = GroundNew.objects.get(id=ground_id)
#
#     query = """
#     SELECT t.*, slot ->> 'date' AS date
#     FROM transactions t,
#     LATERAL jsonb_array_elements(t."selectedSlots") AS slot
#     WHERE t."groundId_id" = %s
#     AND (slot ->> 'date')::timestamp BETWEEN %s AND %s
#     """
#
#     params = [ground_id, start_date, end_date]
#     with connection.cursor() as cursor:
#         cursor.execute(query, params)
#         results = cursor.fetchall()
#     if results:
#         return True
#     return False

# print(find_transactions(ground_id='GRD0000001', start_date='2025-04-24', end_date='2025-04-28'))
# class TournamentList(APIView):
#     permission_classes = []
#     authentication_classes = []
#     queryset = Tournament.objects.all().order_by('-created_by')
#     serializer_class = TournamentSerializerDepth
#
#     @extend_schema(parameters=[
#         OpenApiParameter(name='lat', description="Enter latitude", type=float),
#         OpenApiParameter(name='lon', description="Enter longitude", type=float),
#         OpenApiParameter(name='radius', description="Enter radius", type=int)
#     ], summary='Get Tournament Information', description='This endpoint provides the Tournament Information')
#     def get(self, request, *args, **kwargs):
#         try:
#             lat = request.GET.get('lat', None)
#             lon = request.GET.get('lon', None)
#             radius = request.GET.get('radius', None)
#             if lat and lon and radius:
#                 user_location = Point(float(lat), float(lon))
#                 tournaments = Tournament.objects.filter(
#                     ground__location__distance_lte=(user_location, D(km=int(radius)))
#                 ).annotate(
#                     distance=Distance('ground__location', user_location)
#                 ).order_by('ground__Created')
#
#                 # grounds = GroundNew.objects.filter(
#                 #     location__distance_lte=(Point(float(lat), float(lon)), D(km=int(radius)))).order_by('Created')
#                 # tournaments = Tournament.objects.filter(ground__in = grounds)
#                 serializer_data = list(TournamentSerializerDepth(tournaments, many=True).data)
#                 return HttpResponse(JSONRenderer().render(serializer_data), content_type='application/json',
#                                     status=status.HTTP_200_OK)
#             else:
#                 return HttpResponse(JSONRenderer().render({"Error": "Please provide the location info."}),
#                                     content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
#         except Exception as e:
#             return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
#                                 status=status.HTTP_400_BAD_REQUEST)


class TournamentCRUD(APIView):
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Tournament.objects.all().order_by('-created_by')
    serializer_class = TournamentSerializerDepth

    @extend_schema(parameters=[
        OpenApiParameter(name='id', description="Enter the Tournament Id", type=str)
    ], summary='Get Tournament Information', description=f'* This endpoint provides the Tournament Information. \n'
                                                        f"* By using the Tournament Id")
    def get(self, request, *args, **kwargs):
        try:
            id = request.GET.get('id')
            if id:
                tournament = Tournament.objects.get(id=id)
                serializer_data = TournamentSerializerDepth(tournament).data
                return HttpResponse(JSONRenderer().render(serializer_data), content_type='application/json',
                                    status=status.HTTP_200_OK)
            else:
                return HttpResponse(JSONRenderer().render({"Error": "Please provide the id info."}),
                                    content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=TournamentSerializer, summary="Making a new Tournament",
                   description="This endpoint helps to create a new Tournament")
    def post(self, request, *args, **kwargs):
        try:
            access_token = AccessToken(request.headers['Authorization'].split(' ')[-1])
            user_id = access_token['user_id']
            data = request.data
            data['created_by'] = user_id
            serializer = TournamentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json',
                                    status=status.HTTP_201_CREATED)
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=TournamentSerializer, summary="Full Update Tournament",
                   description=f"Full Updating Tournament.\n"
                                f"This endpoint helps to update the full Tournament details")
    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            tournament = Tournament.objects.get(id__exact=data['id'])
            serializer = TournamentSerializer(tournament, data=data)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=TournamentSerializer, summary="Partial Update Tournament",
                   description=f"Full Updating Tournament.\n"
                               f"This endpoint helps to update the partial Tournament details. \n"
                               f"Send the required fields to update in the body with id.\n"
                               f"id is required filed. \n")
    def patch(self, request, *args, **kwargs):
        try:
            data = request.data
            tournament = Tournament.objects.get(id__exact=data['id'])
            serializer = TournamentSerializer(tournament, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

class TournamentsList(APIView):
    permission_classes = []
    authentication_classes = []
    queryset = Tournament.objects.all().order_by('-created_by')
    serializer_class = TournamentSerializerDepth

    @extend_schema(parameters=[
        OpenApiParameter(name='id', description="Enter the Tournament Id", type=str)
    ], summary='Get Tournaments Information', description=f'* This endpoint provides the Tournaments Information. \n'
                                                        f"* By using the Tournament Id \n"
                                                        f"* If Tournament Id is empty or null return the all the "
                                                         f"Tournaments Information ")
    def get(self, request, *args, **kwargs):
        try:
            id = request.GET.get('id')
            if id:
                tournament = Tournament.objects.get(id=id)
                serializer_data = TournamentSerializerDepth(tournament).data
                return HttpResponse(JSONRenderer().render(serializer_data), content_type='application/json',
                                    status=status.HTTP_200_OK)
            else:
                tournament = Tournament.objects.all().order_by('-created_by')
                serializer_data = TournamentSerializerDepth(tournament, many=True).data
                return HttpResponse(JSONRenderer().render(serializer_data), content_type='application/json',
                                    status=status.HTTP_200_OK)
                # return HttpResponse(JSONRenderer().render({"Error": "Please provide the id info."}),
                #                     content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=IdSerializer, summary="Getting Grounds info based on the Tournament Id",
                   description="This endpoint helps to Get the Grounds info based on the Tournament Id")
    def post(self, request, *args, **kwargs):
        data = request.data
        try:
            if data['id']:
                tournament = Tournament.objects.get(id=data['id'])
                serializer_data = TournamentGroundsSerializer(tournament).data
                return HttpResponse(JSONRenderer().render(serializer_data), content_type='application/json',
                                    status=status.HTTP_200_OK)
            else:
                return HttpResponse(JSONRenderer().render({"Error": "Please provide the Tournament id info."}),
                                    content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

class TeamsCRUD(APIView):
    permission_classes = [IsAuthenticated, DjangoModelPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Teams.objects.all().order_by('id').last()

    @extend_schema(parameters=[
        OpenApiParameter(name='id', description="Enter the Team Owner Id", type=str)
    ], summary='Get Teams Information', description=f'* This endpoint provides the List of teams Information. \n'
                                                         f"* By using the Team Owner Id")
    def get(self, request, *args, **kwargs):
        try:
            id = request.GET.get('id')
            # print(id)
            if id:
                owner = User.objects.get(id=id)
                # print("owner", owner)
                teams = Teams.objects.filter(owner=owner)
                serializer_data = TeamsSerializerDepth(teams, many=True).data
                # print("tournament", tournament)
                # serializer_data = TeamsSerializerDepth(tournament).data
                return HttpResponse(JSONRenderer().render(serializer_data), content_type='application/json',
                                    status=status.HTTP_200_OK)
            else:
                return HttpResponse(JSONRenderer().render({"Error": "Please provide the id info."}),
                                    content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=TeamsSerializer, summary="Making a new Team",
                   description="This endpoint helps to create a new Team")
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = TeamsSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json',
                                    status=status.HTTP_201_CREATED)
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=TeamsSerializer, summary="Update Team",
                   description=f"Updating Team.\n"
                               f"This endpoint helps to update the Team details")
    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            team = Teams.objects.get(id=data['id'])
            serializer = TeamsSerializer(team, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                            status=status.HTTP_400_BAD_REQUEST)

# class TeamsAdditional(APIView):
#     permission_classes = [IsAuthenticated, DjangoModelPermissions]
#     authentication_classes = [JWTAuthentication]
#     queryset = Teams.objects.all().order_by('id').last()
#
#     @extend_schema(parameters=[
#         OpenApiParameter(name='id', description="Enter the Tournament Id", type=str)
#     ], summary='Get Teams Information', description=f'* This endpoint provides the List of teams Information. \n'
#                                                     f"* By using the Tournament Id")
#     def get(self, request, *args, **kwargs):
#         try:
#             id = request.GET.get('id')
#         except Exception as e:
#             return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
#                                 status=status.HTTP_400_BAD_REQUEST)