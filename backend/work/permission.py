from rest_framework.permissions import BasePermission
from .models import Manager,Employee

"""Verify the current login user is manager"""
class ManagerPermission(BasePermission):
    def has_permission(self, request, view):
        getID = request.user.id
        try:
            Manager.objects.get(user=getID)
            return True
        except:
            return False

"""Verify the current login user is employee"""
class EmployeePermission(BasePermission):
    def has_permission(self, request, view):
        getID = request.user.id
        try:
            Employee.objects.get(user=getID)
            return True
        except:
            return False