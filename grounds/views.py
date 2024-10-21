from django.http import HttpResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer

from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import DjangoModelPermissions
from rest_framework.pagination import PageNumberPagination
from rest_framework import status

from rest_framework_simplejwt.authentication import JWTAuthentication

from drf_spectacular.utils import extend_schema, OpenApiParameter

from grounds.serializers import Grounds, GroundsSerializer


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
                return HttpResponse(JSONRenderer().render(GroundsSerializer(ground).data))
            else:
                ground=Grounds.objects.all().order_by('-created')
                return HttpResponse(JSONRenderer().render(GroundsSerializer(ground, many=True).data))
        except Grounds.DoesNotExist:
            return HttpResponse(JSONRenderer().render({"Error": "Provide valid Ground name"}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return HttpResponse(JSONRenderer().render({"Error": str(e)}), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=GroundsSerializer, summary="Adding Ground", description="This endpoint helps to create a Ground")
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = GroundsSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return HttpResponse(JSONRenderer().render(serializer.data), content_type='application/json',
                                    status=status.HTTP_201_CREATED)
            return HttpResponse(JSONRenderer().render(serializer.errors), content_type='application/json',
                                status=status.HTTP_400_BAD_REQUEST)
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
