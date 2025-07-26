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

            // Skip disabled dates logic for now - focus only on weekly schedule

            var existingWeeklySchedule = _context.TutorWeeklyAvailabilities
                                         .Where(d => d.TutorId == tutor.Id)
                                         .ToList();

            var newWeeklySchedule = tutorAvailability.WeeklySchedule.ToList();

            // Simple approach: Clear existing and add new
            // Remove all existing weekly availabilities for this tutor
            var existingAvailabilities = _context.TutorWeeklyAvailabilities
                .Where(wa => wa.TutorId == tutor.Id)
                .ToList();

            // Remove associated time slots first
            foreach (var existing in existingAvailabilities)
            {
                var existingTimeSlots = _context.TutorTimeslots
                    .Where(ts => ts.AvailabilityId == existing.AvailabilityId)
                    .ToList();
                _context.TutorTimeslots.RemoveRange(existingTimeSlots);
            }

            // Remove the weekly availabilities
            _context.TutorWeeklyAvailabilities.RemoveRange(existingAvailabilities);

            // Add new weekly schedule
            foreach (var schedule in tutorAvailability.WeeklySchedule)
            {
                var availability = new TutorWeeklyAvailability
                {
                    AvailabilityId = Guid.NewGuid(),
                    TutorId = tutor.Id,
                    Day = schedule.Day,
                    IsAvailable = schedule.IsAvailable,
                    AllDay = schedule.AllDay
                };
                _context.TutorWeeklyAvailabilities.Add(availability);

                // Add time slots if not all day and is available
                if (schedule.IsAvailable && !schedule.AllDay && schedule.TimeSlots != null)
                {
                    foreach (var timeSlot in schedule.TimeSlots)
                    {
                        var tutorTimeSlot = new TutorTimeSlot
                        {
                            TimeslotId = Guid.NewGuid(),
                            Starttime = timeSlot.Starttime,
                            Endtime = timeSlot.Endtime,
                            AvailabilityId = availability.AvailabilityId
                        };
                        _context.TutorTimeslots.Add(tutorTimeSlot);
                    }
                }
            }

            _context.SaveChanges();
            return "success";
        }

        public TutorAvailabilitySettingsDto GetTutorAvailability(string email)
        {
            var tutor = (from u in _context.Users
                         join t in _context.Tutors on u.UserId equals t.UserId
                         where u.Email == email
                         select new
                         {
                             Id = t.TutorId
                         }).FirstOrDefault();

            if (tutor == null)
            {
                return new TutorAvailabilitySettingsDto
                {
                    DisabledDates = new List<string>(),
                    WeeklySchedule = new List<AvailabilityDto>()
                };
            }

            // Get weekly availability with time slots
            var weeklyAvailabilities = _context.TutorWeeklyAvailabilities
                .Where(wa => wa.TutorId == tutor.Id)
                .ToList();

            var weeklySchedule = new List<AvailabilityDto>();

            foreach (var availability in weeklyAvailabilities)
            {
                // Get time slots for this availability
                var timeSlots = _context.TutorTimeslots
                    .Where(ts => ts.AvailabilityId == availability.AvailabilityId)
                    .Select(ts => new TutorTimeSlotDto
                    {
                        Starttime = ts.Starttime,
                        Endtime = ts.Endtime
                    })
                    .ToList();

                weeklySchedule.Add(new AvailabilityDto
                {
                    Day = availability.Day,
                    IsAvailable = availability.IsAvailable,
                    AllDay = availability.AllDay,
                    TimeSlots = timeSlots
                });
            }

            return new TutorAvailabilitySettingsDto
            {
                DisabledDates = new List<string>(), // Empty list for now
                WeeklySchedule = weeklySchedule
            };
        }
    }
}