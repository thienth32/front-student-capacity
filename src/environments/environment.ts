// const baseApiUrl = "https://adminbeecareer.poly.edu.vn/api";
const baseApiUrl = "http://localhost:8000/api";
const authApi = `${baseApiUrl}/auth`;
export const jwtApiUrl = `${baseApiUrl}/v1`;
export const publicApiUrl = `${baseApiUrl}/public`;
export const environment = {
  production: false,
  GG_CLIENT_ID: "437095088104-c58gonumb2mu71c1d21ofn6ita2uvqr5.apps.googleusercontent.com",
  GG_CLIENT_SECRET: "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",
  loginUrl: authApi + "/login-token",
  publicApiUrl: `${baseApiUrl}/public`,
  sponsorListUrl: `${publicApiUrl}/sponsors`,
  contestListUrl: `${publicApiUrl}/contests`,
  majorListUrl: `${publicApiUrl}/majors`,
  branchesListUrl: `${publicApiUrl}/branches`,
  roundListUrl: `${publicApiUrl}/rounds`,
  sliderListUrl: `${publicApiUrl}/sliders`,
  companyListUrl: `${publicApiUrl}/enterprise`,
  recruitment: `${publicApiUrl}/recruitments`,
  capacityListUrl: `${publicApiUrl}/capacity`,
  postListUrl: `${publicApiUrl}/posts`,
  updateViews: `${publicApiUrl}/posts/view`,
  candidateUrl: `${publicApiUrl}/candidate`,
  skillListUrl: `${publicApiUrl}/skill`,
  keywordListUrl: `${publicApiUrl}/keywords`,
  keywordTrendingUrl: `${publicApiUrl}/keywords`,
  RankCapacityUrl: `${publicApiUrl}/rating/major-capacity`,
  challengeListUrl: `${publicApiUrl}/challenge`,
  codeLanguageListUrl: `${publicApiUrl}/code-language`,
  studentStatusListUrl: `${publicApiUrl}/student-statuses`,
  userUrl: `${publicApiUrl}/users`,
  qaUrl: `${publicApiUrl}/qa`,

  // Router API V1;
  userListUrl: `${jwtApiUrl}/users`,
  roundV1Url: `${jwtApiUrl}/round`,
  contestV1Url: `${jwtApiUrl}/contest`,
  teamListUrl: `${jwtApiUrl}/teams`,
  takeExamUrl: `${jwtApiUrl}/take-exam`,
  userV1Url: `${jwtApiUrl}/user`,
  challengeV1Url: `${jwtApiUrl}/challenge`,
  wishListV1Url: `${jwtApiUrl}/wishlist`,
};
