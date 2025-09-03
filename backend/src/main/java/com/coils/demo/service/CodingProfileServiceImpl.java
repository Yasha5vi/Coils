package com.coils.demo.service;

import com.coils.demo.dto.*;
import com.coils.demo.entity.Profile;
import com.coils.demo.entity.User;
import com.coils.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class CodingProfileServiceImpl implements CodingProfileService {

    private static final Logger log = LoggerFactory.getLogger(CodingProfileServiceImpl.class);
    private final RestTemplate restTemplate;
    private final String leetcodeURL = "https://leetcode-api-pied.vercel.app";
    private final String gfgURL = "https://geeks-for-geeks-api.vercel.app";
    private final String codeforcesURL = "https://codeforces.com/api/user.info?handles=";
    private final String codechefURL = "https://competeapi.vercel.app/user/codechef/";

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public CodingProfileServiceImpl(RestTemplate restTemplate, UserRepository userRepository, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public LeetcodeDTO getLeetCodeData(String userName) {
        try{
            String url = leetcodeURL + "/user/" + userName;
            ResponseEntity<LeetcodeDTO> responseEntity = restTemplate.exchange(url, HttpMethod.GET,null, LeetcodeDTO.class);
            return responseEntity.getBody();
        } catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public GeeksforgeeksDTO getGfgData(String userName) {
        try{
            String url = gfgURL + '/' + userName;
            ResponseEntity<GeeksforgeeksDTO> responseEntity = restTemplate.exchange(url, HttpMethod.GET,null, GeeksforgeeksDTO.class);
            return responseEntity.getBody();
        } catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public CodeforcesDTO getCodeforcesData(String username){
        try {
            String url = codeforcesURL + username;
            ResponseEntity<CodeforcesDTO> responseEntity = restTemplate.exchange(url, HttpMethod.GET, null, CodeforcesDTO.class);
            return responseEntity.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public CodechefDTO getCodechefData(String username){
        try {
            String url = codechefURL + username;
            ResponseEntity<CodechefDTO> responseEntity = restTemplate.exchange(url, HttpMethod.GET, null, CodechefDTO.class);
            return responseEntity.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public PlatformData getData(ProfileUpdateData profileUpdateData) {

        PlatformData platformData = new PlatformData();
        User user = userRepository.findByUsername(profileUpdateData.getCoilsHandle())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Profile profile = user.getProfile();
        if(profile == null){
            throw new NoSuchElementException("Profile not found for user: " + profileUpdateData.getCoilsHandle());
        }

        // LeetCode
        if(profileUpdateData.getLeetcodeHandle() != null && !profileUpdateData.getLeetcodeHandle().isEmpty()){
            try {
                LeetcodeDTO leetcodeDTO = getLeetCodeData(profileUpdateData.getLeetcodeHandle());
                if (leetcodeDTO != null && leetcodeDTO.getSubmitStats() != null) {
                    LeetcodeData leetcode = new LeetcodeData();
                    Map<String, Integer> submissions = new HashMap<>();

                    if (leetcodeDTO.getSubmitStats().getTotalSubmissionNum() != null) {
                        for (LeetcodeDTO.Submission sub : leetcodeDTO.getSubmitStats().getTotalSubmissionNum()) {
                            if (sub != null) {
                                submissions.put(sub.getDifficulty(), sub.getCount());
                            }
                        }
                    }
                    leetcode.setSubmissions(submissions);

                    if (leetcodeDTO.getContestBadge() != null) {
                        leetcode.setContestBadge(leetcodeDTO.getContestBadge().getName());
                    }
                    platformData.setLeetcode(leetcode);
                }
            } catch (Exception e) {
                // log error if needed, but don’t stop execution
            }
        }

        // GeeksForGeeks (special handling → no error throw if not found)
        if(profileUpdateData.getGeeksforgeeksHandle() != null && !profileUpdateData.getGeeksforgeeksHandle().isEmpty()){
            try {
                GeeksforgeeksDTO geeksforgeeksDTO = getGfgData(profileUpdateData.getGeeksforgeeksHandle());
                if (geeksforgeeksDTO != null) {
                    GfgData gfg = new GfgData();
                    Map<String, Integer> solved = new HashMap<>();

                    if (geeksforgeeksDTO.getInfo() != null && geeksforgeeksDTO.getSolvedStats() != null) {
                        GeeksforgeeksDTO.SolvedStats stats = geeksforgeeksDTO.getSolvedStats();
                        solved.put("Basic", stats.getBasic() != null ? stats.getBasic().getCount() : 0);
                        solved.put("Easy", stats.getEasy() != null ? stats.getEasy().getCount() : 0);
                        solved.put("Medium", stats.getMedium() != null ? stats.getMedium().getCount() : 0);
                        solved.put("Hard", stats.getHard() != null ? stats.getHard().getCount() : 0);
                    } else {
                        // user not found → empty/null handled object
                        solved.put("Basic", 0);
                        solved.put("Easy", 0);
                        solved.put("Medium", 0);
                        solved.put("Hard", 0);
                    }
                    gfg.setSolvedStats(solved);
                    platformData.setGfg(gfg);
                }
            } catch (Exception e) {
                // ignore for now
            }
        }

        // Codeforces
        if(profileUpdateData.getCodeforcesHandle() != null && !profileUpdateData.getCodeforcesHandle().isEmpty()){
            try {
                CodeforcesDTO codeforcesDTO = getCodeforcesData(profileUpdateData.getCodeforcesHandle());
                if (codeforcesDTO != null && codeforcesDTO.getResult() != null && codeforcesDTO.getResult().length > 0) {
                    CodeforcesDTO.Result result = codeforcesDTO.getResult()[0];
                    if (result != null) {
                        CodeforcesData cf = new CodeforcesData();
                        cf.setRating(result.getRating());
                        cf.setMaxRating(result.getMaxRating());
                        platformData.setCodeforces(cf);
                    }
                }
            } catch (Exception e) {
                // ignore for now
            }
        }

        // CodeChef
        if(profileUpdateData.getCodechefHandle() != null && !profileUpdateData.getCodechefHandle().isEmpty()){
            try {
                CodechefDTO codechefDTO = getCodechefData(profileUpdateData.getCodechefHandle());
                if (codechefDTO != null) {
                    CodechefData cc = new CodechefData();
                    cc.setRating(codechefDTO.getRating());
                    cc.setMaxRank(codechefDTO.getMaxRank());
                    platformData.setCodechef(cc);
                }
            } catch (Exception e) {
                // ignore for now
            }
        }
        try{
            JsonNode json = objectMapper.valueToTree(platformData);
            profile.setPlatformDataJson(json);
            user.setProfile(profile);
            userRepository.save(user);
        }catch (Exception e){
            log.error("Error saving platform data JSON: {}", e.getMessage());
        }
        return platformData;
    }


}
