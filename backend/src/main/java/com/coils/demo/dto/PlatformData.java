package com.coils.demo.dto;

public class PlatformData {
    private LeetcodeData leetcode;
    private GfgData gfg;
    private CodeforcesData codeforces;
    private CodechefData codechef;


    public PlatformData(){

    }

    public PlatformData(LeetcodeData leetcode, GfgData gfg, CodeforcesData codeforces, CodechefData codechef) {
        this.leetcode = leetcode;
        this.gfg = gfg;
        this.codeforces = codeforces;
        this.codechef = codechef;
    }

    public LeetcodeData getLeetcode() {
        return leetcode;
    }

    public void setLeetcode(LeetcodeData leetcode) {
        this.leetcode = leetcode;
    }

    public GfgData getGfg() {
        return gfg;
    }

    public void setGfg(GfgData gfg) {
        this.gfg = gfg;
    }

    public CodeforcesData getCodeforces() {
        return codeforces;
    }

    public void setCodeforces(CodeforcesData codeforces) {
        this.codeforces = codeforces;
    }

    public CodechefData getCodechef() {
        return codechef;
    }

    public void setCodechef(CodechefData codechef) {
        this.codechef = codechef;
    }

    @Override
    public String toString() {
        return "PlatformData{" +
                "leetcode=" + leetcode +
                ", gfg=" + gfg +
                ", codeforces=" + codeforces +
                ", codechef=" + codechef +
                '}';
    }
}