﻿using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using UserServices.Helpers;
using UserServices.Models;
using UserServices.Reponsitories.DbContext;
using UserServices.Reponsitories.Interfaces;

namespace UserServices.Reponsitories
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _users = null;
        private readonly IFollowRepository _followRepository = null;

        public UserRepository(IOptions<AppSettings> settings)
        {
            var dbContext = new MongoDbContext(settings);
            _users = dbContext.Users;
            _followRepository = new FollowRepository(settings);
        }
        
        public User Add(User user)
        {
            _users.InsertOne(user);
            return user;
        }

        public User Delete(User document)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<User> GetAll()
        {
            List<User> users = _users.Find(x => true).ToList();
            return users;
        }

        public User GetById(string id)
        {
            var user = _users.Find(x => x.Id.Equals(id)).FirstOrDefault();

            if (user == null)
            {
                return user;
            }

            var followerCount = _followRepository.GetAllFollower(id).Count();
            var followingCount = _followRepository.GetAllFollowing(id).Count();
            user.FollowerCount = followerCount;
            user.FollowingCount = followingCount;
            return user;
        }

        public IEnumerable<User> GetUsers(string search)
        {
            // Search filter
            if (search == null || search.Trim() == "")
            {
                search = "";
            }
            Expression<Func<User, bool>> searchFilter;
            searchFilter = u => u.UserName.IndexOf(search, StringComparison.OrdinalIgnoreCase) >= 0
                                || u.DisplayName.IndexOf(search, StringComparison.OrdinalIgnoreCase) >= 0;

            var users = _users.AsQueryable()
                        .Where(searchFilter.Compile())
                        .ToList();
            return users;
        }

        public User Update(User user)
        {
            var result = _users.ReplaceOne(u => u.Id.Equals(user.Id), user);
            if (!result.IsAcknowledged)
            {
                return null;
            }
            return user;
        }
    }
}
