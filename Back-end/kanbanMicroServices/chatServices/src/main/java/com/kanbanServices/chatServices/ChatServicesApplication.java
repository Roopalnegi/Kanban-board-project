package com.kanbanServices.chatServices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ChatServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatServicesApplication.class, args);
	}

}
