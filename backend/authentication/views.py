from django.contrib.auth import authenticate, login, logout

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSerializer


@api_view(["POST"])
def login_view(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    if user is None:
        return Response(
            {
                "detail": "Invalid username or password."
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    login(request, user)

    return Response(
        UserSerializer(user).data
    )


@api_view(["POST"])
def logout_view(request):

    logout(request)

    return Response(
        {
            "detail": "Logged out."
        }
    )


@api_view(["GET"])
def me_view(request):

    if not request.user.is_authenticated:

        return Response(
            {
                "authenticated": False,
            }
        )

    return Response(
        {
            "authenticated": True,
            "user": UserSerializer(
                request.user
            ).data,
        }
    )