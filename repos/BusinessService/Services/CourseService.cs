using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Models.Entities;
using Microsoft.EntityFrameworkCore;

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
                        join t in _context.Tutors on u.UserId equals t.UserId
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
                    CategoryId = newCourse.CategoryFk,
                    CourseDifficultyId = newCourse.CourseDifficultyFk,
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
                                  Type = sub.Type,
                                  FilePath = sub.FilePath ?? ""
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
                             join t in _context.Tutors on u.UserId equals t.UserId
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

            foreach (var contentDto in updatedCourse.CourseContent)
            {
                indexMain++;
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

                   
                    var addedSubContents = new List<SubContent>();
                    var updatedSubContents = new List<SubContent>();
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


                            updatedSubContents.Add(existingSub);
                        }
                        // New subcontent - add
                        else if (subDto.SubContentId == null || !existingSubIds.Contains(subDto.SubContentId))
                        {
                            var newSubContent = new SubContent
                            {
                                SubContentId = Guid.NewGuid(),
                                SubContentTitle = subDto.SubContentTitle,
                                SubContentDescription = subDto.SubContentDescription,
                                Type = subDto.Type,
                                SubContentOrder = subDto.SubContentOrder,
                                ContentId = contentDto.ContentId,
                                FilePath = subDto.FilePath
                                // Assuming you want to set order based on index
                                // ... other properties
                            };

                            addedSubContents.Add(newSubContent);
                            //_context.SubContents.UpdateRange()
                        }

                    }
                    _context.SubContents.AddRange(addedSubContents);
                    _context.SubContents.UpdateRange(updatedSubContents);
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
                CategoryFk = findCourse.CategoryId,
                CategoryName = _context.Categories.FirstOrDefault(x => x.CategoryId == findCourse.CategoryId)?.CategoryName,
                CourseDifficultyFk = findCourse.CourseDifficultyId,
                CourseDifficultyName = _context.CourseDifficulties.FirstOrDefault(x => x.CourseDifficultyId == findCourse.CourseDifficultyId)?.CourseDifficultyName,
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

        public async Task<PaginatedCoursesDto> GetAllCourses(int page, int items, Guid? learnerId = null)
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

            // Get all enrollments for the learner (if learnerId is provided)
            var learnerEnrollments = new HashSet<Guid>();
            if (learnerId.HasValue)
            {
                learnerEnrollments = _context.Enrollments
                    .Where(e => e.LearnerFk == learnerId.Value)
                    .Select(e => e.CourseId ?? Guid.Empty)
                    .ToHashSet();
            }

            var courses = (from course in _context.Courses
                          join category in _context.Categories on course.CategoryId equals category.CategoryId
                          join difficulty in _context.CourseDifficulties on course.CourseDifficultyId equals difficulty.CourseDifficultyId
                          join tutor in _context.Tutors on course.TutorId equals tutor.TutorId
                          join user in _context.Users on tutor.UserId equals user.UserId //innerJoin
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
                HavingEnrollment = learnerId.HasValue && learnerEnrollments.Contains(c.CourseId)
            }).ToList();

            var totalCount = await _context.Courses.CountAsync();
            return new PaginatedCoursesDto
            {
                TotalItems = totalCount,
                Page = page,
                PageSize = items,
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

        public async Task<CourseDetailsDto?> GetCourseDetailsByIdAsync(Guid courseId, string email)
        {

            var learnerId = (from u in _context.Users
                             join l in _context.Learners on u.UserId equals l.UserFk
                             where u.Email == email
                             select l.LearnerId).FirstOrDefault();

            // Get course with all related data
            var courseWithRelations = await _context.Courses
                .Where(c => c.CourseId == courseId && c.IsDeleted != true)
                .Include(c => c.CourseContent)
                    .ThenInclude(cc => cc.SubContent)
                .Select(c => new
                {
                    Course = c,
                    Category = _context.Categories
                        .Where(cat => cat.CategoryId == c.CategoryId)
                        .Select(cat => cat.CategoryName)
                        .FirstOrDefault(),
                    Difficulty = _context.CourseDifficulties
                        .Where(d => d.CourseDifficultyId == c.CourseDifficultyId)
                        .Select(d => d.CourseDifficultyName)
                        .FirstOrDefault(),
                    Language = _context.Languages
                        .Where(l => l.LanguageId == c.LanguageFk)
                        .Select(l => l.Languages)
                        .FirstOrDefault(),
                    Tutor = (from tutor in _context.Tutors
                            join user in _context.Users on tutor.UserId equals user.UserId
                            where tutor.TutorId == c.TutorId
                            select new
                            {
                                tutor.TutorProfPic,
                                tutor.TutorDescription,
                                tutor.Experience,
                                tutor.Education,
                                user.FirstName,
                                user.LastName,
                                user.Email,
                                tutor.TutorId
                            }).FirstOrDefault()
                })
                .FirstOrDefaultAsync();

            if (courseWithRelations == null)
                return null;

            // Get course reviews with learner information
            var reviews = await _context.CourseReviews
                .Where(r => r.CourseFk == courseId)
                .Join(_context.Learners,
                    review => review.LearnerFk,
                    learner => learner.LearnerId,
                    (review, learner) => new { review, learner })
                .Join(_context.Users,
                    combined => combined.learner.UserFk,
                    user => user.UserId,
                    (combined, user) => new CourseReviewDto
                    {
                        CourseReviewId = combined.review.CourseReviewId,
                        Review = combined.review.Review,
                        Rating = combined.review.Rating,
                        LearnerFirstName = user.FirstName,
                        LearnerLastName = user.LastName,
                        LearnerEmail = user.Email
                    })
                .ToListAsync();

            // Get enrollment count
            var enrollmentCount = await _context.Enrollments
                .CountAsync(e => e.CourseId == courseId);

            // Check if learner has active enrollment
            bool hasActiveEnrollment = await _context.Enrollments.AnyAsync(e => e.CourseId == courseId && e.LearnerFk == learnerId && e.EnrollmentStatus == "Active");

            // Calculate average rating
            var averageRating = reviews.Any() && reviews.Any(r => r.Rating.HasValue)
                ? reviews.Where(r => r.Rating.HasValue).Average(r => r.Rating!.Value) 
                : 0;

            // Map to CourseDetailsDto
            var courseDetailsDto = new CourseDetailsDto
            {
                CourseId = courseWithRelations.Course.CourseId,
                Title = courseWithRelations.Course.Title,
                Description = courseWithRelations.Course.Description,
                Introduction = courseWithRelations.Course.Introduction,
                Price = courseWithRelations.Course.Price,
                Currency = courseWithRelations.Course.Currency,
                IsEnabled = courseWithRelations.Course.IsEnabled,
                CourseImage = courseWithRelations.Course.CourseImage,
                Tags = courseWithRelations.Course.Tags,
                CreatedDate = courseWithRelations.Course.CreatedDate,
                UpdatedDate = courseWithRelations.Course.UpdatedDate,
                // Related entity data
                CategoryName = courseWithRelations.Category,
                CourseDifficultyName = courseWithRelations.Difficulty,
                LanguageName = courseWithRelations.Language,
                // Tutor information
                TutorFirstName = courseWithRelations.Tutor?.FirstName,
                TutorLastName = courseWithRelations.Tutor?.LastName,
                TutorEmail = courseWithRelations.Tutor?.Email,
                TutorFk = courseWithRelations.Tutor?.TutorId,
                TutorProfPic = courseWithRelations.Tutor?.TutorProfPic != null
                    ? Convert.ToBase64String(courseWithRelations.Tutor.TutorProfPic)
                    : null,
                TutorDescription = courseWithRelations.Tutor?.TutorDescription,
                TutorExperience = courseWithRelations.Tutor?.Experience,
                TutorEducation = courseWithRelations.Tutor?.Education,
                // Statistics
                EnrolledStudents = enrollmentCount,
                AverageRating = averageRating,
                ReviewCount = reviews.Count,
                // Course content
                CourseContent = courseWithRelations.Course.CourseContent
                    .OrderBy(cc => cc.ContentSortOrder)
                    .Select(cc => new CourseDetailsContentDto
                    {
                        ContentId = cc.ContentId ?? Guid.Empty,
                        ContentTitle = cc.ContentTitle,
                        ContentDescription = cc.ContentDescription,
                        ContentDuration = cc.ContentDuration,
                        ContentSortOrder = cc.ContentSortOrder,
                        SubContent = cc.SubContent
                            .OrderBy(sc => sc.SubContentOrder)
                            .Select(sc => new CourseDetailsSubContentDto
                            {
                                SubContentId = sc.SubContentId ?? Guid.Empty,
                                SubContentTitle = sc.SubContentTitle,
                                SubContentDescription = sc.SubContentDescription,
                                Type = sc.Type.Trim(),
                                SubContentOrder = sc.SubContentOrder ?? 0,
                                FilePath = hasActiveEnrollment ? sc.FilePath : null
                            })
                            .ToList()
                    })
                    .ToList(),
                // Reviews
                Reviews = reviews
            };

            return courseDetailsDto;
        }

        public CourseManagementCardDto GetCourseManagementCardDetails(string email)
        {
            throw new NotImplementedException();
        }
    }
}
