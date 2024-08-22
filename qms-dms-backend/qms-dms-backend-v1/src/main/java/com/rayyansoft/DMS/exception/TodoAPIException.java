package com.rayyansoft.DMS.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public class TodoAPIException extends RuntimeException{

    private HttpStatus httpStatus;
    private String message;

}
