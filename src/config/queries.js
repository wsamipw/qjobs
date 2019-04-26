import gql from "graphql-tag";

export const JOB_APPLICATIONS_QUERY = gql`
  query JobApplicationsQuery($page: Int, $rows: Int, $jobId: ID!) {
    jobApplications(page: $page, rows: $rows, jobId: $jobId) {
      page
      rows
      rowCount
      pages
      data {
        id
        employee {
          id
          username
          firstName
          lastName
          email
        }
        hourlyRate
        totalHours
        totalFee
        appliedOn
        description
        status
        applyjobquestionsSet {
          id
          question
          answer
        }
        reviewSet {
          id
          rating
          review
        }
      }
    }
  }
`;

export const MY_JOBS_QUERY = gql`
  query MyJobsQuery {
    me {
      jobSet {
        id
        geometry {
          type
          coordinates
        }
        properties {
          name
          jobTitle {
            id
            name
          }
          hireBy
          description
          extraQuestion
          employer {
            id
            username
            firstName
            lastName
            email
          }
          timeout
          applyJobCount
        }
      }
    }
  }
`;

export const APPLIED_JOBS_QUERY = gql`
  query AppliedJobsQuery($page: Int!, $rows: Int!) {
    appliedJobs(page: $page, rows: $rows) {
      page
      rows
      pages
      data {
        id
        job {
          id
          properties {
            name
            hireBy
            description
            employer {
              id
              username
              firstName
              lastName
            }
          }
        }
        hourlyRate
        appliedOn
        description
        status
        applyjobquestionsSet {
          id
          question
          answer
        }
      }
    }
  }
`;

export const CLIENT_PAYMENT_TOKEN_QUERY = gql`
  query clientPaymentTokenQuery {
    clientPaymentToken
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

export const JOB_STATUS_CHECK_QUERY = gql`
  query JobStatusCheckQuery($id: ID!, $status: String!) {
    jobStatusChange(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const JOBS_QUERY = gql`
  query JobsListQuery(
    $page: Int
    $rows: Int
    $query: String
    $latitude: Float
    $longitude: Float
  ) {
    jobs(
      page: $page
      rows: $rows
      query: $query
      latitude: $latitude
      longitude: $longitude
    ) {
      data {
        id
        geometry {
          type
          coordinates
        }
        properties {
          name
          jobTitle {
            id
            name
          }
          hireBy
          description
          extraQuestion
          employer {
            id
            username
            firstName
            lastName
          }
          applyjobSet {
            employee {
              id
              username
            }
            status
          }
          applyJobCount
        }
      }
      page
      rows
      rowCount
      pages
    }
  }
`;

/*
 * This Query is not used
 * currently from date: 2075/07/25
 */

// export const TYPES_OF_JOB_QUERY = gql`
//   {
//     typeOfJob {
//       id
//       name
//     }
//   }
// `;

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

// Not used since it's work is done during login and stored in cookie/asyncStorage
export const USER_DETAILS_QUERY = gql`
  {
    me {
      id
      firstName
      lastName
      currentAddress
      permanentAddress
      gender
      dateOfBirth
    }
  }
`;
