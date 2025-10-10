package com.kanbanServices.boardServices.utility;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;
@Component
public class RequestHelper {
    public String getRole(HttpServletRequest request)
    {
        String role = (String) request.getAttribute("role");
        return role;
    }

    // check if user is admin
    public void checkAdminRole(HttpServletRequest request) throws AccessDeniedException
    {
        String role = getRole(request);

        if(!"admin".equals(role))
        {
            // 403 code
            throw new AccessDeniedException("Access denied: Only admin can perform the task");
        }
    }

    // check if user is employee
    public void checkEmployeeRole(HttpServletRequest request) throws AccessDeniedException
    {
        String role = getRole(request);

        if(!"employee".equals(role))
        {
            // 403 code
            throw new AccessDeniedException("Access denied: Only employee can perform the task");
        }
    }
}


/*
 In spring boot controllers, if you want to access details of real http request like headers, attributes set by filers etc.
   --- then spring boot automatically provide HttpServletRequest Object  (package - jakarta.servlet.http)
                                                      |
                                                  given by servlet API
                                                      |
                                                  can use directly into controller layer

   --- so if filter has this line :-
       httpServletRequest.setAttribute("role",role);

   --- then , in controller layer , directly use it
       public ResponseEntity<?> handleCreateTask(HttpServletRequest request)
       -- spring itself take care of it
 */

