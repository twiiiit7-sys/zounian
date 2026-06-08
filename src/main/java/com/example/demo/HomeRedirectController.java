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

    @GetMapping({"/concept", "/concept/"})
    public String concept() {
        return "redirect:/concept/index.html";
    }

    @GetMapping({"/guide", "/guide/"})
    public String guide() {
        return "redirect:/guide/index.html";
    }

    @GetMapping({"/menu", "/menu/"})
    public String menu() {
        return "redirect:/menu/index.html";
    }

    @GetMapping({"/news", "/news/"})
    public String news() {
        return "redirect:/news/index.html";
    }

    @GetMapping({"/store", "/store/"})
    public String store() {
        return "redirect:/store/index.html";
    }

    @GetMapping({"/reserve", "/reserve/"})
    public String reserve() {
        return "redirect:/reserve/index.html";
    }

    @GetMapping({"/contact", "/contact/"})
    public String contact() {
        return "redirect:/contact/index.html";
    }
}
