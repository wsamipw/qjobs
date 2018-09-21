import gql from "graphql-tag";

export const MY_JOBS_QUERY = gql`
  query MyJobsQuery {
    me {
      jobSet {
        id
        name
        typeOfJob
      }
    }
  }
`;

export const JOBS_QUERY = gql`
  query JobsListQuery($page: Int!, $rows: Int!, $query: String!) {
    jobs(page: $page, rows: $rows, query: $query) {
      data {
        id
        name
        typeOfJob
      }
      page
      rows
      rowCount
      pages
    }
  }
`;

export const TYPES_OF_JOB_QUERY = gql`
  {
    typeOfJob {
      id
      name
    }
  }
`;

export const SALARY_TIME_QUERY = gql`
  {
    perTime {
      id
      name
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

export const EDUCATION_DETAILS_QUERY = gql`
  {
    me {
      education
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

export const LANGUAGE_DETAILS_QUERY = gql`
  {
    me {
      language
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

export const REFERENCE_DETAILS_QUERY = gql`
  {
    me {
      reference
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

export const SOCIAL_ACCOUNTS_DETAILS_QUERY = gql`
  {
    me {
      socialAccounts
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

export const TRAINING_DETAILS_QUERY = gql`
  {
    me {
      training
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

export const WORK_EXPERIENCE_DETAILS_QUERY = gql`
  {
    me {
      workExperience
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

export const USER_DETAILS_QUERY = gql`
  {
    me {
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
