import type {
  ActivityRegistrationFormData,
  IdentityDetail,
  MonasticDetail,
  OtherDetail,
  RegistrationPayload,
  RelationDetail,
  RoutineDetail,
} from "../model/activityRegistration.types";

// export type ActivityRegistrationCreateRequest = {
//   data: ActivityRegistrationFormData;
// };

export class ActivityRegistrationFormDataBuilder {
  private data: Partial<ActivityRegistrationFormData> = {};

  withFormData(formData: ActivityRegistrationFormData): this {
    this.data.registreeData = formData.registreeData;
    this.data.firstTimeRegistered = formData.firstTimeRegistered;
    this.data.registeredActivity = formData.registeredActivity;

    if (
      formData.registrationPayload &&
      Object.keys(formData.registrationPayload).length > 0
    ) {
      this.data.registrationPayload = formData.registrationPayload;
    }

    return this;
  }

  withRegistrationPayload(registrationPayload?: RegistrationPayload): this {
    if (registrationPayload && Object.keys(registrationPayload).length > 0) {
      this.data.registrationPayload = registrationPayload;
    }
    return this;
  }

  withIdentityDetail(identityDetail?: IdentityDetail): this {
    if (!identityDetail || Object.keys(identityDetail).length === 0) {
      return this;
    }
    this.data.registrationPayload = {
      ...this.data.registrationPayload,
      identityDetail,
    };
    return this;
  }

  withMonasticDetail(monasticDetail?: MonasticDetail): this {
    if (!monasticDetail || Object.keys(monasticDetail).length === 0) {
      return this;
    }
    this.data.registrationPayload = {
      ...this.data.registrationPayload,
      monasticDetail,
    };
    return this;
  }

  withRelationDetail(relationDetail?: RelationDetail): this {
    if (!relationDetail || Object.keys(relationDetail).length === 0) {
      return this;
    }
    this.data.registrationPayload = {
      ...this.data.registrationPayload,
      relationDetail,
    };
    return this;
  }

  withRoutineDetail(routineDetail?: RoutineDetail): this {
    if (!routineDetail || Object.keys(routineDetail).length === 0) {
      return this;
    }
    this.data.registrationPayload = {
      ...this.data.registrationPayload,
      routineDetail,
    };
    return this;
  }

  withOtherDetail(otherDetail?: OtherDetail): this {
    if (!otherDetail || Object.keys(otherDetail).length === 0) {
      return this;
    }
    this.data.registrationPayload = {
      ...this.data.registrationPayload,
      otherDetail,
    };
    return this;
  }

  build(): ActivityRegistrationFormData {
    if (!this.data.registeredActivity) {
      throw new Error(
        "Valid activityRegisteredID is required to create a registration.",
      );
    }

    if (!this.data.registreeData) {
      throw new Error("registreeData is required to create a registration.");
    }

    if (this.data.firstTimeRegistered === undefined) {
      throw new Error(
        "firstTimeRegistered is required to create a registration.",
      );
    }

    return this.data as ActivityRegistrationFormData;
  }
}
