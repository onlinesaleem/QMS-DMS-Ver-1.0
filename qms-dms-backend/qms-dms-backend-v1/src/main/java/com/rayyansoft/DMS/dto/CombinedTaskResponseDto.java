package com.rayyansoft.DMS.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CombinedTaskResponseDto {
    private TaskDto taskDto;
    private TaskResponseDto taskResponseDto;
}
