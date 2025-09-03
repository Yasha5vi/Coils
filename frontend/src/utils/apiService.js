import api from '../api/axios.js';

export const fetchCodeforces = async (cfUsername) => {
  const res = await api.get(`/codeforces/${cfUsername}`);
  return res.data;
};

export const fetchLeetcode = async (lcUsername) => {
  const res = await api.get(`/leetcode/${lcUsername}`);
  return res.data;
};

export const fetchCodechef = async (ccUsername) => {
  const res = await api.get(`/codechef/${ccUsername}`);
  return res.data;
};

export const fetchGFG = async (gfgUsername) => {
  const res = await api.get(`/geeksforgeeks/${gfgUsername}`);
  return res.data;
};

// Fetch all at once 
export const fetchAllUserData = async (cfUsername, lcUsername, ccUsername, gfgUsername) => {
  const [cf, lc, cc, gfg] = await Promise.all([
    fetchCodeforces(cfUsername),
    fetchLeetcode(lcUsername),
    fetchCodechef(ccUsername),
    fetchGFG(gfgUsername)
  ]);

  return { codeforces: cf, leetcode: lc, codechef: cc, geeksforgeeks: gfg };
};
