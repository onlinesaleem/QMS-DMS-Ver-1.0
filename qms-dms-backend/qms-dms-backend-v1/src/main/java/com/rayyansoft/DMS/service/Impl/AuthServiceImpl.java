package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.dto.*;
import com.rayyansoft.DMS.entity.Department;
import com.rayyansoft.DMS.entity.Role;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.exception.ResourceNotFoundException;
import com.rayyansoft.DMS.exception.TodoAPIException;
import com.rayyansoft.DMS.repository.DepartmentRepository;
import com.rayyansoft.DMS.repository.RoleRepository;
import com.rayyansoft.DMS.repository.UserRepository;
import com.rayyansoft.DMS.security.JwtTokenProvider;
import com.rayyansoft.DMS.service.AuthService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private DepartmentRepository departmentRepository;
    private AuthenticationManager authenticationManager;

    private JwtTokenProvider jwtTokenProvider;

    private ModelMapper modelMapper;
    @Override
    public String register(RegisterDto registerDto) {
        // check the username exists or not
        if(userRepository.existsByUsername(registerDto.getUsername()))
        {
            throw  new TodoAPIException(HttpStatus.BAD_REQUEST,"Username already existis");
        }

        if(userRepository.existsByEmail(registerDto.getEmail()))
        {
            throw new TodoAPIException(HttpStatus.BAD_REQUEST,"Email already exists");
        }
        Department department = departmentRepository.findById(registerDto.getDepartmentId())
                .orElseThrow(() -> new TodoAPIException(HttpStatus.BAD_REQUEST, "Department not found"));
       System.out.println("the enter department id is"+department.getDepartName());
        User user =new User();
        user.setName(registerDto.getName());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setDepartment(department);
        user.setEmpNumber(registerDto.getEmpNumber());
        Set<Role> roles=new HashSet<>();
        Role userRole=roleRepository.findByName("ROLE_USER");
        roles.add(userRole);
        user.setRoles(roles);
        userRepository.save(user);
        return "User Registered Successfully!";
    }




    @Override
    public JwtAuthResponse login(LoginDto loginDto) {

       Authentication authentication= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(),
                loginDto.getPassword()
        ));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token=jwtTokenProvider.generateToken(authentication);

       Optional<User> userOptional= userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail()
               );

       String role=null;
       if(userOptional.isPresent()) {
           User loggedInUser=userOptional.get();
           Optional<Role> optionalRole=loggedInUser.getRoles().stream().findFirst();
           if (optionalRole.isPresent()) {
               Role userRole=optionalRole.get();
               role=userRole.getName();
           }


           }
        JwtAuthResponse jwtAuthResponse=new JwtAuthResponse();
        jwtAuthResponse.setRole(role);
        jwtAuthResponse.setAccessToken(token);

        return jwtAuthResponse;
    }

    @Override
    public Long findByUserId(String userName) {
       Optional<User> user=userRepository.findByUsername(userName);
        if (user.isPresent()) {
            return user.get().getId();
        } else {
            throw new NoSuchElementException("Username not found: " + userName);
            // Or return a default value, or handle the case differently based on your requirement
        }
    }



    @Override
    public Page<User> fetchAllUser(int page, int size) {
        Pageable pageable= PageRequest.of(page, size);
       return userRepository.findAll(pageable);
    }

    @Override
    public List<DepartmentDto> getAllDepartment() {
        List<Department> departments=departmentRepository.findAll();
        return departments.stream().map((department -> modelMapper.map(department,DepartmentDto.class)))
                .collect(Collectors.toList());
    }

    @Override
    public UserDto fetchUserDetailsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Fetch department details
        Department department = user.getDepartment();

        // Check if department is null
        if (department == null) {
            throw new TodoAPIException(HttpStatus.BAD_REQUEST, "User does not belong to any department");
        }

        // Get department name
        String departmentName = department.getDepartName();

        // Map User entity to UserDto
        UserDto userDto = modelMapper.map(user, UserDto.class);

        // Set department name in UserDto
        userDto.setDepartmentName(departmentName);

        return userDto;
    }

    @Override
    public void updateProfile(Long userId, UserDto userDto) {
        User user=userRepository.findById(userId).orElseThrow(()->
                new ResourceNotFoundException("the given id not found"));
        Department department = departmentRepository.findById(userDto.getDepartmentId())
                .orElseThrow(() -> new TodoAPIException(HttpStatus.BAD_REQUEST, "Department not found"));
        user.setName(userDto.getName());
        user.setEmail((userDto.getEmail()));
        user.setEmpNumber(userDto.getEmpNumber());
        user.setDepartment(department);
        user.setUsername(userDto.getUsername());
        if (!user.getPassword().equals(userDto.getPassword())) {
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        }
        userRepository.save(user);

    }

    @Override
    public UserDto findByEmail(Long userId) {
        User user=userRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("the given id not found"));
        UserDto userDto=new UserDto();
        userDto.setEmail(user.getEmail());
        userDto.setName(user.getName());
        return userDto;
    }

    @Override
    public void updateUserPassword(Long userId,UserDto userDto) {
        User user=userRepository.findById(userId).orElseThrow(()->new ResourceNotFoundException("the given id not found"));
        String encodedPassword=passwordEncoder.encode(userDto.getPassword());

        user.setPassword(encodedPassword);

        userRepository.save(user);
    }


}
