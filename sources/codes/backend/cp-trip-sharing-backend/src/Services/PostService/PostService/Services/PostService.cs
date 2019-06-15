﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using PostService.Helpers;
using PostService.Models;
using PostService.Repositories;
using PostService.Services.Interfaces;

namespace PostService.Services
{
    public class PostService : IPostService
    {

        private readonly PostRepository _postRepository = null;

        public PostService()
        {
            _postRepository = new PostRepository();
        }

        public Post Add(Post param)
        {
            return _postRepository.Add(param);
        }

        public IEnumerable<Post> GetAll()
        {
            return _postRepository.GetAll();
        }

        public Post GetById(string id)
        {
            return _postRepository.GetById(id);
        }

        public Post Update(Post post)
        {
            return _postRepository.Update(post);
        }

        public bool Delete(string id)
        {
            return _postRepository.Delete(id);
        }
    }
}
