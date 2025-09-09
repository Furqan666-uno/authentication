from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import serializers, generics
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegisterSerializer, LoginSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class= RegisterSerializer
    http_method_names = ['post']


class LoginView(generics.GenericAPIView):
    serializer_class= LoginSerializer
    
    def post(self, request):
        login_data= self.get_serializer(data= request.data)
        if login_data.is_valid():
            return Response({"message":"You are logged in.", **login_data.validated_data}, status=status.HTTP_200_OK)
        return Response({"message":"Something went wrong. Try logging in again."}, status=status.HTTP_401_UNAUTHORIZED)