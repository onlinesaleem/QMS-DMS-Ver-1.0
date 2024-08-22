package com.rayyansoft.DMS.service.Impl;

import com.rayyansoft.DMS.dto.TodoDto;
import com.rayyansoft.DMS.entity.Todo;
import com.rayyansoft.DMS.exception.ResourceNotFoundException;
import com.rayyansoft.DMS.repository.TodoRepository;
import com.rayyansoft.DMS.service.TodoService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TodoServiceImpl implements TodoService {

    private TodoRepository todoRepository;
    private ModelMapper modelMapper;


    @Override
    public TodoDto addTodo(TodoDto todoDto) {


        Todo todo = modelMapper.map(todoDto,Todo.class);

        Todo savedToto=todoRepository.save(todo);

        TodoDto savedTodoDto=modelMapper.map(savedToto,TodoDto.class);

        return savedTodoDto;

    }

    @Override
    public TodoDto getTodoById(Long id) {

        Todo todo=todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: "+  id));

        // mapper class mapping the todo class to todo dto class..
        return modelMapper.map(todo,TodoDto.class);
    }

    @Override
    public List<TodoDto> getAllTodoDto() {
        List<Todo> todos=todoRepository.findAll();
        return todos.stream().map((todo)->modelMapper.map(todo,TodoDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public TodoDto updateTodtoDto(TodoDto todoDto, Long todosId) {

        Todo todo=todoRepository.findById(todosId)
                .orElseThrow(()->new ResourceNotFoundException("the given id todos not found"+todosId));
        todo.setTitle(todoDto.getTitle());
        todo.setDescription(todoDto.getDescription());
        todo.setCompleted(todoDto.isCompleted());
        Todo savedTodos=todoRepository.save(todo);

        return modelMapper.map(savedTodos,TodoDto.class);
    }

    @Override
    public void deleteTodo(Long todosId) {

        Todo todo=todoRepository.findById(todosId)
                .orElseThrow(()-> new ResourceNotFoundException("the given todos id not found"+todosId));
        todoRepository.delete(todo);


    }

    @Override
    public TodoDto completedTodo(Long todosId) {
        Todo todo=todoRepository.findById(todosId)
                .orElseThrow(()->new ResourceNotFoundException("the given id not found"+todosId));
      todo.setCompleted(Boolean.TRUE);
        Todo updatedtodo=todoRepository.save(todo);
        return modelMapper.map(updatedtodo,TodoDto.class);
    }

    @Override
    public TodoDto inCompleteTodo(Long todosId) {
        Todo todo=todoRepository.findById(todosId)
                .orElseThrow(()->new ResourceNotFoundException("the given id not found"+todosId));
        todo.setCompleted(Boolean.FALSE);
        Todo updatedtodo=todoRepository.save(todo);
        return modelMapper.map(updatedtodo,TodoDto.class);
    }
}
