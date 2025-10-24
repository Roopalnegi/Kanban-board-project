package com.kanbanServices.taskServices.proxy;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;


@FeignClient (name = "NotificationService", url = "http://localhost:8084/api/v1/notification")
public interface NotificationServiceClient
{
   // call notification service to save notification
   @PostMapping("/saveNotification")
   Boolean sendNotificationData(@RequestBody Map<String, String> notificationData);

}
