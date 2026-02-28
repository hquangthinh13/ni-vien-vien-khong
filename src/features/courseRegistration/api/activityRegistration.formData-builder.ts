import type {
  ActivityRegistrationFormData,
  IdentityDetail,
  MonasticDetail,
  OtherDetail,
  RegistationPayLoad,
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
      formData.registrationPayLoad &&
      Object.keys(formData.registrationPayLoad).length > 0
    ) {
      this.data.registrationPayLoad = formData.registrationPayLoad;
    }

    return this;
  }

  withRegistrationPayLoad(registrationPayLoad?: RegistationPayLoad): this {
    if (registrationPayLoad && Object.keys(registrationPayLoad).length > 0) {
      this.data.registrationPayLoad = registrationPayLoad;
    }
    return this;
  }

  withIdentityDetail(identityDetail?: IdentityDetail): this {
    if (!identityDetail || Object.keys(identityDetail).length === 0) {
      return this;
    }
    this.data.registrationPayLoad = {
      ...this.data.registrationPayLoad,
      identityDetail,
    };
    return this;
  }

  withMonasticDetail(monasticDetail?: MonasticDetail): this {
    if (!monasticDetail || Object.keys(monasticDetail).length === 0) {
      return this;
    }
    this.data.registrationPayLoad = {
      ...this.data.registrationPayLoad,
      monasticDetail,
    };
    return this;
  }

  withRelationDetail(relationDetail?: RelationDetail): this {
    if (!relationDetail || Object.keys(relationDetail).length === 0) {
      return this;
    }
    this.data.registrationPayLoad = {
      ...this.data.registrationPayLoad,
      relationDetail,
    };
    return this;
  }

  withRoutineDetail(routineDetail?: RoutineDetail): this {
    if (!routineDetail || Object.keys(routineDetail).length === 0) {
      return this;
    }
    this.data.registrationPayLoad = {
      ...this.data.registrationPayLoad,
      routineDetail,
    };
    return this;
  }

  withOtherDetail(otherDetail?: OtherDetail): this {
    if (!otherDetail || Object.keys(otherDetail).length === 0) {
      return this;
    }
    this.data.registrationPayLoad = {
      ...this.data.registrationPayLoad,
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
