from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


class NameLoginView(APIView):
    permission_classes = []

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={'name': openapi.Schema(type=openapi.TYPE_STRING)},
        )
    )
    def post(self, request):
        name = request.data.get('name')
        if not name:
            return Response({'error': 'name is required'}, status=400)

        user, created = User.objects.get_or_create(username=name)
        token, _ = Token.objects.get_or_create(user=user)

        return Response({'token': token.key})