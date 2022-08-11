from dataclasses import field
from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django import forms
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.contrib.auth.admin import UserAdmin
from .models import WorkLog, MyUser,Department,Manager,Employee

class CustomUserAdmin(UserAdmin):
    pass

"""Adding models to the admin panel"""
class ManagerAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'age', 'salary')

class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'experience', 'height')
    
    #Admin custom action
    actions = ['department']

    @admin.action(description='Change Department')
    def department(self, request, queryset):
        queryset.update(department = 10)

class DepartmentAdmin(admin.ModelAdmin):
    actions = None


"""Form class to get a file CSV file"""
class CsvImportForm(forms.Form):
    csv_upload = forms.FileField()

"""Customize the admin work log page"""
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('employee', 'task_start', 'task_end', 'descp')


    def get_urls(self):
        #Adding super URL(parent URL) with ImportCSV URL
        urls = super().get_urls()
        new_urls = [path('ImportCSV/', self.upload_csv),]
        return new_urls + urls


    def upload_csv(self, request):
        #Perform action on Upload file button
        if request.method == "POST":
            print("Upload file button is triggered")

            #Grab file data from form 
            csv_file = request.FILES["csv_upload"]

            #If file format is not correct return an error
            if not csv_file.name.endswith('.csv'):
                messages.warning(request, 'The uploaded file is not csv forma')
                return HttpResponseRedirect(request.path_info)

            #Correct format
            file_data = csv_file.read().decode("utf-8")

            #Split list after new line
            csv_data = file_data.split("\n")

            general_password = 'ali12345'

            for x in csv_data:
                #Split list after new line
                fields = x.split(',')
                print('Importing')
                
                my_user, created = MyUser.objects.get_or_create(username=fields[0])
                if created:
                    my_user.set_password(general_password)
                    my_user.save()
                
                department_name, _ = Department.objects.get_or_create(name=fields[1])
                employee_name, _  = Employee.objects.get_or_create(user=my_user, department=department_name, experience=fields[2], height=fields[3])
                work, _ = WorkLog.objects.get_or_create(employee=employee_name, task_start=fields[4], task_end=fields[5], descp=fields[6])
 
        form = CsvImportForm()
        data = {'form': form}
        return render(request, 'admin/csv_upload.html',data)



admin.site.register(MyUser, UserAdmin)
admin.site.register(Department, DepartmentAdmin)
admin.site.register(Manager, ManagerAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(WorkLog, CustomerAdmin)