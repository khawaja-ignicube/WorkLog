from django.db import models
from django.contrib.auth.models import AbstractUser

dept_ch = (
    ('Development', 'Development'),
    ('Human Resource', 'Human Resource'),
    ('Marketing', 'Marketing'),
    ('Quality Assurance', 'Quality Assurance'),
    ('Tester', 'Tester'),
    ('Content Writer', 'Content Writer')
)


"""Customization of default abstract user model"""
class MyUser(AbstractUser):
    address = models.TextField(max_length=40, null=True)

    def __str__(self):
        return (self.username)


"""The Department model have one field "name" and its type is choice"""
class Department(models.Model):
    name = models.TextField(max_length=20, choices=dept_ch, default='Development')

    def __str__(self):
        return (self.name)


"""The Manager model have OneToOne relation with MyUser model
   and have OneToOne relation with Department model"""
class Manager(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.CASCADE)
    department = models.OneToOneField(Department, on_delete=models.CASCADE)
    age = models.IntegerField()
    salary = models.IntegerField()


"""The Employee model have OneToOne relation with MyUser model
   and OneToMany relation with Department model"""
class Employee(models.Model):
    user = models.OneToOneField(MyUser, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    experience = models.IntegerField()
    height = models.IntegerField()


"""The WorkLog model have OneToMany relation with Employee model"""
class WorkLog(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='work')
    task_start = models.DateTimeField()
    task_end = models.DateTimeField()
    descp = models.TextField(max_length=50)