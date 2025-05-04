import json

from django.http import HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer

from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import DjangoModelPermissions, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import status

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken

from drf_spectacular.utils import extend_schema, OpenApiParameter

from grounds.serializers import Grounds, GroundsSerializer, GroundsSerializerDepth, GroundNewSerializer, GroundNew # , ArenaSerializer

from django.core.files.storage import default_storage
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

from datetime import datetime, timedelta

from payments.models import Transaction

# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
@extend_schema(request=GroundsSerializer, summary="Grounds List and Create API",
               description="This endpoint helps to Grounds List and Create API")
class GroundLC(ListCreateAPIView):
    permission_classes = [DjangoModelPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Grounds.objects.all().order_by('-created')
    serializer_class = GroundsSerializer
    # pagination_class = [PageNumberPagination]


@method_decorator(csrf_exempt, name='dispatch')
class Ground(APIView):
    permission_classes = [DjangoModelPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = Grounds.objects.all().order_by('-created')
    serializer_class = GroundsSerializer

    @extend_schema(parameters=[
        OpenApiParameter(name='Name', description='Enter Name of the Ground', type=str, default=''),
    ], summary="Get Ground details", description="This endpoint provides the Ground details")
    def get(self, request, *args, **kwargs):
        try:
            name=request.GET.get('Name')
            if name:
                ground=Grounds.objects.get(name__exact=name)
                return HttpResponse(JSONRenderer().render(GroundsSerializerDepth(ground).data))
            else:
                ground=Grounds.objects.all().order_by('-created')
                return HttpResponse(JSONRenderer().render(GroundsSerializerDepth(ground, many=True).data))
        except Grounds.DoesNotExist:
            return HttpResponse(JSONRenderer().render({"Error": "Provide valid Ground name"}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=GroundsSerializerDepth, summary="Adding Ground", description="This endpoint helps to create a Ground")
    def post(self, request, *args, **kwargs):
        try:
            data= request.data
            # print("data", data['Arena'])
            user = data['created_by']
            # Arena = data['Arena']
            data['created_by'] = user['id']
            # data['Arena'] = []
            serializer = GroundsSerializer(data=data, partial=True)
            if serializer.is_valid():
                # arenaSerializer = ArenaSerializer(data=Arena, many=True)
                # if arenaSerializer.is_valid():
                #     arenaSerializer.save()
                # print(arenaSerializer.data)
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
            # return HttpResponse(JSONRenderer().render({"ok":"ok"}), content_type='application/json')
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=GroundsSerializer, summary="Update Ground", description=f"* Updating Ground details.\n"
                                                                        f"* This endpoint helps to updating "
                                                                        f"Ground. \n "
                                                                        f"* Provide the fields to what are need "
                                                                        f"to update with name. \n"
                                                                        f"* name is required field"
                                                                        "* Send is_active as false for "
                                                                        f"deleting user. \n"
    )
    def put(self, request, *args, **kwargs):
        try:
            data= request.data
            data['created_by'] = data['created_by']['id']
            ground = Grounds.objects.get(id__exact=data['id'])
            serializer = GroundsSerializer(ground, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            # OpenApiParameter(name='username', description="Enter Username", type=str),
            OpenApiParameter(name='id', description="Enter Id", type=int),
        ], summary="Delete Ground", description=f"* This endpoint helps to deleting user.\n"
    )
    def delete(self, request, *args, **kwargs):
        try:
            id = request.GET.get('id')
            ground = Grounds.objects.get(id__exact=id)
            ground.delete()
            return HttpResponse(JSONRenderer().render({"message": "Deleted Successfully"}), content_type='application/json',
                                status=status.HTTP_200_OK)
        except Exception as e:
            # raise e
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                            status=status.HTTP_400_BAD_REQUEST)

from grounds.serializers import GroundManagement, GroundManagementSerializer

