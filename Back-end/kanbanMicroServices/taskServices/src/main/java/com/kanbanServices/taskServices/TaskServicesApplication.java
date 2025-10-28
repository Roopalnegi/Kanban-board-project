package com.kanbanServices.taskServices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@SpringBootApplication
@EnableFeignClients
@EnableScheduling
public class TaskServicesApplication
{

	public static void main(String[] args) {
		SpringApplication.run(TaskServicesApplication.class, args);
	}

}


/*
@EnableScheduling -- look for @scheduled methods automatically once per day
                  -- check checkDueDatesAndNotify () in service impl class

 */
