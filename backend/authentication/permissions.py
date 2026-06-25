from rest_framework.permissions import BasePermission


class IsGroundStationClient(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.groups.filter(
                name="GroundStationClient"
            ).exists()
        )


class IsGroundStationNetwork(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.groups.filter(
                name="GroundStationNetwork"
            ).exists()
        )