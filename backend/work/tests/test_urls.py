from django.test import SimpleTestCase
from django.urls import reverse, resolve
from work.views import ManagerView, EmployeeView, WorkLogView,GetEmployeeManager, GetWorkManager, GetWorkManagerOne

"""Testing all the urls"""
class TestUrls(SimpleTestCase):

    def test_ManagerView_url(self):
        url = reverse('man')
        print('\nURL 1 test.... ',resolve(url), '\n')
        self.assertEquals(resolve(url).func.view_class, ManagerView)
    
    def test_EmployeeView_url(self):
        url = reverse('emp')
        print('\nURL 2 test.... ',resolve(url), '\n')
        self.assertEquals(resolve(url).func.view_class, EmployeeView)
    
    def test_WorkLogView_url(self):
        url=reverse('work')
        print('\nURL 3 test.... ',resolve(url), '\n')
        self.assertEquals(resolve(url).func.view_class, WorkLogView)
    
    def test_GetEmployeeManager_url(self):
        url=reverse('manE')
        print('\nURL 4 test.... ',resolve(url), '\n')
        self.assertEquals(resolve(url).func.view_class, GetEmployeeManager)
    
    def test_GetWorkManager_view(self):
        url=reverse('manW')
        print('\nURL 5 test.... ',resolve(url), '\n')
        self.assertEquals(resolve(url).func.view_class, GetWorkManager)
    
    def test_GetWorkManagerOne_url(self):
        url=reverse('manWA',args=[15])
        print('\nURL 6 test.... ',resolve(url), '\n')
        self.assertEquals(resolve(url).func.view_class, GetWorkManagerOne)