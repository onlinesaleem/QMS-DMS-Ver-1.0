package com.rayyansoft.DMS.controller;

import com.rayyansoft.DMS.dto.TodoDto;
import com.rayyansoft.DMS.service.TodoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("api/todos")
@AllArgsConstructor
public class TodoController {

    private TodoService todoService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TodoDto> addTodoDto(@RequestBody TodoDto todoDto){

        TodoDto savedDto=todoService.addTodo(todoDto);
        return new ResponseEntity<>(savedDto, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("{id}")
    public ResponseEntity<TodoDto> getTodo(@PathVariable("id") Long id){
        TodoDto todoDto=todoService.getTodoById(id);
        return new ResponseEntity<>(todoDto,HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping
    public ResponseEntity<List<TodoDto>> getAlltodos() {
        List<TodoDto> todoDto=todoService.getAllTodoDto();
        //
        // return new ResponseEntity<>(todoDto,HttpStatus.OK);
        return ResponseEntity.ok(todoDto);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("{id}")
    public ResponseEntity<TodoDto> updateTodDto(@RequestBody  TodoDto todoDto,@PathVariable("id") Long todosId) {
        TodoDto savedTododto=todoService.updateTodtoDto(todoDto,todosId);
        return ResponseEntity.ok(savedTododto);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteTodosbyId(@PathVariable("id") Long todosId) {
        todoService.deleteTodo(todosId);
        return ResponseEntity.ok("Todos is successfully deleted"+todosId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    //difference between patch mapping and put mapping is , patchmapping only update the given field only, but put mapping update all
    @PatchMapping("{id}/complete")
    public ResponseEntity<TodoDto> completedTodo(@PathVariable("id") Long todosId) {
        TodoDto updatedtodoDto=todoService.completedTodo(todosId);
        return ResponseEntity.ok(updatedtodoDto);
    }

    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PatchMapping("{id}/in-complete")
    public ResponseEntity<TodoDto> incompleteTodo(@PathVariable("id") Long todosId) {
        TodoDto updatedDto=todoService.inCompleteTodo(todosId);
        return ResponseEntity.ok(updatedDto);
    }
}
