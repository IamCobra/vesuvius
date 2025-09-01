"use client";

import Image from "next/image";
import Footer from "@/app/components/footer";
import { useState } from "react";

export default function Reservation() {
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [reservationData, setReservationData] = useState({
    guests: 2,
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
  });

  // Available time slots for dinner service
  const availableTimeSlots = [
    "17:00", "17:15", "17:30", "17:45",
    "18:00", "18:15", "18:30", "18:45", 
    "19:00", "19:15", "19:30", "19:45",
    "20:00", "20:15", "20:30", "20:45",
    "21:00", "21:15", "21:30"
  ];

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Check if selected date is valid (not in the past)
  const isValidDate = (dateString: string) => {
    if (!dateString) return true; // Allow empty for now
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    return selectedDate >= today;
  };

  // Check if selected time is valid (not in the past if today)
  const isValidTime = (timeString: string, dateString: string) => {
    if (!timeString || !dateString) return true;
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    
    // If not today, all times are valid
    if (selectedDate.toDateString() !== today.toDateString()) {
      return true;
    }
    
    // If today, check if time is in the future
    const [hours, minutes] = timeString.split(":").map(Number);
    const selectedTime = new Date();
    selectedTime.setHours(hours, minutes, 0, 0);
    
    return selectedTime > today;
  };

  const handleModalNext = () => {
    if (modalStep < 2) {
      setModalStep(modalStep + 1);
    }
  };

  const handleModalBack = () => {
    if (modalStep > 1) {
      setModalStep(modalStep - 1);
    }
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!isValidDate(reservationData.date)) {
      alert("Ugyldig dato valgt. Vælg venligst en dato i fremtiden.");
      return;
    }
    
    if (!isValidTime(reservationData.time, reservationData.date)) {
      alert("Ugyldig tid valgt. Tidspunktet er allerede passeret.");
      return;
    }
    
    console.log("Reservation:", reservationData);
    setModalStep(3); // Go to confirmation step
  };

  const handleFinalConfirmation = () => {
    setShowModal(false);
    setModalStep(1);
    setReservationData({
      guests: 2,
      date: "",
      time: "",
      name: "",
      email: "",
      phone: "",
    });
  };

  const updateReservationData = (field: string, value: string | number) => {
    setReservationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle date change with validation
  const handleDateChange = (dateString: string) => {
    updateReservationData("date", dateString);
    
    // Reset time if date changes and current time is invalid for new date
    if (reservationData.time && !isValidTime(reservationData.time, dateString)) {
      updateReservationData("time", "");
    }
  };

  // Handle time selection with validation
  const handleTimeSelect = (timeString: string) => {
    if (isValidTime(timeString, reservationData.date)) {
      updateReservationData("time", timeString);
    }
  };

  // Get filtered time slots based on selected date
  const getAvailableTimeSlotsForDate = () => {
    if (!reservationData.date) return availableTimeSlots;
    
    return availableTimeSlots.filter(time => 
      isValidTime(time, reservationData.date)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen bg-gradient-to-br from-burgundy-dark via-burgundy-primary to-burgundy-dark overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        {/* Large Background Images */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop&crop=center"
            alt="Restaurant Interior"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-5xl mx-auto">
            {/* Decorative top element */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-px bg-white opacity-60"></div>
                <div className="mx-4 flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                  <div className="w-2 h-2 bg-white rounded-full opacity-60"></div>
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                </div>
                <div className="w-24 h-px bg-white opacity-60"></div>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight drop-shadow-2xl">
              Vesuvius
            </h1>

            {/* Enhanced divider */}
            <div className="flex items-center justify-center mb-12">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-white opacity-60"></div>
              <div className="mx-6 text-2xl opacity-80">✦</div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-white opacity-60"></div>
            </div>

            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-xl md:text-2xl leading-relaxed mb-6 drop-shadow-lg">
                Oplev ægte italiensk madlavning i hjertet af byen. Vi lover
                kvalitet og en uforglemmelig oplevelse.
              </p>
              <p className="text-lg md:text-xl opacity-90 leading-relaxed drop-shadow-lg">
                Med friske råvarer og autentiske opskrifter skaber vi retter,
                der vækker dine sanser og bringer dig på en kulinarisk rejse til
                det smukke Italien.
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-burgundy-primary px-16 py-6 rounded-full font-bold text-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/25 mb-8"
            >
              Reservér et bord
            </button>

            {/* Additional info */}
            <div className="text-sm opacity-75 mt-8">
              <p>Åbent alle dage • 17:00 - 22:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal - Full Screen Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-burgundy-primary to-burgundy-dark text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Reservér Bord</h2>
                  <p className="text-burgundy-light mt-1">
                    Step {modalStep} af 3
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 bg-white bg-opacity-20 rounded-full h-3">
                <div
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${(modalStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-burgundy-primary mb-4">
                    Vælg dato, tid og antal gæster
                  </h3>

                  {/* Number of Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Antal gæster
                    </label>
                    <select
                      value={reservationData.guests}
                      onChange={(e) =>
                        updateReservationData(
                          "guests",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-burgundy-primary focus:border-transparent bg-white text-gray-900 transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "person" : "personer"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dato *
                    </label>
                    <input
                      type="date"
                      value={reservationData.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={getMinDate()}
                      onClick={(e) => {
                        // Auto-open date picker (works in most modern browsers)
                        try {
                          e.currentTarget.showPicker?.();
                        } catch {
                          // Fallback for browsers that don't support showPicker
                          console.log("Date picker auto-open not supported");
                        }
                      }}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-burgundy-primary focus:border-transparent bg-white text-gray-900 transition-colors cursor-pointer hover:bg-gray-50"
                      required
                    />
                    {reservationData.date && !isValidDate(reservationData.date) && (
                      <p className="text-red-500 text-sm mt-1">
                        Vælg venligst en dato i fremtiden
                      </p>
                    )}
                  </div>

                  {/* Time Selection - Visual Buttons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tid * {reservationData.date && (
                        <span className="text-gray-500 text-xs">
                          ({getAvailableTimeSlotsForDate().length} ledige tider)
                        </span>
                      )}
                    </label>
                    
                    {!reservationData.date ? (
                      <div className="text-gray-500 text-sm bg-gray-50 p-4 rounded-xl border border-gray-200">
                        Vælg først en dato for at se ledige tider
                      </div>
                    ) : getAvailableTimeSlotsForDate().length === 0 ? (
                      <div className="text-red-500 text-sm bg-red-50 p-4 rounded-xl border border-red-200">
                        Ingen ledige tider for denne dato. Vælg en anden dag.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {getAvailableTimeSlotsForDate().map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeSelect(time)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              reservationData.time === time
                                ? "bg-burgundy-primary text-white shadow-md ring-2 ring-burgundy-primary ring-offset-2"
                                : "bg-gray-100 text-gray-700 hover:bg-burgundy-light hover:text-burgundy-dark border border-gray-200"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {reservationData.time && (
                      <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg border border-green-200">
                        ✓ Valgt tid: {reservationData.time}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleModalNext}
                    disabled={
                      !reservationData.date || 
                      !reservationData.time || 
                      !isValidDate(reservationData.date) ||
                      !isValidTime(reservationData.time, reservationData.date)
                    }
                    className="w-full bg-gradient-to-r from-burgundy-primary to-burgundy-dark text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
                  >
                    {!reservationData.date || !reservationData.time
                      ? "Vælg dato og tid"
                      : "Fortsæt til kontaktinfo"
                    }
                  </button>
                </div>
              )}

              {modalStep === 2 && (
                <form onSubmit={handleReservationSubmit} className="space-y-6">
                  <div className="bg-gradient-to-r from-burgundy-light to-burgundy-primary/10 p-4 rounded-xl mb-6">
                    <h4 className="font-medium text-burgundy-primary mb-2">
                      Din reservation:
                    </h4>
                    <p className="text-sm text-gray-600">
                      {reservationData.guests}{" "}
                      {reservationData.guests === 1 ? "person" : "personer"} •{" "}
                      {reservationData.date} • {reservationData.time}
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-burgundy-primary mb-4">
                    Kontaktoplysninger
                  </h3>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fulde navn *
                    </label>
                    <input
                      type="text"
                      required
                      value={reservationData.name}
                      onChange={(e) =>
                        updateReservationData("name", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-burgundy-primary focus:border-transparent bg-white text-gray-900 transition-colors"
                      placeholder="Dit fulde navn"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={reservationData.email}
                      onChange={(e) =>
                        updateReservationData("email", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-burgundy-primary focus:border-transparent bg-white text-gray-900 transition-colors"
                      placeholder="din@email.dk"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefonnummer
                    </label>
                    <input
                      type="tel"
                      value={reservationData.phone}
                      onChange={(e) =>
                        updateReservationData("phone", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-burgundy-primary focus:border-transparent bg-white text-gray-900 transition-colors"
                      placeholder="12 34 56 78"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleModalBack}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Tilbage
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-burgundy-primary to-burgundy-dark text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Bekræft Reservation
                    </button>
                  </div>
                </form>
              )}

              {modalStep === 3 && (
                <div className="text-center space-y-6">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-burgundy-primary mb-4">
                    Reservation Bekræftet!
                  </h3>

                  <p className="text-lg text-gray-600 mb-6">
                    Tak for din reservation hos Vesuvius. Vi glæder os til at se
                    dig!
                  </p>

                  {/* Reservation Details */}
                  <div className="bg-gradient-to-r from-burgundy-light to-burgundy-primary/10 p-6 rounded-2xl mb-6">
                    <h4 className="font-bold text-burgundy-primary text-xl mb-4">
                      Reservationsdetaljer
                    </h4>

                    <div className="space-y-3 text-left">
                      <div className="flex justify-between items-center py-2 border-b border-burgundy-primary/20">
                        <span className="font-medium text-gray-700">Navn:</span>
                        <span className="text-burgundy-primary font-semibold">
                          {reservationData.name}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-burgundy-primary/20">
                        <span className="font-medium text-gray-700">
                          Email:
                        </span>
                        <span className="text-burgundy-primary">
                          {reservationData.email}
                        </span>
                      </div>

                      {reservationData.phone && (
                        <div className="flex justify-between items-center py-2 border-b border-burgundy-primary/20">
                          <span className="font-medium text-gray-700">
                            Telefon:
                          </span>
                          <span className="text-burgundy-primary">
                            {reservationData.phone}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center py-2 border-b border-burgundy-primary/20">
                        <span className="font-medium text-gray-700">Dato:</span>
                        <span className="text-burgundy-primary font-semibold">
                          {new Date(reservationData.date).toLocaleDateString(
                            "da-DK",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-burgundy-primary/20">
                        <span className="font-medium text-gray-700">Tid:</span>
                        <span className="text-burgundy-primary font-semibold">
                          {reservationData.time}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="font-medium text-gray-700">
                          Antal gæster:
                        </span>
                        <span className="text-burgundy-primary font-semibold">
                          {reservationData.guests}{" "}
                          {reservationData.guests === 1 ? "person" : "personer"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 mb-6">
                    <p className="mb-2">
                      <strong>Vigtigt:</strong> Vi har sendt en bekræftelse til
                      din email.
                    </p>
                    <p>
                      Hvis du har spørgsmål eller ønsker at ændre din
                      reservation, kan du kontakte os på telefon eller email.
                    </p>
                  </div>

                  <button
                    onClick={handleFinalConfirmation}
                    className="w-full bg-gradient-to-r from-burgundy-primary to-burgundy-dark text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Færdig
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
