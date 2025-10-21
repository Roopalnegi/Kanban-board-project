package com.kanbanServices.boardServices.configuration;

import com.kanbanServices.boardServices.filter.JwtFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;



public class FilterConfiguration
{
    // since JwtFilter with FeignClient autowired, so register it as
    @Bean
    public FilterRegistrationBean<JwtFilter> jwtFilter(JwtFilter filter)
    {
        FilterRegistrationBean<JwtFilter> filterRegistrationBean = new FilterRegistrationBean<>();
        filterRegistrationBean.setFilter(filter);
        filterRegistrationBean.addUrlPatterns("/api/v1/board/*");
        return filterRegistrationBean;
    }


}
