from gc import get_objects
from django_q.tasks import async_task
from rest_framework import status
from rest_framework.generics import ListAPIView
from .permission import ManagerPermission,EmployeePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Department, Employee, Manager, MyUser, WorkLog
from .serializers import EmployeeSerializers, ManagerSerializers, WorkLogSerializers, EmployeeSerializersW, CreateUserSerializer


"""Create a user, required fields username, password, email, firstname, lastname, address"""
class CreateUserView(generics.CreateAPIView):
  permission_classes = (AllowAny,)
  serializer_class = CreateUserSerializer


"""Create Manager after user successfully signup"""
class CreateManagerView(generics.CreateAPIView):
    serializer_class = ManagerSerializers
    

"""If the current login user is manager then the user can access this view
   and the user can view, update and delete his profile"""
class ManagerView(APIView):

    permission_classes=[ManagerPermission]
        
    def get(self, request, format=None):
        manager = Manager.objects.get(user=self.request.user)
        serializer = ManagerSerializers(manager)
        return Response(serializer.data)

    def put(self, request, format=None):
        my_user = Manager.objects.get(user=self.request.user)
        serializer = ManagerSerializers(my_user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        my_user = Manager.objects.get(user=self.request.user)
        my_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


"""Create Employee after user successfully signup"""
class CreateEmployeeView(generics.CreateAPIView):
    serializer_class = EmployeeSerializers


"""If the current login user is employee then the user can access this view
   and the user can view, update and delete his profile"""
class EmployeeView(APIView):

    permission_classes=[EmployeePermission]
        
    def get(self, request, format=None):
        employee = Employee.objects.get(user=self.request.user)
        serializer = EmployeeSerializers(employee)
        return Response(serializer.data)

    def put(self, request, format=None):
        my_user = Employee.objects.get(user=self.request.user)
        serializer = EmployeeSerializers(my_user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        my_user = Employee.objects.get(user=self.request.user)
        my_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


"""If the current login user is manager then the user can access this view
   and the user can assigned the work to the employee"""
class ManagerAddWorkView(generics.ListCreateAPIView):

    permission_classes = [ManagerPermission]
    queryset = WorkLog.objects.all()
    serializer_class = WorkLogSerializers

    def create(self, request, *args, **kwargs):

        from_mail = self.request.user.email

        serializer = WorkLogSerializers(data=request.data)
        if serializer.is_valid():           
            serializer.save()

            """Saving the model fields data in order to send this data to employee via email."""
            id=serializer.data['employee']
            
            """Recently Change this"""
            #print("ID = ",id)
            employee = Employee.objects.get(id=id)
            #print("\n\n\na = ",employee.user)
            id=employee.user

            task_s = serializer.data['task_start']
            task_e = serializer.data['task_end']
            task_d = serializer.data['descp']

            user = MyUser.objects.get(username=id)
            to_email = user.email
            mess = 'Task has been assign to you' + '\nTask start date = ' + task_s + '\nTask end date = ' + task_e + '\nTask Description = ' + task_d 

            #Sending the email by django-Q.So the django controller dont have to wait for email sent
            async_task('django.core.mail.send_mail', 'Work Log Task', mess,to_email, [from_mail])
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""If the current login user is Employee then the user can add task"""
class EmployeeAddWorkView(generics.ListCreateAPIView):

    permission_classes = [EmployeePermission]
    queryset = WorkLog.objects.all()
    serializer_class = WorkLogSerializers

    def create(self, request, *args, **kwargs):

        from_mail = self.request.user.email
        """print("Employee email = ",from_mail)"""

        serializer = WorkLogSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()

            """Saving the model fields data in order to send this data to employee via email."""
            id = serializer.data['employee']
            #print("Emp id = ", id)
            
            emp_obj = Employee.objects.get(id=id)
            #print("Emp Object = ", emp_obj)

            dept_obj = Department.objects.get(name=emp_obj.department)
            #print("Employee dept name = ", dept_obj)

            manager_obj = Manager.objects.get(department=dept_obj)
            #print("Manager obj = ", manager_obj)

            user = MyUser.objects.get(id=manager_obj.id)
            """print("Manager Email = ",user.email)"""

            to_email = user.email

            task_s = serializer.data['task_start']
            task_e = serializer.data['task_end']
            task_d = serializer.data['descp']
            
            mess = 'Task has been assign to you' + '\nTask start date = ' + task_s + \
                '\nTask end date = ' + task_e + '\nTask Description = ' + task_d

            #Sending the email by django-Q.So the django controller dont have to wait for email sent
            async_task('django.core.mail.send_mail',
                       'Work Log Task', mess, to_email, [from_mail])

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    

class WorkLogEmployee(ListAPIView):

    serializer_class = WorkLogSerializers

    def get_queryset(self):
        employee = Employee.objects.get(user=self.request.user)
        work = WorkLog.objects.filter(employee=employee)
        return work

    

"""If the current login user is manager then the user can access this view
   and the user can view the employee's that are from his department"""
class GetEmployeeManager(ListAPIView):

    permission_classes=[ManagerPermission]
    serializer_class = EmployeeSerializers

    def get_queryset(self):
        manager = Manager.objects.get(user=self.request.user)
        employees = Employee.objects.filter(department=manager.department)
        return employees


"""If the current login user is manager then the user can access this view
   and the user can view the employee's work log that are from his department"""
class GetWorkManager(ListAPIView):

    permission_classes=[ManagerPermission]
    serializer_class = EmployeeSerializersW

    def get_queryset(self):
        manager = Manager.objects.get(user=self.request.user)
        employees = Employee.objects.filter(department=manager.department)
        return employees


"""If the current login user is manager then the user can access this view
   and the user can view all the work log that are from his department"""
class GetWorkManagerOne(ListAPIView):

    permission_classes=[ManagerPermission]

    def get_object(self,pk):
        try:
            return  Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk, format=None):
        work = self.get_object(pk)
        serializer = EmployeeSerializers(work)
        return Response(serializer.data)


class GetWork(ListAPIView):

    permission_classes = [ManagerPermission]
    serializer_class = WorkLogSerializers

   
    def get_queryset(self):
        pk=self.kwargs['pk']
        #print("\n\n\nPK = ", pk)
        work = WorkLog.objects.filter(employee=pk)
        return work


class WorkUDView(APIView):

    permission_classes = [ManagerPermission]

    def get_object(self, pk):
        try:
            work = WorkLog.objects.get(pk=pk)
            return work
        except WorkLog.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request ,pk ,format=None):
        work = self.get_object(pk)
        serializer = WorkLogSerializers(work, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        work = self.get_object(pk)
        work.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
