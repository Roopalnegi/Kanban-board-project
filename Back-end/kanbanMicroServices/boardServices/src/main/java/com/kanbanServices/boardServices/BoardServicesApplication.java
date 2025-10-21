package com.kanbanServices.boardServices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class BoardServicesApplication
{

	public static void main(String[] args) {
		SpringApplication.run(BoardServicesApplication.class, args);
	}



}
