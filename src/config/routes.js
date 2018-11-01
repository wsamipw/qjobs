import { createSwitchNavigator, createStackNavigator } from "react-navigation";
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
  Accounts
} from "../screens";

export const AccountsStack = createSwitchNavigator(
  {
    accounts: Accounts
  },
  { initialRouteName: "accounts" }
);

export const ProfileStack = createStackNavigator(
  {
    profile: ProfileScreen,
    profileDetail: ProfileDetailScreen,

    settings: SettingsScreen,

    education: EducationScreen,
    educationForm: EducationFormScreen,

    language: LanguageScreen,
    languageForm: LanguageFormScreen,

    reference: ReferenceScreen,
    referenceForm: ReferenceFormScreen,

    socialAccounts: SocialAccountsScreen,
    socialAccountsForm: SocialAccountsFormScreen,

    workExperience: WorkExperienceScreen,
    workExperienceForm: WorkExperienceFormScreen,

    training: TrainingScreen,
    trainingForm: TrainingFormScreen,

    postJob1: PostJobScreen1,
    postJob2: PostJobScreen2,
    postJob3: PostJobScreen3,
    postJob4: PostJobScreen4,
    postJob5: PostJobScreen5,
    postJob6: PostJobScreen6,

    postJob41: PostJobScreen41,

    searchDetail: SearchDetailScreen
    // accounts: Accounts
  },
  { initialRouteName: "profile" }
);

export const PostJobStack = createSwitchNavigator(
  {
    postJob1: PostJobScreen1,
    postJob2: PostJobScreen2,
    postJob3: PostJobScreen3
  },
  { initialRouteName: "postJob1" }
);

export const SearchStack = createStackNavigator(
  {
    search: SearchJobScreen,
    result: SearchResultScreen
    // searchDetail: SearchDetailScreen
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
    },
    {
      initialRouteName
    }
  );
