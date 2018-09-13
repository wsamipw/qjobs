import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import {
  LoginScreen,
  RegisterScreen,
  HomeScreen,
  SearchJobScreen,
  PostJobScreen,
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
  TrainingFormScreen
} from "../screens";

export const ProfileStack = createStackNavigator(
  {
    profile: ProfileScreen,
    profileDetail: ProfileDetailScreen,

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
    trainingForm: TrainingFormScreen
  },
  { initialRouteName: "profile" }
);

export const SearchStack = createStackNavigator(
  {
    search: SearchJobScreen,
    result: SearchResultScreen
  },
  { initialRouteName: "search" }
);

export const PostStack = createStackNavigator(
  {
    post: PostJobScreen
  },
  { initialRouteName: "post" }
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
