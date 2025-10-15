package com.kanbanServices.taskServices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class TaskServicesApplication
{

	public static void main(String[] args) {
		SpringApplication.run(TaskServicesApplication.class, args);
	}

}
