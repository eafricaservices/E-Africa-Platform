export default function ProfileForm() {
  return (
    <form className="space-y-6">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name*
        </label>
        <input
          type="text"
          autoComplete="true"
          name="fullName"
          placeholder="Enter your full name"
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Professional Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Title*
        </label>
        <input
          type="text"
          placeholder="e.g. Senior Software Engineer, Marketing Director"
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Current Company */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Company*
        </label>
        <input
          type="text"
          placeholder="Where do you currently work ?"
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Years of Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years of Experience*
        </label>
        <input
          type="number"
          placeholder="How long have you worked in this field?"
          className="appearance-none w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location*
        </label>
        <input
          type="text"
          autoComplete="true"
          name="location"
          placeholder="City, Country"
          className="w-full px-4 py-3 border-1 border-[#13672B] rounded-lg focus:outline-none focus:border-[#13672B] focus:ring-1 focus:ring-[#13672B] text-gray-900 placeholder-gray-500"
        />
      </div>
    </form>
  );
}