@method_decorator(csrf_exempt, name='dispatch')
class GroundManagementCRUD(APIView):
    permission_classes = [DjangoModelPermissions]
    authentication_classes = [JWTAuthentication]
    queryset = GroundManagement.objects.all().order_by('-Created')
    serializer_class = GroundManagementSerializer

    @extend_schema(parameters=[
        OpenApiParameter(name='id', description='Enter Ground Id', type=int),
        OpenApiParameter(name='user_id', description='Enter User Id', type=int),
    ], summary='Get Ground Management Information', description='This endpoint provides the Ground Management details')
    def get(self, request, *args, **kwargs):
        try:
            id = request.GET.get('id', None)
            CreatedBy = request.GET.get('user_id', None)
            if id:
                ground = GroundManagement.objects.get(id=id)
                return HttpResponse(JSONRenderer().render(GroundManagementSerializer(ground).data))
            elif CreatedBy:
                ground = GroundManagement.objects.filter(CreatedBy=CreatedBy)
                return HttpResponse(JSONRenderer().render(GroundManagementSerializer(ground, many=True).data))
            else:
                # print("request.user.id", request.user.id)
                ground = GroundManagement.objects.filter(CreatedBy=request.user.id)
                return HttpResponse(JSONRenderer().render(GroundManagementSerializer(ground, many=True).data))
                # return HttpResponse(JSONRenderer().render({"Error": "Enter valid id or user id"}), content_type='application/json',
                #                     status=status.HTTP_400_BAD_REQUEST)
        except Grounds.DoesNotExist:
            return HttpResponse(JSONRenderer().render({"Error": "Provide valid Ground name"}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=GroundManagementSerializer, summary="Adding Ground",
        description="This endpoint helps to create a Ground")
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = GroundManagementSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=GroundManagementSerializer, summary="Update Ground", description=f"* Updating Ground details.\n"
                                                                        f"* This endpoint helps to updating "
                                                                        f"Ground. \n "
                                                                        f"* Provide the fields to what are need "
                                                                        f"to update with name. \n"
                                                                        f"* name is required field"
                                                                        "* Send is_active as false for "
                                                                        f"deleting user. \n"
    )
    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            ground = GroundManagement.objects.get(id__exact=data['id'])
            serializer = GroundManagementSerializer(ground, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            # OpenApiParameter(name='username', description="Enter Username", type=str),
            OpenApiParameter(name='id', description="Enter Id", type=int),
        ], summary="Delete Ground", description=f"* This endpoint helps to deleting user.\n"
    )
    def delete(self, request, *args, **kwargs):
        try:
            id = request.GET.get('id')
            ground = GroundManagement.objects.get(id__exact=id)
            ground.delete()
            return HttpResponse(JSONRenderer().render({"message": "Deleted Successfully"}),
                                content_type='application/json',
                                status=status.HTTP_200_OK)
        except Exception as e:
            # raise e
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)


