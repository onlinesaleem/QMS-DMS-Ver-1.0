package com.rayyansoft.DMS;

import com.rayyansoft.DMS.config.SpringSecurityConfig;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordEncoderTest {

    public static void main(String[] args) {
        // Retrieve the PasswordEncoder bean from SpringSecurityConfig class
        PasswordEncoder passwordEncoder = SpringSecurityConfig.passwordEncoder();

        // Password to be encoded
        String password = "S@786";

        // Encode the password
        String encodedPassword = passwordEncoder.encode(password);

        // Print the encoded password
        System.out.println("Encoded password: " + encodedPassword);
    }
}
