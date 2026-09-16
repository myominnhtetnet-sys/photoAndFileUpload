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
                model.addAttribute("errorMessage", "Only (JPG, PNG, GIF, WEBP)");
                model.addAttribute("userObj", user);
                return "User";
            }
        }

        try {
            upload_user.insertUploadUser(user);
            
            List<User_Bean> list = upload_user.getAllUsers();
            
            // 💡 ပြင်ဆင်ချက်: ORDER BY id DESC ကြောင့် index 0 သည် အသစ်ဆုံး ထည့်လိုက်သော User ဖြစ်ပါသည်
            User_Bean latestUser = list.get(0);
            
            return "redirect:/user/profile/" + latestUser.getId();

        } catch (org.springframework.dao.DuplicateKeyException e) {
            model.addAttribute("errorMessage", "Email already exists in system!");
            model.addAttribute("userObj", user);
            return "User";
        }
    }

    // 💡 သီးသန့် Profile ကြည့်ရန် GET Method သစ်
    @GetMapping("/user/profile/{id}")
    public String viewUserProfile(@PathVariable("id") Integer id, Model model) {
        User_Bean user = upload_user.getById(id);
        model.addAttribute("user", user);
        return "User_Output";
    }

    @GetMapping("/user/edit/{id}")
    @ResponseBody
    public User_Bean getEditUser(@PathVariable("id") Integer id) {
        User_Bean user = upload_user.getById(id);
        
        if (user.getPhotoBytes() != null && user.getPhotoBytes().length > 0) {
            String base64 = java.util.Base64.getEncoder().encodeToString(user.getPhotoBytes());
            user.setBase64Photo(base64);
        }
        
        user.setPhotoBytes(null); 
        return user; 
    }

    @GetMapping("/users")
    public String viewUserList(Model model) {
        List<User_Bean> userList = upload_user.getAllUsers(); 
        model.addAttribute("users", userList);
        return "User_list";
    }

    // 🛠 Edit (Update) ပြုလုပ်သည့် မက်သဒ် ပြင်ဆင်ချက်
    @PostMapping("/user/update")
    public String updateUser(@ModelAttribute User_Bean user, RedirectAttributes redirectAttributes) {
        
        // 1. Image Validation စစ်ဆေးခြင်း
        if (user.getPhoto() != null && !user.getPhoto().isEmpty()) {
            String contentType = user.getPhoto().getContentType();
            if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
                redirectAttributes.addFlashAttribute("errorMessage", "Only accept Image");
                return "redirect:/user/profile/" + user.getId();
            }
        }

        // 2. Database တွင် Data ပြင်ဆင်ခြင်း
        upload_user.updateUploadUser(user); 

        // 3. Profile GET URL သို့ Redirect ပြန်လုပ်ပေးပါမည်
        return "redirect:/user/profile/" + user.getId();
    }

    @PostMapping("/user/delete/{id}")
    public String deleteUser(@PathVariable("id") Integer id) {
        upload_user.deleteUser(id);
        return "redirect:/users";
    }
}