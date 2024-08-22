package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.dto.TaskResponseDto;
import com.rayyansoft.DMS.dto.UserFeedbackDto;
import com.rayyansoft.DMS.entity.User;
import com.rayyansoft.DMS.entity.UserFeedback;
import com.rayyansoft.DMS.repository.TaskResponseRepository;
import com.rayyansoft.DMS.repository.UserFeedbackRepository;
import com.rayyansoft.DMS.repository.UserRepository;
import com.rayyansoft.DMS.service.UserFeedbackService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserFeedbackServiceImpl implements UserFeedbackService {

    private UserRepository userRepository;
    private UserFeedbackRepository userFeedbackRepository;
    private TaskResponseRepository taskResponseRepository;
    private ModelMapper modelMapper;
    @Override
    public UserFeedbackDto addUserFeedbackDto(UserFeedbackDto userFeedbackDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
        String strDate = formatter.format(date);
        strDate = formatter.format(date);
        Optional<User> user=userRepository.findByUsername(auth.getName());
        Long userId=user.get().getId();
        userFeedbackDto.setCreatedBy(userId);
        userFeedbackDto.setCreatedOn(strDate);
        userFeedbackDto.setIsFeedBackDone(true);

        UserFeedback userFeedback=modelMapper.map(userFeedbackDto,UserFeedback.class);
        UserFeedback savedUserFeedback=userFeedbackRepository.save(userFeedback);

        taskResponseRepository.updateTaskUserFeedback(userFeedbackDto.getTaskResponseId(),userFeedback.getId(),
                userFeedbackDto.getIsFeedBackDone());
        return modelMapper.map(savedUserFeedback,UserFeedbackDto.class);
    }

    @Override
    public void updateTaskResponseFeedback(Long id, TaskResponseDto taskResponseDto) {
        taskResponseRepository.updateTaskUserFeedback(id,taskResponseDto.getUserFeedBackId(),
                taskResponseDto.getIsUserFeedBackDone());
    }

    @Service
    public static class EmailService {

        @Autowired
        private JavaMailSender mailSender;

        public void sendSimpleEmail(String to, String subject, String text) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("your-office365-email@example.com");

            mailSender.send(message);
        }
    }
}
