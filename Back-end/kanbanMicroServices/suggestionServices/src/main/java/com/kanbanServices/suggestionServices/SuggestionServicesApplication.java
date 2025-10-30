package com.kanbanServices.suggestionServices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class SuggestionServicesApplication
{

	public static void main(String[] args) {
		SpringApplication.run(SuggestionServicesApplication.class, args);
	}

}
