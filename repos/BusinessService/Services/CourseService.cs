using System.Globalization;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace BusinessService.Services
{
    public class CourseService : ICourseService
    {

        private readonly ApplicationDbContext _context;
        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public string AddCourse(CourseDto newCourse, string email)
        {
            var tutor = (from u in _context.Users
                        join t in _context.Tutors on u.UserId equals t.UserFk
                        where u.Email == email
                        select new
                        {
                            Id = t.TutorId
                        }).FirstOrDefault();
            if (tutor != null) 

           {
                Guid courseId = Guid.NewGuid();
              

                var course = new Course
                {
                    CourseId = courseId,
                    TutorId = tutor.Id,
                    Title = newCourse.Title,
                    Description = newCourse.Description,
                    Introduction = newCourse.Introduction,
                    CategoryFk = newCourse.CategoryFk,
                    CourseDifficultyFk = newCourse.CourseDifficultyFk,
                    Price = newCourse.Price,
                    IsEnabled = true,
                    LanguageFk = newCourse.LanguageFk,
                    CourseImage = newCourse.CourseImage,
                    Tags = newCourse.Tags, // or store separately
                    CreatedDate = newCourse.CreatedDate,
                    UpdatedDate = newCourse.UpdatedDate,
                };

                var courseContents = newCourse.CourseContent.Select((content, index) =>
                      { var cid = Guid.NewGuid(); // Generate a new Guid for each content

                          return new CourseContent
                          {
                              ContentId = cid,
                              CourseId = courseId,
                              ContentTitle = content.ContentTitle,
                              ContentDescription = content.ContentDescription,
                              ContentDuration = content.ContentDuration,
                              ContentSortOrder = index + 1,
                              IsActive = true,
                              CreatedDate = newCourse.CreatedDate,
                              UpdatedDate = newCourse.UpdatedDate,


                              SubContent = content.SubContent.Select((sub, index) => new SubContent
                              {
                                  SubContentId = Guid.NewGuid(),
                                  ContentId = cid,
                                  SubContentTitle = sub.SubContentTitle,
                                  SubContentDescription = sub.SubContentDescription,
                                  Type = sub.Type
                              }).ToList()

                          };
            }).ToList();

                //course.CourseContent = courseContents;

                _context.Courses.Add(course);
                _context.CourseContents.AddRange(courseContents);
                _context.SubContents.AddRange(courseContents.SelectMany(cc => cc.SubContent));
                _context.SaveChanges();

                return "success";

            }

            return "fail";
        }

        public string UpdateCourse(UpdateCourseDto updatedCourse, string email, Guid courseId)
        {
                var tutor = (from u in _context.Users
                             join t in _context.Tutors on u.UserId equals t.UserFk
                             where u.Email == email
                             select new
                             {
                                 Id = t.TutorId
                             }).FirstOrDefault();
            if (tutor == null) return "fail";

            var existingCourse = _context.Courses
                .Include(c => c.CourseContent)
                .ThenInclude(cc => cc.SubContent)
                .FirstOrDefault(c => c.CourseId == courseId);

            if (existingCourse == null) return "fail";

            var existingCourseContentIds = existingCourse.CourseContent.Select(cc => cc.ContentId).ToList();
            var updatedCourseContentIds = updatedCourse.CourseContent.Select(cc => cc.ContentId).ToList();

            existingCourse.Title = updatedCourse.Title;
            existingCourse.Description = updatedCourse.Description;
            existingCourse.Introduction = updatedCourse.Introduction;
            existingCourse.Price = updatedCourse.Price;
            existingCourse.Currency = updatedCourse.Currency;
            existingCourse.IsEnabled = updatedCourse.IsEnabled;
            existingCourse.Tags = updatedCourse.Tags;
            existingCourse.LanguageFk = updatedCourse.LanguageFk;
            existingCourse.CourseImage = updatedCourse.CourseImage;
            existingCourse.UpdatedDate = DateTime.UtcNow;

            var contentsToRemove = existingCourse.CourseContent
                .Where(cc => !updatedCourseContentIds.Contains(cc.ContentId))
                .ToList();
            _context.CourseContents.RemoveRange(contentsToRemove);

            var indexMain = 0;
            var index = 0;

            foreach (var contentDto in updatedCourse.CourseContent)
            {
                indexMain++;
                var subIndex = 0;
                // Existing content - update
                if (contentDto.ContentId != Guid.Empty &&
                    existingCourseContentIds.Contains(contentDto.ContentId))
                {
                    var existingContent = existingCourse.CourseContent
                        .First(cc => cc.ContentId == contentDto.ContentId);

                    existingContent.ContentTitle = contentDto.ContentTitle;
                    // ... update other properties

                    // Handle subcontents
                    var existingSubIds = existingContent.SubContent.Select(sc => sc.SubContentId).ToList();
                    var updatedSubIds = contentDto.SubContent.Select(sc => sc.SubContentId)
                                                             .ToList();

                    // Remove deleted subcontent

                    var subsToRemove = existingContent.SubContent
                                        .Where(sc => !updatedSubIds.Contains(sc.SubContentId))
                                        .ToList();
                    _context.SubContents.RemoveRange(subsToRemove);

                   

                    foreach (var subDto in contentDto.SubContent)
                    {
                      
                        // Existing subcontent - update
                        if (subDto.SubContentId != Guid.Empty &&
                            existingSubIds.Contains(subDto.SubContentId))
                        {
                            var existingSub = existingContent.SubContent
                                .First(sc => sc.SubContentId == subDto.SubContentId);

                            existingSub.SubContentTitle = subDto.SubContentTitle;
                            existingSub.SubContentDescription = subDto.SubContentDescription;
                            existingSub.Type = subDto.Type;
                            existingSub.SubContentOrder = subDto.SubContentOrder;
                           
                        }
                        // New subcontent - add
                        else if (subDto.SubContentId == null || !existingSubIds.Contains(subDto.SubContentId))
                        {
                            existingContent.SubContent.Add(new SubContent
                            {
                                SubContentId = Guid.NewGuid(),
                                SubContentTitle = subDto.SubContentTitle,
                                SubContentDescription = subDto.SubContentDescription,   
                                Type = subDto.Type,
                                SubContentOrder = subDto.SubContentOrder,
                                ContentId = contentDto.ContentId
                                // Assuming you want to set order based on index
                                // ... other properties
                            });

                            _context.SubContents.AddRange(existingContent.SubContent);
                        }
                    }
                }
            
            //New content -add
                else
            {
                    var contentId = Guid.NewGuid();
                    var newContent = new CourseContent
                    {
                        ContentId = contentId,
                        CourseId = existingCourse.CourseId,
                        ContentTitle = contentDto.ContentTitle,
                        ContentDescription = contentDto.ContentDescription,
                        ContentDuration = contentDto.ContentDuration,
                        ContentSortOrder = contentDto.ContentSortOrder,
                        IsActive = true,
                        CreatedDate = DateTime.UtcNow,
                        UpdatedDate = DateTime.UtcNow,


                        // ... other properties
                        SubContent = contentDto.SubContent.Select(sub => new SubContent
                        {
                            SubContentId = Guid.NewGuid(),
                            SubContentTitle = sub.SubContentTitle,
                            SubContentDescription = sub.SubContentDescription,
                            Type = sub.Type,
                            SubContentOrder = sub.SubContentOrder,
                            ContentId = contentId,


                            // ... other properties
                        }).ToList()
                    };
                _context.CourseContents.Add(newContent);
                    _context.SubContents.AddRange(newContent.SubContent);


                }
            }

        _context.SaveChanges();
                return "success";
            }

        public UpdateCourseDto GetCoursebyId(Guid Id)
        {
           // var findCourse = _context.Courses
           //.Include(c => c.CourseContent)
           //.FirstOrDefault(x => x.CourseId == Id);

            var findCourse = _context.Courses
                            .Where(c => c.CourseId == Id)
                            .Include(c => c.CourseContent)
                             .ThenInclude(cc => cc.SubContent)
                            .FirstOrDefault();

            if (findCourse == null)
            {
                return null;
            }


            return new UpdateCourseDto
            {
                CourseId = findCourse.CourseId,
                Title = findCourse.Title,
                Description = findCourse.Description,
                Introduction = findCourse.Introduction,
                CategoryFk = findCourse.CategoryFk,
                CategoryName = _context.Categories.FirstOrDefault(x => x.CategoryId == findCourse.CategoryFk)?.CategoryName,
                CourseDifficultyFk = findCourse.CourseDifficultyFk,
                CourseDifficultyName = _context.CourseDifficulties.FirstOrDefault(x => x.CourseDifficultyId == findCourse.CourseDifficultyFk)?.CourseDifficultyName,
                Price = findCourse.Price,
                IsEnabled = findCourse.IsEnabled,
                LanguageFk = findCourse.LanguageFk,
                Languages = _context.Languages.FirstOrDefault(x => x.LanguageId == findCourse.LanguageFk)?.Languages,
                CourseImage = findCourse.CourseImage,
                Tags = findCourse.Tags, // or store separately
                UpdatedDate = findCourse.UpdatedDate,


                CourseContent = findCourse.CourseContent
                                .OrderBy(sc => sc.ContentSortOrder)
                                .Select((content, index) =>
                {
                    var cid = Guid.NewGuid(); // Generate a new Guid for each content

                    return new UpdateCourseContentDto
                    {
                        ContentId = content.ContentId,
                        CourseFk = content.CourseId,
                        ContentTitle = content.ContentTitle,
                        ContentDescription = content.ContentDescription,
                        ContentDuration = content.ContentDuration,
                        ContentSortOrder = content.ContentSortOrder,


                        SubContent = content.SubContent.Select((sub, index) => new UpdateSubContentDto
                        {
                            SubContentId = sub.SubContentId,
                            ContentFk = sub.ContentId,
                            SubContentTitle = sub.SubContentTitle,
                            SubContentDescription = sub.SubContentDescription,
                            Type = sub.Type
                        }).ToList()

                    };
                }).ToList()
            };
        }

        public List<Category> GetCourseCategories()
        {
         
        
            var categories = _context.Categories
                .OrderBy(c => c.CategoryName)
                .ToList();
            return categories;
        }

        public List<CourseDifficulty> GetCourseDifficulties()
        {
            var difficulties = _context.CourseDifficulties
               .OrderBy(c => c.CourseDifficultyName)
               .ToList();
            return difficulties;
        }

        public List<Language> GetCourseLanguages()
        {
            var languages = _context.Languages
          .OrderBy(l => l.Languages)
          .ToList();
            return languages;
        }

        public async Task<PaginatedCoursesDto> GetAllCourses(int page, int items)
        {

                    var ratings = await _context.CourseReviews
                                        .GroupBy(r => r.CourseFk)
                                        .Select(g => new
                                        {
                                            CourseId = g.Key,
                                            AverageRating = g.Average(r => r.Rating),
                                            reviewCount = g.Count()
                                        })
                                        .ToListAsync();
                     var duration = _context.CourseContents  
                                        .Select(c => new
                                        {
                                            c.CourseId,
                                            c.ContentDuration
                                        })
                                        .AsEnumerable() // Switches to in-memory LINQ
                                        .GroupBy(c => c.CourseId)
                                        .Select(g => new
                                        {
                                            CourseId = g.Key,
                                            TotalDuration = TimeSpan.FromTicks(
                                                g.Sum(c =>
                                                    TimeSpan.TryParse(c.ContentDuration, out var ts) ? ts.Ticks : 0
                                                )
                                            ).ToString(@"hh\:mm\:ss")
                                        })
                                        .ToList();

            var enrolledStudents = await _context.Enrollments
                                       .GroupBy(r => r.CourseId)
                                       .Select(g => new
                                       {
                                           CourseId = g.Key,
                                           StudentEnrolled = g.Count(),
                                       })
                                       .ToListAsync();


            var courses = (from course in _context.Courses
                          join category in _context.Categories on course.CategoryFk equals category.CategoryId
                          join difficulty in _context.CourseDifficulties on course.CourseDifficultyFk equals difficulty.CourseDifficultyId
                          join tutor in _context.Tutors on course.TutorId equals tutor.TutorId
                          join user in _context.Users on tutor.UserFk equals user.UserId //innerJoin
                          where (course.IsEnabled== true && course.IsDeleted == false)
                          select new 
                          {
                              CourseId = course.CourseId,
                              Title = course.Title,
                              TutorName = user.FirstName + ' ' + user.LastName,
                              Price = course.Price,
                              CourseDifficultyName = difficulty.CourseDifficultyName,
                              UpdatedDate = course.UpdatedDate,
                              CategoryName = category.CategoryName,
                              Introduction = course.Introduction
                          }).ToList();
            var result = courses.Select(c => new CourseDetailDto
            {
                CourseId = c.CourseId,
                Title = c.Title,
                TutorName = c.TutorName,
                Price = c.Price,
                CourseDifficultyName = c.CourseDifficultyName,
                CategoryName = c.CategoryName,
                UpdatedDate = c.UpdatedDate,
                Introduction = c.Introduction,
                Rating = ratings.FirstOrDefault(r => r.CourseId == c.CourseId)?.AverageRating ?? 0,
                ReviewCount = ratings.FirstOrDefault(r => r.CourseId == c.CourseId)?.reviewCount ?? 0,
                Duration = duration.FirstOrDefault(r => r.CourseId == c.CourseId)?.TotalDuration ?? "0",
                EnrolledStudents = enrolledStudents.FirstOrDefault(r => r.CourseId == c.CourseId)?.StudentEnrolled ?? 0,

            }).ToList();


            var totalCount = await _context.Courses.CountAsync();
            return new PaginatedCoursesDto
            {
                TotalItems = totalCount,
                Page = page,
                PageSize = (int)Math.Ceiling((decimal)totalCount / items),
                Courses = result
                .Skip((page-1) * items)
                .Take(items)
                .ToList(),
            };
          
        }



        public void DeleteCourse(Guid id)
        {
            var removeCourse = _context.Courses.FirstOrDefault(x => x.CourseId == id);

            if (removeCourse != null)
            {
                removeCourse.IsDeleted = true;
                _context.SaveChanges();
            }
        }

        public CourseManagementCardDto GetCourseManagementCardDetails(string email)
        {
            throw new NotImplementedException();
        }
    }
}
