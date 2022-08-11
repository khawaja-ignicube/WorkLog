from csv import DictReader
from django.core.management import BaseCommand
from work.models import MyUser,Department,Employee,WorkLog

class Command(BaseCommand):
   
    def handle(self, *args, **options):

        general_password = 'ali12345'
        for row in DictReader(open('./dummy2.csv')): 
            my_user, created = MyUser.objects.get_or_create(username=row['username'])
            if created:
                my_user.set_password(general_password)
                my_user.save()
            department_name, _ = Department.objects.get_or_create(name = row['name'])
            employee_name, _  = Employee.objects.get_or_create(user=my_user, department=department_name, experience=row['experience'], height=row['height'])
            work, _ = WorkLog.objects.get_or_create(employee=employee_name, task_start=row['task_start'], task_end=row['task_end'], descp=row['descp'])