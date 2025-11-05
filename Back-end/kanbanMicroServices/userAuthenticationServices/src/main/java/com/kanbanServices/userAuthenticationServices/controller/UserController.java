package com.kanbanServices.userAuthenticationServices.controller;


import com.kanbanServices.userAuthenticationServices.domain.User;
import com.kanbanServices.userAuthenticationServices.domain.UserProfileImage;
import com.kanbanServices.userAuthenticationServices.exception.ImageNotFoundException;
import com.kanbanServices.userAuthenticationServices.exception.InvalidPasswordException;
import com.kanbanServices.userAuthenticationServices.exception.UserAlreadyExistsException;
import com.kanbanServices.userAuthenticationServices.exception.UserNotFoundException;
import com.kanbanServices.userAuthenticationServices.service.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/user")
public class UserController
{
   private final IUserService userService;
   private final UserProfileImageService profileService;
   private final SecurityTokenGenerator securityTokenGenerator;
   private final EmailService emailService;
   private final OtpService otpService;

   @Autowired
   public UserController(IUserService userService, SecurityTokenGenerator securityTokenGenerator, EmailService emailService, OtpService otpService, UserProfileImageService profileService)
   {
        this.userService = userService;
        this.securityTokenGenerator = securityTokenGenerator;
        this.emailService = emailService;
        this.otpService = otpService;
        this.profileService = profileService;
   }


   // method to login
   @PostMapping("/verify-credentials")
   public ResponseEntity<?> loginUser(@RequestBody User user)
   {
       try
       {
           User foundUser = userService.loginUser(user);
           Map<String,String> token = securityTokenGenerator.generateToken(foundUser);

           // if credentials is valid, send otp
           String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
           otpService.saveOtp(foundUser.getEmail(), otp);

           // send OTP via email
           emailService.sendEmail(foundUser.getEmail(), "Kanban Board OTP", "Your OTP is : " + otp);
           return new ResponseEntity<>("OTP is send to " + foundUser.getEmail() + " . Please verify to continue login.",HttpStatus.OK);
       }
       catch(UserNotFoundException e)
       {
           // 404 -- NOT FOUND
           return new ResponseEntity<>("User not found with email : " + user.getEmail(),HttpStatus.NOT_FOUND);
       }
       catch (InvalidPasswordException e)
       {
           // 401 -- UNAUTHORIZED
           return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
       }
       catch (Exception e)
       {
           // 500 -- INTERNAL SERVER ERROR
           return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
       }
   }


