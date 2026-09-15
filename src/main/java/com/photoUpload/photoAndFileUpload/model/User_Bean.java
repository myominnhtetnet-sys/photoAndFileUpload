package com.photoUpload.photoAndFileUpload.model;

import org.springframework.web.multipart.MultipartFile;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class User_Bean {

    private Integer id;
    private String name;
    private String email;
    private Integer age;
    private String password;
    private MultipartFile photo;
    private byte[] photoBytes;
    private String base64Photo;
}