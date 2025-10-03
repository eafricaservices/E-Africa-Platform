import { Poppins } from "next/font/google";
import StepHeader from "../components/stepHeader";
import DayButton from "../components/dayButton";
import TimeSlotButton from "../components/timeSlotButton";
import TimezoneDropdown from "../components/timezoneDropdown";
import { useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = [
  "9:00 am",
  "11:00 am",
  "2:00 pm",
  "4:00 pm",
  "5:00 pm",
  "6:00 pm",
  "7:00 pm",
];

// TEMPORARY NAVIGATION PROPS
interface NavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

export default function AvailabilityStep({
  onNext,
  onPrevious,
}: NavigationProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState("");

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTimeSlot = (timeSlot: string) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(timeSlot)
        ? prev.filter((t) => t !== timeSlot)
        : [...prev, timeSlot]
    );
  };

  return (
    <div className={`${poppins.className}`}>
      <div id="header-ctn">
        <StepHeader
          title="Set Your Availability"
          description="When are you available for mentoring sessions?"
        />
        <div className="flex items-center gap-2 justify-center">
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
          <span className="w-3 h-3 bg-[#13672B] rounded-full"></span>
        </div>
      </div>

      {/* Form Container */}
      <div className="form-ctn mt-8">
        {/* Weekly Availability */}
        <div className="mb-8">
          <h3 className="text-gray-900 font-medium text-lg mb-4">
            Weekly Availability*
          </h3>
          <div className="flex justify-items-start gap-2 flex-wrap">
            {daysOfWeek.map((day) => (
              <DayButton
                key={day}
                day={day}
                isSelected={selectedDays.includes(day)}
                onToggle={() => toggleDay(day)}
              />
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="mb-8">
          <h3 className="text-gray-900 font-medium text-lg mb-4">
            Time Slots*
          </h3>
          <div className="flex justify-items-start gap-2 flex-wrap">
            {timeSlots.map((timeSlot) => (
              <TimeSlotButton
                key={timeSlot}
                time={timeSlot}
                isSelected={selectedTimeSlots.includes(timeSlot)}
                onToggle={() => toggleTimeSlot(timeSlot)}
              />
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div className="mb-8">
          <h3 className="text-gray-900 font-medium text-lg mb-4">Timezone*</h3>
          <TimezoneDropdown
            value={selectedTimezone}
            onChange={setSelectedTimezone}
          />
        </div>

        {/* TEMPORARY NAVIGATION */}
        <div className="flex justify-between items-center pt-8 gap-2 flex-col md:flex-row">
          <button
            type="button"
            onClick={onPrevious}
            className="px-8 py-3 border-1 border-[#13672B] text-[#13672B] rounded-lg font-medium hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2 w-full md:w-auto text-center"
          >
            Go back
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-8 py-3 bg-[#13672B] text-white rounded-lg font-medium hover:bg-green-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#13672B] focus:ring-offset-2 w-full md:w-auto text-center"
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
}
