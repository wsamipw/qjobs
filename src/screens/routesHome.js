import {
  createSwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import {
  LoginScreen,
  RegisterScreen,
  HomeScreen,
  SearchJobScreen,
  SearchDetailScreen,
  UserDetailScreen,
  ProfileScreen,
  ProfileDetailScreen,
  SearchResultScreen,
  EducationScreen,
  EducationFormScreen,
  LanguageScreen,
  LanguageFormScreen,
  ReferenceScreen,
  ReferenceFormScreen,
  SocialAccountsScreen,
  SocialAccountsFormScreen,
  WorkExperienceScreen,
  WorkExperienceFormScreen,
  TrainingScreen,
  TrainingFormScreen,
  SettingsScreen,
  PostJobScreen1,
  PostJobScreen2,
  PostJobScreen3,
  PostJobScreen4,
  PostJobScreen5,
  PostJobScreen6,
  // SubPart
  PostJobScreen41,
  Accounts,
  ApplyJob
} from "../screens";

export const ProfileStack = createStackNavigator(
  {
    profile: ProfileScreen,
    profileDetail: ProfileDetailScreen,

    settings: SettingsScreen,

    postJob1: PostJobScreen1,
    postJob2: PostJobScreen2,
    postJob3: PostJobScreen3,
    postJob4: PostJobScreen4,
    postJob5: PostJobScreen5,
    postJob6: PostJobScreen6,

    postJob41: PostJobScreen41,

    accounts: Accounts
    // education: EducationScreen,
    // educationForm: EducationFormScreen,

    // language: LanguageScreen,
    // languageForm: LanguageFormScreen,

    // reference: ReferenceScreen,
    // referenceForm: ReferenceFormScreen,

    // socialAccounts: SocialAccountsScreen,
    // socialAccountsForm: SocialAccountsFormScreen,

    // workExperience: WorkExperienceScreen,
    // workExperienceForm: WorkExperienceFormScreen,

    // training: TrainingScreen,
    // trainingForm: TrainingFormScreen,
    // searchDetail: SearchDetailScreen,
  },
  { initialRouteName: "profile" }
);

export const PostJobStack = createStackNavigator(
  {
    postJob1: PostJobScreen1,
    postJob2: PostJobScreen2,
    postJob3: PostJobScreen3,
    postJob4: PostJobScreen4,
    postJob5: PostJobScreen5,
    postJob6: PostJobScreen6,

    postJob41: PostJobScreen41
  },
  { initialRouteName: "postJob1" }
);

export const SearchStack = createStackNavigator(
  {
    search: SearchJobScreen,
    result: SearchResultScreen,
    applyJob: ApplyJob,
    searchDetail: SearchDetailScreen
  },
  { initialRouteName: "search" }
);

export const PostStack = createStackNavigator(
  {
    userDetail: UserDetailScreen
  },
  { initialRouteName: "userDetail" }
);

export default initialRouteName =>
  createSwitchNavigator(
    {
      login: LoginScreen,
      register: RegisterScreen,
      home: HomeScreen
      // profileStack: {
      //   screen: ProfileStack
      // },
      // searchStack: {
      //   screen: SearchStack
      // },
      // postStack: {
      //   screen: PostStack
      // },
      // postJobStack: {
      //   screen: PostJobStack
      // }
    },
    {
      initialRouteName
    }
  );