    // method to return jwt token after otp verification is done
    @PostMapping("/login")
    public ResponseEntity<?> verifyLoginOtp(@RequestBody User user)
    {
        try
        {
            User foundUser = userService.loginUser(user);
            Map<String,String> token = securityTokenGenerator.generateToken(foundUser);


            Map<String, Object> response = new HashMap<>();
            response.put("token", token.get("token"));
            response.put("user", foundUser);

            return new ResponseEntity<>(response, HttpStatus.OK);

        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // method to register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User newUser)
    {
        try
        {
            User foundUser = userService.registerUser(newUser);
            return new ResponseEntity<>(foundUser,HttpStatus.OK);      // 200 OK -- success

        }
        catch(UserAlreadyExistsException e)
        {
            // 409 -- CONFLICT
            return new ResponseEntity<>("User already exists  with email : " + newUser.getEmail(),HttpStatus.CONFLICT);
        }
        catch (Exception e)
        {
            // 500 -- INTERNAL SERVER ERROR
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    // method to decode jwt token and return email + role
    @GetMapping("/validateToken")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token)
    {
        try
        {
            // verify jwt token and return role / username

            if(token == null || !token.startsWith("Bearer "))
            {
                return new ResponseEntity<>("Missing or Invalid Token", HttpStatus.UNAUTHORIZED);
            }

            // decode the jwtToken
            String jwtToken = token.substring(7);
            Claims claims = Jwts.parser()
                                .setSigningKey("kabanprojectsecretkey@123")
                                .parseClaimsJws(jwtToken)
                                .getBody();

            String email = claims.getSubject();
            String role = claims.get("role", String.class);

            Map<String,String> map = new HashMap<>();
            map.put("email", email);
            map.put("role", role);

            return new ResponseEntity<>(map,HttpStatus.OK);

        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to generate 6 digit OTP , stores it in memory and sends email
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp (@RequestParam String email, @RequestParam String context)
    {
        try
        {
            // first validate email format
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$"))
            {
                return new ResponseEntity<>("Invalid Email Format", HttpStatus.BAD_REQUEST);
            }

            // check if email exist or not based on context
            // for registration , not checking email existence as new users are registering
            if("login".equalsIgnoreCase(context))
            {
                // check if email exits or not
                userService.findByEmail(email)
                        .orElseThrow(() -> new UserNotFoundException("Email does not exist!"));

            }


            // if email format is valid, generate 6 digit OTP
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);

            // debugging purpose
            System.out.println("Generated OTP for " + email + " : " + otp);

            // save OTP temporarily in-memory map
            // so that later you can check if user enter correct otp or not
            otpService.saveOtp(email, otp);

            // send OTP via email
            emailService.sendEmail(email, "Kanban Board OTP", "Your OTP is : " + otp);

            return new ResponseEntity<>("OTP is send to " + email ,HttpStatus.OK);
        }
        catch(Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to check OTP correctness and expiration
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp)
    {
        try
        {
            // check if OTP expired
            if (otpService.isOtpExpired(email))
            {
                // remove otp
                otpService.removeOtp(email);
                return new ResponseEntity<>("OTP expired. Please request a new one.", HttpStatus.BAD_REQUEST);
            }

            // check if OTP is correct
            if(otpService.verifyOtp(email,otp))
            {
                //remove after successfully verification
                otpService.removeOtp(email);
                return new ResponseEntity<>("Email verified successfully", HttpStatus.OK);
            }

            // if OTP not expired but incorrect
            return new ResponseEntity<>("Invalid OTP. Please try again", HttpStatus.BAD_REQUEST);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to fetch all employee based user for assigned To property of task
    @GetMapping("/fetchAllEmployeeDetails")
    public ResponseEntity<?> fetchAllEmployeeDetails()
    {
        try
        {
           Map<Long,String> employeeDetails = userService.fetchAllEmployees();
           return new ResponseEntity<>(employeeDetails, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to fetch all users registered in system
    @GetMapping("/fetchAllRegisteredUsers")
    public ResponseEntity<?> fetchAllRegisteredUsers()
    {
        try
        {
            List<Map<String,Object>> registeredUser = userService.getAllRegisteredUsers();
            return new ResponseEntity<>(registeredUser, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to save profile image in db
    @PostMapping("/uploadProfileImage")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file, @RequestParam("userId") Long userId)
    {
        try
        {
            Boolean success = profileService.saveImage(file,userId);

            return new ResponseEntity<>(success,HttpStatus.OK);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // method to get uploaded profile image
    @GetMapping("/getProfileImage")
    public ResponseEntity<?> getProfileImage(@RequestParam("userId") Long userId)
    {
        try
        {
            UserProfileImage image = profileService.getImage(userId);

            return ResponseEntity.ok()
                    .header("Content-Type", image.getContentType())
                    .body(image.getImageData());
        }
        catch (ImageNotFoundException e)
        {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}




/*
 explanation of OTP generation
 Math.random() - generate values b/w 0.0 to 1.0 (exclusive)
 Math.random()* 9000000 -- setting a huge range (decimal value)
                         -- i.e. 0.0 to 899,999.999
 int --> convert random no. to integer type (remove decimal)
 + 1000000 -- make sure otp is always 6 digit
           -- so, now range will be 1000000 -- 999,999

 String.valueOf()  -- convert integer OTP into string because we usually send otp as string via email

 */