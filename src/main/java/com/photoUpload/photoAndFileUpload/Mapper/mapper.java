package com.photoUpload.photoAndFileUpload.Mapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;

import org.springframework.jdbc.core.RowMapper;
import com.photoUpload.photoAndFileUpload.model.User_Bean;

public class mapper implements RowMapper<User_Bean> {

    @Override
    public User_Bean mapRow(ResultSet rs, int rowNum) throws SQLException {
        User_Bean user = new User_Bean();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("userName")); 
        user.setEmail(rs.getString("email"));
        user.setAge(rs.getInt("age"));
        user.setPassword(rs.getString("password"));

        byte[] blobBytes = rs.getBytes("photo");
        user.setPhotoBytes(blobBytes);

        if (blobBytes != null && blobBytes.length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(blobBytes);
            user.setBase64Photo(base64Image);
        }
        return user;
    }
}