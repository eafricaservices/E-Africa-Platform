export type ProfileFormValues = {
  fullName: string;
  professionalTitle: string;
  currentCompany: string;
  yearsOfExperience: string;
  location: string;
};

interface ProfileFormProps {
  values: ProfileFormValues;
  errors?: Partial<Record<keyof ProfileFormValues, string>>;
  onChange: <K extends keyof ProfileFormValues>(
    field: K,
    value: ProfileFormValues[K]
  ) => void;
}

export default function ProfileForm({
  values,
  errors,
  onChange,
}: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name*
        </label>
        <input
          type="text"
          autoComplete="name"
          name="fullName"
          placeholder="Enter your full name"
          value={values.fullName}
          onChange={(event) => onChange("fullName", event.target.value)}
          className={`w-full px-4 py-3 border-1 rounded-lg focus:outline-none focus:ring-1 text-gray-900 placeholder-gray-500 ${
            errors?.fullName
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#13672B] focus:border-[#13672B] focus:ring-[#13672B]"
          }`}
        />
        {errors?.fullName && (
          <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Title*
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Software Engineer, Marketing Director"
          value={values.professionalTitle}
          onChange={(event) =>
            onChange("professionalTitle", event.target.value)
          }
          className={`w-full px-4 py-3 border-1 rounded-lg focus:outline-none focus:ring-1 text-gray-900 placeholder-gray-500 ${
            errors?.professionalTitle
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#13672B] focus:border-[#13672B] focus:ring-[#13672B]"
          }`}
        />
        {errors?.professionalTitle && (
          <p className="mt-2 text-sm text-red-600">
            {errors.professionalTitle}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Company*
        </label>
        <input
          type="text"
          placeholder="Where do you currently work?"
          value={values.currentCompany}
          onChange={(event) => onChange("currentCompany", event.target.value)}
          className={`w-full px-4 py-3 border-1 rounded-lg focus:outline-none focus:ring-1 text-gray-900 placeholder-gray-500 ${
            errors?.currentCompany
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#13672B] focus:border-[#13672B] focus:ring-[#13672B]"
          }`}
        />
        {errors?.currentCompany && (
          <p className="mt-2 text-sm text-red-600">{errors.currentCompany}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years of Experience*
        </label>
        <input
          type="number"
          min="0"
          max="50"
          inputMode="numeric"
          placeholder="How long have you worked in this field?"
          value={values.yearsOfExperience}
          onChange={(event) =>
            onChange("yearsOfExperience", event.target.value)
          }
          className={`appearance-none w-full px-4 py-3 border-1 rounded-lg focus:outline-none focus:ring-1 text-gray-900 placeholder-gray-500 ${
            errors?.yearsOfExperience
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#13672B] focus:border-[#13672B] focus:ring-[#13672B]"
          }`}
        />
        {errors?.yearsOfExperience && (
          <p className="mt-2 text-sm text-red-600">
            {errors.yearsOfExperience}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location*
        </label>
        <input
          type="text"
          autoComplete="address-level2"
          name="location"
          placeholder="City, Country"
          value={values.location}
          onChange={(event) => onChange("location", event.target.value)}
          className={`w-full px-4 py-3 border-1 rounded-lg focus:outline-none focus:ring-1 text-gray-900 placeholder-gray-500 ${
            errors?.location
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-[#13672B] focus:border-[#13672B] focus:ring-[#13672B]"
          }`}
        />
        {errors?.location && (
          <p className="mt-2 text-sm text-red-600">{errors.location}</p>
        )}
      </div>
    </div>
  );
}
