package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeRedirectController {

    @GetMapping("/")
    public String root() {
        return "redirect:/index.html";
    }

    @GetMapping("/zounian")
    public String zounian() {
        return "redirect:/index.html";
    }
}
