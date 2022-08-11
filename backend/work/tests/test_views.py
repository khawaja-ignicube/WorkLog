from work.models import MyUser,Department, Manager, Employee, WorkLog
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
import json

"""Testing all the views"""
class TestUserView(APITestCase):

    #creating some user and objects of model for testing
    def setUp(self):
        self.Gpass = 'ali12345'
        self.Gmail = 'khawajaali444@gmail.com'

        userA = MyUser.objects.create(username='Khawaja',email=self.Gmail ,is_staff = True)
        userA.set_password(self.Gpass)
        userA.save()       
        userM = MyUser.objects.create(username='Ali',email=self.Gmail)
        userM.set_password(self.Gpass)
        userM.save()
        userE = MyUser.objects.create(username='Hassan',email=self.Gmail)
        userE.set_password(self.Gpass)
        userE.save()

        self.dept1 = Department.objects.create(name= "Development")
        self.dept2 = Department.objects.create(name= "Human Resource")
        self.dept3 = Department.objects.create(name= "Marketing")

        self.man1 = Manager.objects.create(
            user=userM,
            department = self.dept1,
            age = 1,
            salary = 1,
        )

        self.emp1 = Employee.objects.create(
            user = userE,
            department = self.dept1,
            experience = 2,
            height = 2
        )

        self.work1 = WorkLog.objects.create(
            employee = self.emp1,
            task_start = "2022-06-14T00:00:00Z",
            task_end = "2022-06-06T00:00:00Z",
            descp = 'Unit Test Case'
        )


        self.client = APIClient()
        self.validU = {'username': 'Khawajaa'}
        self.validD = {'name':'Tester'}
        self.validM = {
            'user': 1,
            'department': 1, 
            'age':2,
            'salary': 2
        }
        self.validE = {
            'user': 1,
            'department': 2,
            'experience':3,
            'height': 3
        }
        self.work_log = {
            'employee': 1,
            'task_start': "2022-06-14T00:00:00Z",
            'task_end': "2022-06-06T00:00:00Z",
            'descp': 'Put Unit Test Case',
        }
    


    """Test get method of ManagerView class view"""
    def test_ManagerView_view_get(self):
        # Manager User has to login to access the view 
        self.client.login(username='Ali', password='ali12345')
        response = self.client.get(reverse('man'))
        print('\n7 Manager get one test.... ',response, '\n')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    """Test put method of ManagerView class view"""
    def test_ManagerView_view_put(self):
        self.client.login(username='Ali', password= 'ali12345')
        response  = self.client.put(
            reverse('man'),
            data = json.dumps(self.validM),
            content_type='application/json'
        )
        print('\n8 Manager get one test.... ',response, '\n')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    """Test delete method of ManagerView class view"""
    def test_ManagerView_view_del(self):
        self.client.login(username="Ali", password = 'ali12345')
        response =self.client.delete(reverse('man')) 
        print('\n9 Manager delete one test.... ',response, '\n')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    


    """Test get method of EmployeeView class view"""
    def test_EmployeeView_view_get(self):
        # Employee User has to login to access the view
        self.client.login(username='Hassan', password='ali12345')
        response = self.client.get(reverse('emp'))
        print('\n10 Employee get one test.... ',response, '\n')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    """Test put method of EmployeeView class view"""
    def test_EmployeeView_view_put(self):
        self.client.login(username = 'Hassan', password = 'ali12345')
        response = self.client.put(
            reverse('emp'),
            data = json.dumps(self.validE),
            content_type='application/json'
        )
        print('\n11 Employee put one test.... ',response, '\n')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    """Test delete method of EmployeeView class view"""
    def test_Employee_View_view_del(self):
        self.client.login(username="Hassan", password = 'ali12345')
        response =self.client.delete(reverse('emp')) 
        print('\n12 Employee delete one test.... ',response, '\n')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    

    """Test get method of WorkLogView class view"""
    def test_WorkLogView_view_get(self):
        # Manager User has to login to access the view 
        self.client.login(username='Ali', password='ali12345')
        response = self.client.get(reverse('work'))
        print('\n13 Work get all test.... ',response, '\n')
        self.assertEquals(response.status_code,200)

    """Test create method of WorkLogView class view"""
    def test_WorkLogView_view_post(self):
        self.client.login(username='Ali', password='ali12345')
        response = self.client.post(
            reverse('work'),
            data=(self.work_log)
        )
        print('\n14 Work post one test.... ',response, '\n')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)



    """Test get method to get all manager's employee by department filtration"""
    def test_GetEmployeeManager_view_get(self):
        # Manager User has to login to access the view 
        self.client.login(username='Ali', password='ali12345')
        response = self.client.get(reverse('manE'))
        print('\n15 Get All Managers Employee test.... ',response, '\n')
        self.assertEquals(response.status_code,200)
    
    """Test get method to get all manager's employee's worklog by department filtration"""
    def test_GetWorkManager_view_get(self):
        # Manager User has to login to access the view 
        self.client.login(username='Ali', password='ali12345')
        response = self.client.get(reverse('manW'))
        print('\n16 Get All Managers Work test.... ',response, '\n')
        self.assertEquals(response.status_code,200)
    
    """Test get method to get all manager's worklog"""
    def test_GetWorkManagerOne_view_get(self):
        # Manager User has to login to access the view 
        self.client.login(username='Ali', password='ali12345')
        response = self.client.get(reverse('manWA', kwargs={'pk':1}))
        print('\n17 Managers Work test.... ',response, '\n')
        self.assertEquals(response.status_code,200)

