using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessService.Services
{
    public class TutorAvailabiltyService : ITutorAvailabilityService
    {
        private readonly ApplicationDbContext _context;

        public TutorAvailabiltyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public string SaveTutorAvailabilty(TutorAvailabilitySettingsDto tutorAvailability, string email)
        {
            var tutor = (from u in _context.Users
                         join t in _context.Tutors on u.UserId equals t.UserId
                         where u.Email == email
                         select new
                         {
                             Id = t.TutorId
                         }).FirstOrDefault();

            if (tutor == null) return "Tutor not found";

            // Get all existing disabled dates for this tutor
            var existingDisabledDates = _context.TutorDisabledDates
                .Where(d => d.TutorId == tutor.Id)
                .ToList();

            // New dates coming from the frontend
            var newDisabledDates = tutorAvailability.DisabledDates; // List<DateOnly>

            // Find which existing dates are NOT in the new list (to remove)
            var disabledDatesToRemove = existingDisabledDates
                .Where(d => !newDisabledDates.Contains(d.DisabledDate))
                .ToList();

            // Remove old dates not present in the new list
            _context.TutorDisabledDates.RemoveRange(disabledDatesToRemove);


            foreach (var d in tutorAvailability.DisabledDates)
            {
                 var findExistingDisabledDates = _context.TutorDisabledDates
                .FirstOrDefault(c => c.DisabledDate == d);
                if (findExistingDisabledDates == null)
                    {   
                        var disabledAvailabilities = new TutorDisabledDate
                        {
                            TutorId = tutor.Id,
                            DisabledDateId = Guid.NewGuid(),
                            DisabledDate = d,
                        };
                            _context.TutorDisabledDates.Add(disabledAvailabilities);
                }
            }


            var existingWeeklySchedule = _context.TutorWeeklyAvailabilities
                                         .Where(d => d.TutorId == tutor.Id)
                                         .ToList();

            var newWeeklySchedule = tutorAvailability.WeeklySchedule.ToList();

            var weeklyScheduleToRemove = existingWeeklySchedule
                               .Where(d => !newWeeklySchedule.Any(n =>
                                   n.IsAvailable == d.IsAvailable &&
                                   n.AllDay == d.AllDay &&
                                   n.Day == d.Day))
                               .ToList();

            _context.TutorWeeklyAvailabilities.RemoveRange(weeklyScheduleToRemove);

            foreach (var u in tutorAvailability.WeeklySchedule)
            {
                // First check if this day's schedule already exists
                var existingSchedule = _context.TutorWeeklyAvailabilities
                                       .FirstOrDefault(d => d.TutorId == tutor.Id && d.Day == u.Day);

                if (existingSchedule != null)
                {
                    // Update existing schedule if there are changes
                    if (existingSchedule.IsAvailable != u.IsAvailable || existingSchedule.AllDay != u.AllDay)
                    {
                        existingSchedule.IsAvailable = u.IsAvailable;
                        existingSchedule.AllDay = u.AllDay;

                        // If changing to non-allDay available, update timeslots
                        if (u.AllDay == false && u.IsAvailable == true)
                        {
                            // Remove existing timeslots for this schedule
                            var existingTimeSlots = _context.TutorTimeslots
                                                    .Where(t => t.AvailabilityId == existingSchedule.AvailabilityId)
                                                    .ToList();
                            _context.TutorTimeslots.RemoveRange(existingTimeSlots);

                            // Add new timeslots
                            foreach (var day in u.TimeSlots)
                            {
                                TimeSpan endTime = TimeSpan.Parse(day.Endtime);
                                TimeSpan newEndTime = endTime.Add(TimeSpan.FromHours(1));
                                string newEndTimeString = newEndTime.ToString(@"hh\:mm");

                                var timeSlot = new TutorTimeSlot
                                {
                                    TimeslotId = Guid.NewGuid(),
                                    Starttime = day.Starttime,
                                    Endtime = newEndTimeString,
                                    AvailabilityId = existingSchedule.AvailabilityId
                                };
                                _context.TutorTimeslots.Add(timeSlot);
                            }
                        }
                        else
                        {
                            // If changing to allDay or not available, remove all timeslots
                            var slotsToRemove = _context.TutorTimeslots
                                                .Where(t => t.AvailabilityId == existingSchedule.AvailabilityId)
                                                .ToList();
                            _context.TutorTimeslots.RemoveRange(slotsToRemove);
                        }
                    }
                }
                else
                {
                    // Add new schedule if it doesn't exist
                    var availability = new TutorWeeklyAvailability
                    {
                        AvailabilityId = Guid.NewGuid(),
                        TutorId = tutor.Id,
                        Day = u.Day,
                        IsAvailable = u.IsAvailable,
                        AllDay = u.AllDay
                    };
                    _context.TutorWeeklyAvailabilities.Add(availability);

                    if (u.AllDay == false && u.IsAvailable == true)
                    {
                        foreach (var day in u.TimeSlots)
                        {
                            TimeSpan endTime = TimeSpan.Parse(day.Endtime);
                            TimeSpan newEndTime = endTime.Add(TimeSpan.FromHours(1));
                            string newEndTimeString = newEndTime.ToString(@"hh\:mm");

                            var timeSlot = new TutorTimeSlot
                            {
                                TimeslotId = Guid.NewGuid(),
                                Starttime = day.Starttime,
                                Endtime = newEndTimeString,
                                AvailabilityId = availability.AvailabilityId
                            };
                            _context.TutorTimeslots.Add(timeSlot);
                        }
                    }
                }
            }

            _context.SaveChanges();
            return "success";
        }
    }
}