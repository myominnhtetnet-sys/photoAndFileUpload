package com.photoUpload.photoAndFileUpload.controller;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.photoUpload.photoAndFileUpload.Repository.Upload_User_Repositiry;
import com.photoUpload.photoAndFileUpload.model.User_Bean;

@Controller
@RequestMapping("/")
public class User_Controller {

    @Autowired
    private Upload_User_Repositiry upload_user;

    // accept Image MIME Types 
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
        "image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"
    );

    @GetMapping("/user")
    public ModelAndView userUpload() {
        return new ModelAndView("User", "userObj", new User_Bean());
    }

    @PostMapping("/userUpload")
    public String seeUserUpload(@ModelAttribute("userObj") User_Bean user, Model model, RedirectAttributes redirectAttributes) {
        
        // 1. Email စစ်ဆေးခြင်း
        if (upload_user.isEmailExists(user.getEmail())) {
            model.addAttribute("errorMessage", "Email ' " + user.getEmail() + " ' is already registered!");
            model.addAttribute("userObj", user);
            return "User";
        }

        // 2. Image File Validation စစ်ဆေးခြင်း
        if (user.getPhoto() != null && !user.getPhoto().isEmpty()) {
            String contentType = user.getPhoto().getContentType();
            if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
                model.addAttribute("errorMessage", "ဓာတ်ပုံဖိုင်များ (JPG, PNG, GIF, WEBP) သာ တင်ခွင့်ရှိပါသည်။");
                model.addAttribute("userObj", user);
                return "User";
            }
        }

        try {
            upload_user.insertUploadUser(user);
            
            List<User_Bean> list = upload_user.getAllUsers();
            User_Bean latestUser = list.get(list.size() - 1);
            model.addAttribute("user", latestUser);
            
            return "User_Output";
        } catch (org.springframework.dao.DuplicateKeyException e) {
            model.addAttribute("errorMessage", "Email already exists in system!");
            model.addAttribute("userObj", user);
            return "User";
        }
    }

    @GetMapping("/user/edit/{id}")
    @ResponseBody
    public User_Bean getEditUser(@PathVariable("id") Integer id) {
        User_Bean user = upload_user.getById(id);
        user.setPhotoBytes(null); 
        return user; 
    }

    @GetMapping("/users")
    public String viewUserList(Model model) {
        List<User_Bean> userList = upload_user.getAllUsers(); 
        model.addAttribute("users", userList);
        return "User_list";
    }

    @PostMapping("/user/update")
    public String updateUser(@ModelAttribute User_Bean user, RedirectAttributes redirectAttributes) {
        
        // Update လုပ်ချိန်တွင် ပုံအသစ်ပါလာပါက Image ဖိုင်ဟုတ်မဟုတ် စစ်ဆေးခြင်း
        if (user.getPhoto() != null && !user.getPhoto().isEmpty()) {
            String contentType = user.getPhoto().getContentType();
            if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
                redirectAttributes.addFlashAttribute("errorMessage", "ဓာတ်ပုံဖိုင်များသာ တင်ခွင့်ရှိပါသည်။");
                return "redirect:/users";
            }
        }

        upload_user.updateUploadUser(user); 
        return "redirect:/users";
    }

    @PostMapping("/user/delete/{id}")
    public String deleteUser(@PathVariable("id") Integer id) {
        upload_user.deleteUser(id);
        return "redirect:/users";
    }
}