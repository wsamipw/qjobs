import gql from "graphql-tag";

export const MY_JOBS_QUERY = gql`
  query MyJobsQuery {
    me {
      jobSet {
        id
        name
        jobTitle {
          id
          name
        }
        typeOfJob
        hireBy
        description
        extraQuestion
        timeout
        location {
          type
          coordinates
        }
        active
      }
    }
  }
`;

export const APPLIED_JOBS_QUERY = gql`
  query AppliedJobsQuery($page: Int!, $rows: Int!) {
    appliedJobs(page: $page, rows: $rows) {
      id
      job {
        id
        name
        typeOfJob
        description
        active
      }
      backgroundCheck
      hourlyRate
      applied
      description
      status
    }
  }
`;

export const JOB_TITLES_QUERY = gql`
  query JobTitlesQuery($name: String) {
    jobTitle(name: $name) {
      id
      name
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

export const REFERENCE_DETAILS_QUERY = gql`
  {
    me {
      reference
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

export const TRAINING_DETAILS_QUERY = gql`
  {
    me {
      training
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

export const USER_DETAILS_QUERY = gql`
  {
    me {
      firstName
      lastName
      currentAddress
      permanentAddress
      gender
      dateOfBirth
    }
  }
`;
