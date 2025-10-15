package com.kanbanServices.taskServices.configuration;

import com.kanbanServices.taskServices.filter.JwtFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


public class FilterConfig
{
    // since JwtFilter with FeignClient autowired, so register it as
    @Bean
    public FilterRegistrationBean<JwtFilter> jwtFilter(JwtFilter filter)
    {
        FilterRegistrationBean<JwtFilter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setFilter(filter);
        filterRegistrationBean.addUrlPatterns("/api/v1/task/*");
        return filterRegistrationBean;
    }
}
