package com.coils.demo.controller;

import com.coils.demo.dto.*;
import com.coils.demo.service.CodingProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CodingProfileController {
    private final CodingProfileService codingProfileService;

    public CodingProfileController(CodingProfileService codingProfileService){
        this.codingProfileService = codingProfileService;
    }

    @GetMapping("/leetcode/{username}")
    public ResponseEntity<LeetcodeDTO> fetchLeetcodeData(@PathVariable String username) {
        LeetcodeDTO leetcodeDTO = codingProfileService.getLeetCodeData(username);
        if (leetcodeDTO != null) {
            return ResponseEntity.ok(leetcodeDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/geeksforgeeks/{username}")
    public ResponseEntity<GeeksforgeeksDTO> fetchGeeksforGeeksData(@PathVariable String username){
        GeeksforgeeksDTO geeksforgeeksDTO = codingProfileService.getGfgData(username);
        if(geeksforgeeksDTO != null && geeksforgeeksDTO.getInfo() != null){
            return ResponseEntity.ok(geeksforgeeksDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/codeforces/{username}")
    public ResponseEntity<CodeforcesDTO> fetchCodeforcesData(@PathVariable String username){
        CodeforcesDTO codeforcesDTO = codingProfileService.getCodeforcesData(username);
        if(codeforcesDTO != null){
            return ResponseEntity.ok(codeforcesDTO);
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/codechef/{username}")
    public ResponseEntity<CodechefDTO> fetchCodechefData(@PathVariable String username){
        CodechefDTO codechefDTO = codingProfileService.getCodechefData(username);
        if(codechefDTO != null && codechefDTO.getUsername() != null){
            return ResponseEntity.ok(codechefDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/coils/fetch")
    public ResponseEntity<PlatformData> fetchData(@RequestBody ProfileUpdateData profileUpdateData) {
        System.out.println("Fetching data for user: " + profileUpdateData);
        try{
            PlatformData data = codingProfileService.getData(profileUpdateData);
            return ResponseEntity.ok(data);
        }catch(Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}

