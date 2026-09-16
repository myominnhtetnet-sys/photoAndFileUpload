 package com.photoUpload.photoAndFileUpload.Repository;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.photoUpload.photoAndFileUpload.Mapper.mapper;
import com.photoUpload.photoAndFileUpload.model.User_Bean;

@Repository
public class Upload_User_Repositiry {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 1. Insert ==> LONGBLOB သို့ byte[] တိုက်ရိုက် ထည့်ခြင်း
    public int insertUploadUser(User_Bean user) {
        String sql = "INSERT INTO upload_table (userName, email, password, age, photo) VALUES (?, ?, ?, ?, ?)";
        try {
            byte[] photoBytes = (user.getPhoto() != null && !user.getPhoto().isEmpty()) 
                                ? user.getPhoto().getBytes() 
                                : null;

            return jdbcTemplate.update(sql, 
                user.getName(), 
                user.getEmail(), 
                user.getPassword(), 
                user.getAge(), 
                photoBytes
            );
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }

    // 2. Select All
    public List<User_Bean> getAllUsers() {
        String sql = "SELECT * FROM upload_table ORDER BY id DESC";
        return jdbcTemplate.query(sql, new mapper());
    }

    // 3. Select By ID
    public User_Bean getById(Integer id) {
        String sql = "SELECT * FROM upload_table WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new mapper(), id);
    }

    // 4. Update ==> ဖိုင်အသစ် ပါမှ photo ကို ပြင်မည်
    public int updateUploadUser(User_Bean user) {
        try {
            if (user.getPhoto() != null && !user.getPhoto().isEmpty()) {
                String sql = "UPDATE upload_table SET userName=?, email=?, password=?, age=?, photo=? WHERE id=?";
                return jdbcTemplate.update(sql, 
                    user.getName(), 
                    user.getEmail(), 
                    user.getPassword(), 
                    user.getAge(), 
                    user.getPhoto().getBytes(), 
                    user.getId()
                );
            } else {
                String sql = "UPDATE upload_table SET userName=?, email=?, password=?, age=? WHERE id=?";
                return jdbcTemplate.update(sql, 
                    user.getName(), 
                    user.getEmail(), 
                    user.getPassword(), 
                    user.getAge(), 
                    user.getId()
                );
            }
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }
    
 // Email ရှိပြီးသားဟုတ်မဟုတ် စစ်ပေးသော method
    public boolean isEmailExists(String email) {
        String sql = "SELECT COUNT(*) FROM upload_table WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    // 5. Delete
    public int deleteUser(Integer id) {
        String sql = "DELETE FROM upload_table WHERE id = ?";
        return jdbcTemplate.update(sql, id);
    }
}