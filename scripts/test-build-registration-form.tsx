// import { fetchActivityByDocumentIdWithRegistrationForm } from "@/features/activity/api/activity.api";
// import {
//   BasicInfoComponent,
//   IdentityComponent,
//   MonasticComponent,
//   RelationComponent,
//   RoutineComponent,
// } from "@/types/form-templates";

// import { FormComponentEnum, FormSectionEnum } from "@/types/form-components";

// const documentId = "lgv3gu7ccx3u7dpwwn5zhqh4";
// async function testFetchActivityByDocumentIdWithRegistrationForm() {
//   try {
//     const activity = await fetchActivityByDocumentIdWithRegistrationForm({
//       documentId,
//       locale: "vi",
//       populate: ["coverImage", "relatedActivities.coverImage"],
//     });

//     const activityRegistrationForm =
//       (Array.isArray(activity.data)
//         ? undefined
//         : activity.data?.registrationForm) || null;

//     // All Form should have basic info component
//     const formBasicInfo: BasicInfoComponent = {
//       fullName: "Nguyen Van A",
//       dob: "1990-01-01",
//       gender: "Male",
//       phoneNumber: "0123456789",
//       email: "abc@gmail.com",
//       address: "123 Main St",
//       haveZalo: true,
//       zaloName: "nguyenvana",
//     };

//     if (activityRegistrationForm?.defaultIdentitySectionIncluded) {
//       // Using the default template for Identity Detail Component
//       const formIdentityInfo: IdentityComponent = {
//         IDNumber: "123456789",
//         issueDate: "2010-01-01",
//         issueAt: "Bộ Công An",
//         otherIssueOrganisation: "",
//       };
//     }
//     if (activityRegistrationForm?.defaultMonasticSectionIncluded) {
//       // Using the default template for Monastic Detail Component
//       const formMonasticInfo: MonasticComponent = {
//         dharmaName: "Thich Nhat Hanh",
//         monasticRank: "Tỳ Kheo Ni",
//         monasticTradition: "Nam Tông",
//         otherMonasticTradition: "",
//         currentMonastery: "Tu viện Tường Vân",
//         yearsOfPractice: 10,
//       };
//     }
//     if (activityRegistrationForm?.defaultRelationSectionIncluded) {
//       // Using the default template for Relation Detail Component
//       const formRelationInfo: RelationComponent = {
//         fullName: "Nguyen Van B",
//         phoneNumber: "0987654321",
//         relationship: "Brother",
//       };
//     }
//     if (activityRegistrationForm?.defaultRoutineSectionIncluded) {
//       // Using the default template for Routine Detail Component
//       const formRoutineInfo: RoutineComponent = {
//         dietaryRequirements: "Ăn Chay",
//         medicalConditions: false,
//         foodAllergies: "",
//       };
//     }

//     console.log(
//       "Form Description:",
//       activityRegistrationForm?.registrationDescription,
//     );

//     if (activityRegistrationForm?.customizedComponents) {
//       console.log("Customized Components:");
//       activityRegistrationForm.customizedComponents.forEach((component) => {
//         console.log(
//           `- ${component.label}: ${component.type} of ${component.section}`,
//         );
//       });
//     }

//     if (activityRegistrationForm?.commitmentMessages) {
//       console.log("Commitment Messages:");
//       activityRegistrationForm.commitmentMessages.forEach((message, index) => {
//         console.log(`- Message ${index + 1}: ${message.label}`);
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching activity by document ID:", error);
//   }
// }

// testFetchActivityByDocumentIdWithRegistrationForm();
