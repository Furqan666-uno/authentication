from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate

User= get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password= serializers.CharField(write_only=True, min_length= 5)
    password2= serializers.CharField(write_only=True, min_length= 5)

    class Meta:
        model= User
        fields= ('id', 'username', 'email', 'password', 'password2')

    def create(self, validated_data):
        password= validated_data.pop('password')
        password2= validated_data.pop('password2')
        username= validated_data['username']
        email= validated_data['email']

        if password != password2:
            raise serializers.ValidationError("Both passwords don't match. Try Again")
        new_user= User.objects.create_user(username=username, email=email, password=password)
        return new_user


class LoginSerializer(serializers.Serializer):
    password= serializers.CharField(write_only=True, min_length= 5)
    email= serializers.EmailField()

    def validate(self, attrs):
        check_user= authenticate(username= attrs['email'], password= attrs['password'])
        if not check_user:
            raise serializers.ValidationError("Invalid Credetials. Try again.")
        get_token= RefreshToken.for_user(check_user)
        return {"refresh":str(get_token), "access":str(get_token.access_token)}