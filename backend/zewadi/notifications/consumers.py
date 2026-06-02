import json
from http.cookies import SimpleCookie
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework_simplejwt.authentication import JWTAuthentication


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        user = await self.get_authenticated_user()
        self.group_name = None

        if user and user.is_authenticated:
            self.group_name = f"user_{user.id}"
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name,
            )

        if not self.group_name:
            await self.close(code=4401)
            return

        await self.accept()


    async def disconnect(self, close_code):

        if self.group_name:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name,
            )


    async def send_notification(self, event):

        await self.send(text_data=json.dumps({
            "type": "notification",
            "id": event["id"],
            "notification_id": event["notification_id"],
            "title": event["title"],
            "body": event["body"],
            "message": event["message"],
            "notification_type": event["notification_type"],
            "target_role": event["target_role"],
            "action_url": event.get("action_url", ""),
            "created_at": event["created_at"],

        }))

    async def get_authenticated_user(self):
        user = self.scope.get("user")
        if user and user.is_authenticated:
            return user

        token = self.get_cookie_value("access_token") or self.get_query_token()
        if not token:
            return user

        return await self.get_user_from_token(token)

    def get_query_token(self):
        query_string = self.scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token = params.get("token") or params.get("access")
        return token[0] if token else None

    def get_cookie_value(self, name):
        cookies = SimpleCookie()
        for header_name, header_value in self.scope.get("headers", []):
            if header_name == b"cookie":
                cookies.load(header_value.decode())

        cookie = cookies.get(name)
        return cookie.value if cookie else None

    @database_sync_to_async
    def get_user_from_token(self, token):
        try:
            jwt_authentication = JWTAuthentication()
            validated_token = jwt_authentication.get_validated_token(token)
            return jwt_authentication.get_user(validated_token)
        except Exception:
            return self.scope.get("user")
