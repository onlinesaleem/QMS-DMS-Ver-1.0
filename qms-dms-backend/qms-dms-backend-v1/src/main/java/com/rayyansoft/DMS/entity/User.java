package com.rayyansoft.DMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="name")
    private String name;

    @Column(name="username",nullable = false,unique = true)
    private String username;

    @Column(name="email",nullable = false,unique = true)
    private String email;

    @Column(name="password",nullable = false)
    private String password;


@Column(name="active")
private Boolean active;

    @ManyToMany(fetch=FetchType.EAGER,cascade = CascadeType.ALL)
    @JoinTable(name="users_roles",
        joinColumns = @JoinColumn(name="user_id",referencedColumnName = "id"),
        inverseJoinColumns=@JoinColumn(name="role_id",referencedColumnName = "id"))
    private Set<Role> roles;

    @Column(name="empNumber")
    private Long empNumber;


    @ManyToOne(cascade = { CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH })
    @JoinColumn(name = "departmentId")
    private Department department;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", active=" + active +
                ", roles=" + roles +
                ", empNumber=" + empNumber +
                ", department=" + department +
                '}';
    }
}
