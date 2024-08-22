package com.rayyansoft.DMS.service;

import com.rayyansoft.DMS.dto.TodoDto;

import java.util.List;

public interface TodoService {

    TodoDto addTodo(TodoDto todoDto);

    TodoDto getTodoById(Long id);

    List<TodoDto> getAllTodoDto();

    TodoDto updateTodtoDto(TodoDto todoDto, Long todosId);

    void deleteTodo(Long todosId);

    TodoDto completedTodo(Long todosId);

    TodoDto inCompleteTodo(Long todosId);
}
