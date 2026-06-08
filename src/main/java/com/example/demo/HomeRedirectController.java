package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeRedirectController {

    @GetMapping("/")
    public String root() {
        return "redirect:/zounian-top/index.html";
    }

    @GetMapping("/zounian")
    public String zounian() {
        return "redirect:/zounian-top/index.html";
    }

    @GetMapping("/index.html")
    public String index() {
        return "redirect:/zounian-top/index.html";
    }

    @GetMapping("/zounian-top")
    public String zounianTop() {
        return "redirect:/zounian-top/index.html";
    }
}
