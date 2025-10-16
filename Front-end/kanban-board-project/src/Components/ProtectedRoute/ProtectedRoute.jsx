import { Navigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useSnackbar } from "notistack";

function ProtectedRoute({children, allowedRole, userData})
{

    const { enqueueSnackbar} = useSnackbar();

    const shownRef = useRef(false);      // show alert only once per redirect

    
    // determine if access is allowed 
    const accessDenied = !userData || (allowedRole && userData.role !== allowedRole);


    // show snackbar
    useEffect(() => {

        if(accessDenied && !shownRef.current)
        {
            shownRef.current = true;
            enqueueSnackbar("Permission Denied !", {variant: "error",
                                                    autoHideDuration: 2000,
                                                    anchorOrigin: {vertical: "top", horizontal: "right"}

                                      });
        }
    },[accessDenied, enqueueSnackbar]);

    // handle redirect code 
    if(accessDenied)
        return <Navigate to = "/login" replace/>;


    // if eveything passes, allow access to the user
    return children;
    
    
}

export default ProtectedRoute;


/*
ProtectedRoute -- component that Protects certain routes in your React app so that only authorized users can access them.
               -- Checks both authentication (is user logged in?) and authorization (does user have the correct role?).
it takes 3 props --   
  i. children: The component(s) to render if access is allowed (e.g., AdminDashboard).
  ii. allowedRole: (optional) role required to access (e.g., "admin" or "employee").
  iii. userData: logged-in user object containing info like role, info

How it works:
  1. If user not logged in → redirect to /login
  2. If user role doesn't match allowedRole → redirect to /
  3. While redirecting, show a snackbar message for feedback
  4. If checks pass → render the protected page (children)


*/


/*
we can't use navigate() to redirect in ProtectedRoute
so, use <Navigate /> component -- react-router-dom
                               -- redirect in declaratively style

replace -- ensure the browser history is replaced so the user can't hit back to the restricted page
*/