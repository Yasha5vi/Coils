package com.coils.demo.service;

import com.coils.demo.dto.*;

public interface CodingProfileService {
    LeetcodeDTO getLeetCodeData(String userName);

    GeeksforgeeksDTO getGfgData(String userName);

    CodeforcesDTO getCodeforcesData(String userName);

    CodechefDTO getCodechefData(String userName);

    PlatformData getData(ProfileUpdateData profileUpdateData);
}
