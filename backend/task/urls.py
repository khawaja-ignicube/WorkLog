from django.contrib import admin
from django.urls import path,include
from work import views
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import TokenVerifyView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('create/',views.CreateUserView.as_view(), name='create'),
    
    path('log/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(),name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    path('createman/', views.CreateManagerView.as_view(), name='createman'),
    path('createemp/', views.CreateEmployeeView.as_view(), name='createemp'),

    path('api/manager/', views.ManagerView.as_view(), name = 'man'),
    path('api/employee/',views.EmployeeView.as_view(), name = 'emp'),
    
    path('api/work/', views.ManagerAddWorkView.as_view(), name='work'),
    path('api/addWorkEmp/', views.EmployeeAddWorkView.as_view(), name='work'),
    path('api/workEmp/', views.WorkLogEmployee.as_view(), name='workCh'),

    path('api/managerEmp/', views.GetEmployeeManager.as_view(), name = 'manE'),
    path('api/managerWork/', views.GetWorkManager.as_view(), name = 'manW'),
    path('api/managerWork/<int:pk>', views.GetWorkManagerOne.as_view(), name = 'manWA'), 


    path('api/Gwork/<int:pk>', views.GetWork.as_view(), name='workGet'),

    path('api/Uwork/<int:pk>', views.WorkUDView.as_view(), name='workUpdate'),
]
