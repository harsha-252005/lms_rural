package com.example.demo.service;

import com.example.demo.model.Notification;
import java.util.List;

public interface NotificationService {
    Notification createNotification(Long userId, String message, String type);
    List<Notification> getUserNotifications(Long userId);
    long getUnreadCount(Long userId);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
}
