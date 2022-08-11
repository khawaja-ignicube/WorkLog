from dataclasses import field
from rest_framework import serializers
from .models import MyUser, Department, Manager, Employee, WorkLog
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

"""Serializer class of MyUser model"""
class MyUserSerializers(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'address']


"""Serializer class of create user model"""
class CreateUserSerializer(serializers.ModelSerializer):
 
  email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=MyUser.objects.all())])
  password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
  password2 = serializers.CharField(write_only=True, required=True)

  class Meta:
    model = MyUser
    fields = ('id', 'username', 'password', 'password2', 'email', 'first_name', 'last_name', 'address')
    extra_kwargs = {'first_name': {'required': True}}

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError(
          {"password": "Password fields didn't match."})
    return attrs

  def create(self, validated_data):
    user = MyUser.objects.create(
        username=validated_data['username'],
        email=validated_data['email'],
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name'],
        address=validated_data['address']
    )
    user.set_password(validated_data['password'])
    user.save()
    return user



"""Serializer class of Department model"""
class DepartmentSerializers(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name']


"""Serializer class of Manager model"""
class ManagerSerializers(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = ['user', 'department', 'age', 'salary']


"""Serializer class of Employee model"""
class EmployeeSerializers(serializers.ModelSerializer):

    class Meta:
        model = Employee
        fields = ['user', 'department', 'experience', 'height','id']


"""Serializer class of WorkLog model"""
class WorkLogSerializers(serializers.ModelSerializer):
    class Meta:
        model = WorkLog
        fields = ['employee', 'task_start','task_end','descp', 'id']


"""Serializer class of Employee model along with WorkLog model"""
class EmployeeSerializersW(serializers.ModelSerializer):
    work=WorkLogSerializers(many=True)
    class Meta:
        model = Employee
        fields = ['user', 'department', 'experience', 'height', 'work']
