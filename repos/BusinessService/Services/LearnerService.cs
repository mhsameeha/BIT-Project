using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessService.Data;
using BusinessService.Models.Entities;
using BusinessService.Interfaces;


namespace BusinessService.Services
{
    public class LearnerService : ILearnerService
    {



        private readonly ApplicationDbContext _context;

        public LearnerService(ApplicationDbContext context)
        {
            _context = context;
        }

        //public Learner addLearner(Learner newLearner, Learner learner)
        //{

        //        learner.FirstName = newLearner.FirstName;
        //        learner.LastName = newLearner.LastName;
        //        learner.Email = newLearner.Email;
        //        learner.DateOfBirth = newLearner.DateOfBirth;
        //    _context.Add(learner);
        //        _context.SaveChanges();
        //        return learner;

        //}


        public User addUser(User newUser, User user)
        {
            user.FirstName = newUser.FirstName;
            user.LastName = newUser.LastName;
            user.Email = newUser.Email;
            user.DOB = newUser.DOB;
            user.Role = newUser.Role;
            _context.Add(user);
            _context.SaveChanges();
            //addRole(user, learner);
            return user;

        }

        //public Learner addRole(User user, Learner learner)
        //{
        //    if(user.Role == "Learner")
        //    {
        //        learner.UserFk = user.Id;
        //        _context.Add(learner);
        //        _context.SaveChanges();
        //        return learner;

        //    }
        //    return learner;
            
        //}





        //public List<Learner> allLearners()
        //{
        //    var allLearners = _context.Learners.ToList();
        //    return allLearners;
        //}

        //public Learner GetLearnerById(int id)
        //{
        //    var learner = _context.Learners.Find(id);

        //    if (learner != null)
        //    {
        //        return learner;
        //    }
        //    else
        //    {
                
        //        return null ;
        //    }
        //}

        //public bool removeLearner(int id)
        //{
        //    var learner = _context.Learners.Find(id);

        //        //learner.IsDeleted = true ;
        //        _context.SaveChanges();
        //        return true;
            
         
            
        //}

        //public Learner addLearner(Learner newLearner, Learner learner)
        //{
        //    throw new NotImplementedException();
        //}

        //public Learner updateLearner(int id, Learner newLearner)
        //{
        //    throw new NotImplementedException();
        //}

        //public Learner updateLearner(int id, Learner newLearner)
        //{

        //    var learner = _context.Learners.Find(id);

        //    if (learner != null)
        //    {
        //        learner.FirstName = newLearner.FirstName;
        //        learner.LastName = newLearner.LastName;
        //        learner.Email = newLearner.Email;
        //        learner.DateOfBirth = newLearner.DateOfBirth;

        //        _context.SaveChanges();
        //        return learner;
        //    } else
        //    {
        //        return null;
        //    }

        //}
    }
}
