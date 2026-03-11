import { ActivityRegistrationFormDataBuilder } from "@/features/courseRegistration/api/activityRegistration.formData-builder";
import { createActivityRegistration } from "@/features/courseRegistration/api/activityRegistration.api";
import {
  BasicInfoComponent, // this is required
  IdentityComponent, // options for identity detail
  MonasticComponent, // options for monastic detail
  RelationComponent, // options for relation detail
  RoutineComponent, //  options for routine detail
} from "@/types/form-templates"; // This is the default template

import {
  IdentityDetail,
  MonasticDetail,
  OtherDetail,
  RelationDetail,
  RoutineDetail,
} from "@/features/courseRegistration/model/activityRegistration.types"; // This is the payload structure for registrationPayLoad in activity registration

import { FormComponentEnum, FormSectionEnum } from "@/types/form-components";

async function testCreateActivityRegistration() {
  try {
    const formBasicInfo: BasicInfoComponent = {
      fullName: "Nguyen Van A",
      dob: "2005-01-01",
      gender: "Female",
      phoneNumber: "0917671949",
      email: "abc@gmail.com",
      address: "123 Main St",
      haveZalo: true,
      zaloName: "nguyenvana",
    }; // Basic info component data always required and cannot be extended, if you want to add more fields, you can add them in the form payload as otherDetail.

    const formIdentityInfo: IdentityComponent = {
      IDNumber: "1312412412421",
      issueDate: "2010-01-01",
      issueAt: "Bộ Công An",
      otherIssueOrganisation: "",
    };
    const formMonasticInfo: MonasticComponent = {
      dharmaName: "Thich Nhat Hanh",
      monasticRank: "Tỳ Kheo Ni",
      monasticTradition: "Nam Tông",
      otherMonasticTradition: "",
      currentMonastery: "Tu viện Tường Vân",
      yearsOfPractice: 10,
    };
    const formRelationInfo: RelationDetail = {
      relationFullName: "Tran Thi B",
      relationPhoneNumber: "0917671949",
    };
    const formRoutineInfo: RoutineDetail = {
      dietaryRequirements: "Vegetarian",
      medicalConditions: false,
    };
    const formOtherInfo: OtherDetail = {
      weight: 60,
      height: 165,
      question:
        "This is a very important question that the registree want to ask the organizer before joining the activity, and the organizer should answer this question as soon as possible to help the registree have a better experience in the activity",
    };

    const registrationPayload = {
      identityDetail: formIdentityInfo,
      monasticDetail: formMonasticInfo,
      relationDetail: formRelationInfo,
      routineDetail: formRoutineInfo,
      otherDetail: formOtherInfo,
    };
    // This is 1 approach to build the form data, you can also choose to use the withIdentityDetail, withMonasticDetail, withRelationDetail, withRoutineDetail, withOtherDetail methods to build the payload step by step
    const formData = new ActivityRegistrationFormDataBuilder()
      .withFormData({
        registreeData: formBasicInfo,
        firstTimeRegistered: true,
        registeredActivity: "lgv3gu7ccx3u7dpwwn5zhqh4",
      })
      .withRegistrationPayload(registrationPayload)
      .build();

    console.log("Form data to be sent for activity registration:", formData);

    const response = await createActivityRegistration(formData);
    console.log("Activity registration created successfully:", response);
  } catch (error) {
    console.error("Error creating activity registration:", error);
  }
}

for (let i = 0; i < 50; i++) {
  testCreateActivityRegistration();
}
