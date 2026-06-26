from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token


from rest_framework import request, status
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

    response = Response(
        {"detail": "Logged out."}
    )

    response.delete_cookie("sessionid")

    return response


@api_view(["GET"])
def me_view(request):

    return Response({"csrfToken": get_token(request)})