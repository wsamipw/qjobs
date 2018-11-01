import gql from "graphql-tag";

export const CREATE_USER_PRO_MUTATION = gql`
  mutation CreateUserProMutation(
    $jobTitle: ID!
    $verifyingDoc1Base64: String!
    $verifyingDoc2Base64: String!
  ) {
    createUserpro(
      jobTitle: $jobTitle
      verifyingDoc1: $verifyingDoc1Base64
      verifyingDoc2: $verifyingDoc2Base64
    ) {
      msg
      status
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation LoginMutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation RegisterMutation(
    $email: String!
    $password: String!
    $username: String!
  ) {
    createUser(email: $email, password: $password, username: $username) {
      token
      msg
      status
    }
  }
`;

export const EDUCATION_MUTATION = gql`
  mutation EducationMutation($education: JSONString!) {
    updateUser(education: $education) {
      msg
      status
    }
  }
`;

export const LANGUAGE_MUTATION = gql`
  mutation LanguageMutation($language: JSONString!) {
    updateUser(language: $language) {
      msg
      status
    }
  }
`;

export const REFERENCE_MUTATION = gql`
  mutation ReferenceMutation($reference: JSONString!) {
    updateUser(reference: $reference) {
      msg
      status
    }
  }
`;

export const SOCIAL_ACCOUNTS_MUTATION = gql`
  mutation SocialAccountsMutation($socialAccounts: JSONString!) {
    updateUser(socialAccounts: $socialAccounts) {
      msg
      status
    }
  }
`;

export const TRAINING_MUTATION = gql`
  mutation TrainingMutation($training: JSONString!) {
    updateUser(training: $training) {
      msg
      status
    }
  }
`;

export const WORK_EXPERIENCE_MUTATION = gql`
  mutation WorkExperienceMutation($workExperience: JSONString!) {
    updateUser(workExperience: $workExperience) {
      msg
      status
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserMutation(
    $firstName: String!
    $lastName: String!
    $currentAddress: String!
    $permanentAddress: String!
    $gender: String!
    $nationality: String!
    $religion: String!
    $dateOfBirth: Date!
    $disability: Boolean!
  ) {
    updateUser(
      firstName: $firstName
      lastName: $lastName
      currentAddress: $currentAddress
      permanentAddress: $permanentAddress
      gender: $gender
      nationality: $nationality
      religion: $religion
      dateOfBirth: $dateOfBirth
      disability: $disability
    ) {
      user {
        firstName
        lastName
        currentAddress
        permanentAddress
        gender
        nationality
        religion
        dateOfBirth
        disability
      }
      msg
      status
    }
  }
`;

export const POST_JOB_MUTATION = gql`
  mutation PostJobMutation(
    $customJobTitle: String
    $typeOfJob: String!
    $salaryTime: String!
    $salary: Float!
    $hires: Int!
    $hireBy: DateTime!
    $description: String
    $experience: [JobExperienceInputType]
    $workAuthorization: [WorkAuthorizationInputType]
    $backgroundCheck: Boolean
    $jobLocation: Boolean
    $shiftAvailability: String!
    $latitude: String!
    $longitude: String!
    $timeout: Int!
    $extraQuestion: [String]
  ) {
    createJob(
      name: $customJobTitle
      typeOfJob: $typeOfJob
      salaryTime: $salaryTime
      salary: $salary
      hires: $hires
      hireBy: $hireBy
      description: $description
      experience: $experience
      workAuthorization: $workAuthorization
      backgroundCheck: $backgroundCheck
      jobLocation: $jobLocation
      shiftAvailability: $shiftAvailability
      latitude: $latitude
      longitude: $longitude
      timeout: $timeout
      extraQuestion: $extraQuestion
    ) {
      job {
        name
        typeOfJob
        salaryTime
        salary
        hires
        hireBy
        description
        timeout
        jobexperienceSet {
          id
          name
          time
        }
        jobworkauthorizationSet {
          id
          name
        }
        backgroundCheck
        shiftAvailability
        location {
          type
          coordinates
        }
        extraQuestion
      }
      msg
      status
    }
  }
`;
