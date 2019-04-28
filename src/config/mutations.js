import gql from "graphql-tag";

export const APPLY_JOB_MUTATION = gql`
  mutation ApplyJobMutation(
    $job: ID
    $description: String
    $hourlyRate: Float!
    $extraQuestion: [ApplyJobQuestionsInputType]
  ) {
    applyJob(
      job: $job
      description: $description
      hourlyRate: $hourlyRate
      extraQuestion: $extraQuestion
    ) {
      msg
      status
      applyJob {
        id
        status
        description
        hourlyRate
        applyjobquestionsSet {
          id
          question
          answer
        }
      }
    }
  }
`;

export const CREATE_REVIEW_MUTATION = gql`
  mutation CreateReviewMutation(
    $applyJobId: ID!
    $rating: Int!
    $review: String
  ) {
    createReview(applyJobId: $applyJobId, rating: $rating, review: $review) {
      msg
      status
      review {
        id
        rating
        review
      }
    }
  }
`;

export const INPUT_TOTAL_HOURS_MUTATION = gql`
  mutation InputTotalhoursMutation($id: ID!, $totalHours: Float!) {
    inputTotalHours(id: $id, totalHours: $totalHours) {
      msg
      status
      applyJob {
        status
      }
    }
  }
`;

export const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePaymentMutation($id: ID!, $nonce: String!) {
    createPayment(id: $id, nonce: $nonce) {
      msg
      status
      applyJob {
        status
        paid
      }
    }
  }
`;

export const DELETE_APPLY_JOB_MUTATION = gql`
  mutation DeleteApplyJobMutation($id: ID!) {
    deleteApplyJob(id: $id) {
      msg
      status
      applyJob {
        status
      }
    }
  }
`;

export const SELECT_APPLY_JOB_MUTATION = gql`
  mutation SelectApplyJobMutation($id: ID!, $select: Boolean!) {
    selectApplyJob(id: $id, select: $select) {
      msg
      status
      applyJob {
        status
      }
    }
  }
`;

export const CONFIRM_APPLY_JOB_MUTATION = gql`
  mutation ConfirmApplyJobMutation($id: ID!, $confirm: Boolean!) {
    confirmApplyJob(id: $id, confirm: $confirm) {
      msg
      status
      applyJob {
        status
      }
    }
  }
`;

// This mutation is not used now ...
export const COMPLETE_APPLY_JOB_MUTATION = gql`
  mutation CompleteApplyJobMutation(
    $id: ID!
    $complete: Boolean!
    $totalHours: Float!
    $rating: Int!
    $review: String
  ) {
    completeApplyJob(
      id: $id
      complete: $complete
      totalHours: $totalHours
      rating: $rating
      review: $review
    ) {
      msg
      status
    }
  }
`;

export const CREATE_USER_PRO_MUTATION = gql`
  mutation CreateUserProMutation(
    $jobTitle: ID!
    $verifyingDoc1Base64: String
    $verifyingDoc2Base64: String
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
      user {
        id
        username
        firstName
        lastName
        email
        currentAddress
        permanentAddress
        gender
        dateOfBirth
      }
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
      user {
        id
        username
        firstName
        lastName
        email
        currentAddress
        permanentAddress
        gender
        dateOfBirth
      }
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
    $avatar: String
    $firstName: String
    $lastName: String
    $currentAddress: String
    $permanentAddress: String
    $gender: String
    $dateOfBirth: Date
  ) {
    updateUser(
      firstName: $firstName
      lastName: $lastName
      currentAddress: $currentAddress
      permanentAddress: $permanentAddress
      gender: $gender
      dateOfBirth: $dateOfBirth
      avatar: $avatar
    ) {
      user {
        id
        username
        email
        firstName
        lastName
        currentAddress
        permanentAddress
        gender
        dateOfBirth
        avatar
      }
      msg
      status
    }
  }
`;

export const POST_JOB_MUTATION = gql`
  mutation PostJobMutation(
    $jobTitle: ID!
    $hireBy: DateTime!
    $description: String
    $latitude: String
    $longitude: String
    $timeout: Int
    $extraQuestion: [String]
  ) {
    createJob(
      jobTitle: $jobTitle
      hireBy: $hireBy
      description: $description
      latitude: $latitude
      longitude: $longitude
      timeout: $timeout
      extraQuestion: $extraQuestion
    ) {
      job {
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
          timeout

          extraQuestion
        }
      }
      msg
      status
    }
  }
`;