class GroundCRUD(APIView):
    permission_classes = [DjangoModelPermissions, IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset = GroundNew.objects.all().order_by('-Created')
    serializer_class = GroundNewSerializer

    @extend_schema(parameters=[
        OpenApiParameter(name='id', description='Enter Ground Id', type=int),
        OpenApiParameter(name='user_id', description='Enter User Id', type=int),
    ], summary='Get Ground Management Information', description='This endpoint provides the Ground details')
    def get(self, request, *args, **kwargs):
        try:
            # print('Getting Ground Information')
            lat = request.GET.get('lat', None)
            lon = request.GET.get('lon', None)
            radius = request.GET.get('radius', None)
            id = request.GET.get('id', None)
            CreatedBy = request.GET.get('user_id', None)
            if lat and lon and radius:
                ground = GroundNew.objects.filter(location__distance_lte=(Point(float(lat), float(lon)), D(km=int(radius)))).order_by('Created')
                return HttpResponse(JSONRenderer().render(GroundNewSerializer(ground, many=True).data))
            elif id:
                ground = GroundNew.objects.get(id=id)
                return HttpResponse(JSONRenderer().render(GroundNewSerializer(ground).data))
            elif CreatedBy:
                ground = GroundNew.objects.filter(CreatedBy=CreatedBy).order_by('Created')
                return HttpResponse(JSONRenderer().render(GroundNewSerializer(ground, many=True).data))
            else:
                access_token = AccessToken(request.headers.get('Authorization').split(' ')[1])
                # print("Ground", access_token.payload['user_id'])
                ground = GroundNew.objects.filter(CreatedBy=access_token.payload['user_id']).order_by('Created')
                # ground = GroundNew.objects.filter(CreatedBy=request.user.id)
                return HttpResponse(JSONRenderer().render(GroundNewSerializer(ground, many=True).data))
                # return HttpResponse(JSONRenderer().render({"Error": "Enter valid id or user id"}), content_type='application/json',
                #                     status=status.HTTP_400_BAD_REQUEST)
        except Grounds.DoesNotExist:
            return HttpResponse(JSONRenderer().render({"Error": "Provide valid Ground name"}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=GroundNewSerializer, summary="Adding Ground",
        description="This endpoint helps to create a Ground")
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            data['CreatedBy'] = request.user.id
            serializer = GroundNewSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                # serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json',
                                    status=status.HTTP_201_CREATED)
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=GroundNewSerializer, summary="Update Ground", description=f"* Updating Ground details.\n"
                                                                                 f"* This endpoint helps to updating "
                                                                                 f"Ground. \n "
                                                                                 f"* Provide the fields to what are need "
                                                                                 f"to update with name. \n"
                                                                                 f"* name is required field"
                                                                                 "* Send is_active as false for "
                                                                                 f"deleting user. \n"
    )
    def put(self, request, *args, **kwargs):
        try:
            data = request.data
            ground = GroundNew.objects.get(id__exact=data['id'])
            serializer = GroundNewSerializer(ground, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json')
            return HttpResponse(JSONRenderer().render(serializer.errors), status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        parameters=[
            # OpenApiParameter(name='username', description="Enter Username", type=str),
            OpenApiParameter(name='id', description="Enter Id"),
        ], summary="Delete Ground", description=f"* This endpoint helps to deleting user.\n"
    )
    def delete(self, request, *args, **kwargs):
        try:
            id = request.GET.get('id')
            ground = GroundNew.objects.get(id__exact=id)
            ground.delete()
            return HttpResponse(JSONRenderer().render({"message": "Deleted Successfully"}),
                                content_type='application/json',
                                status=status.HTTP_200_OK)
        except Exception as e:
            # raise e
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

class GroundsData(APIView):
    permission_classes = []
    authentication_classes = []
    queryset = GroundNew.objects.all().order_by('-Created')
    serializer_class = GroundNewSerializer

    @extend_schema(parameters=[
        OpenApiParameter(name='lat', description='Enter latitude', type=float),
        OpenApiParameter(name='lon', description='Enter longitude', type=float),
        OpenApiParameter(name='radius', description='Enter radius', type=int),
    ], summary='Get Ground Management Information', description='This endpoint provides the Ground details')
    def get(self, request, *args, **kwargs):
        try:
            lat = request.GET.get('lat', None)
            lon = request.GET.get('lon', None)
            radius = request.GET.get('radius', None)
            if lat and lon and radius:
                ground = GroundNew.objects.filter(
                    location__distance_lte=(Point(float(lat), float(lon)), D(km=int(radius)))).order_by('Created')
                serializers_data = list(GroundNewSerializer(ground, many=True).data)
                for i in serializers_data:
                    prices = []
                    try:
                        for j in i['pricing']:
                            for k in j['times']:
                                prices.append(k['price'])
                        i['priceRange'] = [min(prices), max(prices)]
                    except:
                        pass
                return HttpResponse(JSONRenderer().render(serializers_data),
                                    content_type='application/json', status=status.HTTP_200_OK)
            else:
                return HttpResponse(JSONRenderer().render({"Error": "Please provide the location info."}),
                                    content_type='application/json', status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request, *args, **kwargs):
    #     try:
    #         data = request.data
    #         print(data)
    #     except Exception as e:
    #         return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
    #                             status=status.HTTP_400_BAD_REQUEST)

# def get(self, request, *args, **kwargs):
#     date = request.GET.get('date', None)
#     time = request.GET.get('time', None)
#     id = request.GET.get('id', None)
#     price = 0
#     if date not in [None,  ''] and time not in [None,  ''] and id not in [None,  '']:
#         ground = GroundNew.objects.get(id__exact=id)
#         date = datetime.strptime(date, "%Y-%m-%d")
#         shot_date_name = date.strftime("%a")
#         for i in ground.pricing:
#             if shot_date_name in i['days']:
#                 startTime = datetime.strptime(i['times'][0]['startTime'], "%H:%M")
#                 endTime = datetime.strptime(i['times'][0]['endTime'], "%H:%M")
#                 if startTime <= datetime.strptime(time, "%H:%M") <= endTime:
#                     price = i['times'][0]['price']
#
#     return HttpResponse(JSONRenderer().render({"price": price}),
#                         content_type='application/json', status=status.HTTP_200_OK)

def generate_slots(date_str, pricing_data):
    """
    Generate hourly slots for a given date based on pricing data.

    Args:
        date_str (str): Date for which slots are to be generated (format: YYYY-MM-DD).
        pricing_data (list): Pricing data with days and time ranges.

    Returns:
        list: List of slots with time range and prices.
    """
    # Parse the given date
    # date_str = datetime.strptime(date_str, "%Y-%m-%d")
    day_name = date_str.strftime("%a")  # Get the day name (e.g., "Mon")

    # Find the pricing for the given day
    applicable_pricing = next(
        (p for p in pricing_data if day_name in p["days"]), None
    )

    if not applicable_pricing:
        return []  # No pricing found for the day

    slots = []
    for time_range in applicable_pricing["times"]:
        start_time = datetime.strptime(time_range["startTime"], "%H:%M")
        end_time = datetime.strptime(time_range["endTime"], "%H:%M")
        price = time_range["price"]

        # Generate hourly slots
        current_time = start_time
        while current_time < end_time:
            slot_start = current_time
            slot_end = slot_start + timedelta(hours=1)

            # Adjust slot_end to not exceed end_time
            if slot_end > end_time:
                slot_end = end_time

            slots.append({
                "date": date_str,
                "startTime": slot_start.strftime("%H:%M"),
                "endTime": slot_end.strftime("%H:%M"),
                "price": price
            })
            current_time = slot_end

    return slots

class PriceCalculator(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        date = request.GET.get('date', None)
        # time = request.GET.get('time', None)
        id = request.GET.get('id', None)
        price = 0
        if date not in [None,  ''] and id not in [None,  '']:
            ground = GroundNew.objects.get(id__exact=id)
            date = datetime.strptime(date, "%Y-%m-%d")
            shot_date_name = date.strftime("%a")
            slots  = generate_slots(date_str=date, pricing_data=ground.pricing)
            trans = Transaction.objects.filter(ground_booked_date=date, groundId=id, status="SUCCESS")
            # print([item for sublist in [x.selectedSlots for x in trans] for item in sublist])
            slot_id = 1
            for slot in slots:
                slot['Availability'] = True
                slot['id'] = slot_id
                slot_id = slot_id+1
                maintenances = [x for x in ground.maintenanceSchedule if shot_date_name in x['days']] + [item for sublist in [x.selectedSlots for x in trans] for item in sublist]
                # print(maintenances)
                for maintenance in maintenances:
                    startTime = datetime.strptime(maintenance['startTime'], "%H:%M")
                    endTime = datetime.strptime(maintenance['endTime'], "%H:%M")
                    # if date.strftime("%Y-%m-%d") == datetime.now().strftime("%Y-%m-%d"):
                    #     time = datetime.now().strftime("%H:%M")
                    #     if endTime <= datetime.strptime(time, "%H:%M"):
                    #         slot['Availability'] = False
                        # if ((startTime <= datetime.strptime(time, "%H:%M"))
                        #         or (endTime >= datetime.strptime(time, "%H:%M"))):
                        #     slot['Availability'] = False
                    if ((startTime == datetime.strptime(slot['startTime'], "%H:%M")) #  <= endTime
                            or (datetime.strptime(slot['endTime'], "%H:%M") == endTime)): # startTime <=
                        slot['Availability'] = False

        return HttpResponse(JSONRenderer().render({"slots": slots}),
                            content_type='application/json', status=status.HTTP_200_OK)
