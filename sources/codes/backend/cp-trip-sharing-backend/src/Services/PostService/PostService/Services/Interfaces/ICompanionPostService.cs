﻿using PostService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PostService.Services.Interfaces
{
    public interface ICompanionPostService
    {
        CompanionPost Add(CompanionPost post);
        CompanionPost Update(CompanionPost post);
        bool Delete(string id);
        CompanionPost GetById(string id);
        IEnumerable<CompanionPost> GetAll();
        CompanionPost GetById(string id, string userId);
        IEnumerable<CompanionPost> GetAll(string userId);

        IEnumerable<CompanionPostJoinRequest> GetAllJoinRequest(string companionPostId);
        CompanionPostJoinRequest AddNewRequest(CompanionPostJoinRequest param);
        bool DeleteJoinRequest(string requestId);
    }
}