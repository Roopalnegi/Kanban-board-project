package com.kanbanServices.boardServices.configuration;

import com.kanbanServices.boardServices.filter.JwtFilter;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.FilterRegistration;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.*;

@Configuration
public class FilterConfiguration {
    @Bean
    public FilterRegistrationBean jwtFilter(){
        FilterRegistrationBean filterRegistrationBean=new FilterRegistrationBean();
        filterRegistrationBean.setFilter(new JwtFilter());
        filterRegistrationBean.addUrlPatterns("/api/v1/board/*");
        return filterRegistrationBean;

    }



}
